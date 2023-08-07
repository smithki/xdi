import type { Server } from 'http';
import type { Socket } from 'net';

import type { HTTPMethod, ServerAdapter } from '@xdi/server';
import type express from 'express';

interface SocketsMap {
  [key: number]: Socket;
}

export async function expressAdapter(): Promise<ServerAdapter> {
  const { fetch, FormData, Headers, Request, Response } = await import('@remix-run/web-fetch');
  const { File, Blob } = await import('@remix-run/web-file');
  const { AbortController: NodeAbortController } = await import('abort-controller');

  return {
    global,

    implementations: {
      fetch,
      FormData,
      Headers,
      Request,
      Response,
      AbortController: (global.AbortController as typeof NodeAbortController) || NodeAbortController,

      File,
      Blob,

      atob(a) {
        return Buffer.from(a, 'base64').toString('binary');
      },
      btoa(b) {
        return Buffer.from(b, 'binary').toString('base64');
      },
    },

    async listen(port, app) {
      const express = (await import('express')).default;
      const expressApp = express();

      expressApp.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const matchedRoute = app.match(req.method as HTTPMethod, req.url);
          if (matchedRoute) {
            res.status(200).send(`Hello world ${req.method} ${req.url}`);
          } else {
            res.status(404).send('Not found');
          }
        } catch (err) {
          // Express <=4 doesn't support async functions, so we have to pass
          // along the error manually using next().
          next(err);
        }
      });

      let server: Server | undefined;
      const connections: SocketsMap = {};
      let nextConnectionId = 1;

      const IdleSocket = Symbol('IdleSocket');
      const closeIdleConnection = (connection: Socket) => {
        if ((connection as any)[IdleSocket]) {
          connection.destroy();
        }
      };

      app.addShutdownTask(() => {
        if (server) {
          server.close();
          for (const connectionId in connections) {
            // eslint-disable-next-line no-prototype-builtins
            if (connections.hasOwnProperty(connectionId)) {
              const socket = connections[connectionId];
              closeIdleConnection(socket);
            }
          }
        }
      });

      await new Promise<void>((resolve) => {
        server = expressApp.listen(port, resolve);

        server.on('connection', (connection) => {
          const connectionId = nextConnectionId++;
          (connection as any)[IdleSocket] = true;
          connections[connectionId] = connection;
          connection.on('close', () => delete connections[connectionId]);
        });

        server.on('request', (request, response) => {
          const connection = request.socket;
          (connection as any)[IdleSocket] = false;
          response.on('finish', () => {
            (connection as any)[IdleSocket] = true;
            if (app.isShuttingDown) {
              closeIdleConnection(connection);
            }
          });
        });
      });
    },
  };
}

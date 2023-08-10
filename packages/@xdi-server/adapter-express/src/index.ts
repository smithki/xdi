import type { Server } from 'http';
import type { Socket } from 'net';

import type { ServerAdapter } from '@xdi-server/core';
import type express from 'express';

interface SocketsMap {
  [key: number]: Socket;
}

export async function expressAdapter(): Promise<ServerAdapter> {
  const { fetch, FormData, Headers, Request, Response } = await import('@remix-run/web-fetch');
  const { File, Blob } = await import('@remix-run/web-file');
  const { AbortController: NodeAbortController } = await import('abort-controller');
  const { URL } = await import('url');

  return {
    global,

    implementations: {
      fetch: fetch as any,
      FormData,
      Headers: Headers as any,
      Request: Request as any,
      Response: Response as any,
      AbortController: (global.AbortController || NodeAbortController) as any,

      File,
      Blob,

      atob(a) {
        return Buffer.from(a, 'base64').toString('binary');
      },
      btoa(b) {
        return Buffer.from(b, 'binary').toString('base64');
      },

      URL: (global.URL || URL) as any,
      encodeURI: (global.encodeURI || encodeURI) as any,
      encodeURIComponent: (global.encodeURIComponent || encodeURIComponent) as any,
      decodeURI: (global.decodeURI || decodeURI) as any,
      decodeURIComponent: (global.decodeURIComponent || decodeURIComponent) as any,
    },

    async listen(port, app) {
      const express = (await import('express')).default;
      const expressApp = express();

      expressApp.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const url = new app.adapter.implementations.URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

          const headers = new app.adapter.implementations.Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') {
              headers.set(key, value);
            }
          }

          const xdiRequest = new app.adapter.implementations.Request(url, {
            method: req.method,
            body: req.body,
            headers,
          });

          const requestManager = app.createRequestManager(xdiRequest);
          const xdiResponse = await requestManager.getResponse();

          res.status(xdiResponse.status);
          xdiResponse.headers.forEach((value, header) => {
            console.log(header, value);
            res.set(header, value);
          });
          res.send(await xdiResponse.text());
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

import type { Server } from 'http';

import type express from 'express';

import { ServerAdapter } from './base';

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

    async listen(port) {
      const express = (await import('express')).default;
      const app = express();

      app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          // TODO: implement...
          // @see https://github.com/remix-run/remix/blob/main/packages/remix-express/server.ts
          // let request = createRemixRequest(req, res);
          // let loadContext = await getLoadContext?.(req, res);
          // let response = (await handleRequest(
          //   request,
          //   loadContext
          // )) as NodeResponse;
          // await sendRemixResponse(res, response);
        } catch (err) {
          // Express <=4 doesn't support async functions, so we have to pass
          // along the error manually using next().
          next(err);
        }
      });

      let server: Server;
      await new Promise<void>((resolve) => {
        server = app.listen(port, resolve);
      });

      return async () => {
        server.close();
      };
    },
  };
}

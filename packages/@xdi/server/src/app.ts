import * as pathToRegExp from 'path-to-regexp';

import type { ServerAdapter } from './adapters/base';
import { RouteMetadata } from './decorators/route';
import { Metadata } from './metadata';
import { HTTPMethod } from './types';

export namespace App {
  export interface Options extends RouterOptions {
    adapter: ServerAdapter.AdapterFactory;
  }

  export interface RouterOptions {
    withConnectMiddleware?: any[];
    withMiddleware?: any[];
  }

  export type Route<T = any> = new () => T;
}

export class App {
  private _closeServer?: ServerAdapter.ServerClose;

  constructor(private readonly routers: Router[], private readonly options: App.Options) {}

  async start(port: number) {
    const adapter = await this.options.adapter();
    this._closeServer = await adapter.listen(port, this);
  }

  async stop(port: number) {
    await this._closeServer?.();
  }

  public match(method: HTTPMethod, url: string) {
    let matchedRoute: App.Route | undefined;
    for (const router of this.routers) {
      matchedRoute = router.match(method, url);
      if (matchedRoute) {
        break;
      }
    }
    return matchedRoute;
  }
}

export class Router {
  constructor(private readonly routes: App.Route[], private readonly options?: App.RouterOptions) {
    this.routes.forEach((route) => {
      console.log(Metadata.getRegistry(route).get(RouteMetadata));
    });
  }

  public match(method: HTTPMethod, url: string) {
    return this.routes.find((route) => {
      const routeMetadata = Metadata.getRegistry(route).get(RouteMetadata)[0]?.value;
      if (!routeMetadata) {
        return false;
      }
      const matcher = pathToRegExp.match(routeMetadata.pattern /* TODO { encode: encodeURIComponent } */);
      return routeMetadata.method.toLowerCase() === method.toLowerCase() && matcher(url);
    });
  }
}

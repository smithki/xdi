/* eslint-disable new-cap */

import { exitAfterCleanup, addCleanupListener, removeCleanupListener } from 'async-cleanup';
import * as pathToRegExp from 'path-to-regexp';

import type { ServerAdapter } from './adapter';
import { HandlerMetadata } from './decorators/handler';
import { RouteMetadata } from './decorators/route';
import { Metadata } from './metadata';
import { HTTPMethod } from './types';

export namespace App {
  export interface Options extends RouterOptions {
    adapter: ServerAdapter;
  }

  export interface RouterOptions {
    withConnectMiddleware?: any[];
    withMiddleware?: any[];
  }

  export type Route<T = any> = new () => T;

  export interface Shutdown {
    (status?: number): Promise<never>;
  }
  export interface ShutdownTask {
    (): void | Promise<void>;
  }
}

export class App {
  public isShuttingDown = false;

  constructor(private readonly routers: Router[], private readonly options: App.Options) {}

  public get adapter() {
    return this.options.adapter;
  }

  public async listen(port: number) {
    await this.adapter.listen(port, this);
  }

  public async shutdown(code?: number) {
    this.isShuttingDown = true;
    return exitAfterCleanup(code);
  }

  public async addShutdownTask(task: App.ShutdownTask) {
    addCleanupListener(task);
  }

  public async removeShutdownTask(task: App.ShutdownTask) {
    removeCleanupListener(task);
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

  public handleRequest(
    request: InstanceType<ServerAdapter.Implementations['Request']>,
    route: App.Route,
  ): Promise<InstanceType<ServerAdapter.Implementations['Response']>> {
    // TODO: instantiate middleware

    const routeInstance = new route();

    const handlerMetadata = Metadata.getRegistry(route).get(HandlerMetadata)[0]?.value;
    routeInstance[handlerMetadata.handlerKey]?.();
    // TODO: throw error if `handlerKey` is undefined

    return {} as any;
  }
}

export class Router {
  constructor(private readonly routes: App.Route[], private readonly options?: App.RouterOptions) {
    this.routes.forEach((route) => {
      console.log('RouteMetadata:', Metadata.getRegistry(route).get(RouteMetadata));
      console.log('HandlerMetadata:', Metadata.getRegistry(route).get(HandlerMetadata));
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

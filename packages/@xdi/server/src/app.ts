import type { ServerAdapter } from './adapters/base';
import { MiddlewareMetadata } from './decorators/middleware';
import { RouteMetadata } from './decorators/route';
import { Metadata } from './metadata';

export namespace App {
  export interface Options extends RouterOptions {
    adapter?: ServerAdapter.AdapterFactory;
  }

  export interface RouterOptions {
    withConnectMiddleware?: any[];
    withMiddleware?: any[];
  }

  export type Route<T = any> = new () => T;
}

export class App {
  constructor(private readonly routers: Router[], private readonly options?: App.Options) {}
}

export class Router {
  constructor(private readonly routes: App.Route[], private readonly options?: App.RouterOptions) {
    const foo = Metadata.getRegistryForSubject(routes[0])?.get(RouteMetadata);
    const bar = Metadata.getRegistryForSubject(routes[0])?.get(MiddlewareMetadata);
    const foo1 = Metadata.getRegistryForSubject(routes[1])?.get(RouteMetadata);
    const bar1 = Metadata.getRegistryForSubject(routes[1])?.get(MiddlewareMetadata);
    console.log('Router', foo);
    console.log('Router', bar);
    console.log('Router', foo1);
    console.log('Router', bar1);
  }
}

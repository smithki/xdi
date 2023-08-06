import type { ServerAdapter } from './adapters/base';

export namespace App {
  export interface Options extends RouterOptions {
    adapter: ServerAdapter;
  }

  export interface RouterOptions {
    withConnectMiddleware: any[];
    withMiddleware: any[];
  }

  export type Route<T = any> = new () => T;
}

export class App {
  constructor(private readonly routers: Router[], private readonly options?: App.Options) {}
}

export class Router {
  constructor(private readonly routes: App.Route[], private readonly options?: App.RouterOptions) {}
}

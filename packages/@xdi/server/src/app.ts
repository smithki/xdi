export namespace App {
  export interface Options extends RouterOptions {}

  export interface RouterOptions {
    withConnectMiddleware: any[];
    withMiddleware: any[];
  }

  export type Route<T = any> = new () => T;
}

export class App {
  constructor(routers: Router[], options?: App.Options) {}
}

export class Router {
  constructor(routes: App.Route[], options?: App.RouterOptions) {}
}

/* eslint-disable new-cap */

import { exitAfterCleanup, addCleanupListener, removeCleanupListener } from 'async-cleanup';
import * as pathToRegExp from 'path-to-regexp';

import { ServerAdapter } from './adapter';
import { HandlerMetadata } from './decorators/handler';
import { RequestMetadata } from './decorators/request';
import { RouteMetadata } from './decorators/route';
import { URLMetadata } from './decorators/url';
import { Metadata } from './metadata';
import { HTTPMethod } from './types';

export namespace App {
  export interface Options {
    adapter: ServerAdapter;
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

  constructor(private readonly routers: Router[], private readonly options: App.Options) {
    for (const router of routers) {
      AppInjected.registerApp(this, router);
    }
  }

  public get adapter() {
    return this.options.adapter;
  }

  public async listen(port: number) {
    ServerAdapter.installGlobals(this.adapter);
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

  public createRequestManager(request: InstanceType<ServerAdapter.Implementations['Request']>): RequestManager {
    const url = new this.adapter.implementations.URL(request.url, 'http://localhost');
    const matchedRoute = this.match(request.method as HTTPMethod, url.pathname);
    const requestManager = new RequestManager(request, matchedRoute);
    AppInjected.registerApp(this, requestManager);
    return requestManager;
  }
}

class AppMetadata extends Metadata<{ app: App }> {}

class AppInjected {
  public static registerApp(app: App, subject: Metadata.Subject) {
    const appMetadata = new AppMetadata(subject, { app });
    Metadata.registerOne(appMetadata);
  }

  protected get app(): App | null {
    return Metadata.getRegistry(this).get(AppMetadata)[0]?.value.app ?? null;
  }
}

export class Router extends AppInjected {
  constructor(private readonly routes: App.Route[]) {
    super();
  }

  public match(method: HTTPMethod, url: string) {
    return this.routes.find((route) => {
      const routeMetadata = Metadata.getRegistry(route).get(RouteMetadata)[0]?.value;
      if (!routeMetadata) {
        return false;
      }
      const matcher = pathToRegExp.match(routeMetadata.pattern, {
        encode: this.app?.adapter.implementations.encodeURI,
      });
      return routeMetadata.method.toLowerCase() === method.toLowerCase() && matcher(url);
    });
  }
}

class RequestManager extends AppInjected {
  constructor(
    public readonly request: InstanceType<ServerAdapter.Implementations['Request']>,
    public readonly route?: App.Route,
  ) {
    super();
  }

  public async getResponse(): Promise<InstanceType<ServerAdapter.Implementations['Response']>> {
    // --- Initial validations ---------------------------------------------- //

    if (!this.app) {
      throw new Error('App not injected'); // TODO: better errors
    }

    if (!this.route) {
      // TODO: more robust 404
      return new this.app.adapter.implementations.Response('Not found', {
        status: 404,
      });
    }

    // --- Create route instance -------------------------------------------- //

    const routeInstance = new this.route();

    // --- Inject property decorators --------------------------------------- //

    // 1. Inject request
    const requestMetadata = Metadata.getRegistry(this.route).get(RequestMetadata)[0]?.value;
    routeInstance[requestMetadata.key] = this.request;

    // 2. Inject request URL
    const urlMetadata = Metadata.getRegistry(this.route).get(URLMetadata)[0]?.value;
    routeInstance[urlMetadata.key] = new URL(this.request.url);

    // --- Execute request handler; resolve response ------------------------ //

    // Find handler and get a response.
    const handlerMetadata = Metadata.getRegistry(this.route).get(HandlerMetadata)[0]?.value;
    const response = routeInstance[handlerMetadata.key]?.() as
      | InstanceType<ServerAdapter.Implementations['Response']>
      | undefined;

    if (!response) {
      // TODO: more robust fallback reponse (or should this be an error?)
      return new this.app.adapter.implementations.Response('', {
        status: 200,
      });
    }

    if (!response.headers.has('Content-Type')) {
      response.headers.append('Content-Type', 'text/plain');
    }

    return response;
  }
}

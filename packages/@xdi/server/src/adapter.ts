import type { App } from './app';

export namespace ServerAdapter {
  /**
   *
   */
  export interface Implementations {
    fetch: typeof fetch;
    FormData: typeof FormData;
    Headers: typeof Headers;
    Request: typeof Request;
    Response: typeof Response;
    AbortController: typeof AbortController;

    File: typeof File;
    Blob: typeof Blob;

    atob: typeof atob;
    btoa: typeof btoa;

    URL: typeof URL;
  }

  /**
   *
   */
  export interface ServerListen {
    (port: number, app: App): void | Promise<void>;
  }

  /**
   *
   */
  export function installGlobals(adapter: ServerAdapter) {
    for (const [polyfill, implementation] of Object.entries(adapter.implementations)) {
      adapter.global[polyfill] = implementation;
    }
  }

  /**
   *
   */
  export interface AdapterFactory {
    (): Promise<ServerAdapter>;
  }
}

/**
 *
 */
export interface ServerAdapter {
  global: any;
  implementations: ServerAdapter.Implementations;
  listen: ServerAdapter.ServerListen;
}

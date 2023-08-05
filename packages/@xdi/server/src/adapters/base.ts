import type { fetch, FormData, Headers, Request, Response } from '@remix-run/web-fetch';
import type { File, Blob } from '@remix-run/web-file';
import type { AbortController } from 'abort-controller';

export namespace ServerAdapter {
  export interface Implementations {
    fetch?: typeof fetch;
    FormData?: typeof FormData;
    Headers?: typeof Headers;
    Request?: typeof Request;
    Response?: typeof Response;
    AbortController?: typeof AbortController;

    File?: typeof File;
    Blob?: typeof Blob;

    atob?: typeof atob;
    btoa?: typeof btoa;
  }

  export interface ServerListen {
    (port: number): ServerClose | Promise<ServerClose>;
  }

  export interface ServerClose {
    (): void | Promise<void>;
  }

  export function installGlobals(adapter: ServerAdapter) {
    for (const [polyfill, implementation] of Object.entries(adapter.implementations)) {
      adapter.global[polyfill] = implementation;
    }
  }
}

export interface ServerAdapter {
  global: any;
  implementations: ServerAdapter.Implementations;
  listen: ServerAdapter.ServerListen;
}

import { expressAdapter } from '@xdi-server/adapter-express';
import { route, App, Router, handler, request, url } from '@xdi-server/core';

@route('GET', '/hello-world')
class BarRoute {
  @request()
  req!: Request;

  @url()
  url!: URL;

  @handler()
  bar() {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const body = JSON.stringify({
      hello: 'world',
    });

    return new Response(body, {
      headers,
      status: 200,
    });
  }
}

const router = new Router([BarRoute]);

expressAdapter().then((adapter) => {
  const app = new App([router], { adapter });
  app.listen(3000);
});

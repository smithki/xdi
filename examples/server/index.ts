import { expressAdapter } from '@xdi-server/adapter-express';
import { route, App, Router, middleware, handler } from '@xdi-server/core';

console.log('@xdi/example-server');

@middleware()
@route('POST', '/hello-world2')
@route('PUT', '/hello-world')
class FooRoute {}

@middleware()
@route('GET', '/hello-world')
class BarRoute {
  @handler()
  bar() {
    console.log('YOLO');
    return new Response('Hello world!', {
      status: 200,
    });
  }
}

const router = new Router([FooRoute, BarRoute]);

expressAdapter().then((adapter) => {
  const app = new App([router], { adapter });
  app.listen(3000);
});

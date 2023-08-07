import { expressAdapter } from '@xdi/adapter-express';
import { route, App, Router, middleware, handler } from '@xdi/server';

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
  }
}

const router = new Router([FooRoute, BarRoute]);

expressAdapter().then((adapter) => {
  const app = new App([router], { adapter });
  app.listen(3000);
});

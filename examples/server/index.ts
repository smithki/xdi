import { expressAdapter } from '@xdi/adapter-express';
import { route, App, Router, middleware } from '@xdi/server';

console.log('@xdi/example-server');

@middleware()
@route('POST', '/hello-world2')
@route('PUT', '/hello-world')
class FooRoute {}

@middleware()
@route('GET', '/hello-world')
class BarRoute {}

const router = new Router([FooRoute, BarRoute]);

const app = new App([router], {
  adapter: expressAdapter,
});

app.listen(3000);

// --- Pseudo APIs ---------------------------------------------------------- //

interface Context {
  url: string;
}

function createApp(...args: any[]): any {}
function createRouter(...args: any[]): any {}

function context(...args: any[]): PropertyDecorator {
  return () => {};
}

function param(...args: any[]): PropertyDecorator {
  return () => {};
}

function query(...args: any[]): PropertyDecorator {
  return () => {};
}

function body(...args: any[]): PropertyDecorator {
  return () => {};
}

function handler(...args: any[]): PropertyDecorator {
  return () => {};
}

function on(...args: any[]): PropertyDecorator {
  return () => {};
}

function middleware(...args: any[]): ClassDecorator {
  return () => {};
}

function withConnectMiddleware(...args: any[]): ClassDecorator {
  return () => {};
}

function withMiddleware(...args: any[]): ClassDecorator {
  return () => {};
}

function middlewareContext(...args: any[]): PropertyDecorator {
  return () => {};
}

function route(...args: any[]): ClassDecorator {
  return () => {};
}

// --- Psuedo example ------------------------------------------------------- //

function bodyparser() {}

@middleware()
class AuthMiddleware {
  @context()
  ctx!: Context;

  @query()
  asdf!: string;

  @handler()
  protected checkAuth() {
    // returning "undefined" == "next()"
  }
}

@withConnectMiddleware([bodyparser])
@withMiddleware([AuthMiddleware])
@route('PUT', '/hello/:id')
class UpdateResource {
  @context()
  ctx!: Context;

  @middlewareContext(AuthMiddleware)
  auth!: AuthMiddleware;

  @param()
  id!: string;

  @query()
  helloOne!: string;

  @query({ multiple: true, required: false, validate: (raw: string[]) => raw.length > 1 })
  helloTwo?: string[];

  @body()
  world!: { nyes: 'ynope' };

  @handler()
  protected async doUpdate() {
    // return new Response('hello world');
  }

  @on('sent')
  protected async handleSent() {}
}

export const controller = createRouter([UpdateResource], {
  withConnectMiddleware: [bodyparser],
  withMiddleware: [AuthMiddleware],
});

export const app = createApp([controller], {
  withConnectMiddleware: [bodyparser],
  withMiddleware: [AuthMiddleware],
});

app.listen(3000);

// --- Notes ---------------------------------------------------------------- //
/*

Lifecycle of an HTTP request:
1. Match URL to registered route patterns - decide which route will handle the request
2. Instantiate route instance & middleware instances
3. Collect query params and URL params; perform validations
4. Run middlewares; stop early if any middleware returns a `Response` instance or throws an error
5. Return response at the end of a flow.

*/

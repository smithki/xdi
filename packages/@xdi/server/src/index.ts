// --- Pseudo APIs ---------------------------------------------------------- //

interface Context {
  url: string;
}

const Next = Symbol('Next');

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

// TODO: is this a good workaround?
function useConnectMiddleware(...args: any[]): ClassDecorator {
  return () => {};
}

function useMiddleware(...args: any[]): ClassDecorator {
  return () => {};
}

function useMiddlewareContext(...args: any[]): PropertyDecorator {
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
    return Next;
  }
}

@useConnectMiddleware([bodyparser])
@useMiddleware([AuthMiddleware])
@route('PUT', '/hello/:id')
class UpdateResource {
  @context()
  ctx!: Context;

  @useMiddlewareContext(AuthMiddleware)
  auth!: AuthMiddleware;

  @param()
  id!: string;

  @query()
  helloOne!: string;

  @query({ multiple: true, required: true, validate: (raw: string[]) => raw.length > 1 })
  helloTwo?: string[];

  @body()
  world!: { nyes: 'ynope' };

  @handler()
  protected async doUpdate() {
    return new Response('hello world');
  }

  @on('sent')
  protected async handleSent() {}
}

export const controller = createRouter([UpdateResource], {
  useConnectMiddleware: [bodyparser],
  useMiddleware: [AuthMiddleware],
});

export const app = createApp([controller], {
  useConnectMiddleware: [bodyparser],
  useMiddleware: [AuthMiddleware],
});

app.listen(3000);

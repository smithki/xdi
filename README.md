# `xdi` monorepo

- **Bare-bones dependency injection using TypeScript decorators.** Absolutely no frills.
- **<1kb bundled & compressed** (including React bindings).
- **Two field decorators: `@inject` and `@inject.lazy`.** No complicated dependency graph.
- **Supports `global` and `transient`-scoped dependencies.**
- **Direct upgrade path to [ES decorators](https://github.com/tc39/proposal-decorators).**

| Package                       | Description |
| ----------------------------- | ----------- |
| [`xdi`](./packages/xdi)       | The meat-and-potatoes of `xdi`. This is what you `npm install` & use. |
| [`@xdi/react`](./packages/@xdi/react) | React bindings for `xdi` (i.e.: `useService(...)`). |
| [`@internal/config`](./packages/@internal/config) | Shared toolchains (i.e.: TypeScript, ESLint, etc.). |
| [`@internal/tools`](./packages/@internal/tools) | Internal CLI tool for automating common tasks. |

## ⚡️ Quick Start

1. Install:

   ```zsh
   npm install xdi
   ```

2. Configure TypeScript `experimentalDecorators`:

   ```js
   // tsconfig.json
   {
     "compilerOptions": {
       "experimentalDecorators": true,
     }
   }
   ```

3. Make your DI container:

   ```ts
   // src/services/container.ts
   import { createContainer } from 'xdi';

   export const { inject, ...container } = createContainer();
   ```

4. Write your services:

   ```ts
   import { inject } from 'src/services/container';

   export class MyService {
     sayHello(fullName: string) {
       console.log(`Hello there, ${fullName}!`);
     }
   }

   export class MyConsumer {
     // Injected upon instantiation
     @inject(() => MyService) private readonly svc!: MyService;

     // Injected upon usage
     // (this will change to use auto-accessors when ES decorators land)
     @inject.lazy(() => MyService) private readonly svc!: MyService;

     sayName(firstName: string, lastName: string) {
       this.svc.sayHello(`${firstName} ${lastName}`);
     }
   }
   ```

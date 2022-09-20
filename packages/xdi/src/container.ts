import type { Container, ContainerOptions, ResolutionOptionsInternal, Token } from './types';

export function createContainer(containerOptions: ContainerOptions = {}): Container {
  const { defaultScope = 'singleton' } = containerOptions;

  const singletonRegistry = new Map<Token<any>, any>();
  const transientRegistry = new Map<any, any>();
  const transientCreators = new Map<any, any>();
  const transientTokensRebound = new Set<any>();

  const container: Container = {
    Inject(token, options) {
      return () => {
        return {
          configurable: false,
          enumerable: true,
          get() {
            if (options?.scope === 'transient') {
              (options as ResolutionOptionsInternal)._transientContext = this;
            }

            return container.get(token(), options);
          },
        };
      };
    },

    get(token, options = {}) {
      const { scope = defaultScope, _transientContext } = options as ResolutionOptionsInternal;

      // --- Resolve singleton instance --- //

      if (scope === 'singleton') {
        if (singletonRegistry.has(token)) {
          return singletonRegistry.get(token);
        }

        // eslint-disable-next-line new-cap
        const inst = isConstructor(token) ? new token() : token();
        singletonRegistry.set(token, inst);
        return inst;
      }

      // --- Resolve transient instance --- //

      if (!transientTokensRebound.has(token) && !!_transientContext) {
        if (transientRegistry.has(_transientContext)) {
          return transientRegistry.get(_transientContext);
        }
      }

      // eslint-disable-next-line new-cap
      const Creator = transientCreators.get(token) || token;
      const inst = isConstructor(Creator) ? new Creator() : Creator();
      if (_transientContext) {
        transientRegistry.set(_transientContext, inst);
      }
      transientTokensRebound.delete(token);
      return inst;
    },

    bind(token, Creator) {
      const inst = isConstructor(Creator) ? new Creator() : Creator();
      singletonRegistry.set(token, inst);
      transientCreators.set(token, Creator);
      transientTokensRebound.add(token);
      return inst;
    },

    unbind(token) {
      // eslint-disable-next-line new-cap
      const inst = isConstructor(token) ? new token() : token();
      singletonRegistry.set(token, inst);
      transientCreators.delete(token);
      transientTokensRebound.delete(token);
      return inst;
    },

    reset() {
      singletonRegistry.clear();
      transientRegistry.clear();
      transientCreators.clear();
      transientTokensRebound.clear();
    },
  };

  return container;
}

function isConstructor<T>(value: Token<T>): value is new () => T {
  return !!value && !!value.prototype && !!value.prototype.constructor;
}

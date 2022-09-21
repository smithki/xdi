import type { Container, ContainerOptions, Token } from './types';

export function createContainer(containerOptions: ContainerOptions = {}): Container {
  const { defaultScope = 'global' } = containerOptions;

  const globalRegistry = new Map<Token<any>, any>();
  const tokenBoundCreators = new Map<any, any>();

  const container: Container = {
    Inject(token, options) {
      return () => {
        return {
          configurable: false,
          enumerable: true,
          writable: false,
          value: container.get(token(), options),
        };
      };
    },

    get(token, options = {}) {
      const { scope = defaultScope } = options;

      if (scope === 'global') {
        if (globalRegistry.has(token)) {
          return globalRegistry.get(token);
        }
      }

      const Creator = tokenBoundCreators.get(token) || token;
      const inst = isConstructor(Creator) ? new Creator() : Creator();

      if (scope === 'global') {
        globalRegistry.set(token, inst);
      }

      return inst;
    },

    bind(token, Creator) {
      const inst = isConstructor(Creator) ? new Creator() : Creator();
      globalRegistry.set(token, inst);
      tokenBoundCreators.set(token, Creator);
      return inst;
    },

    unbind(token) {
      // eslint-disable-next-line new-cap
      const inst = isConstructor(token) ? new token() : token();
      globalRegistry.set(token, inst);
      tokenBoundCreators.delete(token);
      return inst;
    },

    reset() {
      globalRegistry.clear();
      tokenBoundCreators.clear();
    },
  };

  return container;
}

function isConstructor<T>(value: Token<T>): value is new () => T {
  return !!value && !!value.prototype && !!value.prototype.constructor;
}

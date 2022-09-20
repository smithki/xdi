export type Token<T> = (new () => T) | (() => T);

export type ResolutionScope = 'singleton' | 'transient';

export interface ResolutionOptions {
  scope?: ResolutionScope;
}

export interface ResolutionOptionsInternal extends ResolutionOptions {
  _transientContext: any;
}

export interface InjectDecorator {
  <T>(token: () => Token<T>, options?: ResolutionOptions): PropertyDecorator;
}

export interface ContainerOptions {
  defaultScope?: ResolutionScope;
}

export interface Container {
  Inject: InjectDecorator;

  /**
   * Gets a service instance designated by `token`.
   * Instantiates the service if not already created.
   */
  get<T>(token: Token<T>, options?: ResolutionOptions): T;

  /**
   * Bind a new `Creator` to the service designated by `token`.
   */
  bind<T, C extends T>(token: Token<T>, Creator: Token<C>): T;

  /**
   * Reset instances for the given `token`.
   * This will also remove any mocks binded with `Container.bind`.
   */
  unbind<T>(token: Token<T>): T;

  /**
   * Clears all existing instances from this container.
   * The next time a token is requested, it will resolve to a fresh instance.
   */
  reset(): void;
}

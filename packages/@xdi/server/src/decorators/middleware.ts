import { Metadata } from '../metadata';

export class MiddlewareMetadata extends Metadata<{
  foo: string;
}> {}

/**
 *
 */
export function middleware(): ClassDecorator {
  return (target) => {
    Metadata.register(
      new MiddlewareMetadata(target, {
        foo: 'bar',
      }),
    );
  };
}

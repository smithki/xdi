import { Metadata } from '../metadata';
import { HTTPMethod } from '../types';

export class RouteMetadata extends Metadata<{
  method: HTTPMethod;
  pattern: string;
}> {}

/**
 *
 */
export function route(method: HTTPMethod, pattern: string): ClassDecorator {
  return (target) => {
    Metadata.register(
      new RouteMetadata(target, {
        method,
        pattern,
      }),
    );
  };
}

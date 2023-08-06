import { Metadata } from '../metadata';
import { HTTPMethod } from '../types';

export class RouteMetadata<Subject> extends Metadata<
  Subject,
  'route',
  {
    method: HTTPMethod;
    pattern: string;
  }
> {}

/**
 *
 */
export function route(method: HTTPMethod, pattern: string): ClassDecorator {
  return (target) => {
    Metadata.register(
      new RouteMetadata({
        subject: target,
        key: 'route',
        value: { method, pattern },
      }),
    );
  };
}

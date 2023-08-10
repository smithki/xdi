import { Metadata } from '../metadata';

export class RequestMetadata extends Metadata<{
  key: string | symbol;
}> {}

/**
 *
 */
export function request(): PropertyDecorator {
  return (target, propertyKey) => {
    const subject = target.constructor;
    Metadata.register(
      new RequestMetadata(subject, {
        key: propertyKey,
      }),
    );
  };
}

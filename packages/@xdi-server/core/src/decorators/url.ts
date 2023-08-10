import { Metadata } from '../metadata';

export class URLMetadata extends Metadata<{
  key: string | symbol;
}> {}

/**
 *
 */
export function url(): PropertyDecorator {
  return (target, propertyKey) => {
    const subject = target.constructor;
    Metadata.register(
      new URLMetadata(subject, {
        key: propertyKey,
      }),
    );
  };
}

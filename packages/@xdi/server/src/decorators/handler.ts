import { Metadata } from '../metadata';

export class HandlerMetadata extends Metadata<{
  handlerKey: string | symbol;
}> {}

/**
 *
 */
export function handler(): MethodDecorator {
  return (target, propertyKey) => {
    const subject = Object.getPrototypeOf(target).constructor;
    Metadata.register(
      new HandlerMetadata(subject, {
        handlerKey: propertyKey,
      }),
    );
  };
}

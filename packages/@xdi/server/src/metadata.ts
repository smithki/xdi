export class Metadata<Value> {
  private static _subjects = new Map<any, MetadataRegistry<any>>();

  constructor(public readonly subject: any, public readonly value: Value) {}

  /**
   *
   */
  public static register<M extends Metadata<any>>(metadata: M) {
    const metadataType = Object.getPrototypeOf(metadata).constructor as new () => Metadata<any>;

    if (!Metadata._subjects.has(metadata.subject)) {
      const registry = new MetadataRegistry<Metadata<any>>(metadata.subject);
      registry.get(metadataType).push(metadata);
      Metadata._subjects.set(metadata.subject, registry);
    } else {
      Metadata._subjects.get(metadata.subject)?.get(metadataType).push(metadata);
    }
  }

  /**
   *
   */
  public static getRegistryForSubject<S>(subject: S) {
    return Metadata._subjects.get(subject);
  }
}

class MetadataRegistry<Subject> {
  private _registry = new Map<new (...args: any[]) => Metadata<any>, Metadata<any>[]>();

  constructor(public readonly subject: Subject) {}

  get<M extends Metadata<any>>(metadataType: new (...args: any[]) => M): M[] {
    if (!this._registry.has(metadataType)) {
      this._registry.set(metadataType, []);
    }
    return this._registry.get(metadataType)! as M[];
  }
}

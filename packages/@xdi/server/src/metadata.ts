export namespace Metadata {
  export type Constructor<M extends Metadata = Metadata> = new (...args: any[]) => M;
  export type Subject = any;
  export type SubjectRegistry = Map<Subject, MetadataRegistry<Subject>>;
  export type Container = Map<Constructor, Metadata[]>;
}

/**
 *
 */
export abstract class Metadata<Value = any> {
  private static _subjects: Metadata.SubjectRegistry = new Map();

  constructor(public readonly subject: Metadata.Subject, public readonly value: Value) {}

  /**
   *
   */
  public static register<M extends Metadata>(metadata: M) {
    const metadataType = Metadata.getType(metadata);
    Metadata.getRegistry(metadata.subject).get(metadataType).push(metadata);
  }

  /**
   *
   */
  public static registerOne<M extends Metadata>(metadata: M) {
    const metadataType = Metadata.getType(metadata);
    const metadataCollection = Metadata.getRegistry(metadata.subject).get(metadataType);
    if (metadataCollection.length === 0) {
      metadataCollection.push(metadata);
    } else {
      // TODO: throw an error...
    }
  }

  /**
   *
   */
  public static getType<M extends Metadata>(metadata: M): Metadata.Constructor<M> {
    return Object.getPrototypeOf(metadata).constructor as Metadata.Constructor<M>;
  }

  /**
   *
   */
  public static getRegistry<S>(subject: S) {
    if (!Metadata._subjects.has(subject)) {
      const registry = new MetadataRegistry(subject);
      Metadata._subjects.set(subject, registry);
    }
    return Metadata._subjects.get(subject)!;
  }
}

/**
 *
 */
class MetadataRegistry<Subject = Metadata.Subject> {
  private _state: Metadata.Container = new Map();

  constructor(public readonly subject: Subject) {}

  /**
   *
   */
  get<M extends Metadata>(metadataType: Metadata.Constructor<M>): M[] {
    if (!this._state.has(metadataType)) {
      this._state.set(metadataType, []);
    }
    return this._state.get(metadataType)! as M[];
  }
}

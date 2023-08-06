type MetadataSet = Set<Metadata<any, any, any>>;
type MetadataContainer = Map<string, MetadataSet>;
type MetadataRegistry = Map<any, MetadataContainer>;

export class Metadata<Subject, Key extends string, Value> {
  private static _registry: MetadataRegistry = new Map();

  public subject: Subject;
  public key: Key;
  public value: Value;

  constructor(options: { subject: Subject; key: Key; value: Value }) {
    this.subject = options.subject;
    this.key = options.key;
    this.value = options.value;
  }

  /**
   *
   */
  public static register<M extends Metadata<any, any, any>>(metadata: M) {
    if (!Metadata._registry.has(metadata.subject)) {
      // Case #1: Registry does not contain any entry for the given subject.
      const collection = new Map();
      collection.set(metadata.key, new Set([metadata]));
      Metadata._registry.set(metadata.key, collection);
    } else if (!Metadata._registry.get(metadata.subject)!.has(metadata.key)) {
      // Case #2: Registry contains an entry for the given subject, but does not
      //          contain any metadatas for the given key.
      const collection = Metadata._registry.get(metadata.subject)!;
      collection.set(metadata.key, new Set([metadata]));
      Metadata._registry.set(metadata.key, collection);
    } else {
      // Case #3: Registry contains an entry for the given subject & contains
      //          other metadatas for the given key, so we'll append this
      //          metadata to the existing list.
      Metadata._registry.get(metadata.subject)!.get(metadata.key)!.add(metadata);
    }
  }

  /**
   *
   */
  public static getMetadataForSubject<S>(subject: S) {
    return Metadata._registry.get(subject);
  }
}

import type { Workout as WorkoutType, LibraryRef, DocumentMetadata } from '@openset/types';
import { BlockBuilder } from './block.js';

type DurationUnit = 's' | 'min' | 'h' | 'day' | 'week';

export class WorkoutBuilder {
  private _id?: string;
  private _name?: string;
  private _date?: string;
  private _sports?: string[];
  private _note?: string;
  private _library?: LibraryRef;
  private _duration?: { value: number; unit: DurationUnit };
  private _x_extensions?: string[];
  private _metadata?: DocumentMetadata;
  private _blocks: ReturnType<BlockBuilder['build']>[] = [];

  constructor(name?: string) {
    if (name) this._name = name;
  }

  /** Set a unique ID for this workout */
  id(id: string): this {
    this._id = id;
    return this;
  }

  /** Set the workout name */
  name(name: string): this {
    this._name = name;
    return this;
  }

  /** Set the workout date (ISO 8601 format, e.g. "2024-01-15") */
  date(date: string): this {
    this._date = date;
    return this;
  }

  /** Set the sports for this workout */
  sports(...sports: string[]): this {
    this._sports = sports;
    return this;
  }

  /** Add a note to the workout */
  note(note: string): this {
    this._note = note;
    return this;
  }

  /** Set a library reference */
  library(ref: LibraryRef): this {
    this._library = ref;
    return this;
  }

  /** Set the estimated workout duration with an explicit unit */
  duration(value: number, unit: DurationUnit): this {
    this._duration = { value, unit };
    return this;
  }

  /** Declare extension namespaces used in this document */
  extensions(exts: string[]): this {
    this._x_extensions = exts;
    return this;
  }

  /** Set document metadata (version, author, provider, license, created_at, updated_at) */
  metadata(metadata: DocumentMetadata): this {
    this._metadata = metadata;
    return this;
  }

  /** Add a named block */
  block(name: string, configure: (b: BlockBuilder) => void): this;
  /** Add an unnamed block */
  block(configure: (b: BlockBuilder) => void): this;
  block(nameOrConfigure: string | ((b: BlockBuilder) => void), configure?: (b: BlockBuilder) => void): this {
    let builder: BlockBuilder;
    if (typeof nameOrConfigure === 'string') {
      builder = new BlockBuilder(nameOrConfigure);
      configure!(builder);
    } else {
      builder = new BlockBuilder();
      nameOrConfigure(builder);
    }
    this._blocks.push(builder.build());
    return this;
  }

  /** Build the Workout JSON object */
  build(): WorkoutType {
    const result: Record<string, unknown> = {
      openset_version: '1.0',
      type: 'workout',
      blocks: this._blocks,
    };
    if (this._id !== undefined) result.id = this._id;
    if (this._name !== undefined) result.name = this._name;
    if (this._date !== undefined) result.date = this._date;
    if (this._sports !== undefined) result.sports = this._sports;
    if (this._note !== undefined) result.note = this._note;
    if (this._library !== undefined) result.library = this._library;
    if (this._duration !== undefined) result.duration = this._duration;
    if (this._x_extensions !== undefined) result.x_extensions = this._x_extensions;
    if (this._metadata !== undefined) result.metadata = this._metadata;
    return result as unknown as WorkoutType;
  }

  /** Build and validate the Workout using @openset/validator (async, throws on errors) */
  async buildValidated(): Promise<WorkoutType> {
    const doc = this.build();
    const { validateAndThrow } = await import('../validation.js');
    await validateAndThrow(doc);
    return doc;
  }
}

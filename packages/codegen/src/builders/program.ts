import type { Program as ProgramType, DocumentMetadata } from '@openset/types';
import { PhaseBuilder } from './phase.js';

type DurationUnit = 's' | 'min' | 'h' | 'day' | 'week';

export class ProgramBuilder {
  private _id?: string;
  private _name: string;
  private _description?: string;
  private _sports?: string[];
  private _duration?: { value: number; unit: DurationUnit };
  private _metadata?: DocumentMetadata;
  private _x_extensions?: string[];
  private _phases: ReturnType<PhaseBuilder['build']>[] = [];

  constructor(name: string) {
    this._name = name;
  }

  /** Set a unique ID for this program */
  id(id: string): this {
    this._id = id;
    return this;
  }

  /** Set the program description */
  description(desc: string): this {
    this._description = desc;
    return this;
  }

  /** Set the sports for this program */
  sports(...sports: string[]): this {
    this._sports = sports;
    return this;
  }

  /** Set the total duration with an explicit unit */
  duration(value: number, unit: DurationUnit): this {
    this._duration = { value, unit };
    return this;
  }

  /** Set the total duration in weeks */
  durationWeeks(weeks: number): this {
    this._duration = { value: weeks, unit: 'week' };
    return this;
  }

  /** Set the author (convenience for metadata.author) */
  author(author: string): this {
    this._metadata = { ...this._metadata, author };
    return this;
  }

  /** Set the creation date (ISO 8601 format; convenience for metadata.created_at) */
  createdAt(date: string): this {
    this._metadata = { ...this._metadata, created_at: date };
    return this;
  }

  /** Set document metadata (version, author, provider, license, created_at, updated_at) */
  metadata(metadata: DocumentMetadata): this {
    this._metadata = { ...this._metadata, ...metadata };
    return this;
  }

  /** Declare extension namespaces used in this document */
  extensions(exts: string[]): this {
    this._x_extensions = exts;
    return this;
  }

  /** Add a phase to this program */
  phase(name: string, configure: (p: PhaseBuilder) => void): this {
    const builder = new PhaseBuilder(name);
    configure(builder);
    this._phases.push(builder.build());
    return this;
  }

  /** Build the Program JSON object */
  build(): ProgramType {
    const result: Record<string, unknown> = {
      openset_version: '1.0',
      type: 'program',
      name: this._name,
      phases: this._phases,
    };
    if (this._id !== undefined) result.id = this._id;
    if (this._description !== undefined) result.description = this._description;
    if (this._sports !== undefined) result.sports = this._sports;
    if (this._duration !== undefined) result.duration = this._duration;
    if (this._metadata !== undefined) result.metadata = this._metadata;
    if (this._x_extensions !== undefined) result.x_extensions = this._x_extensions;
    return result as unknown as ProgramType;
  }

  /** Build and validate the Program using @openset/validator (async, throws on errors) */
  async buildValidated(): Promise<ProgramType> {
    const doc = this.build();
    const { validateAndThrow } = await import('../validation.js');
    await validateAndThrow(doc);
    return doc;
  }
}

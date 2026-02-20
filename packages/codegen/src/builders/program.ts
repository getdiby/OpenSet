import type { Program as ProgramType } from '@openset/types';
import { PhaseBuilder } from './phase.js';

export class ProgramBuilder {
  private _id?: string;
  private _name: string;
  private _description?: string;
  private _sports?: string[];
  private _duration_weeks?: number;
  private _author?: string;
  private _created_at?: string;
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

  /** Set the total duration in weeks */
  durationWeeks(weeks: number): this {
    this._duration_weeks = weeks;
    return this;
  }

  /** Set the author */
  author(author: string): this {
    this._author = author;
    return this;
  }

  /** Set the creation date (ISO 8601 format) */
  createdAt(date: string): this {
    this._created_at = date;
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
    const result: ProgramType = {
      openset_version: '1.0',
      type: 'program',
      name: this._name,
      phases: this._phases,
    };
    if (this._id !== undefined) result.id = this._id;
    if (this._description !== undefined) result.description = this._description;
    if (this._sports !== undefined) result.sports = this._sports;
    if (this._duration_weeks !== undefined) result.duration_weeks = this._duration_weeks;
    if (this._author !== undefined) result.author = this._author;
    if (this._created_at !== undefined) result.created_at = this._created_at;
    if (this._x_extensions !== undefined) result.x_extensions = this._x_extensions;
    return result;
  }

  /** Build and validate the Program using @openset/validator (async, throws on errors) */
  async buildValidated(): Promise<ProgramType> {
    const doc = this.build();
    const { validateAndThrow } = await import('../validation.js');
    await validateAndThrow(doc);
    return doc;
  }
}

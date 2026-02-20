import type { Block as BlockType, ExecutionMode } from '@openset/types';
import { SeriesBuilder } from './series.js';

export class BlockBuilder {
  private _id?: string;
  private _name?: string;
  private _note?: string;
  private _series: ReturnType<SeriesBuilder['build']>[] = [];

  constructor(name?: string) {
    if (name) this._name = name;
  }

  /** Set a unique ID for this block */
  id(id: string): this {
    this._id = id;
    return this;
  }

  /** Set the block name */
  name(name: string): this {
    this._name = name;
    return this;
  }

  /** Add a note to the block */
  note(note: string): this {
    this._note = note;
    return this;
  }

  /** Add a series with the given execution mode */
  series(mode: ExecutionMode, configure: (s: SeriesBuilder) => void): this {
    const builder = new SeriesBuilder(mode);
    configure(builder);
    this._series.push(builder.build());
    return this;
  }

  /** Build the Block object */
  build(): BlockType {
    const result: BlockType = { series: this._series };
    if (this._id !== undefined) result.id = this._id;
    if (this._name !== undefined) result.name = this._name;
    if (this._note !== undefined) result.note = this._note;
    return result;
  }
}

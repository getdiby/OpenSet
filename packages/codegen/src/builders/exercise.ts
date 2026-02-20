import type { Exercise as ExerciseType, Set } from '@openset/types';

export class ExerciseBuilder {
  private _exercise_id?: string;
  private _name?: string;
  private _group?: string;
  private _note?: string;
  private _sets: Set[] = [];

  constructor(idOrName: string, byName = false) {
    if (byName) {
      this._name = idOrName;
    } else {
      this._exercise_id = idOrName;
    }
  }

  /** Set a display name (in addition to or instead of exercise_id) */
  name(name: string): this {
    this._name = name;
    return this;
  }

  /** Assign a group label (used in CLUSTER execution mode) */
  group(group: string): this {
    this._group = group;
    return this;
  }

  /** Add a note to the exercise */
  note(note: string): this {
    this._note = note;
    return this;
  }

  /** Add a single set */
  set(set: Set): this {
    this._sets.push(set);
    return this;
  }

  /** Add N identical sets at once (each is a shallow copy) */
  sets(count: number, set: Set): this {
    for (let i = 0; i < count; i++) {
      this._sets.push({ ...set });
    }
    return this;
  }

  /** Build the Exercise object */
  build(): ExerciseType {
    const result: ExerciseType = { sets: this._sets };
    if (this._exercise_id !== undefined) result.exercise_id = this._exercise_id;
    if (this._name !== undefined) result.name = this._name;
    if (this._group !== undefined) result.group = this._group;
    if (this._note !== undefined) result.note = this._note;
    return result;
  }
}

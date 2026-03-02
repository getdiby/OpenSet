import type { Series as SeriesType, ExecutionMode, ValueObject } from '@diby/openset-types';
import { ExerciseBuilder } from './exercise.js';

export class SeriesBuilder {
  private _id?: string;
  private _execution_mode: ExecutionMode;
  private _rounds?: ValueObject;
  private _rest_after?: ValueObject;
  private _note?: string;
  private _exercises: ReturnType<ExerciseBuilder['build']>[] = [];

  constructor(mode: ExecutionMode) {
    this._execution_mode = mode;
  }

  /** Set a unique ID for this series */
  id(id: string): this {
    this._id = id;
    return this;
  }

  /** Set the number of rounds for the series */
  rounds(rounds: ValueObject): this {
    this._rounds = rounds;
    return this;
  }

  /** Set rest after the series (shorthand: creates a fixed value) */
  rest(value: number, unit: string): this {
    this._rest_after = { type: 'fixed', value, unit };
    return this;
  }

  /** Set rest after the series (full ValueObject) */
  restAfter(rest: ValueObject): this {
    this._rest_after = rest;
    return this;
  }

  /** Add a note to the series */
  note(note: string): this {
    this._note = note;
    return this;
  }

  /** Add an exercise by exercise_id */
  exercise(exerciseId: string, configure: (e: ExerciseBuilder) => void): this {
    const builder = new ExerciseBuilder(exerciseId);
    configure(builder);
    this._exercises.push(builder.build());
    return this;
  }

  /** Add an exercise by custom name (not from the canonical library) */
  namedExercise(name: string, configure: (e: ExerciseBuilder) => void): this {
    const builder = new ExerciseBuilder(name, true);
    configure(builder);
    this._exercises.push(builder.build());
    return this;
  }

  /** Build the Series object */
  build(): SeriesType {
    const result: SeriesType = {
      execution_mode: this._execution_mode,
      exercises: this._exercises,
    };
    if (this._id !== undefined) result.id = this._id;
    if (this._rounds !== undefined) result.rounds = this._rounds;
    if (this._rest_after !== undefined) result.rest_after = this._rest_after;
    if (this._note !== undefined) result.note = this._note;
    return result;
  }
}

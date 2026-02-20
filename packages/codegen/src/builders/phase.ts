import type { Phase as PhaseType, Workout as WorkoutType } from '@openset/types';
import { WorkoutBuilder } from './workout.js';

export class PhaseBuilder {
  private _id?: string;
  private _name: string;
  private _week_start?: number;
  private _week_end?: number;
  private _goal?: string;
  private _workouts: Omit<WorkoutType, 'openset_version' | 'type'>[] = [];

  constructor(name: string) {
    this._name = name;
  }

  /** Set a unique ID for this phase */
  id(id: string): this {
    this._id = id;
    return this;
  }

  /** Set the week range for this phase */
  weeks(start: number, end: number): this {
    this._week_start = start;
    this._week_end = end;
    return this;
  }

  /** Set the goal for this phase */
  goal(goal: string): this {
    this._goal = goal;
    return this;
  }

  /** Add a workout to this phase */
  workout(name: string, configure: (s: WorkoutBuilder) => void): this {
    const builder = new WorkoutBuilder(name);
    configure(builder);
    const built = builder.build();
    // Workouts inside phases don't have openset_version or type
    const { openset_version, type, ...workoutData } = built;
    this._workouts.push(workoutData);
    return this;
  }

  /** Build the Phase object */
  build(): PhaseType {
    const result: PhaseType = {
      name: this._name,
      workouts: this._workouts as WorkoutType[],
    };
    if (this._id !== undefined) result.id = this._id;
    if (this._week_start !== undefined) result.week_start = this._week_start;
    if (this._week_end !== undefined) result.week_end = this._week_end;
    if (this._goal !== undefined) result.goal = this._goal;
    return result;
  }
}

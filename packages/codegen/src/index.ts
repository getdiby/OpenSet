// === Value Helpers ===
export { fixed, range, min, amrap, max, any } from './values.js';

// === Set Builder ===
export { set } from './sets.js';
export type { SetParams } from './sets.js';

// === Document Builders ===
import { WorkoutBuilder } from './builders/workout.js';
import { ProgramBuilder } from './builders/program.js';

/** Create a new Workout builder */
export function workout(name?: string): WorkoutBuilder {
  return new WorkoutBuilder(name);
}

/** Create a new Program builder */
export function program(name: string): ProgramBuilder {
  return new ProgramBuilder(name);
}

// Export builder classes for advanced use (subclassing, extension)
export { WorkoutBuilder } from './builders/workout.js';
export { ProgramBuilder } from './builders/program.js';
export { PhaseBuilder } from './builders/phase.js';
export { BlockBuilder } from './builders/block.js';
export { SeriesBuilder } from './builders/series.js';
export { ExerciseBuilder } from './builders/exercise.js';

// === Validation ===
export { ValidationError } from './validation.js';

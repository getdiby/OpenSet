import type { ValidationMessage, ValidationResult, ExerciseLibrary } from '@diby/openset-types';
import { setStructureRules } from './rules/set-structure.js';
import { dimensionRules } from './rules/dimensions.js';
import { restPrecedenceRules } from './rules/rest-precedence.js';
import { exerciseLibraryRules } from './rules/exercise-library.js';
import { workoutLibraryRules } from './rules/workout-library.js';
import { versionRules } from './rules/version.js';

export type { ValidationMessage, ValidationResult };

export interface ValidateOptions {
  /** Custom exercise library to validate against. Defaults to the canonical openset-default library. */
  library?: ExerciseLibrary;
}

// Embedded canonical library exercise IDs.
// Used for W003 (unknown exercise_id) checks.
let defaultExerciseIds: Set<string> | null = null;

function getDefaultExerciseIds(): Set<string> {
  if (!defaultExerciseIds) {
    defaultExerciseIds = new Set([
      'back_squat', 'front_squat', 'trap_bar_squat',
      'deadlift', 'romanian_deadlift',
      'bench_press', 'incline_bench_press', 'overhead_press',
      'hip_thrust', 'dip', 'pull_up', 'chin_up', 'australian_pull_up',
      'push_up', 'decline_push_up',
      'lunge', 'bulgarian_split_squat', 'step_up', 'box_jump',
      'wall_sit', 'plank', 'copenhagen_plank',
      'single_leg_calf_raise_elevated',
      'leg_curl', 'leg_extension', 'lat_pulldown', 'seated_row',
      'chest_pass', 'triceps_cable_pushdown', 'bicep_curl',
      'leg_raise', 'crunch', 'sit_up',
      'sprint', 'run', 'row_ergometer', 'assault_bike', 'cycling',
      'sled_push', 'farmer_carry', 'jump_rope', 'swimming',
      'trx_inverted_row',
    ]);
  }
  return defaultExerciseIds;
}

function buildExerciseIdSet(library: ExerciseLibrary): Set<string> {
  return new Set(library.exercises.map(ex => ex.id));
}

/**
 * Validate an OpenSet document.
 *
 * Returns a ValidationResult with errors and warnings.
 * A document is valid if it has zero errors.
 */
export function validate(document: unknown, options?: ValidateOptions): ValidationResult {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];

  if (!document || typeof document !== 'object') {
    errors.push({
      code: 'SCHEMA',
      level: 'error',
      path: '',
      message: 'Document must be a non-null object',
    });
    return { valid: false, errors, warnings };
  }

  const doc = document as any;

  // Version checking — run first, may short-circuit on major version mismatch
  const versionOk = versionRules(doc, errors, warnings);
  if (!versionOk) {
    return { valid: false, errors, warnings };
  }

  // Build exercise ID set for library checks
  const exerciseIds = options?.library
    ? buildExerciseIdSet(options.library)
    : getDefaultExerciseIds();

  // Workout library documents have their own validation path
  if (doc.type === 'workout_library') {
    workoutLibraryRules(doc, errors, warnings, exerciseIds);
    return { valid: errors.length === 0, errors, warnings };
  }

  // Basic structural checks
  if (!doc.blocks && !doc.phases) {
    errors.push({
      code: 'SCHEMA',
      level: 'error',
      path: '',
      message: 'Document must have "blocks" (workout) or "phases" (program)',
    });
    return { valid: false, errors, warnings };
  }

  // Run all rule modules
  setStructureRules(doc, errors, warnings);
  dimensionRules(doc, errors, warnings);
  restPrecedenceRules(doc, errors, warnings);
  exerciseLibraryRules(doc, errors, warnings, exerciseIds);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Count structural elements in a document.
 */
export function countElements(doc: any): { blocks: number; series: number; exercises: number; sets: number } {
  let blocks = 0;
  let series = 0;
  let exercises = 0;
  let sets = 0;

  const allBlocks = doc.blocks ?? doc.phases?.flatMap((p: any) => p.workouts?.flatMap((s: any) => s.blocks ?? []) ?? []) ?? [];

  for (const block of allBlocks) {
    blocks++;
    for (const s of block.series ?? []) {
      series++;
      for (const e of s.exercises ?? []) {
        exercises++;
        sets += (e.sets ?? []).length;
      }
    }
  }

  return { blocks, series, exercises, sets };
}

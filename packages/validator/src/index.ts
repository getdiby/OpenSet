import type { ValidationMessage, ValidationResult, ExerciseLibrary } from '@openset/types';
import { executionTypeRules } from './rules/execution-type.js';
import { dimensionRules } from './rules/dimensions.js';
import { restPrecedenceRules } from './rules/rest-precedence.js';
import { movementLibraryRules } from './rules/movement-library.js';

export type { ValidationMessage, ValidationResult };

export interface ValidateOptions {
  /** Custom exercise library to validate against. Defaults to the canonical openset-default library. */
  library?: ExerciseLibrary;
}

// Embedded canonical library exercise IDs and their execution types.
// The full library is loaded lazily if needed.
let defaultLibrary: Map<string, { execution_types: string[] }> | null = null;

function getDefaultLibrary(): Map<string, { execution_types: string[] }> {
  if (!defaultLibrary) {
    // Lazy-load to avoid circular dependencies and keep startup fast
    defaultLibrary = new Map();
    // This will be populated at build time or via dynamic import
    // For now, we embed the essential data inline
    const exercises: Array<{ id: string; execution_types: string[] }> = [
      { id: 'back_squat', execution_types: ['reps_load', 'reps_only'] },
      { id: 'front_squat', execution_types: ['reps_load', 'reps_only'] },
      { id: 'trap_bar_squat', execution_types: ['reps_load', 'reps_only'] },
      { id: 'deadlift', execution_types: ['reps_load', 'reps_only'] },
      { id: 'romanian_deadlift', execution_types: ['reps_load', 'reps_only'] },
      { id: 'bench_press', execution_types: ['reps_load', 'reps_only'] },
      { id: 'incline_bench_press', execution_types: ['reps_load', 'reps_only'] },
      { id: 'overhead_press', execution_types: ['reps_load', 'reps_only'] },
      { id: 'hip_thrust', execution_types: ['reps_load', 'reps_only'] },
      { id: 'dip', execution_types: ['reps_only', 'reps_load'] },
      { id: 'pull_up', execution_types: ['reps_only', 'reps_load'] },
      { id: 'chin_up', execution_types: ['reps_only', 'reps_load'] },
      { id: 'australian_pull_up', execution_types: ['reps_only'] },
      { id: 'push_up', execution_types: ['reps_only'] },
      { id: 'decline_push_up', execution_types: ['reps_only'] },
      { id: 'lunge', execution_types: ['reps_only', 'reps_load', 'reps_per_side'] },
      { id: 'bulgarian_split_squat', execution_types: ['reps_only', 'reps_load', 'reps_per_side'] },
      { id: 'step_up', execution_types: ['reps_only', 'reps_load', 'reps_per_side', 'reps_height'] },
      { id: 'box_jump', execution_types: ['reps_only', 'reps_height'] },
      { id: 'wall_sit', execution_types: ['duration_only'] },
      { id: 'plank', execution_types: ['duration_only'] },
      { id: 'copenhagen_plank', execution_types: ['duration_only', 'duration_per_side'] },
      { id: 'single_leg_calf_raise_elevated', execution_types: ['reps_only', 'reps_load', 'reps_per_side'] },
      { id: 'leg_curl', execution_types: ['reps_load'] },
      { id: 'leg_extension', execution_types: ['reps_load'] },
      { id: 'lat_pulldown', execution_types: ['reps_load'] },
      { id: 'seated_row', execution_types: ['reps_load'] },
      { id: 'chest_pass', execution_types: ['reps_only'] },
      { id: 'triceps_cable_pushdown', execution_types: ['reps_load'] },
      { id: 'bicep_curl', execution_types: ['reps_load', 'reps_per_side'] },
      { id: 'leg_raise', execution_types: ['reps_only'] },
      { id: 'crunch', execution_types: ['reps_only'] },
      { id: 'sit_up', execution_types: ['reps_only'] },
      { id: 'sprint', execution_types: ['distance_only', 'distance_time'] },
      { id: 'run', execution_types: ['distance_only', 'distance_time', 'duration_only', 'calories_only'] },
      { id: 'row_ergometer', execution_types: ['distance_only', 'distance_time', 'duration_only', 'calories_only', 'power_duration'] },
      { id: 'assault_bike', execution_types: ['distance_only', 'duration_only', 'calories_only'] },
      { id: 'cycling', execution_types: ['distance_only', 'distance_time', 'duration_only', 'calories_only', 'power_duration', 'power_distance'] },
      { id: 'sled_push', execution_types: ['distance_only', 'distance_load', 'duration_only'] },
      { id: 'farmer_carry', execution_types: ['distance_load', 'duration_load'] },
      { id: 'jump_rope', execution_types: ['duration_only', 'reps_only', 'calories_only'] },
      { id: 'swimming', execution_types: ['distance_only', 'distance_time', 'duration_only', 'calories_only'] },
      { id: 'trx_inverted_row', execution_types: ['reps_only'] },
    ];
    for (const ex of exercises) {
      defaultLibrary.set(ex.id, { execution_types: ex.execution_types });
    }
  }
  return defaultLibrary;
}

function buildLibraryMap(library: ExerciseLibrary): Map<string, { execution_types: string[] }> {
  const map = new Map<string, { execution_types: string[] }>();
  for (const ex of library.exercises) {
    map.set(ex.id, { execution_types: ex.execution_types });
  }
  return map;
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

  // Basic structural checks
  if (!doc.blocks && !doc.phases) {
    errors.push({
      code: 'SCHEMA',
      level: 'error',
      path: '',
      message: 'Document must have "blocks" (session) or "phases" (program)',
    });
    return { valid: false, errors, warnings };
  }

  // Build exercise library map
  const exerciseLibrary = options?.library
    ? buildLibraryMap(options.library)
    : getDefaultLibrary();

  // Run all rule modules
  executionTypeRules(doc, errors, warnings, exerciseLibrary);
  dimensionRules(doc, errors, warnings);
  restPrecedenceRules(doc, errors, warnings);
  movementLibraryRules(doc, errors, warnings, exerciseLibrary);

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

  const allBlocks = doc.blocks ?? doc.phases?.flatMap((p: any) => p.sessions?.flatMap((s: any) => s.blocks ?? []) ?? []) ?? [];

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

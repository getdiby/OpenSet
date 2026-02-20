import type { ValidationMessage } from '@openset/types';
import { setStructureRules } from './set-structure.js';
import { dimensionRules } from './dimensions.js';
import { restPrecedenceRules } from './rest-precedence.js';
import { exerciseLibraryRules } from './exercise-library.js';

/**
 * Validates workout_library documents.
 *
 * A workout_library contains reusable workout templates.
 * Each workout must have an id, name, and blocks array.
 * Inner blocks are validated by delegating to the standard rule modules.
 * W006 warnings are suppressed because library workouts are templates without dates.
 */
export function workoutLibraryRules(
  doc: any,
  errors: ValidationMessage[],
  warnings: ValidationMessage[],
  exerciseIds: Set<string> | null,
): void {
  if (!Array.isArray(doc.workouts) || doc.workouts.length === 0) {
    errors.push({
      code: 'SCHEMA',
      level: 'error',
      path: 'workouts',
      message: 'workout_library must have a non-empty "workouts" array',
    });
    return;
  }

  const seenIds = new Set<string>();

  for (const [wi, workout] of doc.workouts.entries()) {
    const basePath = `workouts[${wi}]`;

    // Required fields
    if (!workout.id) {
      errors.push({
        code: 'SCHEMA',
        level: 'error',
        path: basePath,
        message: 'Workout is missing required field "id"',
      });
    }

    if (!workout.name) {
      errors.push({
        code: 'SCHEMA',
        level: 'error',
        path: basePath,
        message: 'Workout is missing required field "name"',
      });
    }

    if (!workout.blocks) {
      errors.push({
        code: 'SCHEMA',
        level: 'error',
        path: basePath,
        message: 'Workout is missing required field "blocks"',
      });
    }

    // Duplicate ID check
    if (workout.id) {
      if (seenIds.has(workout.id)) {
        errors.push({
          code: 'SCHEMA',
          level: 'error',
          path: basePath,
          message: `Duplicate workout id "${workout.id}"`,
        });
      } else {
        seenIds.add(workout.id);
      }
    }

    // Delegate block-level validation to existing rules
    if (workout.blocks) {
      const syntheticDoc = { type: 'workout', blocks: workout.blocks };
      const innerErrors: ValidationMessage[] = [];
      const innerWarnings: ValidationMessage[] = [];

      setStructureRules(syntheticDoc, innerErrors, innerWarnings);
      dimensionRules(syntheticDoc, innerErrors, innerWarnings);
      restPrecedenceRules(syntheticDoc, innerErrors, innerWarnings);
      exerciseLibraryRules(syntheticDoc, innerErrors, innerWarnings, exerciseIds);

      // Remap inner paths with workout prefix
      for (const err of innerErrors) {
        errors.push({
          ...err,
          path: err.path ? `${basePath}.${err.path}` : basePath,
        });
      }

      // Suppress W006 for library workouts (templates don't need dates)
      for (const warn of innerWarnings) {
        if (warn.code === 'W006') continue;
        warnings.push({
          ...warn,
          path: warn.path ? `${basePath}.${warn.path}` : basePath,
        });
      }
    }
  }
}

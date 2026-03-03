import type { ValidationMessage } from '@diby/openset-types';
import { formatMessage } from '../messages.js';

/**
 * Rules: W003, W004, W006, W008
 */
export function exerciseLibraryRules(
  doc: any,
  errors: ValidationMessage[],
  warnings: ValidationMessage[],
  exerciseIds: Set<string> | null,
): void {
  // W006: workout has no date field
  if (doc.type === 'workout' && !doc.date) {
    warnings.push({
      code: 'W006',
      level: 'warn',
      path: '',
      message: formatMessage('W006'),
    });
  }

  // For programs, check each workout
  if (doc.type === 'program') {
    for (const [pi, phase] of (doc.phases ?? []).entries()) {
      for (const [wi, wkt] of (phase.workouts ?? []).entries()) {
        if (!wkt.date) {
          warnings.push({
            code: 'W006',
            level: 'warn',
            path: `phases[${pi}].workouts[${wi}]`,
            message: formatMessage('W006'),
          });
        }
      }
    }
  }

  const blocks = doc.blocks ?? doc.phases?.flatMap((p: any) => p.workouts?.flatMap((s: any) => s.blocks ?? []) ?? []) ?? [];

  for (const [bi, block] of blocks.entries()) {
    for (const [si, series] of (block.series ?? []).entries()) {
      const isSequential = series.execution_mode === 'SEQUENTIAL';

      // W008: uneven set counts in non-SEQUENTIAL series
      if (!isSequential && (series.exercises ?? []).length > 1) {
        const setCounts = (series.exercises ?? []).map((e: any) => (e.sets ?? []).length);
        const allEqual = setCounts.every((c: number) => c === setCounts[0]);
        if (!allEqual) {
          warnings.push({
            code: 'W008',
            level: 'warn',
            path: `blocks[${bi}].series[${si}]`,
            message: formatMessage('W008', Math.min(...setCounts), Math.max(...setCounts)),
          });
        }
      }

      for (const [ei, exercise] of (series.exercises ?? []).entries()) {
        const path = `blocks[${bi}].series[${si}].exercises[${ei}]`;

        // W003: exercise_id not found in library
        if (exercise.exercise_id && exerciseIds && !exerciseIds.has(exercise.exercise_id)) {
          warnings.push({
            code: 'W003',
            level: 'warn',
            path,
            message: formatMessage('W003', exercise.exercise_id),
          });
        }

        // W004: no exercise_id and no name
        if (!exercise.exercise_id && !exercise.name) {
          warnings.push({
            code: 'W004',
            level: 'warn',
            path,
            message: formatMessage('W004'),
          });
        }
      }
    }
  }
}

import type { ValidationMessage } from '@diby/openset-types';
import { formatMessage } from '../messages.js';

/**
 * Rules: W001, W002
 */
export function restPrecedenceRules(
  doc: any,
  errors: ValidationMessage[],
  warnings: ValidationMessage[],
): void {
  const blocks = doc.blocks ?? doc.phases?.flatMap((p: any) => p.workouts?.flatMap((s: any) => s.blocks ?? []) ?? []) ?? [];

  for (const [bi, block] of blocks.entries()) {
    for (const [si, series] of (block.series ?? []).entries()) {
      const seriesHasRest = series.rest_after !== undefined;

      for (const [ei, exercise] of (series.exercises ?? []).entries()) {
        for (const [seti, set] of (exercise.sets ?? []).entries()) {
          const path = `blocks[${bi}].series[${si}].exercises[${ei}].sets[${seti}]`;

          // W001: rest_after at both SET and SERIES level
          if (set.rest_after !== undefined && seriesHasRest) {
            warnings.push({
              code: 'W001',
              level: 'warn',
              path,
              message: formatMessage('W001'),
            });
          }
        }

        // W002: rest_after in group on non-last exercise
        if (exercise.group !== undefined && series.execution_mode === 'CLUSTER') {
          const sameGroupExercises = (series.exercises ?? []).filter(
            (e: any) => e.group === exercise.group,
          );
          const isLastInGroup =
            sameGroupExercises.indexOf(exercise) === sameGroupExercises.length - 1;

          if (!isLastInGroup) {
            // Check if any set in this non-last exercise has rest_after
            for (const [seti, set] of (exercise.sets ?? []).entries()) {
              if (set.rest_after !== undefined) {
                warnings.push({
                  code: 'W002',
                  level: 'warn',
                  path: `blocks[${bi}].series[${si}].exercises[${ei}].sets[${seti}]`,
                  message: formatMessage('W002'),
                });
              }
            }
          }
        }
      }
    }
  }
}

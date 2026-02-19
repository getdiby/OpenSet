import type { ValidationMessage } from '@openset/types';
import { VALID_EXECUTION_TYPE_IDS, EXECUTION_TYPE_MAP } from '../data.js';
import { formatMessage } from '../messages.js';

/**
 * Rules: E001, E002, E011, W005
 */
export function executionTypeRules(
  doc: any,
  errors: ValidationMessage[],
  warnings: ValidationMessage[],
  exerciseLibrary: Map<string, { execution_types: string[] }> | null,
): void {
  const blocks = doc.blocks ?? doc.phases?.flatMap((p: any) => p.sessions?.flatMap((s: any) => s.blocks ?? []) ?? []) ?? [];

  for (const [bi, block] of blocks.entries()) {
    for (const [si, series] of (block.series ?? []).entries()) {
      const isCluster = series.execution_mode === 'CLUSTER';
      let hasGroup = false;

      for (const [ei, exercise] of (series.exercises ?? []).entries()) {
        if (exercise.group !== undefined) {
          hasGroup = true;
        }

        // E011: group only valid in CLUSTER mode
        if (exercise.group !== undefined && !isCluster) {
          errors.push({
            code: 'E011',
            level: 'error',
            path: `blocks[${bi}].series[${si}].exercises[${ei}]`,
            message: formatMessage('E011'),
          });
        }

        for (const [seti, set] of (exercise.sets ?? []).entries()) {
          const path = `blocks[${bi}].series[${si}].exercises[${ei}].sets[${seti}]`;

          // E001: execution_type must be known
          if (set.execution_type && !VALID_EXECUTION_TYPE_IDS.has(set.execution_type)) {
            errors.push({
              code: 'E001',
              level: 'error',
              path,
              message: formatMessage('E001', set.execution_type),
            });
          }

          // E002: execution_type must be in exercise's allowed list (if exercise is in library)
          if (exerciseLibrary && exercise.exercise_id && set.execution_type) {
            const libEntry = exerciseLibrary.get(exercise.exercise_id);
            if (libEntry && !libEntry.execution_types.includes(set.execution_type)) {
              errors.push({
                code: 'E002',
                level: 'error',
                path,
                message: formatMessage('E002', set.execution_type, exercise.exercise_id),
              });
            }
          }
        }
      }

      // W005: CLUSTER mode but no exercises have group fields
      if (isCluster && !hasGroup) {
        warnings.push({
          code: 'W005',
          level: 'warn',
          path: `blocks[${bi}].series[${si}]`,
          message: formatMessage('W005'),
        });
      }
    }
  }
}

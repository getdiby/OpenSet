import type { ValidationMessage } from '@openset/types';
import { KNOWN_DIMENSIONS } from '../data.js';
import { formatMessage } from '../messages.js';

/**
 * Rules: E001, E003, E011, W005
 */
export function setStructureRules(
  doc: any,
  errors: ValidationMessage[],
  warnings: ValidationMessage[],
): void {
  const blocks = doc.blocks ?? doc.phases?.flatMap((p: any) => p.workouts?.flatMap((s: any) => s.blocks ?? []) ?? []) ?? [];

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

          // E001: Each entry in dimensions array must be a known dimension name
          if (Array.isArray(set.dimensions)) {
            for (const dim of set.dimensions) {
              if (typeof dim === 'string' && !KNOWN_DIMENSIONS.has(dim)) {
                errors.push({
                  code: 'E001',
                  level: 'error',
                  path,
                  message: formatMessage('E001', dim),
                });
              }
            }
          }

          // E003: Every dimension listed in dimensions array must have a corresponding field on the set
          if (Array.isArray(set.dimensions)) {
            for (const dim of set.dimensions) {
              if (typeof dim === 'string' && KNOWN_DIMENSIONS.has(dim) && set[dim] === undefined) {
                errors.push({
                  code: 'E003',
                  level: 'error',
                  path,
                  message: formatMessage('E003', dim),
                });
              }
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

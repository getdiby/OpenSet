import type { ValidationMessage } from '@openset/types';
import {
  VALID_VALUE_TYPES,
  DIMENSION_ALLOWED_TYPES,
  KNOWN_DIMENSIONS,
  DIMENSION_CONFLICTS,
  SET_NON_DIMENSION_FIELDS,
  UNIVERSAL_SET_DIMENSIONS,
  isExtensionField,
  isValueObjectShape,
} from '../data.js';
import { formatMessage } from '../messages.js';

/**
 * Rules: E005, E006, E007, E008, E009, E010, E012, E013, E015, W007, W009
 */
export function dimensionRules(
  doc: any,
  errors: ValidationMessage[],
  warnings: ValidationMessage[],
): void {
  const blocks = doc.blocks ?? doc.phases?.flatMap((p: any) => p.workouts?.flatMap((s: any) => s.blocks ?? []) ?? []) ?? [];

  for (const [bi, block] of blocks.entries()) {
    for (const [si, series] of (block.series ?? []).entries()) {
      for (const [ei, exercise] of (series.exercises ?? []).entries()) {
        for (const [seti, set] of (exercise.sets ?? []).entries()) {
          const path = `blocks[${bi}].series[${si}].exercises[${ei}].sets[${seti}]`;

          // Walk all fields on the set
          const setDimensions: string[] = [];
          for (const key of Object.keys(set)) {
            if (SET_NON_DIMENSION_FIELDS.has(key)) continue;
            if (UNIVERSAL_SET_DIMENSIONS.has(key)) {
              if (key !== 'note') setDimensions.push(key);
              continue;
            }

            if (KNOWN_DIMENSIONS.has(key)) {
              setDimensions.push(key);
            } else if (isExtensionField(key)) {
              // W009: Namespaced extension field
              warnings.push({
                code: 'W009',
                level: 'warn',
                path,
                message: formatMessage('W009', key),
              });

              // E015: Extension field must be a valid ValueObject shape
              const extVal = set[key];
              if (extVal !== undefined && !isValueObjectShape(extVal)) {
                errors.push({
                  code: 'E015',
                  level: 'error',
                  path: `${path}.${key}`,
                  message: formatMessage('E015', key),
                });
              }
            } else {
              // E013: Unknown dimension without valid namespace prefix
              errors.push({
                code: 'E013',
                level: 'error',
                path,
                message: formatMessage('E013', key),
              });
            }
          }

          // Validate each dimension's value object
          for (const dim of setDimensions) {
            const val = set[dim];
            if (val === undefined) continue;

            // E005: Value object type must be valid
            if (val.type && !VALID_VALUE_TYPES.has(val.type)) {
              errors.push({
                code: 'E005',
                level: 'error',
                path: `${path}.${dim}`,
                message: formatMessage('E005', val.type),
              });
              continue;
            }

            // E006: Range min < max
            if (val.type === 'range' && val.min !== undefined && val.max !== undefined && val.min >= val.max) {
              errors.push({
                code: 'E006',
                level: 'error',
                path: `${path}.${dim}`,
                message: formatMessage('E006', val.min, val.max),
              });
            }

            // E007: Dimension must use allowed value types
            const allowedTypes = DIMENSION_ALLOWED_TYPES[dim];
            if (allowedTypes && val.type && !allowedTypes.includes(val.type)) {
              errors.push({
                code: 'E007',
                level: 'error',
                path: `${path}.${dim}`,
                message: formatMessage('E007', dim, val.type),
              });
            }

            // E008: sides must be 1 or 2
            if (dim === 'sides' && val.type === 'fixed' && val.value !== undefined) {
              if (val.value !== 1 && val.value !== 2) {
                errors.push({
                  code: 'E008',
                  level: 'error',
                  path: `${path}.${dim}`,
                  message: formatMessage('E008', val.value),
                });
              }
            }

            // E009: heart_rate_zone must be 1-5
            if (dim === 'heart_rate_zone' && val.type === 'fixed' && val.value !== undefined) {
              if (val.value < 1 || val.value > 5) {
                errors.push({
                  code: 'E009',
                  level: 'error',
                  path: `${path}.${dim}`,
                  message: formatMessage('E009', val.value),
                });
              }
            }

            // E010: rpe must be 1-10
            if (dim === 'rpe' && val.type === 'fixed' && val.value !== undefined) {
              if (val.value < 1 || val.value > 10) {
                errors.push({
                  code: 'E010',
                  level: 'error',
                  path: `${path}.${dim}`,
                  message: formatMessage('E010', val.value),
                });
              }
            }
          }

          // E012: Mutually exclusive dimensions
          for (const [a, b] of DIMENSION_CONFLICTS) {
            if (set[a] !== undefined && set[b] !== undefined) {
              errors.push({
                code: 'E012',
                level: 'error',
                path,
                message: formatMessage('E012', a, b),
              });
            }
          }

          // W007: load range without rpe
          if (set.load?.type === 'range' && set.rpe === undefined) {
            warnings.push({
              code: 'W007',
              level: 'warn',
              path,
              message: formatMessage('W007'),
            });
          }
        }
      }
    }
  }
}

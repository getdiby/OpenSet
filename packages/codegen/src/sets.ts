import type { Set as OpenSetSet, ValueObject, Dimension } from '@diby/openset-types';

/** Known dimension names that can be auto-detected from set params */
const KNOWN_DIMENSION_NAMES: Set<string> = new Set([
  'reps', 'sides', 'rounds', 'load', 'duration', 'duration_per_side',
  'rest_between_sides', 'tempo', 'distance', 'height', 'incline',
  'pace', 'speed', 'power', 'heart_rate', 'heart_rate_zone',
  'rpe', 'velocity', 'calories', 'cadence', 'resistance',
]);

/** Fields that are NOT dimensions (should not appear in the dimensions array) */
const NON_DIMENSION_FIELDS: Set<string> = new Set([
  'rest_after', 'note',
]);

/**
 * Parameters for building a set.
 *
 * Any known dimension key with a ValueObject will be included.
 * The `dimensions` array is auto-inferred from which dimension keys are present,
 * or can be explicitly provided to override auto-inference.
 */
export interface SetParams {
  /** Explicitly declare which dimensions define this set. If omitted, auto-inferred from present keys. */
  dimensions?: Dimension[];

  // Dimension fields (all optional — provide the ones you need)
  reps?: ValueObject;
  sides?: ValueObject;
  rounds?: ValueObject;
  load?: ValueObject;
  duration?: ValueObject;
  duration_per_side?: ValueObject;
  rest_between_sides?: ValueObject;
  tempo?: ValueObject;
  distance?: ValueObject;
  height?: ValueObject;
  incline?: ValueObject;
  pace?: ValueObject;
  speed?: ValueObject;
  power?: ValueObject;
  heart_rate?: ValueObject;
  heart_rate_zone?: ValueObject;
  rpe?: ValueObject;
  velocity?: ValueObject;
  calories?: ValueObject;
  cadence?: ValueObject;
  resistance?: ValueObject;

  // Universal fields
  rest_after?: ValueObject;
  note?: string;
}

/**
 * Build a Set object from parameters.
 *
 * If `dimensions` is not explicitly provided, it is auto-inferred
 * from which known dimension keys have values in the params.
 *
 * @example
 * ```ts
 * set({ reps: fixed(5), load: fixed(100, 'kg') })
 * // => { dimensions: ['reps', 'load'], reps: {...}, load: {...} }
 *
 * set({ dimensions: ['reps'], reps: fixed(5), rpe: fixed(8) })
 * // => { dimensions: ['reps'], reps: {...}, rpe: {...} }
 * ```
 */
export function set(params: SetParams): OpenSetSet {
  const result: any = {};

  // Collect dimension keys present in params
  const presentDimensions: Dimension[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (key === 'dimensions') continue;
    if (NON_DIMENSION_FIELDS.has(key)) continue;
    if (KNOWN_DIMENSION_NAMES.has(key) && value !== undefined) {
      presentDimensions.push(key as Dimension);
    }
  }

  // Use explicit dimensions if provided, otherwise auto-infer
  result.dimensions = params.dimensions ?? presentDimensions;

  // Copy all dimension values
  for (const key of Object.keys(params)) {
    if (key === 'dimensions') continue;
    const value = (params as any)[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result as OpenSetSet;
}

import type { FixedValue, RangeValue, MinValue, AmrapValue, MaxValue, AnyValue } from '@diby/openset-types';

/** Create a fixed value: `{ type: 'fixed', value, unit? }` */
export function fixed(value: number, unit?: string): FixedValue {
  const result: FixedValue = { type: 'fixed', value };
  if (unit !== undefined) result.unit = unit;
  return result;
}

/** Create a range value: `{ type: 'range', min, max, unit? }` */
export function range(min: number, max: number, unit?: string): RangeValue {
  if (min >= max) {
    throw new Error(`range() requires min < max, got min=${min}, max=${max}`);
  }
  const result: RangeValue = { type: 'range', min, max };
  if (unit !== undefined) result.unit = unit;
  return result;
}

/** Create a minimum value: `{ type: 'min', value, unit? }` */
export function min(value: number, unit?: string): MinValue {
  const result: MinValue = { type: 'min', value };
  if (unit !== undefined) result.unit = unit;
  return result;
}

/** Create an AMRAP (as many reps as possible) value: `{ type: 'amrap' }` */
export function amrap(): AmrapValue {
  return { type: 'amrap' };
}

/** Create a max value: `{ type: 'max' }` */
export function max(): MaxValue {
  return { type: 'max' };
}

/** Create an any value: `{ type: 'any' }` */
export function any(): AnyValue {
  return { type: 'any' };
}

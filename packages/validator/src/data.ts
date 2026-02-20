// Canonical data embedded from spec vocabulary files.
// This avoids runtime file reads and makes the validator self-contained.

export const EXECUTION_MODES = new Set([
  'SEQUENTIAL', 'CIRCUIT', 'SUPERSET',
  'AMRAP', 'FOR_TIME', 'INTERVAL',
  'TABATA', 'EMOM', 'LADDER', 'CLUSTER',
]);

export const VALID_VALUE_TYPES = new Set(['fixed', 'range', 'min', 'amrap', 'max', 'any']);

export const DIMENSION_ALLOWED_TYPES: Record<string, string[]> = {
  reps: ['fixed', 'range', 'min', 'amrap'],
  sides: ['fixed'],
  rounds: ['fixed', 'amrap'],
  load: ['fixed', 'range', 'max'],
  duration: ['fixed', 'range', 'min'],
  duration_per_side: ['fixed', 'range'],
  rest_between_sides: ['fixed'],
  rest_after: ['fixed', 'range'],
  tempo: ['fixed'],
  distance: ['fixed', 'range', 'min', 'amrap'],
  height: ['fixed', 'range'],
  incline: ['fixed', 'range'],
  pace: ['fixed', 'range'],
  speed: ['fixed', 'range'],
  power: ['fixed', 'range'],
  heart_rate: ['fixed', 'range', 'max'],
  heart_rate_zone: ['fixed', 'range'],
  rpe: ['fixed', 'range', 'max'],
  velocity: ['fixed', 'range'],
  calories: ['fixed', 'min', 'amrap'],
  cadence: ['fixed', 'range'],
  resistance: ['fixed', 'range'],
};

export const KNOWN_DIMENSIONS = new Set(Object.keys(DIMENSION_ALLOWED_TYPES));

export const DIMENSION_CONFLICTS: [string, string][] = [
  ['pace', 'speed'],
  ['heart_rate', 'heart_rate_zone'],
];

// Dimensions that are always allowed on any set (not part of declared dimensions)
export const UNIVERSAL_SET_DIMENSIONS = new Set(['rest_after', 'note']);

// Extension prefix patterns — aligned with JSON Schema patternProperties
export const EXTENSION_PREFIXES = [/^x_/, /^app_/, /^[a-z]+_[a-z]+_/];

export function isExtensionField(name: string): boolean {
  return EXTENSION_PREFIXES.some(re => re.test(name));
}

// Supported spec versions — the validator knows how to handle these
export const SUPPORTED_VERSIONS = new Set(['1.0']);
export const CURRENT_VERSION = '1.0';

// Check if a value looks like a valid ValueObject structure
export function isValueObjectShape(val: unknown): boolean {
  if (!val || typeof val !== 'object') return false;
  const obj = val as Record<string, unknown>;
  if (typeof obj.type !== 'string') return false;
  return VALID_VALUE_TYPES.has(obj.type);
}

// Non-dimension fields on a set object that are always valid
export const SET_NON_DIMENSION_FIELDS = new Set(['dimensions', 'note']);

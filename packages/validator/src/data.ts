// Canonical data embedded from spec vocabulary files.
// This avoids runtime file reads and makes the validator self-contained.

export interface ExecutionTypeSpec {
  id: string;
  required: string[];
  optional: string[];
}

export const EXECUTION_TYPES: ExecutionTypeSpec[] = [
  { id: 'reps_only', required: ['reps'], optional: ['rpe'] },
  { id: 'reps_load', required: ['reps'], optional: ['load', 'tempo', 'rpe', 'velocity'] },
  { id: 'reps_per_side', required: ['reps', 'sides'], optional: ['load', 'tempo', 'rpe'] },
  { id: 'reps_height', required: ['reps', 'height'], optional: ['load', 'rpe'] },
  { id: 'duration_only', required: ['duration'], optional: ['heart_rate_zone', 'rpe', 'incline'] },
  { id: 'duration_load', required: ['duration'], optional: ['load', 'rpe', 'incline'] },
  { id: 'duration_per_side', required: ['duration', 'sides'], optional: ['rest_between_sides', 'load', 'rpe'] },
  { id: 'duration_power', required: ['duration'], optional: ['power', 'heart_rate_zone', 'rpe'] },
  { id: 'distance_only', required: ['distance'], optional: ['pace', 'speed', 'heart_rate', 'heart_rate_zone', 'rpe', 'incline'] },
  { id: 'distance_time', required: ['distance', 'duration'], optional: ['pace', 'heart_rate_zone', 'rpe', 'incline'] },
  { id: 'distance_load', required: ['distance'], optional: ['load', 'pace', 'rpe'] },
  { id: 'power_duration', required: ['power', 'duration'], optional: ['heart_rate_zone', 'rpe'] },
  { id: 'power_distance', required: ['power', 'distance'], optional: ['pace', 'rpe'] },
  { id: 'calories_only', required: ['calories'], optional: ['duration', 'heart_rate_zone', 'rpe'] },
  { id: 'distance_calories', required: ['distance'], optional: ['calories', 'duration', 'pace', 'rpe'] },
  { id: 'rounds_time', required: ['rounds'], optional: ['duration', 'rpe'] },
];

export const EXECUTION_TYPE_MAP = new Map(EXECUTION_TYPES.map(et => [et.id, et]));

export const VALID_EXECUTION_TYPE_IDS = new Set(EXECUTION_TYPES.map(et => et.id));

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
};

export const KNOWN_DIMENSIONS = new Set(Object.keys(DIMENSION_ALLOWED_TYPES));

export const DIMENSION_CONFLICTS: [string, string][] = [
  ['pace', 'speed'],
  ['heart_rate', 'heart_rate_zone'],
];

// Dimensions that are always allowed on any set (not part of execution_type required/optional)
export const UNIVERSAL_SET_DIMENSIONS = new Set(['rest_after', 'note']);

export const EXTENSION_PREFIXES = [/^x_/, /^app_/, /^[a-z]+_[a-z]+_[a-z]+_/];

export function isExtensionField(name: string): boolean {
  return EXTENSION_PREFIXES.some(re => re.test(name));
}

// Non-dimension fields on a set object that are always valid
export const SET_NON_DIMENSION_FIELDS = new Set(['execution_type', 'note']);

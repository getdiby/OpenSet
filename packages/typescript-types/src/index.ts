// OpenSet v1.0 — TypeScript Type Definitions

// === Value Types ===

export type ValueType = 'fixed' | 'range' | 'min' | 'amrap' | 'max' | 'any';

export interface FixedValue {
  type: 'fixed';
  value: number;
  unit?: string;
}

export interface RangeValue {
  type: 'range';
  min: number;
  max: number;
  unit?: string;
}

export interface MinValue {
  type: 'min';
  value: number;
  unit?: string;
}

export interface AmrapValue {
  type: 'amrap';
}

export interface MaxValue {
  type: 'max';
}

export interface AnyValue {
  type: 'any';
}

export type ValueObject =
  | FixedValue
  | RangeValue
  | MinValue
  | AmrapValue
  | MaxValue
  | AnyValue;

// === Execution Modes ===

export type ExecutionMode =
  | 'SEQUENTIAL'
  | 'CIRCUIT'
  | 'SUPERSET'
  | 'AMRAP'
  | 'FOR_TIME'
  | 'INTERVAL'
  | 'TABATA'
  | 'EMOM'
  | 'LADDER'
  | 'CLUSTER';

// === Execution Types ===

export type ExecutionType =
  | 'reps_only'
  | 'reps_load'
  | 'reps_per_side'
  | 'reps_height'
  | 'duration_only'
  | 'duration_load'
  | 'duration_per_side'
  | 'duration_power'
  | 'distance_only'
  | 'distance_time'
  | 'distance_load'
  | 'power_duration'
  | 'power_distance'
  | 'calories_only'
  | 'distance_calories'
  | 'rounds_time';

// === Set ===

export interface Set {
  execution_type: ExecutionType;
  reps?: ValueObject;
  sides?: ValueObject;
  rounds?: ValueObject;
  load?: ValueObject;
  duration?: ValueObject;
  duration_per_side?: ValueObject;
  rest_between_sides?: ValueObject;
  rest_after?: ValueObject;
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
  note?: string;
  [key: `x_${string}`]: ValueObject | undefined;
  [key: `app_${string}`]: ValueObject | undefined;
}

// === Exercise ===

export interface Exercise {
  exercise_id?: string;
  name?: string;
  group?: string;
  note?: string;
  sets: Set[];
}

// === Series ===

export interface Series {
  id?: string;
  execution_mode: ExecutionMode;
  rounds?: ValueObject;
  rest_after?: ValueObject;
  note?: string;
  exercises: Exercise[];
}

// === Block ===

export interface Block {
  id?: string;
  name?: string;
  note?: string;
  series: Series[];
}

// === Session ===

export interface Session {
  openset_version?: string;
  type?: 'session';
  id?: string;
  name?: string;
  date?: string;
  sport?: string;
  note?: string;
  library?: LibraryRef;
  blocks: Block[];
}

// === Phase ===

export interface Phase {
  id?: string;
  name: string;
  week_start?: number;
  week_end?: number;
  goal?: string;
  sessions: Session[];
}

// === Program ===

export interface Program {
  openset_version: string;
  type: 'program';
  id?: string;
  name: string;
  description?: string;
  sport?: string;
  duration_weeks?: number;
  phases: Phase[];
  created_at?: string;
  author?: string;
}

// === Library Reference ===

export interface LibraryRef {
  id: string;
  version?: string;
}

// === OpenSet Document (union of standalone session or program) ===

export type OpenSetDocument = Session | Program;

// === Exercise Library Types ===

export type BodyPart = 'upper_body' | 'lower_body' | 'core' | 'full_body' | 'cardio';

export type ExerciseCategory =
  | 'push'
  | 'pull'
  | 'hinge'
  | 'squat'
  | 'carry'
  | 'rotation'
  | 'gait';

export type Mechanic = 'compound' | 'isolation';

export type Laterality = 'bilateral' | 'unilateral' | 'alternating';

export type ExerciseLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export interface MediaVideo {
  url: string;
  label: string;
  language?: string;
}

export interface MediaPhoto {
  url: string;
  label: string;
}

export interface Media {
  videos?: MediaVideo[];
  photos?: MediaPhoto[];
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  aliases?: string[];
  description?: string;
  body_part?: BodyPart;
  category?: ExerciseCategory;
  mechanic?: Mechanic;
  laterality?: Laterality;
  level?: ExerciseLevel;
  equipment?: string[];
  target_muscles?: string[];
  synergist_muscles?: string[];
  progressions?: string[];
  regressions?: string[];
  variations?: string[];
  sport_relevance?: string[];
  execution_types: ExecutionType[];
  media?: Media;
  note?: string;
}

export interface ExerciseLibrary {
  openset_version: string;
  type: 'exercise_library';
  id: string;
  name: string;
  version: string;
  provider: string;
  license: string;
  exercises: ExerciseDefinition[];
}

// === Validation Types ===

export interface ValidationMessage {
  code: string;
  level: 'error' | 'warn';
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
}

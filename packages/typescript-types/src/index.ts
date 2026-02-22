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

// === Dimensions ===

export type Dimension =
  | 'reps'
  | 'sides'
  | 'rounds'
  | 'load'
  | 'duration'
  | 'duration_per_side'
  | 'rest_between_sides'
  | 'tempo'
  | 'distance'
  | 'height'
  | 'incline'
  | 'pace'
  | 'speed'
  | 'power'
  | 'heart_rate'
  | 'heart_rate_zone'
  | 'rpe'
  | 'velocity'
  | 'calories'
  | 'cadence'
  | 'resistance';

// === Set ===

export interface Set {
  dimensions: Dimension[];
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
  cadence?: ValueObject;
  resistance?: ValueObject;
  note?: string;
  /** Extension dimensions — any key with x_, app_, or reverse-DNS prefix */
  [key: `x_${string}`]: ValueObject | undefined;
  [key: `app_${string}`]: ValueObject | undefined;
  [key: string]: unknown;
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

// === Document Metadata ===

export interface DocumentMetadata {
  version?: string;
  author?: string;
  provider?: string;
  license?: string;
  created_at?: string;
  updated_at?: string;
}

// === Workout ===

export interface Workout {
  openset_version?: string;
  type?: 'workout';
  id?: string;
  name?: string;
  date?: string;
  sports?: string[];
  note?: string;
  library?: LibraryRef;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  estimated_duration_min?: number;
  /** Declared extension namespaces used in this document */
  x_extensions?: string[];
  /** Optional tags for filtering and discovery */
  tags?: string[];
  /** Document metadata (version, author, provider, license, timestamps) */
  metadata?: DocumentMetadata;
  blocks: Block[];
}

// === Phase ===

export interface Phase {
  id?: string;
  name: string;
  week_start?: number;
  week_end?: number;
  goal?: string;
  workouts: Workout[];
}

// === Program ===

export interface Program {
  openset_version: string;
  type: 'program';
  id?: string;
  name: string;
  description?: string;
  sports?: string[];
  duration_weeks?: number;
  /** Declared extension namespaces used in this document */
  x_extensions?: string[];
  phases: Phase[];
  /** Document metadata (version, author, provider, license, timestamps) */
  metadata?: DocumentMetadata;
}

// === Library Reference ===

export interface LibraryRef {
  id: string;
  version?: string;
}

// === OpenSet Document (union of standalone workout or program) ===

export type OpenSetDocument = Workout | Program;

// === Workout execution (optional layer: what was done) ===

export interface SetRef {
  block: number;
  series: number;
  exercise: number;
  set: number;
}

export type DimensionCompletion = 'met' | 'partial' | 'missed' | 'not_logged';

export interface DimensionResult {
  value: number;
  unit?: string;
  completion: DimensionCompletion;
}

export type SetExecutionStatus = 'skipped' | 'partial' | 'completed';

export interface MediaItem {
  url: string;
  type?: 'photo' | 'video';
  label?: string;
}

export interface SetExecution {
  set_ref: SetRef;
  status: SetExecutionStatus;
  started_at: string;
  completed_at: string;
  dimensions: Record<string, DimensionResult>;
  rest_actual?: number;
  /** Optional: client's felt RPE for this set (0–10). Can be logged even when RPE was not prescribed ("real feel"). When prescribed, may use this and/or dimensions.rpe with completion. */
  rpe?: number;
  /** Same as prescribed exercise's exercise_id. Strongly recommended when exercise is from a library (enables trends by exercise); omit only for custom exercises. */
  exercise_id?: string;
  /** Per-set feedback (e.g. how that set felt, form notes, coach comments). */
  feedback?: string;
  /** Photos or videos from this set (e.g. form check on first or last set of exercise). */
  media?: MediaItem[];
}

export interface WorkoutRef {
  workout_id?: string;
  date?: string;
  program_id?: string;
  phase_index?: number;
  workout_index?: number;
}

export interface ExerciseRef {
  block: number;
  series: number;
  exercise: number;
}

export interface ExerciseFeedback {
  exercise_ref: ExerciseRef;
  feedback: string;
  media?: MediaItem[];
}

export interface WorkoutExecutionSummary {
  sets_completed?: number;
  sets_skipped?: number;
  total_volume_kg?: number;
  [key: string]: unknown;
}

/** Provenance for execution data (e.g. FIT import, manual). Use for deduplication and linking back to the original activity. */
export interface WorkoutExecutionSource {
  provider?: string;
  activity_id?: string;
  imported_at?: string;
  device?: string;
  mapping_summary?: string;
  [key: string]: unknown;
}

export interface WorkoutExecution {
  openset_version: string;
  type: 'workout_execution';
  execution_id: string;
  workout_ref: WorkoutRef;
  started_at: string;
  completed_at: string;
  set_executions: SetExecution[];
  summary?: WorkoutExecutionSummary;
  /** Overall workout feedback (e.g. how the session felt, notes from the athlete or coach). */
  feedback?: string;
  /** Photos or videos for the entire session. */
  media?: MediaItem[];
  /** Feedback per exercise (and optional media); how each exercise felt overall. */
  exercise_feedback?: ExerciseFeedback[];
  /** Where this execution came from (e.g. FIT import, manual). For deduplication and audit. */
  source?: WorkoutExecutionSource;
}

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
  common_dimensions: Dimension[][];
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

// === Workout Library Types ===

export interface WorkoutDefinition {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  level?: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  estimated_duration_min?: number;
  sports?: string[];
  note?: string;
  library?: LibraryRef;
  media?: Media;
  blocks: Block[];
}

export interface WorkoutLibrary {
  openset_version: string;
  type: 'workout_library';
  id: string;
  name: string;
  version: string;
  provider: string;
  license: string;
  workouts: WorkoutDefinition[];
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

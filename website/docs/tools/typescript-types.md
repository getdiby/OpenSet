---
title: TypeScript Types
description: TypeScript type definitions for OpenSet documents. Install @openset/types for type-safe workout and program types.
keywords: [OpenSet, TypeScript, types, openset types, npm]
---

# @openset/types

TypeScript type definitions for OpenSet documents.

## Installation

```bash
npm install @openset/types
```

## Usage

```typescript
import type {
  Workout,
  Program,
  Set,
  Exercise,
  Series,
  Block,
  ValueObject,
  Dimension,
  ExecutionMode,
  ExerciseDefinition,
  ExerciseLibrary,
  WorkoutLibrary,
  WorkoutExecution,
  SetExecution,
  SetRef,
  DimensionResult,
  WorkoutRef,
} from '@openset/types';
```

## Core Types

### ValueObject

A discriminated union of all six value types:

```typescript
type ValueObject =
  | FixedValue
  | RangeValue
  | MinValue
  | AmrapValue
  | MaxValue
  | AnyValue;
```

### Dimension

Union of all valid dimension names:

```typescript
type Dimension =
  | 'reps' | 'load' | 'duration' | 'distance'
  | 'power' | 'calories' | 'rounds' | 'height'
  | 'sides' | 'tempo' | 'velocity' | 'pace'
  | 'speed' | 'heart_rate' | 'heart_rate_zone'
  | 'rpe' | 'incline' | 'rest_between_sides'
  | 'cadence' | 'resistance';
```

### Set

The atomic unit of prescription:

```typescript
interface Set {
  dimensions: Dimension[];
  reps?: ValueObject;
  load?: ValueObject;
  duration?: ValueObject;
  distance?: ValueObject;
  // ... all dimensions
  rest_after?: ValueObject;
  note?: string;
  [key: `x_${string}`]: unknown; // extensions
}
```

### Exercise

A single exercise within a series:

```typescript
interface Exercise {
  exercise_id?: string;
  name?: string;
  group?: string;
  note?: string;
  sets: Set[];
}
```

### ExecutionMode

Union of all 10 execution modes:

```typescript
type ExecutionMode =
  | 'SEQUENTIAL' | 'CIRCUIT' | 'SUPERSET'
  | 'AMRAP' | 'FOR_TIME' | 'INTERVAL'
  | 'TABATA' | 'EMOM' | 'LADDER' | 'CLUSTER';
```

### Workout & Program

Top-level document types:

```typescript
interface Workout {
  openset_version: string;
  type: 'workout';
  name?: string;
  date?: string;
  sports?: string[];
  blocks: Block[];
}

interface Program {
  openset_version: string;
  type: 'program';
  name: string;
  phases: Phase[];
}
```

## Exercise Library Types

```typescript
interface ExerciseDefinition {
  id: string;
  name: string;
  aliases?: string[];
  body_part?: string;
  category?: string;
  mechanic?: string;
  laterality?: string;
  level?: string;
  equipment?: string[];
  target_muscles?: string[];
}

interface ExerciseLibrary {
  openset_version: string;
  type: 'exercise_library';
  id: string;
  name: string;
  exercises: ExerciseDefinition[];
}
```

## Workout Library Types

```typescript
interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  level?: string;
  duration?: { value: number; unit: 's' | 'min' | 'h' | 'day' | 'week' };
  sports?: string[];
  note?: string;
  library?: { id: string; version: string };
  blocks: Block[];
}

interface WorkoutLibrary {
  openset_version: string;
  type: 'workout_library';
  id: string;
  name: string;
  version: string;
  provider: string;
  license: string;
  workouts: WorkoutTemplate[];
}
```

## Workout execution types

Optional execution layer (see [Workout execution](/docs/spec/workout-execution)): record what was done for a workout instance.

```typescript
interface SetRef {
  block: number;
  series: number;
  exercise: number;
  set: number;
}

interface DimensionResult {
  value: number;
  unit?: string;
  completion: 'met' | 'partial' | 'missed' | 'not_logged';
}

interface MediaItem {
  url: string;
  type?: 'photo' | 'video';
  label?: string;
}

interface SetExecution {
  set_ref: SetRef;
  status: 'skipped' | 'partial' | 'completed';
  started_at: string;
  completed_at: string;
  dimensions: Record<string, DimensionResult>;
  rest_actual?: number;
  rpe?: number;        // optional felt RPE (0–10), even when not prescribed
  exercise_id?: string;
  feedback?: string;   // per-set feedback
  media?: MediaItem[]; // photos/videos from this set
}

interface WorkoutRef {
  workout_id?: string;
  date?: string;
  program_id?: string;
  phase_index?: number;
  workout_index?: number;
}

interface ExerciseRef {
  block: number;
  series: number;
  exercise: number;
}

interface ExerciseFeedback {
  exercise_ref: ExerciseRef;
  feedback: string;
  media?: MediaItem[];
}

interface WorkoutExecution {
  openset_version: string;
  type: 'workout_execution';
  execution_id: string;
  workout_ref: WorkoutRef;
  started_at: string;
  completed_at: string;
  set_executions: SetExecution[];
  summary?: { sets_completed?: number; sets_skipped?: number; total_volume_kg?: number };
  feedback?: string;           // overall workout feedback
  media?: MediaItem[];         // session-level photos/videos
  exercise_feedback?: ExerciseFeedback[]; // per-exercise feedback (and optional media)
  source?: {                   // provenance (e.g. FIT import) for deduplication and audit
    provider?: string;
    activity_id?: string;
    imported_at?: string;
    device?: string;
    mapping_summary?: string;
  };
}
```

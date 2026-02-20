---
title: TypeScript Types
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
  estimated_duration_min?: number;
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

---
sidebar_position: 2
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
  Session,
  Program,
  Set,
  Exercise,
  Series,
  Block,
  ValueObject,
  ExecutionMode,
  ExerciseDefinition,
  ExerciseLibrary,
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

### Set

The atomic unit of prescription:

```typescript
interface Set {
  execution_type: string;
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

### Session & Program

Top-level document types:

```typescript
interface Session {
  openset_version: string;
  type: 'session';
  name?: string;
  date?: string;
  sport?: string;
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
  execution_types?: string[];
}

interface ExerciseLibrary {
  openset_version: string;
  type: 'exercise_library';
  id: string;
  name: string;
  exercises: ExerciseDefinition[];
}
```

# @openset/types

TypeScript type definitions for the [OpenSet](https://github.com/getdiby/openset) training data standard.

## Installation

```bash
npm install @openset/types
```

## Usage

```typescript
import type {
  Workout,
  Exercise,
  Set,
  Program,
  ExerciseDefinition,
  ExerciseLibrary,
  ValueObject,
  ExecutionMode,
  Dimension,
  ValidationResult,
} from '@openset/types';
```

## Types

### Document Types

- `Workout` — A standalone training workout
- `Program` — A multi-phase training program
- `OpenSetDocument` — Union of `Workout | Program`

### Hierarchy

- `Block` — A named group of series within a workout
- `Series` — A group of exercises with an execution mode
- `Exercise` — A single exercise with its sets
- `Set` — A single set with declared dimensions and their values

### Value Types

- `ValueObject` — Union of all value types
- `FixedValue` — Exact prescribed target
- `RangeValue` — Min/max bounds
- `MinValue` — At least this value
- `AmrapValue` — As many as possible
- `MaxValue` — Maximum effort
- `AnyValue` — No target

### Exercise Library

- `ExerciseLibrary` — A complete exercise library document
- `ExerciseDefinition` — A single exercise entry in a library

### Validation

- `ValidationResult` — Result of validating an OpenSet document
- `ValidationMessage` — A single validation error or warning

## License

MIT

# OpenSet

[![npm @openset/types](https://img.shields.io/npm/v/@openset/types?label=%40openset%2Ftypes)](https://www.npmjs.com/package/@openset/types)
[![npm @openset/validator](https://img.shields.io/npm/v/@openset/validator?label=%40openset%2Fvalidator)](https://www.npmjs.com/package/@openset/validator)
[![npm @openset/codegen](https://img.shields.io/npm/v/@openset/codegen?label=%40openset%2Fcodegen)](https://www.npmjs.com/package/@openset/codegen)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

An open, sport-agnostic standard for representing structured training workouts and programs as machine-readable data.

## What is OpenSet?

OpenSet is a JSON-based data standard for describing training workouts across any sport or physical activity. It defines a strict vocabulary for how workouts are structured — from high-level programs down to individual sets and their prescribed dimensions — so that coaches, athletes, and software tools can exchange training data without ambiguity.

## Quick Start

### Validate a document

```bash
npx @openset/validator validate ./my-workout.json --summary
```

### Use TypeScript types

```bash
npm install @openset/types
```

```typescript
import type { Workout, Set, Exercise } from '@openset/types';
```

### Validate programmatically

```bash
npm install @openset/validator
```

```typescript
import { validate } from '@openset/validator';

const result = validate(myDocument);
// { valid: true, errors: [], warnings: [] }
```

## Minimal Example

```json
{
  "openset_version": "1.0",
  "type": "workout",
  "name": "Upper Body",
  "date": "2026-02-19",
  "blocks": [
    {
      "name": "Main Work",
      "series": [
        {
          "execution_mode": "SUPERSET",
          "rounds": { "type": "fixed", "value": 3 },
          "rest_after": { "type": "fixed", "value": 90, "unit": "s" },
          "exercises": [
            {
              "exercise_id": "bench_press",
              "sets": [
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" } }
              ]
            },
            {
              "exercise_id": "pull_up",
              "sets": [
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Project Structure

```
openset/
├── spec/v1/                    # Specification files
│   ├── schema/                 # JSON Schemas and vocabulary
│   ├── libraries/              # Canonical exercise library
│   └── types/                  # TypeScript type definitions
├── packages/
│   ├── typescript-types/       # @openset/types npm package
│   └── validator/              # @openset/validator npm package
├── examples/                   # Example OpenSet documents
├── tools/convert/              # LLM conversion prompt
└── website/                    # Documentation website
```

## Core Concepts

**Data Hierarchy:** `Program > Phase > Workout > Block > Series > Exercise > Set`

**Document types:** `workout`, `program`, `workout_library`

**Workout** is the minimum valid standalone document.

**Execution Modes** define how exercises in a series flow: `SEQUENTIAL`, `CIRCUIT`, `SUPERSET`, `AMRAP`, `FOR_TIME`, `INTERVAL`, `TABATA`, `EMOM`, `LADDER`, `CLUSTER`.

**Set Dimensions** define the measurable axes of each set. The `dimensions` array declares which dimensions are required (e.g., `["reps", "load"]`), and any other known dimension can be added freely.

**Value Types** describe how targets are prescribed: `fixed` (exact), `range` (min/max), `min` (at least), `amrap` (as many as possible), `max` (maximum effort), `any` (no target).

## Packages

| Package | Description |
|---------|-------------|
| [`@openset/types`](./packages/typescript-types) | TypeScript type definitions |
| [`@openset/validator`](./packages/validator) | CLI and programmatic validator |
| [`@openset/codegen`](./packages/codegen) | Fluent TypeScript builder for documents |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on adding exercises, proposing new dimensions, and contributing to the spec.

## License

[MIT](./LICENSE)

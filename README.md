# OpenSet

An open, sport-agnostic standard for representing structured training sessions, workouts, and programs as machine-readable data.

## What is OpenSet?

OpenSet is a JSON-based data standard for describing training sessions across any sport or physical activity. It defines a strict vocabulary for how workouts are structured — from high-level programs down to individual sets and their prescribed dimensions — so that coaches, athletes, and software tools can exchange training data without ambiguity.

## Quick Start

### Validate a document

```bash
npx @openset/validator validate ./my-session.json --summary
```

### Use TypeScript types

```bash
npm install @openset/types
```

```typescript
import type { Session, Set, Exercise } from '@openset/types';
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
  "type": "session",
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
                { "execution_type": "reps_load", "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" } },
                { "execution_type": "reps_load", "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" } },
                { "execution_type": "reps_load", "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" } }
              ]
            },
            {
              "exercise_id": "pull_up",
              "sets": [
                { "execution_type": "reps_only", "reps": { "type": "fixed", "value": 10 } },
                { "execution_type": "reps_only", "reps": { "type": "fixed", "value": 10 } },
                { "execution_type": "reps_only", "reps": { "type": "fixed", "value": 10 } }
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

**Data Hierarchy:** `Program > Phase > Session > Block > Series > Exercise > Set`

**Session** is the minimum valid standalone document.

**Execution Modes** define how exercises in a series flow: `SEQUENTIAL`, `CIRCUIT`, `SUPERSET`, `AMRAP`, `FOR_TIME`, `INTERVAL`, `TABATA`, `EMOM`, `LADDER`, `CLUSTER`.

**Execution Types** define the shape of individual set prescriptions: `reps_only`, `reps_load`, `distance_only`, `duration_only`, and 12 more.

**Value Types** describe how targets are prescribed: `fixed` (exact), `range` (min/max), `min` (at least), `amrap` (as many as possible), `max` (maximum effort), `any` (no target).

## Packages

| Package | Description |
|---------|-------------|
| [`@openset/types`](./packages/typescript-types) | TypeScript type definitions |
| [`@openset/validator`](./packages/validator) | CLI and programmatic validator |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on adding exercises, proposing new execution types, and contributing to the spec.

## License

[MIT](./LICENSE)

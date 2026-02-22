# OpenSet Specification v1.0

This document provides a narrative overview of the OpenSet v1.0 specification.

## Philosophy

OpenSet models **what should be done, how it should feel, and under what constraints**. It is a prescription format, not a logging format. It does not model actual execution timelines, sensor data, or real-time athlete behavior.

## Document Hierarchy

```
PROGRAM
  PHASE
    WORKOUT          <-- minimum valid standalone document
      BLOCK
        SERIES
          EXERCISE
            SET
```

A valid OpenSet document is either a standalone **workout**, a **program** containing phases and workouts, or a **workout_library** containing reusable workout definitions.

## Schema type naming

In `openset.schema.json`:

| Type | Role |
|------|------|
| **Workout** | Workout payload (blocks, name, tags, etc.). Used as the shape of workouts inside a program (`Phase.workouts[]`) and as the base for the workout root document. |
| **WorkoutDocument** | Root document: a single workout file. Composes `Workout` with `openset_version`, `type: "workout"`, and `x_extensions`. |
| **ProgramDocument** | Root document: a program file. Contains `phases`, each with an array of `Workout`. |

Root documents are the two top-level shapes (`WorkoutDocument` \| `ProgramDocument`). The shared workout content is defined once as `Workout`.

## Execution Modes

Series-level field that defines how exercises flow:

| Mode | Description |
|------|-------------|
| `SEQUENTIAL` | Complete all sets of each exercise before moving on |
| `CIRCUIT` | Cycle through exercises, one set each, repeat |
| `SUPERSET` | Two exercises back to back with minimal rest |
| `AMRAP` | As many rounds as possible within a time window |
| `FOR_TIME` | Complete prescribed work as fast as possible |
| `INTERVAL` | Repeating work/rest structure |
| `TABATA` | 20s work / 10s rest, fixed protocol |
| `EMOM` | Every minute on the minute |
| `LADDER` | Ascending, descending, or pyramid scheme |
| `CLUSTER` | Sub-groups of exercises with internal rest |

## Set Dimensions

Each set declares a `dimensions` array listing the dimension names that define the set's prescription shape. Any combination of dimensions is valid — no fixed enum of types.

See `spec/v1/schema/dimensions.json` for the complete dimension vocabulary with allowed value types.

## Value Types

Every prescribed dimension uses one of six types:

| Type | Description | Example |
|------|-------------|---------|
| `fixed` | Exact target | `{ "type": "fixed", "value": 100, "unit": "kg" }` |
| `range` | Min/max bounds | `{ "type": "range", "min": 8, "max": 12 }` |
| `min` | At least this value | `{ "type": "min", "value": 30, "unit": "s" }` |
| `amrap` | As many as possible | `{ "type": "amrap" }` |
| `max` | Maximum effort | `{ "type": "max" }` |
| `any` | No target | `{ "type": "any" }` |

## Dimensions

Measurable axes of a set. See `spec/v1/schema/dimensions.json` for the complete list with allowed value types per dimension.

Key dimensions: `reps`, `load`, `duration`, `distance`, `height`, `pace`, `speed`, `power`, `heart_rate`, `heart_rate_zone`, `rpe`, `calories`, `tempo`, `velocity`, `incline`, `sides`, `rounds`, `cadence`, `resistance`, `rest_after`.

## Extension Mechanism

Custom dimensions and exercises are supported via namespacing:

| Prefix | Usage |
|--------|-------|
| `x_` | Generic extension |
| `app_` | App-specific |
| reverse-DNS | Organization-specific |

Unknown fields with a valid namespace prefix produce a warning (W009). Unknown fields without a prefix produce an error (E013).

## Exercise Library

The canonical library (`openset-default`) ships with 42 exercises under MIT license. The library format is defined by `exercise-library.schema.json`. Third-party libraries must validate against this schema to claim OpenSet compatibility.

## Validation

The `@openset/validator` package enforces 13 error rules and 9 warning rules. Errors make a document invalid. Warnings are informational.

See the [validator README](../../packages/validator/README.md) for the full rule reference.

## Versioning

- `MAJOR.MINOR` semantic versioning
- Minor bumps: additive, backward compatible
- Major bumps: breaking, with migration guides
- All documents carry `openset_version`

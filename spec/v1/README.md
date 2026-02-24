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

A valid OpenSet document is either a standalone **workout**, a **program** containing phases and workouts, or a **workout_library** containing reusable workout definitions. An optional **workout execution** document type (`workout_execution`) records what was actually done for a workout instance (session + set-level actuals); see `workout-execution.schema.json` and the [Workout execution](https://openset.dev/docs/spec/workout-execution) spec.

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
| `range` | Min/max bounds | `{ "type": "range", "min": 8, "max": 12, "unit": "kg" }` |
| `min` | At least this value | `{ "type": "min", "value": 30, "unit": "s" }` |
| `amrap` | As many as possible | `{ "type": "amrap" }` |
| `max` | Maximum effort | `{ "type": "max" }` |
| `any` | No target | `{ "type": "any" }` |

## Dimensions

Measurable axes of a set. See `spec/v1/schema/dimensions.json` for the complete list with allowed value types per dimension.

Key dimensions: `reps`, `load`, `duration`, `distance`, `height`, `pace`, `speed`, `power`, `heart_rate`, `heart_rate_zone`, `rpe`, `rir`, `calories`, `tempo`, `velocity`, `incline`, `sides`, `rounds`, `cadence`, `resistance`, `rest_after`.

## Extension Mechanism

Custom dimensions and exercises are supported via namespacing:

| Prefix | Usage |
|--------|-------|
| `x_` | Generic extension |
| `app_` | App-specific |
| reverse-DNS | Organization-specific |

Unknown fields with a valid namespace prefix produce a warning (W009). Unknown fields without a prefix produce an error (E013).

Recommended patterns:

- Use **`x_*`** for generic extensions that could reasonably be shared across apps (e.g. `x_status`, `x_load_strategy`, `x_resistance_band`, `x_load_components`).
- Use **`app_*`** for strictly app-specific fields that are unlikely to be reused elsewhere (e.g. `app_tracking_id`).
- Use **reverse-DNS prefixes** for organization-specific contracts you control across multiple apps (e.g. `com_myapp_custom_field`).
- Declare any namespaces you rely on in the document's `x_extensions` array so consumers can detect them up front and decide whether to interpret or ignore them.
- Consumers should be free to ignore unknown namespaced fields, but **should preserve them** when re-serializing documents to avoid losing extension data.

## Exercise Library

The canonical library (`openset-default`) ships with 42 exercises under MIT license. The library format is defined by `exercise-library.schema.json`. Third-party libraries must validate against this schema to claim OpenSet compatibility.

## Validation

The `@openset/validator` package enforces 13 error rules and 9 warning rules. Errors make a document invalid. Warnings are informational.

See the [validator README](../../packages/validator/README.md) for the full rule reference.

## Interoperability and related formats

OpenSet can represent the same prescription intent as other workout and prescription formats. Conversion to and from these formats is out of scope of the core spec but is encouraged for implementers and tools (e.g. in the [tools/convert](../../tools/convert/) directory).

| Format | Domain | Notes |
|--------|--------|------|
| **Zwift (ZWO)** | Indoor cycling/running | XML; segment types (Warmup, SteadyState, IntervalsT, Ramp, etc.) map to OpenSet blocks/series/sets and execution modes. Power as %FTP or fixed W. |
| **ERG / MRC** | Cycling trainers | Text-based time + power (Watts or %FTP). Intervals map to OpenSet sets with `duration`, `power`, `rest_after`. |
| **FHIR Physical Activity IG** | Healthcare | CarePlan, ServiceRequest, Goal for high-level prescriptions (e.g. minutes/week). OpenSet can describe the detailed workout structure referenced by or embedded in FHIR workflows. |
| **Structured Workout Format (SWF)** | Cross-platform JSON | Sections, intervals, repeats with volume and intensity. OpenSet covers the same ideas with blocks, series, sets, and dimensions; conversion is straightforward. |
| **TCX / FIT** | Garmin, devices | Primarily recording/targets; OpenSet is prescription-first. Export from OpenSet to FIT/TCX for device use is a tooling concern. |

## Versioning

- `MAJOR.MINOR` semantic versioning
- Minor bumps: additive, backward compatible
- Major bumps: breaking, with migration guides
- All documents carry `openset_version`

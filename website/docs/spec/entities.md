---
title: Entities
---

# Entities

OpenSet documents follow a strict hierarchical structure.

```
PROGRAM
  PHASE
    WORKOUT          <-- minimum valid standalone document
      BLOCK
        SERIES
          EXERCISE
            SET
```

Order of series within a block, exercises within a series, and sets within an exercise is given by **array index** (first element is first). There is no separate `order` field.

## Document Types

A valid OpenSet document is one of:

1. **Workout document** — A single training workout with `type: "workout"` (schema: `WorkoutDocument`)
2. **Program document** — A multi-phase training plan with `type: "program"` containing phases and workouts (schema: `ProgramDocument`)
3. **Exercise Library** — A collection of exercise definitions with `type: "exercise_library"`
4. **Workout Library** — A collection of reusable workout templates with `type: "workout_library"`

## Levels

### Program

Top-level container for a multi-workout training plan.

| Field | Required | Description |
|-------|----------|-------------|
| `openset_version` | Yes | Spec version (e.g. `"1.0"`) |
| `type` | Yes | Must be `"program"` |
| `name` | Yes | Program name |
| `description` | No | Program description |
| `sports` | No | Target sports (freeform; common values include strength, running, cycling, swimming, fitness, yoga) |
| `duration_weeks` | No | Total duration in weeks |
| `phases` | Yes | Array of Phase objects |

### Phase

Groups workouts within a program by training focus or time period.

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Phase name |
| `week_start` | No | Starting week number |
| `week_end` | No | Ending week number |
| `goal` | No | Phase objective |
| `workouts` | Yes | Array of Workout objects |

### Workout

The minimum valid standalone document. Represents a single training workout.

| Field | Required | Description |
|-------|----------|-------------|
| `openset_version` | Yes | Spec version |
| `type` | Yes | Must be `"workout"` |
| `name` | No | Workout name |
| `date` | No | ISO 8601 date |
| `sports` | No | Target sports (freeform; common values include strength, running, cycling, swimming, fitness, yoga) |
| `level` | No | Difficulty: `beginner`, `intermediate`, `advanced`, `elite` |
| `estimated_duration_min` | No | Estimated duration in minutes |
| `tags` | No | Optional tags for filtering and discovery |
| `blocks` | Yes | Array of Block objects |

### Block

Groups related series within a workout (e.g., warm-up, main work, cooldown).

| Field | Required | Description |
|-------|----------|-------------|
| `name` | No | Block name |
| `series` | Yes | Array of Series objects |

### Series

A group of exercises performed with a specific execution mode.

| Field | Required | Description |
|-------|----------|-------------|
| `execution_mode` | Yes | How exercises flow (see [Execution Modes](./execution-modes)) |
| `rounds` | No | When present, how many times the series is repeated (e.g. for CIRCUIT, SUPERSET, AMRAP) |
| `rest_after` | No | Rest after the series |
| `exercises` | Yes | Array of Exercise objects |

### Exercise

A single exercise within a series.

| Field | Required | Description |
|-------|----------|-------------|
| `exercise_id` | One required | ID from an exercise library |
| `name` | One required | Freeform exercise name |
| `group` | No | Sub-group identifier (for CLUSTER mode) |
| `sets` | Yes | Array of Set objects |

### Set

The atomic unit — a single prescribed effort.

| Field | Required | Description |
|-------|----------|-------------|
| `dimensions` | Yes | Array of required dimension names (see [Dimensions](./set-dimensions)) |
| dimension fields | Varies | Values for each declared and optional dimension |

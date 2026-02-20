---
title: Document Hierarchy
---

# Document Hierarchy

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

## Document Types

A valid OpenSet document is one of:

1. **Standalone Workout** — A single training workout with `type: "workout"`
2. **Program** — A multi-phase training plan with `type: "program"` containing phases and workouts
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
| `sports` | No | Target sports |
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
| `sports` | No | Target sports |
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
| `rounds` | No | Number of rounds |
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

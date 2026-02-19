---
sidebar_position: 3
title: Execution Modes
---

# Execution Modes

Execution modes are series-level fields that define how exercises flow within a series.

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

## Examples

### SEQUENTIAL

The default mode. Complete all sets of exercise A, then all sets of exercise B.

```json
{
  "execution_mode": "SEQUENTIAL",
  "exercises": [
    {
      "exercise_id": "back_squat",
      "sets": [
        { "execution_type": "reps_load", "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 140, "unit": "kg" } },
        { "execution_type": "reps_load", "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 140, "unit": "kg" } }
      ]
    }
  ]
}
```

### SUPERSET

Alternate between two exercises with minimal rest.

```json
{
  "execution_mode": "SUPERSET",
  "exercises": [
    {
      "exercise_id": "bench_press",
      "sets": [
        { "execution_type": "reps_load", "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" } }
      ]
    },
    {
      "exercise_id": "bent_over_row",
      "sets": [
        { "execution_type": "reps_load", "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 70, "unit": "kg" } }
      ]
    }
  ]
}
```

### AMRAP

As many rounds as possible within a time cap.

```json
{
  "execution_mode": "AMRAP",
  "rounds": { "type": "amrap" },
  "duration": { "type": "fixed", "value": 12, "unit": "min" },
  "exercises": [
    {
      "exercise_id": "kettlebell_swing",
      "sets": [
        { "execution_type": "reps_only", "reps": { "type": "fixed", "value": 15 } }
      ]
    },
    {
      "exercise_id": "burpee",
      "sets": [
        { "execution_type": "reps_only", "reps": { "type": "fixed", "value": 10 } }
      ]
    }
  ]
}
```

### CLUSTER

Sub-groups of exercises using the `group` field.

```json
{
  "execution_mode": "CLUSTER",
  "exercises": [
    { "exercise_id": "bench_press", "group": "A", "sets": [{ "execution_type": "reps_load", "reps": { "type": "fixed", "value": 6 }, "load": { "type": "fixed", "value": 85, "unit": "kg" } }] },
    { "exercise_id": "dumbbell_fly", "group": "A", "sets": [{ "execution_type": "reps_only", "reps": { "type": "fixed", "value": 12 } }] },
    { "exercise_id": "tricep_pushdown", "group": "B", "sets": [{ "execution_type": "reps_only", "reps": { "type": "fixed", "value": 15 } }] },
    { "exercise_id": "overhead_tricep_extension", "group": "B", "sets": [{ "execution_type": "reps_only", "reps": { "type": "fixed", "value": 12 } }] }
  ]
}
```

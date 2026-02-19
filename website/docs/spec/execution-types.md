---
sidebar_position: 4
title: Execution Types
---

# Execution Types

Execution types are set-level fields that define the prescription shape — which dimensions are required and which are optional.

There are 16 canonical execution types:

| ID | Required | Optional |
|----|----------|----------|
| `reps_only` | reps | rpe |
| `reps_load` | reps | load, tempo, rpe, velocity |
| `reps_per_side` | reps, sides | load, tempo, rpe |
| `reps_height` | reps, height | load, rpe |
| `duration_only` | duration | heart_rate_zone, rpe, incline |
| `duration_load` | duration | load, rpe, incline |
| `duration_per_side` | duration, sides | rest_between_sides, load, rpe |
| `duration_power` | duration | power, heart_rate_zone, rpe |
| `distance_only` | distance | pace, speed, heart_rate, heart_rate_zone, rpe, incline |
| `distance_time` | distance, duration | pace, heart_rate_zone, rpe, incline |
| `distance_load` | distance | load, pace, rpe |
| `power_duration` | power, duration | heart_rate_zone, rpe |
| `power_distance` | power, distance | pace, rpe |
| `calories_only` | calories | duration, heart_rate_zone, rpe |
| `distance_calories` | distance | calories, duration, pace, rpe |
| `rounds_time` | rounds | duration, rpe |

## How It Works

Every set must declare an `execution_type`. The validator checks that:

1. The `execution_type` value is one of the 16 canonical IDs (or an extension)
2. All **required** dimensions for that type are present
3. No dimensions are present that aren't in the required or optional list (unless they're universal like `rest_after`)

## Example

A `reps_load` set requires `reps` and optionally accepts `load`, `tempo`, `rpe`, and `velocity`:

```json
{
  "execution_type": "reps_load",
  "reps": { "type": "fixed", "value": 5 },
  "load": { "type": "fixed", "value": 100, "unit": "kg" },
  "rpe": { "type": "range", "min": 7, "max": 8 }
}
```

## Extension Types

Custom execution types are supported via namespacing. See [Extensions](./extensions) for details.

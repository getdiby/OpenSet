---
title: Dimensions
description: Set dimensions in OpenSet — reps, load, duration, distance, power, and other measurable axes. How to declare and use dimensions.
keywords: [OpenSet, dimensions, reps, load, duration, power, set dimensions]
---

# Dimensions

Dimensions are the measurable axes of a set — reps, load, duration, distance, and so on. Every set declares a `dimensions` array listing which dimension names are required for that set.

## How It Works

Each set explicitly declares its dimensions:

```json
{
  "dimensions": ["reps", "load"],
  "reps": { "type": "fixed", "value": 5 },
  "load": { "type": "fixed", "value": 100, "unit": "kg" }
}
```

The `dimensions` array tells validators and consumers which fields are **required** for this set. Any other known dimension may be added optionally.

## Rules

1. Every set **must** have a `dimensions` array with at least one entry
2. Each name in `dimensions` must be a known dimension (see table below) or a valid extension dimension
3. All dimensions listed in the array **must** be present as fields on the set
4. Any known dimension **not** in the array may still appear on the set -- it is treated as optional
5. Universal dimensions (`rest_after`, `note`) are always allowed and never need to be listed in `dimensions`

## Known Dimensions

There are 21 known dimension names. By category: **count** (reps, sides, rounds); **load**; **time** (duration, duration_per_side, rest_between_sides, rest_after); **tempo**; **distance and space** (distance, height, incline); **cardio and effort** (pace, speed, power, heart_rate, heart_rate_zone, rpe, velocity, calories, cadence, resistance).

| Dimension | Allowed Types | Units |
|-----------|---------------|-------|
| `reps` | fixed, range, min, amrap | (count) |
| `sides` | fixed | (count) |
| `rounds` | fixed, amrap | (count) |
| `load` | fixed, range, max | kg, lb, %1RM, %BW |
| `duration` | fixed, range, min | s, min, h |
| `duration_per_side` | fixed, range | s, min |
| `rest_between_sides` | fixed | s, min |
| `rest_after` | fixed, range | s, min |
| `tempo` | fixed | (string, e.g. "3-1-2-0") |
| `distance` | fixed, range, min, amrap | m, km, mi, ft, yd |
| `height` | fixed, range | cm, in |
| `incline` | fixed, range | % |
| `pace` | fixed, range | min/km, min/mi |
| `speed` | fixed, range | km/h, mph |
| `power` | fixed, range | W, %FTP |
| `heart_rate` | fixed, range, max | bpm |
| `heart_rate_zone` | fixed, range | (zone number) |
| `rpe` | fixed, range, max | (scale) |
| `velocity` | fixed, range | m/s |
| `calories` | fixed, min, amrap | kcal |
| `cadence` | fixed, range | rpm, spm |
| `resistance` | fixed, range | level, % |

**Power:** Use `W` for absolute watts or `%FTP` for power relative to the athlete's FTP. `%FTP` makes workouts portable across riders (e.g. shared cycling/ERG workouts).

## Examples

### Strength set (reps + load)

```json
{
  "dimensions": ["reps", "load"],
  "reps": { "type": "fixed", "value": 5 },
  "load": { "type": "fixed", "value": 100, "unit": "kg" },
  "rpe": { "type": "range", "min": 7, "max": 8 }
}
```

Here `reps` and `load` are required (listed in `dimensions`), while `rpe` is optional.

### Bodyweight set (reps only)

```json
{
  "dimensions": ["reps"],
  "reps": { "type": "fixed", "value": 20 }
}
```

### Cardio set (distance)

```json
{
  "dimensions": ["distance"],
  "distance": { "type": "fixed", "value": 5, "unit": "km" },
  "pace": { "type": "range", "min": 4.5, "max": 5.0, "unit": "min/km" }
}
```

### Timed set (duration + power)

```json
{
  "dimensions": ["duration", "power"],
  "duration": { "type": "fixed", "value": 20, "unit": "min" },
  "power": { "type": "range", "min": 200, "max": 220, "unit": "W" }
}
```

Portable cycling workout using %FTP (same file works for any rider):

```json
{
  "dimensions": ["duration", "power"],
  "duration": { "type": "fixed", "value": 5, "unit": "min" },
  "power": { "type": "fixed", "value": 0.65, "unit": "%FTP" }
}
```

### Per-side set

```json
{
  "dimensions": ["reps", "sides"],
  "reps": { "type": "fixed", "value": 10 },
  "sides": { "type": "fixed", "value": 2 },
  "load": { "type": "fixed", "value": 20, "unit": "kg" }
}
```

## Custom Dimensions

Custom dimensions are supported via namespaced prefixes (e.g., `x_`, `app_`). Extension dimensions can be listed in the `dimensions` array just like built-in ones:

```json
{
  "dimensions": ["reps", "load", "x_band_tension"],
  "reps": { "type": "fixed", "value": 10 },
  "load": { "type": "fixed", "value": 60, "unit": "kg" },
  "x_band_tension": { "type": "fixed", "value": 20, "unit": "lb" }
}
```

See [Extensions](./extensions) for details on namespacing conventions.

## Dimension Conflicts

Some dimensions are mutually exclusive within a single set:

- `pace` and `speed` -- Cannot specify both
- `heart_rate` and `heart_rate_zone` -- Cannot specify both

The validator will emit **E012** if conflicting dimensions are found on the same set.

## Hold (isometric) exercises

Exercises where the athlete holds a position for time (e.g. plank, wall sit, hollow hold) are prescribed using the **duration** dimension. There is no separate "hold" dimension — use `dimensions: ["duration"]` and set `duration` to the hold time (e.g. 30s, 60s).

## To failure

To prescribe **"to failure"**, use `reps` with type `amrap` or `rpe` with type `max` as appropriate.

## Universal Dimensions

The following dimensions are always allowed on any set, regardless of what is listed in `dimensions`:

- `rest_after` -- Rest period after the set. It can also appear at series level; when both are present, **set overrides series**.
- `note` -- Freeform coaching notes

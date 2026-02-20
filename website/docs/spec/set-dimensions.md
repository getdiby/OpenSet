---
title: Dimensions
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

There are 21 known dimension names:

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
| `power` | fixed, range | W |
| `heart_rate` | fixed, range, max | bpm |
| `heart_rate_zone` | fixed, range | (zone number) |
| `rpe` | fixed, range, max | (scale) |
| `velocity` | fixed, range | m/s |
| `calories` | fixed, min, amrap | kcal |
| `cadence` | fixed, range | rpm, spm |
| `resistance` | fixed, range | level, % |

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

## Universal Dimensions

The following dimensions are always allowed on any set, regardless of what is listed in `dimensions`:

- `rest_after` -- Rest period after the set
- `note` -- Freeform coaching notes

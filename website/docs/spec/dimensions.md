---
sidebar_position: 6
title: Dimensions
---

# Dimensions

Dimensions are the measurable axes of a set. Each dimension accepts specific value types.

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

## Universal Dimensions

The following dimensions are always allowed on any set, regardless of execution type:

- `rest_after` — Rest period after the set
- `note` — Freeform coaching notes

## Dimension Conflicts

Some dimensions are mutually exclusive within a single set:

- `pace` and `speed` — Cannot specify both
- `heart_rate` and `heart_rate_zone` — Cannot specify both

The validator will emit **E012** if conflicting dimensions are found on the same set.

## Custom Dimensions

Custom dimensions can be added using the extension mechanism. See [Extensions](./extensions).

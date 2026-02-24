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

There are 22 known dimension names. By category: **count** (reps, sides, rounds); **load**; **time** (duration, duration_per_side, rest_between_sides, rest_after); **tempo**; **distance and space** (distance, height, incline); **cardio and effort** (pace, speed, power, heart_rate, heart_rate_zone, rpe, rir, velocity, calories, cadence, resistance).

| Dimension | Allowed Types | Units |
|-----------|---------------|-------|
| `reps` | fixed, range, min, amrap | (count) |
| `sides` | fixed | (count) |
| `rounds` | fixed, amrap | (count) |
| `load` | fixed, range, max | kg, lb, %1RM, %BW |
| `duration` | fixed, range, min | s, min, h |
| `duration_per_side` | fixed, range | s, min, h |
| `rest_between_sides` | fixed | s, min, h |
| `rest_after` | fixed, range | s, min, h |
| `tempo` | fixed | (string, e.g. "3-1-2-0") |
| `distance` | fixed, range, min, amrap | m, km, mi, ft, yd |
| `height` | fixed, range | cm, in |
| `incline` | fixed, range | % |
| `pace` | fixed, range | min/km, min/mi |
| `speed` | fixed, range | km/h, mph |
| `power` | fixed, range | W, %FTP |
| `heart_rate` | fixed, range, max | bpm |
| `heart_rate_zone` | fixed, range | (zone number) |
| `rpe` | fixed, range, max | (scale, typically 1–10) |
| `rir` | fixed, range, max | (reps in reserve, typically 0–5) |
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

You can also use **RIR (reps in reserve)** as an effort cue alongside or instead of RPE:

```json
{
  "dimensions": ["reps", "load", "rir"],
  "reps": { "type": "fixed", "value": 5 },
  "load": { "type": "fixed", "value": 100, "unit": "kg" },
  "rir": { "type": "fixed", "value": 2 }
}
```

RIR is typically logged on a **0–5** scale (0 = failure, 2 = two reps left). A rough mapping between RPE and RIR is:

- RPE 10 ≈ RIR 0 (to failure)
- RPE 9  ≈ RIR 1
- RPE 8  ≈ RIR 2

They are related but not interchangeable: RPE considers overall effort and context; RIR focuses on **how many reps remained** at the end of the set.

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

### Resistance machines and bands

Use the `resistance` dimension for **machine resistance levels or percentages**, keeping values numeric:

```json
{
  "dimensions": ["reps", "resistance"],
  "reps": { "type": "fixed", "value": 12 },
  "resistance": { "type": "fixed", "value": 8, "unit": "level" },
  "note": "Leg press — level 8, green band assist"
}
```

When you need to preserve the **exact band identity** (e.g. band color or model), keep `load`/`resistance` numeric and add an extension dimension such as `x_resistance_band`:

```json
{
  "dimensions": ["reps", "resistance", "x_resistance_band"],
  "reps": { "type": "fixed", "value": 10 },
  "resistance": { "type": "fixed", "value": 6, "unit": "level" },
  "x_resistance_band": { "type": "fixed", "value": "zelena_guma" }
}
```

Core consumers can ignore `x_resistance_band` and still understand the numeric prescription; apps that care about band names can read the extension.

### Compound loads (e.g. dumbbells + chains)

For prescriptions like `"3kg ball + 15kg kettlebell"`, keep the core `load` dimension as the **total external load** and store the breakdown in a note or extension:

```json
{
  "dimensions": ["reps", "load", "x_load_components"],
  "reps": { "type": "fixed", "value": 8 },
  "load": { "type": "fixed", "value": 18, "unit": "kg" },
  "x_load_components": { "type": "fixed", "value": [3, 15] },
  "note": "3kg medicine ball + 15kg kettlebell"
}
```

This keeps the core data model simple and interoperable (everyone understands `load: 18kg`), while still allowing apps to reconstruct or display the detailed components if they know about `x_load_components`.

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

## Intensity scales and guideline alignment

OpenSet’s intensity-related dimensions are designed to mirror common guideline usage (including ACSM) without locking into a single standard:

- **RPE (`rpe`)**
  - Recommended scale is **1–10**, which aligns with ACSM’s use of Borg CR10-style ratings for light, moderate, and vigorous domains.
  - Apps that prefer the original **6–20** Borg scale can still use `rpe` with `fixed`/`range` values and document the scale in app UI, but 1–10 is the shared baseline for interoperability.
  - Typical mapping (approximate) for 1–10:
    - Light: 2–3
    - Moderate: 4–6
    - Vigorous: 7–8
    - Near-maximal to maximal: 9–10
- **Heart rate (`heart_rate`, `heart_rate_zone`)**
  - Use `heart_rate` when prescribing intensities relative to **absolute heart rate** (`bpm`) or guideline-style **relative markers**:
    - Absolute: `unit: "bpm"` (e.g. 140–155 bpm).
    - Relative to reserve or max: `unit: "%HRR"` or `unit: "%HRmax"` (e.g. 0.4–0.59 for moderate, 0.6–0.89 for vigorous when following ACSM domains).
  - Use `heart_rate_zone` when you maintain your own zone model (e.g. 1–5) that maps to %HRR/%HRmax in app logic. OpenSet does not define the zone table; it only stores the zone index or range.
- **Cardio pace/speed and effort (`pace`, `speed`, `power`)**
  - Use `pace` (min/km or min/mi) or `speed` (km/h or mph) for running/walking prescriptions derived from guideline tables (e.g. ACSM MET-based walking speeds), optionally alongside:
  - `power` (`W` or `%FTP`) for cycling/ERG prescriptions where guidelines are expressed as % of threshold or absolute watts.

Guideline-specific rules (e.g. how %HRR, %HRmax, RPE, and METs combine to define “moderate” or “vigorous”) live in **app logic**. OpenSet provides the common intensity fields and units so those rules can be implemented consistently.
## Hold (isometric) exercises

Exercises where the athlete holds a position for time (e.g. plank, wall sit, hollow hold) are prescribed using the **duration** dimension. There is no separate "hold" dimension — use `dimensions: ["duration"]` and set `duration` to the hold time (e.g. 30s, 60s).

## To failure

To prescribe **"to failure"**, use `reps` with type `amrap` or `rpe` with type `max` as appropriate.

## Universal Dimensions

The following dimensions are always allowed on any set, regardless of what is listed in `dimensions`:

- `rest_after` -- Rest period after the set. It can also appear at series level; when both are present, **set overrides series**.
- `note` -- Freeform coaching notes

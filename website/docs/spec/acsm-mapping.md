---
title: ACSM-style Mapping
description: How to encode ACSM-style walking and resistance-training prescriptions in OpenSet JSON using programs, workouts, and set dimensions.
keywords: [OpenSet, ACSM, FITT-VP, walking, resistance training]
---

# ACSM-style Mapping

This page shows how to express classic ACSM-style prescriptions in OpenSet. The focus is on **big rocks** — FITT-VP structure and intensity — not on reproducing every disease-specific guideline.

## How ACSM maps onto OpenSet (FITT-VP)

OpenSet is designed to encode guideline-driven prescriptions such as ACSM’s FITT-VP framework without baking any specific guideline into the schema.

- **Frequency & Volume (F, V)** — Represented by:
  - How often a workout appears in a `program`/`phase` (`workouts` array on phases; `duration` on program/phase for overall plan length).
  - Set, series, and workout-level volume via `dimensions` such as `reps`, `rounds`, `duration`, `distance`, and optional tags (e.g. `"sports": ["strength"]`).
- **Intensity (I)** — Captured by existing dimensions and value types:
  - Cardio: `heart_rate`, `heart_rate_zone`, `power`, `pace`, `speed` using `fixed`, `range`, `min`, or `max` values.
  - Strength: `load`, `rpe`, `rir`, `velocity` for resistance and effort targets, again with value types like `fixed`, `range`, and `max`.
- **Time (T)** — Modeled with:
  - Workout/program `duration` estimates.
  - Set-level `duration`, `duration_per_side`, and `rest_after` (and series-level `rest_after`) to capture bout and rest structure.
- **Type (T)** — Expressed using:
  - `sports` on workouts/programs (e.g. `"running"`, `"strength"`, `"fitness"`).
  - `exercise_id` and `tags` to distinguish modalities (e.g. walking vs. jogging vs. cycling).
- **Progression (P)** — Implemented structurally:
  - Multi-phase programs (`PROGRAM → PHASE → WORKOUT`) where later phases increase volume, intensity, or complexity.
  - Within-workout progression using blocks and series (e.g., `"Warm-up"` → `"Main work"` → `"Cool-down"`), and by adjusting set-level value objects over time.

ACSM and similar guidelines remain **clinical/coach logic** that choose and sequence OpenSet documents. OpenSet focuses on providing a precise, sport-agnostic prescription format and a separate execution layer so those guideline decisions can be audited and analyzed over time.

## Example 1 — Beginner walking program (general health)

A simple 3-day-per-week walking program aimed at ACSM’s general health targets (e.g. building toward ~150 min/week of moderate-intensity activity).

Program document:

```json
{
  "openset_version": "1.0",
  "type": "program",
  "name": "Beginner Walking — General Health",
  "sports": ["running"],
  "duration": { "value": 8, "unit": "week" },
  "metadata": {
    "goal": "Build toward ~150 min/week of moderate-intensity walking",
    "author": "Example Coach",
    "provider": "OpenSet Example"
  },
  "phases": [
    {
      "name": "Weeks 1–4",
      "goal": "Establish habit, accumulate at least 90 min/week",
      "workouts": [
        {
          "openset_version": "1.0",
          "type": "workout",
          "name": "Walk — 30 min, 3x/week",
          "sports": ["running"],
          "duration": { "value": 30, "unit": "min" },
          "blocks": [
            {
              "name": "Main walk",
              "series": [
                {
                  "execution_mode": "SEQUENTIAL",
                  "exercises": [
                    {
                      "name": "Brisk walk",
                      "sets": [
                        {
                          "dimensions": ["duration", "pace"],
                          "duration": { "type": "fixed", "value": 30, "unit": "min" },
                          "pace": { "type": "range", "min": 10, "max": 12, "unit": "min/km" }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Weeks 5–8",
      "goal": "Progress toward ~150 min/week",
      "workouts": [
        {
          "openset_version": "1.0",
          "type": "workout",
          "name": "Walk — 40–50 min, 3–4x/week",
          "sports": ["running"],
          "duration": { "value": 45, "unit": "min" },
          "blocks": [
            {
              "name": "Main walk",
              "series": [
                {
                  "execution_mode": "SEQUENTIAL",
                  "exercises": [
                    {
                      "name": "Brisk walk",
                      "sets": [
                        {
                          "dimensions": ["duration", "pace"],
                          "duration": { "type": "range", "min": 40, "max": 50, "unit": "min" },
                          "pace": { "type": "range", "min": 9, "max": 11, "unit": "min/km" }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

- **FITT-VP mapping**
  - Frequency: implied by scheduling this workout 3–4 times per week in your app/calendar.
  - Intensity: controlled by `pace` (min/km range); apps may also attach `heart_rate` in `%HRR` or `rpe` if desired.
  - Time: `duration` at workout and set level.
  - Type: `sports: ["running"]` and `"Brisk walk"` exercise name.
  - Volume & progression: program `duration`, phase goals, and increasing time/pace across phases.

## Example 2 — Basic full-body resistance session

A single-session resistance workout that reflects ACSM’s guidance for major muscle groups with moderate loads and repetitions.

Workout document:

```json
{
  "openset_version": "1.0",
  "type": "workout",
  "name": "Full-Body — General Strength",
  "sports": ["strength"],
  "level": "beginner",
  "blocks": [
    {
      "name": "Warm-up",
      "series": [
        {
          "execution_mode": "SEQUENTIAL",
          "exercises": [
            {
              "name": "Bodyweight squat",
              "sets": [
                {
                  "dimensions": ["reps"],
                  "reps": { "type": "fixed", "value": 12 }
                },
                {
                  "dimensions": ["reps"],
                  "reps": { "type": "fixed", "value": 12 }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Main lifts",
      "series": [
        {
          "execution_mode": "SEQUENTIAL",
          "exercises": [
            {
              "exercise_id": "back_squat",
              "sets": [
                {
                  "dimensions": ["reps", "load"],
                  "reps": { "type": "range", "min": 8, "max": 12 },
                  "load": { "type": "fixed", "value": 60, "unit": "kg" },
                  "rpe": { "type": "range", "min": 6, "max": 7 },
                  "rest_after": { "type": "fixed", "value": 90, "unit": "s" }
                },
                {
                  "dimensions": ["reps", "load"],
                  "reps": { "type": "range", "min": 8, "max": 12 },
                  "load": { "type": "fixed", "value": 60, "unit": "kg" },
                  "rpe": { "type": "range", "min": 6, "max": 7 },
                  "rest_after": { "type": "fixed", "value": 90, "unit": "s" }
                }
              ]
            },
            {
              "exercise_id": "bench_press",
              "sets": [
                {
                  "dimensions": ["reps", "load"],
                  "reps": { "type": "range", "min": 8, "max": 12 },
                  "load": { "type": "fixed", "value": 40, "unit": "kg" },
                  "rpe": { "type": "range", "min": 6, "max": 7 },
                  "rest_after": { "type": "fixed", "value": 90, "unit": "s" }
                },
                {
                  "dimensions": ["reps", "load"],
                  "reps": { "type": "range", "min": 8, "max": 12 },
                  "load": { "type": "fixed", "value": 40, "unit": "kg" },
                  "rpe": { "type": "range", "min": 6, "max": 7 },
                  "rest_after": { "type": "fixed", "value": 90, "unit": "s" }
                }
              ]
            }
          ]
        },
        {
          "execution_mode": "SUPERSET",
          "rounds": { "type": "fixed", "value": 2 },
          "rest_after": { "type": "fixed", "value": 60, "unit": "s" },
          "exercises": [
            {
              "exercise_id": "lat_pulldown",
              "sets": [
                {
                  "dimensions": ["reps", "load"],
                  "reps": { "type": "range", "min": 10, "max": 15 },
                  "load": { "type": "fixed", "value": 30, "unit": "kg" },
                  "rpe": { "type": "range", "min": 6, "max": 7 }
                }
              ]
            },
            {
              "exercise_id": "dumbbell_shoulder_press",
              "sets": [
                {
                  "dimensions": ["reps", "load"],
                  "reps": { "type": "range", "min": 10, "max": 15 },
                  "load": { "type": "fixed", "value": 10, "unit": "kg" },
                  "rpe": { "type": "range", "min": 6, "max": 7 }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Cool-down",
      "series": [
        {
          "execution_mode": "SEQUENTIAL",
          "exercises": [
            {
              "name": "Easy walk",
              "sets": [
                {
                  "dimensions": ["duration"],
                  "duration": { "type": "fixed", "value": 5, "unit": "min" }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

This workout:

- Hits multiple major muscle groups with 2–4 sets of 8–15 reps.
- Uses **RPE 6–7** to capture moderate effort in a way that is compatible with ACSM’s intensity domains.
- Can be scheduled 2–3 times per week within a program to meet weekly resistance-training recommendations.

These examples are intentionally compact; real programs may add more exercises, phases, and population-specific extensions (see [Extensions](./extensions)) while keeping the same structural pattern.

## Periodization and macro/meso/micro cycles

ACSM’s **progression** principle assumes that training changes over **weeks and months**, not just inside one workout. OpenSet represents this progression using the existing document hierarchy:

- **Macrocycle** — A `Program` document describing the overall season or long-term plan (e.g. 12-week or 12-month plan).
- **Mesocycle** — `Phase` objects within a program (often 4–8 weeks each) with their own `goal`, `week_start`, and `week_end` fields (e.g. hypertrophy, strength, deload).
- **Microcycle** — Weekly patterns of `Workout`s inside a phase; each workout holds the detailed set prescriptions.

### Mapping ACSM-style progression to OpenSet

For resistance training, ACSM often describes progression across weeks, for example:

- Start with higher reps and moderate loads.
- Gradually increase load and reduce reps.
- Insert deload weeks when needed.

In OpenSet, this looks like:

- **Macrocycle** — A program-level goal (e.g. “increase strength over 12 weeks”) plus overall `duration`.
- **Mesocycle** — Phases such as `"Hypertrophy 1"`, `"Strength 1"`, `"Peaking"` with:
  - `goal`: phase focus.
  - `week_start` / `week_end`: the weeks this block covers.
  - Optional periodization extensions like `x_mesocycle_index`, `x_phase_type`, and `x_intensity_trend`.
- **Microcycle** — Individual workouts (e.g. `Push — Week 3`) with:
  - Optional extensions like `x_week_in_phase`, `x_day_in_microcycle`, and `x_split`.
  - Set-level changes over time (e.g. load and reps changing from week to week).

See the **Advanced Example — Periodized Strength Program** in [Examples](./examples) (`program-hypertrophy-strength-periodized.json`) for a complete JSON document that encodes multiple mesocycles and weekly progression.

### Example — Bench press mesocycle progression

The table below is a classic strength mesocycle (similar to what many coaches use):

| Week | Sets × Reps | Load |
|------|-------------|------|
| 1 | 4×10 | 70 kg |
| 2 | 4×9 | 72.5 kg |
| 3 | 4×8 | 75 kg |
| 4 | 5×6 | 80 kg |
| 5 | 5×5 | 85 kg |

Here is how you might encode those five weeks of bench press in a single `Phase` using five separate push-day workouts, each tagged with its week in the phase:

```json
{
  "name": "Hypertrophy → Strength Bench Mesocycle",
  "week_start": 1,
  "week_end": 5,
  "x_mesocycle_index": 1,
  "x_phase_type": "hypertrophy",
  "workouts": [
    {
      "name": "Push — Week 1",
      "x_week_in_phase": 1,
      "x_day_in_microcycle": 1,
      "x_split": "push",
      "blocks": [
        {
          "name": "Main Work",
          "series": [
            {
              "execution_mode": "SEQUENTIAL",
              "exercises": [
                {
                  "exercise_id": "bench_press",
                  "sets": [
                    { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 70, "unit": "kg" } },
                    { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 70, "unit": "kg" } },
                    { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 70, "unit": "kg" } },
                    { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 70, "unit": "kg" } }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Push — Week 2",
      "x_week_in_phase": 2,
      "x_day_in_microcycle": 1,
      "x_split": "push",
      "blocks": [
        {
          "name": "Main Work",
          "series": [
            {
              "execution_mode": "SEQUENTIAL",
              "exercises": [
                {
                  "exercise_id": "bench_press",
                  "sets": [
                    { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 9 }, "load": { "type": "fixed", "value": 72.5, "unit": "kg" } },
                    { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 9 }, "load": { "type": "fixed", "value": 72.5, "unit": "kg" } },
                    { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 9 }, "load": { "type": "fixed", "value": 72.5, "unit": "kg" } },
                    { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 9 }, "load": { "type": "fixed", "value": 72.5, "unit": "kg" } }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

Subsequent weeks (3–5) follow the same pattern, with updated `reps` and `load` to reflect the mesocycle progression. Apps can use:

- `x_week_in_phase` and `x_day_in_microcycle` to group workouts into microcycles.
- `week_start` / `week_end`, `x_phase_type`, and `x_intensity_trend` to visualize mesocycles across the macrocycle.


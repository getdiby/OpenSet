---
title: Examples
---

# Examples

The repository includes example documents demonstrating different use cases. All examples validate cleanly with zero errors.

## Minimal Workout

The smallest valid OpenSet workout:

```json
{
  "openset_version": "1.0",
  "type": "workout",
  "blocks": [
    {
      "series": [
        {
          "execution_mode": "SEQUENTIAL",
          "exercises": [
            {
              "name": "Push-ups",
              "sets": [
                {
                  "dimensions": ["reps"],
                  "reps": { "type": "fixed", "value": 20 }
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

---

## Workout Examples

### Upper Body — Push/Pull

Push/pull upper body workout demonstrating **CIRCUIT** and **CLUSTER** execution modes with groups and rest precedence.

<details>
<summary><code>strength-upper-body.json</code></summary>

```json
{
  "openset_version": "1.0",
  "type": "workout",
  "name": "Upper Body — Push/Pull",
  "date": "2026-02-17",
  "sports": ["strength"],
  "blocks": [
    {
      "name": "Block A",
      "series": [
        {
          "execution_mode": "CIRCUIT",
          "rounds": { "type": "fixed", "value": 3 },
          "exercises": [
            {
              "exercise_id": "incline_bench_press",
              "sets": [
                {
                  "dimensions": ["reps", "load"],
                  "reps": { "type": "fixed", "value": 15 },
                  "load": { "type": "fixed", "value": 20, "unit": "kg" },
                  "note": "add barbell weight to load"
                },
                {
                  "dimensions": ["reps", "load"],
                  "reps": { "type": "fixed", "value": 12 },
                  "load": { "type": "fixed", "value": 25, "unit": "kg" },
                  "note": "add barbell weight to load"
                },
                {
                  "dimensions": ["reps", "load"],
                  "reps": { "type": "range", "min": 8, "max": 10 },
                  "load": { "type": "fixed", "value": 25, "unit": "kg" },
                  "note": "add barbell weight to load"
                }
              ]
            },
            {
              "exercise_id": "pull_up",
              "sets": [
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Block B",
      "series": [
        {
          "execution_mode": "CLUSTER",
          "rounds": { "type": "fixed", "value": 3 },
          "note": "Pair A back to back, then 30s, then Pair B, then 120s",
          "exercises": [
            {
              "exercise_id": "pull_up",
              "group": "pair_a",
              "sets": [
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 15 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 12 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 8 } }
              ]
            },
            {
              "exercise_id": "decline_push_up",
              "group": "pair_a",
              "sets": [
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 32 }, "rest_after": { "type": "fixed", "value": 30, "unit": "s" } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 26 }, "rest_after": { "type": "fixed", "value": 30, "unit": "s" } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 19 }, "rest_after": { "type": "fixed", "value": 30, "unit": "s" } }
              ]
            },
            {
              "exercise_id": "pull_up",
              "group": "pair_b",
              "sets": [
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 7 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 7 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 5 } }
              ]
            },
            {
              "exercise_id": "decline_push_up",
              "group": "pair_b",
              "sets": [
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 14 }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 14 }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 11 }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Core",
      "series": [
        {
          "execution_mode": "CIRCUIT",
          "rounds": { "type": "fixed", "value": 1 },
          "exercises": [
            {
              "exercise_id": "leg_raise",
              "sets": [{ "dimensions": ["reps"], "reps": { "type": "fixed", "value": 20 } }]
            },
            {
              "exercise_id": "crunch",
              "sets": [{ "dimensions": ["reps"], "reps": { "type": "fixed", "value": 20 } }]
            },
            {
              "exercise_id": "sit_up",
              "sets": [{ "dimensions": ["reps"], "reps": { "type": "fixed", "value": 20 } }]
            }
          ]
        }
      ]
    }
  ]
}
```

</details>

### Lower Body — Squat & Hinge

Squat and hinge focused workout demonstrating **SEQUENTIAL**, **SUPERSET**, RPE scaling, and per-side work.

<details>
<summary><code>strength-lower-body.json</code></summary>

```json
{
  "openset_version": "1.0",
  "type": "workout",
  "name": "Lower Body — Squat & Hinge",
  "date": "2026-02-18",
  "sports": ["strength"],
  "blocks": [
    {
      "name": "Warm-up",
      "series": [
        {
          "execution_mode": "SEQUENTIAL",
          "exercises": [
            {
              "exercise_id": "wall_sit",
              "sets": [
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 30, "unit": "s" } },
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 45, "unit": "s" } }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Main Lifts",
      "series": [
        {
          "execution_mode": "SEQUENTIAL",
          "exercises": [
            {
              "exercise_id": "back_squat",
              "sets": [
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 100, "unit": "kg" }, "rpe": { "type": "fixed", "value": 7 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 110, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 3 }, "load": { "type": "fixed", "value": 120, "unit": "kg" }, "rpe": { "type": "fixed", "value": 9 }, "rest_after": { "type": "fixed", "value": 240, "unit": "s" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 3 }, "load": { "type": "fixed", "value": 125, "unit": "kg" }, "rpe": { "type": "fixed", "value": 9 }, "rest_after": { "type": "fixed", "value": 240, "unit": "s" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 3 }, "load": { "type": "fixed", "value": 130, "unit": "kg" }, "rpe": { "type": "max" } }
              ]
            }
          ]
        },
        {
          "execution_mode": "SEQUENTIAL",
          "exercises": [
            {
              "exercise_id": "romanian_deadlift",
              "sets": [
                { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 8, "max": 12 }, "load": { "type": "fixed", "value": 80, "unit": "kg" }, "rpe": { "type": "fixed", "value": 7 }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 8, "max": 12 }, "load": { "type": "fixed", "value": 80, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 8, "max": 12 }, "load": { "type": "fixed", "value": 80, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 } }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Accessories",
      "series": [
        {
          "execution_mode": "SUPERSET",
          "rounds": { "type": "fixed", "value": 3 },
          "rest_after": { "type": "fixed", "value": 90, "unit": "s" },
          "exercises": [
            {
              "exercise_id": "bulgarian_split_squat",
              "sets": [
                { "dimensions": ["reps", "sides"], "reps": { "type": "fixed", "value": 10 }, "sides": { "type": "fixed", "value": 2 }, "load": { "type": "fixed", "value": 16, "unit": "kg" } },
                { "dimensions": ["reps", "sides"], "reps": { "type": "fixed", "value": 10 }, "sides": { "type": "fixed", "value": 2 }, "load": { "type": "fixed", "value": 16, "unit": "kg" } },
                { "dimensions": ["reps", "sides"], "reps": { "type": "fixed", "value": 10 }, "sides": { "type": "fixed", "value": 2 }, "load": { "type": "fixed", "value": 16, "unit": "kg" } }
              ]
            },
            {
              "exercise_id": "leg_curl",
              "sets": [
                { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 10, "max": 15 }, "load": { "type": "fixed", "value": 40, "unit": "kg" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 10, "max": 15 }, "load": { "type": "fixed", "value": 40, "unit": "kg" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 10, "max": 15 }, "load": { "type": "fixed", "value": 40, "unit": "kg" } }
              ]
            }
          ]
        },
        {
          "execution_mode": "SEQUENTIAL",
          "exercises": [
            {
              "exercise_id": "single_leg_calf_raise_elevated",
              "sets": [
                { "dimensions": ["reps", "sides"], "reps": { "type": "fixed", "value": 15 }, "sides": { "type": "fixed", "value": 2 }, "rest_after": { "type": "fixed", "value": 60, "unit": "s" } },
                { "dimensions": ["reps", "sides"], "reps": { "type": "fixed", "value": 15 }, "sides": { "type": "fixed", "value": 2 }, "rest_after": { "type": "fixed", "value": 60, "unit": "s" } },
                { "dimensions": ["reps", "sides"], "reps": { "type": "fixed", "value": 15 }, "sides": { "type": "fixed", "value": 2 } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

</details>

### Full Body Conditioning Circuit

Full body conditioning demonstrating **AMRAP**, **FOR_TIME**, **TABATA**, and calories as a dimension.

<details>
<summary><code>conditioning-circuit.json</code></summary>

```json
{
  "openset_version": "1.0",
  "type": "workout",
  "name": "Full Body Conditioning Circuit",
  "date": "2026-02-19",
  "sports": ["general_fitness"],
  "blocks": [
    {
      "name": "AMRAP Block",
      "series": [
        {
          "execution_mode": "AMRAP",
          "rounds": { "type": "amrap" },
          "note": "12 minute AMRAP — as many rounds as possible",
          "exercises": [
            {
              "exercise_id": "push_up",
              "sets": [
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 15 } }
              ]
            },
            {
              "exercise_id": "back_squat",
              "note": "Use empty barbell or light load",
              "sets": [
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 15 }, "load": { "type": "fixed", "value": 20, "unit": "kg" } }
              ]
            },
            {
              "exercise_id": "row_ergometer",
              "sets": [
                { "dimensions": ["calories"], "calories": { "type": "fixed", "value": 15 } }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "For Time",
      "series": [
        {
          "execution_mode": "FOR_TIME",
          "rounds": { "type": "fixed", "value": 3 },
          "note": "Complete 3 rounds as fast as possible",
          "exercises": [
            {
              "exercise_id": "run",
              "sets": [
                { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 400, "unit": "m" } },
                { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 400, "unit": "m" } },
                { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 400, "unit": "m" } }
              ]
            },
            {
              "exercise_id": "box_jump",
              "sets": [
                { "dimensions": ["reps", "height"], "reps": { "type": "fixed", "value": 15 }, "height": { "type": "fixed", "value": 60, "unit": "cm" } },
                { "dimensions": ["reps", "height"], "reps": { "type": "fixed", "value": 15 }, "height": { "type": "fixed", "value": 60, "unit": "cm" } },
                { "dimensions": ["reps", "height"], "reps": { "type": "fixed", "value": 15 }, "height": { "type": "fixed", "value": 60, "unit": "cm" } }
              ]
            },
            {
              "exercise_id": "pull_up",
              "sets": [
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Tabata Finisher",
      "series": [
        {
          "execution_mode": "TABATA",
          "rounds": { "type": "fixed", "value": 8 },
          "exercises": [
            {
              "exercise_id": "assault_bike",
              "sets": [
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 20, "unit": "s" }, "rest_after": { "type": "fixed", "value": 10, "unit": "s" }, "rpe": { "type": "max" } },
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 20, "unit": "s" }, "rest_after": { "type": "fixed", "value": 10, "unit": "s" }, "rpe": { "type": "max" } },
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 20, "unit": "s" }, "rest_after": { "type": "fixed", "value": 10, "unit": "s" }, "rpe": { "type": "max" } },
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 20, "unit": "s" }, "rest_after": { "type": "fixed", "value": 10, "unit": "s" }, "rpe": { "type": "max" } },
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 20, "unit": "s" }, "rest_after": { "type": "fixed", "value": 10, "unit": "s" }, "rpe": { "type": "max" } },
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 20, "unit": "s" }, "rest_after": { "type": "fixed", "value": 10, "unit": "s" }, "rpe": { "type": "max" } },
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 20, "unit": "s" }, "rest_after": { "type": "fixed", "value": 10, "unit": "s" }, "rpe": { "type": "max" } },
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 20, "unit": "s" }, "rpe": { "type": "max" } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

</details>

### Threshold Intervals — 6x1km

Endurance running workout demonstrating **INTERVAL** mode with pace targets, heart rate zones, and distance dimensions.

<details>
<summary><code>endurance-run.json</code></summary>

```json
{
  "openset_version": "1.0",
  "type": "workout",
  "name": "Threshold Intervals — 6×1km",
  "date": "2026-02-20",
  "sports": ["running"],
  "blocks": [
    {
      "name": "Warm-up",
      "series": [
        {
          "execution_mode": "SEQUENTIAL",
          "exercises": [
            {
              "exercise_id": "run",
              "note": "Easy jog to warm up",
              "sets": [
                {
                  "dimensions": ["duration"],
                  "duration": { "type": "fixed", "value": 600, "unit": "s" },
                  "heart_rate_zone": { "type": "fixed", "value": 2 }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Intervals",
      "series": [
        {
          "execution_mode": "INTERVAL",
          "rounds": { "type": "fixed", "value": 6 },
          "exercises": [
            {
              "exercise_id": "run",
              "note": "6 × 1km at threshold pace. HR ceiling 175bpm — if exceeded, reduce pace.",
              "sets": [
                {
                  "dimensions": ["distance"],
                  "distance": { "type": "fixed", "value": 1, "unit": "km" },
                  "pace": { "type": "range", "min": 3.8, "max": 4.0, "unit": "min/km" },
                  "heart_rate": { "type": "max" },
                  "rest_after": { "type": "fixed", "value": 90, "unit": "s" }
                },
                {
                  "dimensions": ["distance"],
                  "distance": { "type": "fixed", "value": 1, "unit": "km" },
                  "pace": { "type": "range", "min": 3.8, "max": 4.0, "unit": "min/km" },
                  "heart_rate": { "type": "max" },
                  "rest_after": { "type": "fixed", "value": 90, "unit": "s" }
                },
                {
                  "dimensions": ["distance"],
                  "distance": { "type": "fixed", "value": 1, "unit": "km" },
                  "pace": { "type": "range", "min": 3.8, "max": 4.0, "unit": "min/km" },
                  "heart_rate": { "type": "max" },
                  "rest_after": { "type": "fixed", "value": 90, "unit": "s" }
                },
                {
                  "dimensions": ["distance"],
                  "distance": { "type": "fixed", "value": 1, "unit": "km" },
                  "pace": { "type": "range", "min": 3.8, "max": 4.0, "unit": "min/km" },
                  "heart_rate": { "type": "max" },
                  "rest_after": { "type": "fixed", "value": 90, "unit": "s" }
                },
                {
                  "dimensions": ["distance"],
                  "distance": { "type": "fixed", "value": 1, "unit": "km" },
                  "pace": { "type": "range", "min": 3.8, "max": 4.0, "unit": "min/km" },
                  "heart_rate": { "type": "max" },
                  "rest_after": { "type": "fixed", "value": 90, "unit": "s" }
                },
                {
                  "dimensions": ["distance"],
                  "distance": { "type": "fixed", "value": 1, "unit": "km" },
                  "pace": { "type": "range", "min": 3.8, "max": 4.0, "unit": "min/km" },
                  "heart_rate": { "type": "max" }
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
              "exercise_id": "run",
              "note": "Easy jog cool-down",
              "sets": [
                {
                  "dimensions": ["duration"],
                  "duration": { "type": "fixed", "value": 600, "unit": "s" },
                  "heart_rate_zone": { "type": "fixed", "value": 1 }
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

</details>

### Mixed Modal — Strength + Conditioning

Combination workout demonstrating **EMOM**, **LADDER**, 1RM testing with `"load": { "type": "max" }`, and distance/duration dimensions.

<details>
<summary><code>mixed-workout.json</code></summary>

```json
{
  "openset_version": "1.0",
  "type": "workout",
  "name": "Mixed Modal — Strength + Conditioning",
  "date": "2026-02-21",
  "sports": ["crossfit"],
  "blocks": [
    {
      "name": "Strength",
      "series": [
        {
          "execution_mode": "SEQUENTIAL",
          "exercises": [
            {
              "exercise_id": "deadlift",
              "sets": [
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 140, "unit": "kg" }, "rpe": { "type": "fixed", "value": 7 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 3 }, "load": { "type": "fixed", "value": 160, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 }, "rest_after": { "type": "fixed", "value": 240, "unit": "s" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 1 }, "load": { "type": "max" }, "note": "Test 1RM" }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "EMOM Conditioning",
      "series": [
        {
          "execution_mode": "EMOM",
          "rounds": { "type": "fixed", "value": 10 },
          "note": "Alternating minutes — odd = work, even = recovery",
          "exercises": [
            {
              "exercise_id": "row_ergometer",
              "note": "Odd minutes — row hard",
              "sets": [
                { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 200, "unit": "m" } },
                { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 200, "unit": "m" } },
                { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 200, "unit": "m" } },
                { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 200, "unit": "m" } },
                { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 200, "unit": "m" } }
              ]
            },
            {
              "exercise_id": "jump_rope",
              "note": "Even minutes — easy pace, full minute",
              "sets": [
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 60, "unit": "s" }, "rpe": { "type": "fixed", "value": 3 } },
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 60, "unit": "s" }, "rpe": { "type": "fixed", "value": 3 } },
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 60, "unit": "s" }, "rpe": { "type": "fixed", "value": 3 } },
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 60, "unit": "s" }, "rpe": { "type": "fixed", "value": 3 } },
                { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 60, "unit": "s" }, "rpe": { "type": "fixed", "value": 3 } }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Ladder Finisher",
      "series": [
        {
          "execution_mode": "LADDER",
          "rest_after": { "type": "fixed", "value": 60, "unit": "s" },
          "exercises": [
            {
              "exercise_id": "push_up",
              "note": "Ascending then descending ladder",
              "sets": [
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 5 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 15 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 20 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 15 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } },
                { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 5 } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

</details>

---

## Program Example

### 4-Week Strength Foundation

Multi-phase program demonstrating progressive overload across two phases with **SEQUENTIAL** and **SUPERSET** execution modes.

<details>
<summary><code>full-program.json</code></summary>

```json
{
  "openset_version": "1.0",
  "type": "program",
  "name": "4-Week Strength Foundation",
  "description": "A beginner-friendly 4-week program focusing on compound movements with progressive overload.",
  "sports": ["strength"],
  "duration_weeks": 4,
  "author": "OpenSet",
  "phases": [
    {
      "name": "Phase 1 — Base Building",
      "week_start": 1,
      "week_end": 2,
      "goal": "Build movement quality and work capacity with moderate loads",
      "workouts": [
        {
          "name": "Day 1 — Upper Body",
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
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 60, "unit": "kg" }, "rpe": { "type": "fixed", "value": 7 }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 60, "unit": "kg" }, "rpe": { "type": "fixed", "value": 7 }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 60, "unit": "kg" }, "rpe": { "type": "fixed", "value": 7 } }
                      ]
                    },
                    {
                      "exercise_id": "seated_row",
                      "sets": [
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 50, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 50, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 50, "unit": "kg" } }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "name": "Accessories",
              "series": [
                {
                  "execution_mode": "SUPERSET",
                  "rounds": { "type": "fixed", "value": 3 },
                  "rest_after": { "type": "fixed", "value": 60, "unit": "s" },
                  "exercises": [
                    {
                      "exercise_id": "triceps_cable_pushdown",
                      "sets": [
                        { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 12, "max": 15 }, "load": { "type": "fixed", "value": 20, "unit": "kg" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 12, "max": 15 }, "load": { "type": "fixed", "value": 20, "unit": "kg" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 12, "max": 15 }, "load": { "type": "fixed", "value": 20, "unit": "kg" } }
                      ]
                    },
                    {
                      "exercise_id": "bicep_curl",
                      "sets": [
                        { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 12, "max": 15 }, "load": { "type": "fixed", "value": 10, "unit": "kg" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 12, "max": 15 }, "load": { "type": "fixed", "value": 10, "unit": "kg" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 12, "max": 15 }, "load": { "type": "fixed", "value": 10, "unit": "kg" } }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "Day 2 — Lower Body",
          "blocks": [
            {
              "name": "Main Work",
              "series": [
                {
                  "execution_mode": "SEQUENTIAL",
                  "exercises": [
                    {
                      "exercise_id": "back_squat",
                      "sets": [
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" }, "rpe": { "type": "fixed", "value": 7 }, "rest_after": { "type": "fixed", "value": 150, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" }, "rpe": { "type": "fixed", "value": 7 }, "rest_after": { "type": "fixed", "value": 150, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" }, "rpe": { "type": "fixed", "value": 7 } }
                      ]
                    },
                    {
                      "exercise_id": "hip_thrust",
                      "sets": [
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 60, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 60, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 60, "unit": "kg" } }
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
      "name": "Phase 2 — Intensification",
      "week_start": 3,
      "week_end": 4,
      "goal": "Increase intensity with heavier loads and lower rep ranges",
      "workouts": [
        {
          "name": "Day 1 — Upper Body",
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
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 70, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 70, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 70, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 70, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 70, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 } }
                      ]
                    },
                    {
                      "exercise_id": "lat_pulldown",
                      "sets": [
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 55, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 55, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 55, "unit": "kg" } }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "Day 2 — Lower Body",
          "blocks": [
            {
              "name": "Main Work",
              "series": [
                {
                  "execution_mode": "SEQUENTIAL",
                  "exercises": [
                    {
                      "exercise_id": "back_squat",
                      "sets": [
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 90, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 90, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 90, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 } }
                      ]
                    },
                    {
                      "exercise_id": "deadlift",
                      "sets": [
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 120, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 120, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
                        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 120, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 } }
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

</details>

---

## Workout Library Example

### Example Workout Library

Reusable workout template collection demonstrating library metadata, media attachments, **SUPERSET**, **INTERVAL**, and AMRAP sets.

<details>
<summary><code>workout-library.json</code></summary>

```json
{
  "openset_version": "1.0",
  "type": "workout_library",
  "id": "example-workout-library",
  "name": "Example Workout Library",
  "version": "1.0.0",
  "provider": "openset",
  "license": "MIT",
  "workouts": [
    {
      "id": "upper_body_push",
      "name": "Upper Body Push",
      "description": "Horizontal and vertical pressing with triceps accessories",
      "tags": ["upper_body", "push", "strength"],
      "level": "intermediate",
      "estimated_duration_min": 60,
      "sports": ["strength"],
      "library": { "id": "openset-default", "version": "1.0.0" },
      "media": {
        "videos": [
          { "url": "https://example.com/videos/upper-body-push.mp4", "label": "Workout walkthrough" }
        ],
        "photos": [
          { "url": "https://example.com/photos/upper-body-push.jpg", "label": "Workout thumbnail" }
        ]
      },
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
                    { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 100, "unit": "kg" } },
                    { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 100, "unit": "kg" } },
                    { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 100, "unit": "kg" } },
                    { "dimensions": ["reps", "load", "rpe"], "reps": { "type": "amrap" }, "load": { "type": "fixed", "value": 100, "unit": "kg" }, "rpe": { "type": "fixed", "value": 9 } }
                  ]
                },
                {
                  "exercise_id": "overhead_press",
                  "sets": [
                    { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 8, "max": 12 }, "load": { "type": "fixed", "value": 50, "unit": "kg" } },
                    { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 8, "max": 12 }, "load": { "type": "fixed", "value": 50, "unit": "kg" } },
                    { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 8, "max": 12 }, "load": { "type": "fixed", "value": 50, "unit": "kg" } }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "Accessories",
          "series": [
            {
              "execution_mode": "SUPERSET",
              "rounds": { "type": "fixed", "value": 3 },
              "rest_after": { "type": "fixed", "value": 90, "unit": "s" },
              "exercises": [
                {
                  "exercise_id": "dip",
                  "sets": [
                    { "dimensions": ["reps"], "reps": { "type": "range", "min": 10, "max": 15 } },
                    { "dimensions": ["reps"], "reps": { "type": "range", "min": 10, "max": 15 } },
                    { "dimensions": ["reps"], "reps": { "type": "range", "min": 10, "max": 15 } }
                  ]
                },
                {
                  "exercise_id": "triceps_cable_pushdown",
                  "sets": [
                    { "dimensions": ["reps"], "reps": { "type": "range", "min": 12, "max": 15 } },
                    { "dimensions": ["reps"], "reps": { "type": "range", "min": 12, "max": 15 } },
                    { "dimensions": ["reps"], "reps": { "type": "range", "min": 12, "max": 15 } }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "cardio_intervals",
      "name": "Cardio Intervals",
      "description": "High-intensity interval training on assault bike and rower",
      "tags": ["cardio", "hiit", "conditioning"],
      "level": "intermediate",
      "estimated_duration_min": 30,
      "sports": ["crossfit"],
      "blocks": [
        {
          "name": "Intervals",
          "series": [
            {
              "execution_mode": "INTERVAL",
              "rounds": { "type": "fixed", "value": 8 },
              "exercises": [
                {
                  "exercise_id": "assault_bike",
                  "sets": [
                    { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 30, "unit": "s" } },
                    { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 30, "unit": "s" } },
                    { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 30, "unit": "s" } },
                    { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 30, "unit": "s" } },
                    { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 30, "unit": "s" } },
                    { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 30, "unit": "s" } },
                    { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 30, "unit": "s" } },
                    { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 30, "unit": "s" } }
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

</details>

---

## Validating Examples

All examples validate cleanly with zero errors:

```bash
npx openset validate ./examples/strength-upper-body.json --summary
```

```
openset_version: 1.0
type: workout
2 blocks, 4 series, 8 exercises, 16 sets

Result: VALID
```

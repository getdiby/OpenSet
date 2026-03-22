---
title: Execution Modes
description: Series-level execution modes — SEQUENTIAL, SUPERSET, CIRCUIT, AMRAP, FOR_TIME, INTERVAL, TABATA, EMOM, LADDER, CLUSTER. When to use each.
keywords: [OpenSet, execution modes, SUPERSET, AMRAP, CIRCUIT, EMOM, TABATA]
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

## SEQUENTIAL

The default mode. Complete all sets of exercise A, then all sets of exercise B.

**Use for:** Traditional strength training, warm-ups, accessory work.

```json
{
  "execution_mode": "SEQUENTIAL",
  "exercises": [
    {
      "exercise_id": "back_squat",
      "sets": [
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 100, "unit": "kg" }, "rpe": { "type": "fixed", "value": 7 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 110, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 3 }, "load": { "type": "fixed", "value": 120, "unit": "kg" }, "rpe": { "type": "fixed", "value": 9 } }
      ]
    },
    {
      "exercise_id": "romanian_deadlift",
      "sets": [
        { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 8, "max": 12 }, "load": { "type": "fixed", "value": 80, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 8, "max": 12 }, "load": { "type": "fixed", "value": 80, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "range", "min": 8, "max": 12 }, "load": { "type": "fixed", "value": 80, "unit": "kg" } }
      ]
    }
  ]
}
```

## CIRCUIT

Cycle through exercises round-robin — one set of each exercise per round, then repeat. The `rounds` field on the series controls how many times to cycle through.

**Use for:** General conditioning, metabolic training, group classes.

```json
{
  "execution_mode": "CIRCUIT",
  "rounds": { "type": "fixed", "value": 3 },
  "exercises": [
    {
      "exercise_id": "push_up",
      "sets": [
        { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 15 } },
        { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 15 } },
        { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 15 } }
      ]
    },
    {
      "exercise_id": "back_squat",
      "sets": [
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 12 }, "load": { "type": "fixed", "value": 40, "unit": "kg" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 12 }, "load": { "type": "fixed", "value": 40, "unit": "kg" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 12 }, "load": { "type": "fixed", "value": 40, "unit": "kg" } }
      ]
    },
    {
      "exercise_id": "plank",
      "sets": [
        { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 45, "unit": "s" } },
        { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 45, "unit": "s" } },
        { "dimensions": ["duration"], "duration": { "type": "fixed", "value": 45, "unit": "s" } }
      ]
    }
  ]
}
```

## SUPERSET

Two (or more) exercises performed back to back with minimal rest between them. Rest typically comes after completing one round of all exercises. The `rounds` field controls how many times to repeat.

**Use for:** Antagonist pairings (push/pull), time-efficient hypertrophy, pre-exhaust protocols.

```json
{
  "execution_mode": "SUPERSET",
  "rounds": { "type": "fixed", "value": 3 },
  "rest_after": { "type": "fixed", "value": 90, "unit": "s" },
  "exercises": [
    {
      "exercise_id": "bench_press",
      "sets": [
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" } }
      ]
    },
    {
      "exercise_id": "seated_row",
      "sets": [
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 60, "unit": "kg" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 60, "unit": "kg" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 60, "unit": "kg" } }
      ]
    }
  ]
}
```

## AMRAP

As many rounds as possible within a time cap. The athlete cycles through the exercises continuously, logging how many full rounds they complete.

**Use for:** CrossFit-style conditioning, testing work capacity, time-capped efforts.

```json
{
  "execution_mode": "AMRAP",
  "rounds": { "type": "amrap" },
  "note": "12 minute AMRAP",
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
      "exercise_id": "rowing_machine",
      "sets": [
        { "dimensions": ["calories"], "calories": { "type": "fixed", "value": 15 } }
      ]
    }
  ]
}
```

## FOR_TIME

Complete the prescribed work as fast as possible. The athlete performs all rounds and exercises, and the score is total time elapsed.

**Use for:** CrossFit WODs, competitive conditioning, timed challenges.

```json
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
```

## INTERVAL

Repeating work/rest structure. Each exercise represents one interval, and `rounds` controls how many times the full sequence repeats. Rest between intervals is modeled with `rest_after` on individual sets.

**Use for:** Running intervals, rowing repeats, cycling efforts, sport-specific conditioning.

```json
{
  "execution_mode": "INTERVAL",
  "rounds": { "type": "fixed", "value": 6 },
  "exercises": [
    {
      "exercise_id": "run",
      "note": "6 x 1km at threshold pace with 90s recovery",
      "sets": [
        { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 1, "unit": "km" }, "pace": { "type": "range", "min": 3.8, "max": 4.0, "unit": "min/km" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
        { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 1, "unit": "km" }, "pace": { "type": "range", "min": 3.8, "max": 4.0, "unit": "min/km" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
        { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 1, "unit": "km" }, "pace": { "type": "range", "min": 3.8, "max": 4.0, "unit": "min/km" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
        { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 1, "unit": "km" }, "pace": { "type": "range", "min": 3.8, "max": 4.0, "unit": "min/km" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
        { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 1, "unit": "km" }, "pace": { "type": "range", "min": 3.8, "max": 4.0, "unit": "min/km" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
        { "dimensions": ["distance"], "distance": { "type": "fixed", "value": 1, "unit": "km" }, "pace": { "type": "range", "min": 3.8, "max": 4.0, "unit": "min/km" } }
      ]
    }
  ]
}
```

## TABATA

20 seconds of work followed by 10 seconds of rest, repeated for 8 rounds (4 minutes total). A standardized high-intensity interval protocol. Rest between work intervals is modeled with `rest_after` on each set (omitted on the last round).

**Use for:** Sprint conditioning, metabolic finishers, cardio equipment intervals.

```json
{
  "execution_mode": "TABATA",
  "rounds": { "type": "fixed", "value": 8 },
  "exercises": [
    {
      "exercise_id": "stationary_bike",
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
```

*Note: `rpe` is optional here (an effort cue: "max"). Only **required** dimensions go in the `dimensions` array; see [Dimensions](./set-dimensions.md).*

## EMOM

Every Minute On the Minute. At the start of each minute, perform the prescribed work, then rest for the remainder. With multiple exercises, alternate them across minutes.

**Use for:** Skill practice under fatigue, pacing work, conditioning with built-in recovery.

```json
{
  "execution_mode": "EMOM",
  "rounds": { "type": "fixed", "value": 10 },
  "note": "Alternating minutes — odd = row, even = jump rope",
  "exercises": [
    {
      "exercise_id": "rowing_machine",
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
      "note": "Even minutes — easy pace",
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
```

## LADDER

Ascending, descending, or pyramid rep/load scheme. Each set explicitly states its prescription, allowing full flexibility in how the ladder progresses.

**Use for:** Rep ladders, ascending/descending schemes, wave loading, density work.

```json
{
  "execution_mode": "LADDER",
  "rest_after": { "type": "fixed", "value": 60, "unit": "s" },
  "exercises": [
    {
      "exercise_id": "push_up",
      "note": "Ascending then descending ladder: 5-10-15-20-15-10-5",
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
```

## CLUSTER

Sub-groups of exercises using the `group` field. Exercises within the same group are performed back-to-back, with rest between groups. This enables complex pairing strategies within a single series.

**Use for:** Complex training pairings, antagonist trisets, advanced programming with multiple sub-circuits.

```json
{
  "execution_mode": "CLUSTER",
  "rounds": { "type": "fixed", "value": 3 },
  "note": "Pair A back to back, then 30s rest, then Pair B, then 120s rest",
  "exercises": [
    {
      "exercise_id": "pull_up",
      "group": "pair_a",
      "sets": [
        { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } },
        { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } },
        { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 10 } }
      ]
    },
    {
      "exercise_id": "push_up",
      "group": "pair_a",
      "sets": [
        { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 20 }, "rest_after": { "type": "fixed", "value": 30, "unit": "s" } },
        { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 20 }, "rest_after": { "type": "fixed", "value": 30, "unit": "s" } },
        { "dimensions": ["reps"], "reps": { "type": "fixed", "value": 20 }, "rest_after": { "type": "fixed", "value": 30, "unit": "s" } }
      ]
    },
    {
      "exercise_id": "bicep_curl",
      "group": "pair_b",
      "sets": [
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 12 }, "load": { "type": "fixed", "value": 12, "unit": "kg" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 12 }, "load": { "type": "fixed", "value": 12, "unit": "kg" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 12 }, "load": { "type": "fixed", "value": 12, "unit": "kg" } }
      ]
    },
    {
      "exercise_id": "tricep_pushdown",
      "group": "pair_b",
      "sets": [
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 15 }, "load": { "type": "fixed", "value": 20, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 15 }, "load": { "type": "fixed", "value": 20, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 15 }, "load": { "type": "fixed", "value": 20, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } }
      ]
    }
  ]
}
```

---

## Common Training Patterns

Some popular training patterns don't need their own execution mode — they are naturally expressed through per-set variation within the existing modes.

### Drop Set

A drop set is a single exercise where the load decreases each set while reps stay the same (or increase). The key characteristic is **no rest between sets** — the athlete reduces the weight immediately.

Some systems use a dedicated DROPSET type; in OpenSet this is expressed as a `SEQUENTIAL` series with decreasing `load` values and zero or minimal `rest_after`:

```json
{
  "execution_mode": "SEQUENTIAL",
  "exercises": [
    {
      "exercise_id": "leg_extension",
      "note": "Drop set — strip weight immediately, no rest",
      "sets": [
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 60, "unit": "kg" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 45, "unit": "kg" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 30, "unit": "kg" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "amrap" }, "load": { "type": "fixed", "value": 20, "unit": "kg" }, "note": "Final drop — go to failure" }
      ]
    }
  ]
}
```

:::tip Why no `DROP_SET` mode?
A drop set is simply a loading pattern — sets with decreasing load. OpenSet's set-level granularity already captures this perfectly. Each set independently specifies its own `load` and `reps`. Adding a dedicated mode would be redundant and would reduce flexibility (e.g., you couldn't vary both load *and* reps across drops).
:::

### Pyramid Set

A pyramid combines ascending load (with decreasing reps) followed by descending load (with increasing reps). Like drop sets, this is just a per-set variation pattern.

**Ascending pyramid** (ramping up):

```json
{
  "execution_mode": "SEQUENTIAL",
  "exercises": [
    {
      "exercise_id": "bench_press",
      "note": "Ascending pyramid — increase load, decrease reps",
      "sets": [
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 12 }, "load": { "type": "fixed", "value": 60, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 10 }, "load": { "type": "fixed", "value": 70, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 150, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 6 }, "load": { "type": "fixed", "value": 90, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 3 }, "load": { "type": "fixed", "value": 100, "unit": "kg" } }
      ]
    }
  ]
}
```

**Full pyramid** (up and back down):

```json
{
  "execution_mode": "SEQUENTIAL",
  "exercises": [
    {
      "exercise_id": "back_squat",
      "note": "Full pyramid — ramp up then back down",
      "sets": [
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 12 }, "load": { "type": "fixed", "value": 60, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 100, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 3 }, "load": { "type": "fixed", "value": 110, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" }, "note": "Top set" },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 100, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 120, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 80, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 90, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 12 }, "load": { "type": "fixed", "value": 60, "unit": "kg" } }
      ]
    }
  ]
}
```

:::tip Why no `PYRAMID` mode?
For the same reason as drop sets — a pyramid is a loading/rep pattern, not an exercise flow pattern. OpenSet models **how exercises flow** (execution modes) separately from **what each set prescribes** (set-level dimensions). This keeps the mode list small and composable. You can even combine pyramids with other modes — e.g., a pyramid inside a `SUPERSET` by varying the sets of each paired exercise.
:::

### Reverse Pyramid (RPT)

Start with the heaviest set first (when you're freshest), then reduce load and increase reps:

```json
{
  "execution_mode": "SEQUENTIAL",
  "exercises": [
    {
      "exercise_id": "overhead_press",
      "note": "Reverse pyramid — heaviest set first",
      "sets": [
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 60, "unit": "kg" }, "rpe": { "type": "fixed", "value": 9 }, "rest_after": { "type": "fixed", "value": 180, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 8 }, "load": { "type": "fixed", "value": 52, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 }, "rest_after": { "type": "fixed", "value": 150, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 12 }, "load": { "type": "fixed", "value": 45, "unit": "kg" }, "rpe": { "type": "fixed", "value": 8 } }
      ]
    }
  ]
}
```

### Myo Set (Rest-Pause)

A myo set (rest-pause set) is a cluster of short sets on the **same exercise**, separated by very short rests (e.g. 10–20 seconds). The athlete performs an initial near-failure set, rests briefly, then performs several mini-sets.

Model this as a `SEQUENTIAL` series with small sets and short `rest_after` between them:

```json
{
  "execution_mode": "SEQUENTIAL",
  "exercises": [
    {
      "exercise_id": "bench_press",
      "note": "Myo set — 1 main set, then short rest-pause clusters",
      "sets": [
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 12 }, "load": { "type": "fixed", "value": 60, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 20, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 4 },  "load": { "type": "fixed", "value": 60, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 20, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 4 },  "load": { "type": "fixed", "value": 60, "unit": "kg" }, "rest_after": { "type": "fixed", "value": 20, "unit": "s" } },
        { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 4 },  "load": { "type": "fixed", "value": 60, "unit": "kg" } }
      ]
    }
  ]
}
```

No special execution mode is needed — the pattern comes from **per-set reps, load, and rest**, the same way as drop sets and pyramids.

---
title: Exercises
sidebar_label: Exercises
description: OpenSet canonical exercise library (openset-default), exercise definitions, and how to reference exercises by ID in workouts.
keywords: [OpenSet, exercise library, exercises, openset-default, exercise_id]
---

# Exercise Library

OpenSet includes a canonical exercise library (`openset-default`) with 42 exercises under the MIT license. Exercise libraries are separate JSON documents that workouts and programs reference by ID.

## Library Document

Exercise libraries are validated against `exercise-library.schema.json`. A library document has these top-level fields:

| Field | Required | Description |
|-------|----------|-------------|
| `openset_version` | Yes | Spec version (e.g. `"1.0"`) |
| `type` | Yes | Must be `"exercise_library"` |
| `id` | Yes | Unique library identifier (e.g. `"openset-default"`) |
| `name` | Yes | Human-readable name |
| `version` | Yes | Library version string (e.g. `"1.0.0"`) |
| `provider` | Yes | Library author or organization |
| `license` | Yes | License identifier (e.g. `"MIT"`) |
| `exercises` | Yes | Array of exercise definitions |

## Exercise Definition

Each exercise in the `exercises` array is an object with the following fields:

### Required Fields

| Field | Description |
|-------|-------------|
| `id` | Snake_case identifier, unique within the library (e.g. `back_squat`) |
| `name` | Display name (e.g. "Back Squat") |
| `common_dimensions` | Array of typical dimension combinations (see below) |

### Classification Fields

| Field | Values | Description |
|-------|--------|-------------|
| `body_part` | `upper_body`, `lower_body`, `core`, `full_body`, `cardio` | Primary body region |
| `body_parts` | `string[]` | Optional finer taxonomy; use the [recommended vocabulary](#recommended-body-part-vocabulary) below for consistency. Secondary to `body_part` for apps that need muscle-group or region detail. |
| `category` | `push`, `pull`, `hinge`, `squat`, `carry`, `rotation`, `gait` | Movement pattern |
| `mechanic` | `compound`, `isolation` | Joint involvement |
| `laterality` | `bilateral`, `unilateral`, `alternating` | Side symmetry |
| `level` | `beginner`, `intermediate`, `advanced`, `elite` | Skill/strength prerequisite |

### Descriptive Fields

| Field | Type | Description |
|-------|------|-------------|
| `aliases` | `string[]` | Alternative names (e.g. `["RDL"]` for Romanian Deadlift) |
| `description` | `string` | Brief description of the movement |
| `equipment` | `string[]` | Required equipment (e.g. `["barbell", "squat_rack"]`) |
| `target_muscles` | `string[]` | Primary muscles worked |
| `synergist_muscles` | `string[]` | Secondary muscles involved |
| `sport_relevance` | `string[]` | Sports where this exercise is commonly used |
| `default_tempo` | `string` | Default tempo (e.g. `"3-1-2-0"`) when a set does not specify `tempo` |
| `note` | `string` | Coaching cues or additional notes |

### Relationship Fields

Exercises can reference other exercises in the same library by `id`:

| Field | Type | Description |
|-------|------|-------------|
| `progressions` | `string[]` | Harder variations (e.g. pull-up → weighted pull-up) |
| `regressions` | `string[]` | Easier variations (e.g. pull-up → chin-up) |
| `variations` | `string[]` | Lateral alternatives at similar difficulty |

### Media

The optional `media` field provides instructional content:

```json
{
  "media": {
    "videos": [
      { "url": "https://example.com/squat.mp4", "label": "Form Guide", "language": "en" }
    ],
    "photos": [
      { "url": "https://example.com/squat.jpg", "label": "Setup Position" }
    ]
  }
}
```

### Recommended body part vocabulary

For `body_parts`, the following snake_case values are recommended so libraries and apps can filter and categorize consistently:

| Term | Description |
|------|-------------|
| `chest` | Pectorals, chest |
| `back` | Lats, rhomboids, traps, spinal erectors |
| `shoulders` | Deltoids |
| `biceps` | Biceps brachii |
| `triceps` | Triceps brachii |
| `core` | Abs, obliques, transverse abdominis |
| `glutes` | Gluteals |
| `quads` | Quadriceps |
| `hamstrings` | Hamstrings |
| `calves` | Gastrocnemius, soleus |
| `full_body` | Whole body / general |

These are optional; libraries may use other values. Keeping to this vocabulary improves interoperability.

### Common Dimensions

The `common_dimensions` field is an array of arrays. Each inner array lists a typical combination of [dimensions](./set-dimensions) for the exercise:

```json
{
  "id": "back_squat",
  "common_dimensions": [
    ["reps", "load"],
    ["reps"]
  ]
}
```

This tells tooling that a back squat is commonly prescribed as reps + load, or reps only. It's guidance for validators and code generators — not a constraint. Any valid dimension combination can be used.

## Example Exercise

A complete exercise definition from the canonical library:

```json
{
  "id": "back_squat",
  "name": "Back Squat",
  "aliases": ["Squat", "High Bar Squat"],
  "description": "A compound lower body movement where the barbell rests on the upper back.",
  "body_part": "lower_body",
  "category": "squat",
  "mechanic": "compound",
  "laterality": "bilateral",
  "level": "intermediate",
  "equipment": ["barbell", "squat_rack"],
  "target_muscles": ["quadriceps", "glutes"],
  "synergist_muscles": ["hamstrings", "adductors", "spinal_erectors", "core"],
  "progressions": ["front_squat"],
  "regressions": ["trap_bar_squat"],
  "variations": ["front_squat", "trap_bar_squat"],
  "sport_relevance": ["strength", "powerlifting", "football", "rugby"],
  "common_dimensions": [["reps", "load"], ["reps"]],
  "note": "Keep chest tall and knees tracking over toes throughout the movement."
}
```

## Referencing Libraries

Workouts and programs reference a library via the `library` field. Exercises then use `exercise_id` to look up definitions:

```json
{
  "openset_version": "1.0",
  "type": "workout",
  "library": {
    "id": "openset-default",
    "version": "1.0.0"
  },
  "blocks": [
    {
      "series": [
        {
          "execution_mode": "SEQUENTIAL",
          "exercises": [
            {
              "exercise_id": "back_squat",
              "sets": [{ "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 100, "unit": "kg" } }]
            }
          ]
        }
      ]
    }
  ]
}
```

When no library is referenced, exercises use the `name` field instead of `exercise_id`.

## Canonical Library

The `openset-default` library ships with 42 exercises covering strength, conditioning, and endurance:

| ID | Name | Body Part | Category |
|----|------|-----------|----------|
| `back_squat` | Back Squat | lower_body | squat |
| `front_squat` | Front Squat | lower_body | squat |
| `trap_bar_squat` | Trap Bar Squat | lower_body | squat |
| `deadlift` | Deadlift | lower_body | hinge |
| `romanian_deadlift` | Romanian Deadlift | lower_body | hinge |
| `bench_press` | Bench Press | upper_body | push |
| `incline_bench_press` | Incline Bench Press | upper_body | push |
| `overhead_press` | Overhead Press | upper_body | push |
| `hip_thrust` | Hip Thrust | lower_body | hinge |
| `dip` | Dip | upper_body | push |
| `pull_up` | Pull Up | upper_body | pull |
| `chin_up` | Chin Up | upper_body | pull |
| `australian_pull_up` | Australian Pull Up | upper_body | pull |
| `push_up` | Push Up | upper_body | push |
| `decline_push_up` | Decline Push Up | upper_body | push |
| `lunge` | Lunge | lower_body | squat |
| `bulgarian_split_squat` | Bulgarian Split Squat | lower_body | squat |
| `step_up` | Step Up | lower_body | squat |
| `box_jump` | Box Jump | lower_body | gait |
| `wall_sit` | Wall Sit | lower_body | squat |
| `plank` | Plank | core | carry |
| `copenhagen_plank` | Copenhagen Plank | core | rotation |
| `single_leg_calf_raise_elevated` | Single Leg Calf Raise (Elevated) | lower_body | push |
| `leg_curl` | Leg Curl | lower_body | hinge |
| `leg_extension` | Leg Extension | lower_body | squat |
| `lat_pulldown` | Lat Pulldown | upper_body | pull |
| `seated_row` | Seated Row | upper_body | pull |
| `chest_pass` | Chest Pass | upper_body | push |
| `triceps_cable_pushdown` | Triceps Cable Pushdown | upper_body | push |
| `bicep_curl` | Bicep Curl | upper_body | pull |
| `leg_raise` | Leg Raise | core | rotation |
| `crunch` | Crunch | core | rotation |
| `sit_up` | Sit Up | core | rotation |
| `sprint` | Sprint | full_body | gait |
| `run` | Run | full_body | gait |
| `row_ergometer` | Rowing (Ergometer) | full_body | pull |
| `assault_bike` | Assault Bike | full_body | carry |
| `cycling` | Cycling | lower_body | gait |
| `sled_push` | Sled Push | full_body | carry |
| `farmer_carry` | Farmer Carry | full_body | carry |
| `jump_rope` | Jump Rope | full_body | gait |
| `swimming` | Swimming | full_body | pull |

## Third-Party Libraries

Anyone can create a custom exercise library. To claim OpenSet compatibility, it must validate against `exercise-library.schema.json`. Use a unique `id` and `provider` to avoid conflicts with other libraries.

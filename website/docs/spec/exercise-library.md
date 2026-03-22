---
title: Exercises
sidebar_label: Exercises
description: OpenSet canonical exercise library (openset-default), exercise definitions, and how to reference exercises by ID in workouts.
keywords: [OpenSet, exercise library, exercises, openset-default, exercise_id]
---

# Exercise Library

OpenSet includes a canonical exercise library (`openset-default`) with 50 broadly recognized exercises under the MIT license. Exercise libraries are separate JSON documents that workouts and programs reference by ID.

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
  "regressions": ["goblet_squat", "bodyweight_squat"],
  "variations": ["front_squat", "goblet_squat", "leg_press"],
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

The `openset-default` library ships with 50 exercises covering strength, conditioning, endurance, and general fitness:

| ID | Name | Body Part | Category |
|----|------|-----------|----------|
| `back_squat` | Back Squat | lower_body | squat |
| `front_squat` | Front Squat | lower_body | squat |
| `goblet_squat` | Goblet Squat | lower_body | squat |
| `bodyweight_squat` | Bodyweight Squat | lower_body | squat |
| `leg_press` | Leg Press | lower_body | squat |
| `wall_sit` | Wall Sit | lower_body | squat |
| `deadlift` | Deadlift | lower_body | hinge |
| `romanian_deadlift` | Romanian Deadlift | lower_body | hinge |
| `hip_thrust` | Hip Thrust | lower_body | hinge |
| `kettlebell_swing` | Kettlebell Swing | full_body | hinge |
| `lunge` | Lunge | lower_body | squat |
| `bulgarian_split_squat` | Bulgarian Split Squat | lower_body | squat |
| `step_up` | Step Up | lower_body | squat |
| `calf_raise` | Calf Raise | lower_body | push |
| `bench_press` | Bench Press | upper_body | push |
| `incline_bench_press` | Incline Bench Press | upper_body | push |
| `dumbbell_bench_press` | Dumbbell Bench Press | upper_body | push |
| `push_up` | Push Up | upper_body | push |
| `dip` | Dip | upper_body | push |
| `overhead_press` | Overhead Press | upper_body | push |
| `lateral_raise` | Lateral Raise | upper_body | push |
| `pull_up` | Pull Up | upper_body | pull |
| `chin_up` | Chin Up | upper_body | pull |
| `lat_pulldown` | Lat Pulldown | upper_body | pull |
| `barbell_row` | Barbell Row | upper_body | pull |
| `dumbbell_row` | Dumbbell Row | upper_body | pull |
| `seated_row` | Seated Row | upper_body | pull |
| `inverted_row` | Inverted Row | upper_body | pull |
| `bicep_curl` | Bicep Curl | upper_body | pull |
| `tricep_pushdown` | Tricep Pushdown | upper_body | push |
| `tricep_extension` | Tricep Extension | upper_body | push |
| `leg_curl` | Leg Curl | lower_body | hinge |
| `leg_extension` | Leg Extension | lower_body | squat |
| `plank` | Plank | core | carry |
| `side_plank` | Side Plank | core | rotation |
| `crunch` | Crunch | core | rotation |
| `sit_up` | Sit Up | core | rotation |
| `leg_raise` | Leg Raise | core | rotation |
| `farmer_carry` | Farmer Carry | full_body | carry |
| `sled_push` | Sled Push | full_body | carry |
| `box_jump` | Box Jump | lower_body | gait |
| `burpee` | Burpee | full_body | gait |
| `run` | Run | cardio | gait |
| `sprint` | Sprint | cardio | gait |
| `treadmill` | Treadmill | cardio | gait |
| `rowing_machine` | Rowing Machine | cardio | pull |
| `stationary_bike` | Stationary Bike | cardio | gait |
| `jump_rope` | Jump Rope | cardio | gait |
| `swimming` | Swimming | cardio | pull |
| `elliptical` | Elliptical | cardio | gait |

## Third-Party Libraries

Anyone can create a custom exercise library. To claim OpenSet compatibility, it must validate against `exercise-library.schema.json`. Use a unique `id` and `provider` to avoid conflicts with other libraries.

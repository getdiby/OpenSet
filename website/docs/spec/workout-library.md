---
title: Workouts
sidebar_label: Workouts
description: Workout library document type. Reusable workout templates, referencing and embedding workouts in programs.
keywords: [OpenSet, workout library, workout_library, templates]
---

# Workout Library

A workout library is a flat collection of reusable workout templates. Each workout is a complete, self-contained definition that can be referenced or embedded in programs and standalone workouts.

## Document Format

```json
{
  "openset_version": "1.0",
  "type": "workout_library",
  "id": "my-workout-library",
  "name": "My Workout Library",
  "version": "1.0.0",
  "provider": "my-org",
  "license": "MIT",
  "workouts": [...]
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `openset_version` | string | Must be `"1.0"` |
| `type` | string | Must be `"workout_library"` |
| `id` | string | Unique library identifier |
| `name` | string | Human-readable library name |
| `version` | string | Semantic version of the library |
| `provider` | string | Organization or author |
| `license` | string | License identifier (e.g. `"MIT"`) |
| `workouts` | array | Array of workout definitions |

## Workout Definition

Each workout in the `workouts` array is a complete workout template:

```json
{
  "id": "upper_body_push",
  "name": "Upper Body Push",
  "description": "Horizontal and vertical pressing",
  "tags": ["upper_body", "push", "strength"],
  "level": "intermediate",
  "duration": { "value": 60, "unit": "min" },
  "sports": ["strength"],
  "library": { "id": "openset-default", "version": "1.0.0" },
  "blocks": [...]
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique snake_case identifier within the library |
| `name` | string | Human-readable workout name |
| `blocks` | array | Array of blocks (same structure as standalone workouts) |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Free-text description |
| `tags` | string[] | Searchable tags |
| `level` | string | One of: `beginner`, `intermediate`, `advanced`, `elite` |
| `duration` | object | Estimated duration object with numeric `value` and `unit` from `s|min|h|day|week` |
| `sports` | string[] | Target sports or activities |
| `note` | string | General notes |
| `library` | object | Reference to an exercise library (`{ id, version }`) |
| `media` | object | Videos and photos (`{ videos, photos }`) |

## Relationship to Exercise Libraries

Workout libraries can reference exercise libraries. Exercises within workout blocks can use `exercise_id` to reference exercises from any library, or use inline `name` for ad-hoc exercises.

```json
{
  "library": { "id": "openset-default", "version": "1.0.0" },
  "blocks": [{
    "series": [{
      "execution_mode": "SEQUENTIAL",
      "exercises": [
        { "exercise_id": "bench_press", "sets": [...] },
        { "name": "Custom Drill", "sets": [...] }
      ]
    }]
  }]
}
```

## Validation

The `@openset/validator` validates workout library documents:

- The `workouts` array must be non-empty
- Each workout must have `id`, `name`, and `blocks`
- Workout IDs must be unique within the library
- Inner blocks are validated using the same rules as standalone workouts
- W006 ("Workout has no date") is suppressed for library workouts since they are templates

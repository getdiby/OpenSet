---
sidebar_position: 7
title: Exercise Library
---

# Exercise Library

OpenSet includes a canonical exercise library (`openset-default`) with 42 exercises under the MIT license.

## Library Format

Exercise libraries are JSON documents validated against `exercise-library.schema.json`. Each library has:

- `openset_version` — Spec version
- `type` — Must be `"exercise_library"`
- `id` — Unique library identifier
- `name` — Human-readable name
- `version` — Library version string
- `provider` — Library author/organization
- `license` — License identifier (e.g. `"MIT"`)
- `exercises` — Array of exercise definitions

## Exercise Definition

Each exercise includes rich metadata:

| Field | Description |
|-------|-------------|
| `id` | Snake_case identifier (e.g. `back_squat`) |
| `name` | Display name (e.g. "Back Squat") |
| `aliases` | Alternative names |
| `description` | Brief description |
| `body_part` | `upper_body`, `lower_body`, `core`, `full_body`, `cardio` |
| `category` | `push`, `pull`, `hinge`, `squat`, `carry`, `rotation`, `gait` |
| `mechanic` | `compound`, `isolation` |
| `laterality` | `bilateral`, `unilateral`, `alternating` |
| `level` | `beginner`, `intermediate`, `advanced`, `elite` |
| `equipment` | List of required equipment |
| `target_muscles` | Primary muscles worked |
| `synergist_muscles` | Secondary muscles |
| `execution_types` | Compatible execution types |

## Referencing Libraries

Sessions can reference an exercise library via the `library` field:

```json
{
  "openset_version": "1.0",
  "type": "session",
  "library": {
    "id": "openset-default",
    "version": "1.0.0"
  },
  "blocks": []
}
```

## Third-Party Libraries

Anyone can create a custom exercise library. To claim OpenSet compatibility, it must validate against `exercise-library.schema.json`.

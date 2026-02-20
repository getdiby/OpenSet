---
title: Overview
---

# OpenSet Specification v1.0

OpenSet is an open, sport-agnostic JSON standard for representing structured training workouts and programs.

## Philosophy

OpenSet models **what should be done, how it should feel, and under what constraints**. It is a prescription format, not a logging format. It does not model actual execution timelines, sensor data, or real-time athlete behavior.

## Design Goals

- **Sport-agnostic** — Works for strength, endurance, conditioning, and hybrid training
- **Prescription-first** — Describes intent, not execution
- **Machine-readable** — Valid JSON with a formal JSON Schema
- **Human-friendly** — Clear naming conventions and sensible defaults
- **Extensible** — Namespaced extension mechanism for custom dimensions and fields

## Quick Example

```json
{
  "openset_version": "1.0",
  "type": "workout",
  "name": "Upper Body Push",
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
                {
                  "dimensions": ["reps", "load"],
                  "reps": { "type": "fixed", "value": 5 },
                  "load": { "type": "fixed", "value": 100, "unit": "kg" }
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

## Versioning

- `MAJOR.MINOR` semantic versioning
- **Minor bumps** are additive and backward compatible — a v1.0 validator can validate v1.1 documents (with a warning)
- **Major bumps** are breaking — a v1.x validator will reject v2.x documents
- All documents carry an `openset_version` field
- The JSON Schema accepts any `1.x` version via pattern matching, enabling forward compatibility
- The validator checks versions at runtime: warns on newer minor, errors on different major

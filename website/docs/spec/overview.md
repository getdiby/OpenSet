---
title: Overview
description: Philosophy, design goals, and quick example of the OpenSet specification. Sport-agnostic JSON standard for workouts and programs.
keywords: [OpenSet, specification, workout format, JSON schema, training data]
---

# OpenSet Specification v1.0

OpenSet is an open, sport-agnostic JSON standard for representing structured training workouts and programs.

## Philosophy

OpenSet models **what should be done, how it should feel, and under what constraints**. The core spec is a **prescription format** (workouts and programs). An optional **workout execution** layer (see [Workout execution](/docs/spec/workout-execution)) records what was actually done — set-level actuals, timestamps, and completion state — so you can build audit trails, analytics, and import device data (e.g. FIT) into the same model.

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

## Interoperability and related formats

OpenSet can represent the same prescription intent as other workout and prescription formats. Conversion to and from these formats is out of scope of the core spec but is encouraged for implementers and tools (e.g. in the [tools/convert](/docs/tools/conversion) area).

| Format | Domain | Notes |
|--------|--------|------|
| **Zwift (ZWO)** | Indoor cycling/running | XML; segment types (Warmup, SteadyState, IntervalsT, Ramp, etc.) map to OpenSet blocks/series/sets and execution modes. Power as %FTP or fixed W. |
| **ERG / MRC** | Cycling trainers | Text-based time + power (Watts or %FTP). Intervals map to OpenSet sets with `duration`, `power`, `rest_after`. |
| **FHIR Physical Activity IG** | Healthcare | CarePlan, ServiceRequest, Goal for high-level prescriptions (e.g. minutes/week). OpenSet can describe the detailed workout structure referenced by or embedded in FHIR workflows. |
| **Structured Workout Format (SWF)** | Cross-platform JSON | Sections, intervals, repeats with volume and intensity. OpenSet covers the same ideas with blocks, series, sets, and dimensions; conversion is straightforward. |
| **TCX / FIT** | Garmin, devices | Primarily recording/targets; OpenSet is prescription-first. Export from OpenSet to FIT/TCX for device use is a tooling concern. |

## Versioning

- `MAJOR.MINOR` semantic versioning
- **Minor bumps** are additive and backward compatible — a v1.0 validator can validate v1.1 documents (with a warning)
- **Major bumps** are breaking — a v1.x validator will reject v2.x documents
- All documents carry an `openset_version` field
- The JSON Schema accepts any `1.x` version via pattern matching, enabling forward compatibility
- The validator checks versions at runtime: warns on newer minor, errors on different major

OpenSet is compatible with guideline-driven frameworks (e.g., ACSM FITT-VP) but does not encode any specific guideline into the schema. For a concrete ACSM-style mapping and examples, see the [`ACSM` section](./acsm-mapping).

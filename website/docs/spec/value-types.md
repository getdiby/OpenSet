---
title: Value Types
description: Prescription value types — fixed, range, min, amrap, max, any. How to specify targets for dimensions in OpenSet.
keywords: [OpenSet, value types, fixed, range, amrap, prescription]
---

# Value Types

Every prescribed dimension uses one of six value types. Each value type is a JSON object with a `type` discriminator.

| Type | Description | Example |
|------|-------------|---------|
| `fixed` | Exact target | `{ "type": "fixed", "value": 100, "unit": "kg" }` |
| `range` | Min/max bounds | `{ "type": "range", "min": 8, "max": 12, "unit": "kg" }` |
| `min` | At least this value | `{ "type": "min", "value": 30, "unit": "s" }` |
| `amrap` | As many as possible | `{ "type": "amrap" }` |
| `max` | Maximum effort | `{ "type": "max" }` |
| `any` | No specific target | `{ "type": "any" }` |

## Fixed

An exact target value. The `unit` field is required for dimensional values (load, duration, distance, etc.) and omitted for counts (reps, rounds).

```json
{
  "type": "fixed",
  "value": 100,
  "unit": "kg"
}
```

## Range

A min/max bound. The athlete should target somewhere within the range. For dimensional values, include `unit`.

```json
{
  "type": "range",
  "min": 8,
  "max": 12,
  "unit": "kg"
}
```

## Min

At least this value. Useful for duration holds or distance minimums.

```json
{
  "type": "min",
  "value": 30,
  "unit": "s"
}
```

## AMRAP

As many reps as possible. No value needed.

```json
{
  "type": "amrap"
}
```

## Max

Maximum effort (e.g., 1RM test, max heart rate).

```json
{
  "type": "max"
}
```

## Any

No specific target. The dimension is acknowledged but unconstrained.

```json
{
  "type": "any"
}
```

## Allowed Types per Dimension

Not every value type is valid for every dimension. See [Dimensions](./set-dimensions) for the complete compatibility matrix.

### Guideline-oriented usage (e.g., ACSM)

When mirroring guideline prescriptions:

- Use **`range`** for domains like *“moderate”* or *“vigorous”* by encoding the numeric bounds (e.g. `%HRR` 0.4–0.59, `%HRR` 0.6–0.89, RPE 4–6, etc.).
- Use **`fixed`** when guidelines specify a clear target (e.g. “walk at 5 km/h” or “RPE 5”).
- Use **`min`** for *“at least”* prescriptions (e.g. `duration` ≥ 30 min, or `calories` ≥ 300 kcal).
- Use **`max`** for tests or ceiling-type efforts (e.g. `heart_rate` max test, 1RM).
- Use **`any`** sparingly when a dimension is present but unconstrained (e.g. general “walk” blocks where speed is free and only time/volume is constrained at the program level).

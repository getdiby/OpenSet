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

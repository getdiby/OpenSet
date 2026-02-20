---
title: Extensions
---

# Extension Mechanism

OpenSet supports custom dimensions and fields via namespaced prefixes.

## Namespace Prefixes

| Prefix | Usage | Example |
|--------|-------|---------|
| `x_` | Generic extension | `x_band_tension` |
| `app_` | App-specific | `app_tracking_id` |
| reverse-DNS style | Organization-specific | `com_myapp_custom_field` |

## Extension Dimensions

Custom dimensions can be added to sets using a namespaced key. Extension values **must be valid ValueObjects** (with a `type` field like `fixed`, `range`, etc.). Extension dimensions can also be listed in the `dimensions` array to mark them as required:

```json
{
  "dimensions": ["reps", "load", "x_band_tension"],
  "reps": { "type": "fixed", "value": 10 },
  "load": { "type": "fixed", "value": 60, "unit": "kg" },
  "x_band_tension": { "type": "fixed", "value": 20, "unit": "lb" }
}
```

## Declaring Extensions

Documents can optionally declare which extension namespaces they use via the `x_extensions` field:

```json
{
  "openset_version": "1.0",
  "type": "workout",
  "x_extensions": ["x_band", "com_myapp"],
  "blocks": [...]
}
```

This helps consumers understand what custom data a document contains without inspecting every set.

## Validation Behavior

- Unknown fields **with** a valid namespace prefix: warning **W009** + structural check **E015** (must be a ValueObject)
- Unknown fields **without** a prefix: error **E013**

This ensures forward compatibility while catching both typos and malformed extension values.

## Forward Compatibility

The Set type in the JSON Schema uses `additionalProperties: true`, meaning new fields added in minor version bumps (e.g., v1.1) pass through a v1.0 schema validator without errors. The semantic validator will warn about unknown fields while still validating the rest of the document.

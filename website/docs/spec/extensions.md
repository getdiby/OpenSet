---
sidebar_position: 8
title: Extensions
---

# Extension Mechanism

OpenSet supports custom dimensions, execution types, and fields via namespaced prefixes.

## Namespace Prefixes

| Prefix | Usage | Example |
|--------|-------|---------|
| `x_` | Generic extension | `x_band_tension` |
| `app_` | App-specific | `app_tracking_id` |
| reverse-DNS style | Organization-specific | `com_myapp_custom_field` |

## Extension Dimensions

Custom dimensions can be added to sets using a namespaced key:

```json
{
  "execution_type": "reps_load",
  "reps": { "type": "fixed", "value": 10 },
  "load": { "type": "fixed", "value": 60, "unit": "kg" },
  "x_band_tension": { "type": "fixed", "value": 20, "unit": "lb" }
}
```

## Extension Execution Types

Custom execution types use the same prefix convention:

```json
{
  "execution_type": "x_swim_intervals",
  "x_laps": { "type": "fixed", "value": 4 },
  "duration": { "type": "fixed", "value": 120, "unit": "s" }
}
```

## Validation Behavior

- Unknown fields **with** a valid namespace prefix produce warning **W009**
- Unknown fields **without** a prefix produce error **E013**

This ensures forward compatibility — apps can add custom data without breaking validation, while typos and invalid fields are caught.

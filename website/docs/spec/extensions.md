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

## Document-level extensions

Workouts and programs may carry extension fields at the document or workout level using the same namespace prefixes. The schema allows these via `patternProperties` on root and workout objects.

### Workout status (`x_status`)

Apps that need to mark workouts as draft vs. published can use the **`x_status`** extension (generic `x_` namespace):

- **`x_status`**: `"draft"` | `"valid"` — Optional. `"draft"` = not yet ready for use; `"valid"` = approved/published. Omission means unspecified.

Example:

```json
{
  "openset_version": "1.0",
  "type": "workout",
  "x_extensions": ["x_status"],
  "x_status": "draft",
  "name": "Upper Body A",
  "blocks": [...]
}
```

Use `x_extensions` to declare `"x_status"` when the document uses it. Other document-level extensions (e.g. `app_workout_id`, `com_myapp_approved_at`) follow the same pattern.

### In-workout cues (`x_cue`)

Apps or devices that show messages during execution (e.g. trainers, watches, coaching apps) can use the **`x_cue`** extension at **set** or **series** level. A cue defines when to display a message relative to the start of that set or series.

- **`x_cue`**: Optional array of cue objects. Each cue has:
  - **`time_offset_s`** (number): Seconds from the start of the set/series when the message should be shown.
  - **`message`** (string): Text to display (e.g. "Relax shoulders", "Last rep").
  - **`distance_offset_m`** (number, optional): For distance-based sets, meters from the start when the message should be shown. Use either `time_offset_s` or `distance_offset_m` per cue.

Consumers may show the message at the given offset during playback. If both time and distance are present, they can use the first that applies for the current sport/device.

Example (set with a cue 30 seconds in):

```json
{
  "dimensions": ["duration", "power"],
  "duration": { "type": "fixed", "value": 300, "unit": "s" },
  "power": { "type": "fixed", "value": 0.65, "unit": "%FTP" },
  "x_cue": [
    { "time_offset_s": 30, "message": "Settle into the effort" },
    { "time_offset_s": 240, "message": "Last minute — hold form" }
  ]
}
```

Declare `"x_cue"` in `x_extensions` when the document uses it. This extension is optional; if adopters use it widely, it may be promoted to first-class in a future minor version.

## Validation Behavior

- Unknown fields **with** a valid namespace prefix: warning **W009** + structural check **E015** (must be a ValueObject)
- Unknown fields **without** a prefix: error **E013**

This ensures forward compatibility while catching both typos and malformed extension values.

## Forward Compatibility

The Set type in the JSON Schema uses `additionalProperties: true`, meaning new fields added in minor version bumps (e.g., v1.1) pass through a v1.0 schema validator without errors. The semantic validator will warn about unknown fields while still validating the rest of the document.

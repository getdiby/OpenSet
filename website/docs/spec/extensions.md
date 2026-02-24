---
title: Extensions
description: OpenSet extension mechanism. Namespaced prefixes (x_, app_, reverse-DNS) for custom dimensions and fields.
keywords: [OpenSet, extensions, custom dimensions, namespaced fields]
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

### Common patterns: bands and compound loads

Two patterns show up frequently across strength and conditioning apps:

- **Resistance bands / machine levels** — keep core dimensions numeric; use extensions for labels.
  - Use `resistance` for numeric machine levels or percentages (e.g. `level`, `%`).
  - When you need to preserve a human-readable band identifier, add an extension such as:
    - `x_resistance_band`: band identity (e.g. `"zelena_guma"`, `"green_medium"`).
  - Declare the namespace via `x_extensions`, for example: `"x_extensions": ["x_resistance_band"]`.

- **Compound loads** — total load in `load`, components in an extension.
  - Keep `load.value` as the total external load (e.g. 18kg).
  - Use `x_load_components` to store a structured breakdown when needed (e.g. `[3, 15]` for `3kg + 15kg`).
  - This lets core consumers rely on a single scalar load, while apps that know about `x_load_components` can reconstruct the exact combination.

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

### AI-generated insights (`x_ai_insights`)

Apps or agents that use AI to analyze workouts or executions can attach structured insights without overloading core fields like `feedback`. The **`x_ai_insights`** extension (generic `x_` namespace) is optional and **safe to strip** for storage or display — consumers may ignore it; OpenSet compliance does not require it.

**Where it is allowed:**

- **Prescription:** Workout and program documents (same as other document-level extensions).
- **Execution:** Workout execution documents support extensions at the root via `x_extensions` and `patternProperties` in the [workout-execution schema](https://openset.dev/schema/v1/workout-execution.schema.json).

**Suggested shape:** A flexible object or array of insight objects. Minimal useful fields:

- **`type`** (string): e.g. `"suggestion"`, `"form_note"`, `"summary"`.
- **`text`** (string): Human-readable insight.
- **`scope`** (string, optional): `"workout"`, `"exercise"`, `"set"` to indicate what the insight refers to.
- **`target`** (optional): When scope is exercise or set, a reference (e.g. `set_ref`-style indices or exercise index) so consumers can place the insight in context.

Consumers may ignore or strip `x_ai_insights`; validators treat it as an extension (namespaced field). Use `x_extensions` to declare `"x_ai_insights"` when present.

Example on a **prescription** (e.g. AI-suggested deload):

```json
{
  "openset_version": "1.0",
  "type": "workout",
  "x_extensions": ["x_ai_insights"],
  "name": "Upper Body A",
  "x_ai_insights": [
    { "type": "suggestion", "text": "Consider deload next week; volume has increased for 3 weeks." }
  ],
  "blocks": [...]
}
```

Example on an **execution** (e.g. form note or volume summary):

```json
{
  "openset_version": "1.0",
  "type": "workout_execution",
  "x_extensions": ["x_ai_insights"],
  "execution_id": "...",
  "workout_ref": {...},
  "started_at": "...",
  "completed_at": "...",
  "set_executions": [...],
  "x_ai_insights": [
    { "type": "form_note", "text": "Slight knee cave on set 2.", "scope": "set", "target": { "block": 0, "series": 0, "exercise": 0, "set": 1 } },
    { "type": "summary", "text": "Volume above weekly target; recovery may benefit from lighter session next." }
  ]
}
```

This extension is optional. If adopters use it widely, it may be promoted to first-class in a future minor version.

### Health / clinical profile extensions (ACSM-style, optional)

Some applications apply clinical or guideline frameworks (e.g. ACSM) when deciding whether a workout or program is appropriate for a given person. OpenSet does **not** encode those algorithms, but you can standardize their **outputs** using extensions on workouts and programs:

- **`x_risk_class`** (string)
  - Optional risk/stratification bucket produced by your own screening logic.
  - Examples: `"low"`, `"increased"`, `"known_disease"`, `"cardiac_rehab"`. The exact taxonomy is app-defined.
- **`x_medical_clearance_required`** (string or boolean)
  - Whether medical clearance is recommended or required before using this workout/program.
  - Recommended values: `"not_required"`, `"recommended"`, `"required"` (or the boolean form if you only need yes/no).
- **`x_supervision_level`** (string)
  - Suggested supervision level when this prescription is used as written.
  - Examples: `"independent"`, `"on_site_clinical"`, `"telemetry"`, `"group_class"`.
- **`x_population_tags`** (array of strings)
  - Target or tested population tags aligned with guideline “special populations”.
  - Examples: `"older_adult"`, `"pregnancy"`, `"pediatrics"`, `"cardiac_rehab"`, `"diabetes"`, `"obesity"`.

These extensions are **descriptive**, not prescriptive: validators do not enforce any particular clinical model. They make it easier for downstream tools to filter, surface, and audit guideline-driven content (e.g. “show only programs tagged `older_adult` that do not require medical clearance”).

Example on a `program`:

```json
{
  "openset_version": "1.0",
  "type": "program",
  "name": "Beginner Walking — General Health",
  "x_extensions": ["x_risk_class", "x_medical_clearance_required", "x_supervision_level", "x_population_tags"],
  "x_risk_class": "low",
  "x_medical_clearance_required": "not_required",
  "x_supervision_level": "independent",
  "x_population_tags": ["older_adult"],
  "phases": [...]
}
```

## Validation Behavior

- Unknown fields **with** a valid namespace prefix: warning **W009** + structural check **E015** (must be a ValueObject)
- Unknown fields **without** a prefix: error **E013**

This ensures forward compatibility while catching both typos and malformed extension values.

## Forward Compatibility

The Set type in the JSON Schema uses `additionalProperties: true`, meaning new fields added in minor version bumps (e.g., v1.1) pass through a v1.0 schema validator without errors. The semantic validator will warn about unknown fields while still validating the rest of the document.

---
title: Workout Execution
description: OpenSet execution layer — record what was done for a workout instance (session and set-level actuals). Storage strategy and completion rules.
keywords: [OpenSet, execution, logging, audit, session, set execution]
---

# Workout execution

The **workout execution** layer records **what was done** for a specific occurrence of a workout. It is separate from the prescription (workout/program documents): prescription describes intent; execution records actuals, timestamps, and completion state.

Use execution data to:

- Show prescribed vs actual per set
- Build analytics (volume, progression, compliance)
- Import device data (e.g. [FIT → OpenSet](#mapping-fit-data-into-openset-execution))

## Document type

Execution documents have `type: "workout_execution"` and are validated against the [workout-execution schema](https://openset.dev/schema/v1/workout-execution.schema.json). They are **optional**: implementations that only need prescription can ignore execution.

| Field | Required | Description |
|-------|----------|-------------|
| `openset_version` | Yes | Spec version (e.g. `"1.0"`) |
| `type` | Yes | Must be `"workout_execution"` |
| `execution_id` | Yes | Unique id for this session (e.g. UUID) |
| `workout_ref` | Yes | Reference to the prescribed workout (see [Workout reference](#workout-reference)) |
| `started_at` | Yes | Session start (ISO 8601 date-time) |
| `completed_at` | Yes | Session end (ISO 8601 date-time) |
| `set_executions` | Yes | Array of set execution records |
| `summary` | No | Optional high-level summary (sets completed, total volume, etc.) |
| `feedback` | No | **Overall workout feedback** — how the session felt, notes from the athlete or coach (e.g. "Brutal training, feeling perfect on everything") |
| `media` | No | Photos or videos for the entire session |
| `exercise_feedback` | No | Array of **per-exercise feedback** (and optional media) — how each exercise felt overall; see [Feedback and media](#feedback-and-media) |
| `source` | No | **Provenance** — where this execution came from (e.g. FIT import, manual). Use for deduplication, audit, and linking back to the original activity; see [Source / provenance](#source--provenance). |

## Set reference

Each set execution points at a prescribed set by **path** (array indices):

```json
"set_ref": {
  "block": 0,
  "series": 0,
  "exercise": 0,
  "set": 0
}
```

- `block` — index of the block in the workout `blocks[]`
- `series` — index of the series in that block's `series[]`
- `exercise` — index of the exercise in that series' `exercises[]`
- `set` — index of the set in that exercise's `sets[]`

This matches the prescription hierarchy (see [Entities](./entities)). Optional stable IDs (e.g. `block_id`, `series_id`, `exercise_id`) can be used in addition when the prescription provides them.

## Set execution record

One record per prescribed set (or per lap/interval for cardio). Shape:

| Field | Required | Description |
|-------|----------|-------------|
| `set_ref` | Yes | Path to the prescribed set |
| `status` | Yes | `skipped` \| `partial` \| `completed` |
| `started_at` | Yes | When the set started (ISO 8601 date-time) |
| `completed_at` | Yes | When the set ended |
| `dimensions` | Yes | Object: dimension name → actual value and completion |
| `rpe` | No | **Felt RPE** — client's rate of perceived exertion for this set (0–10). Optional; can be logged even when RPE was not prescribed ("real feel" from the client). When RPE is prescribed, you can use this and/or `dimensions.rpe` with completion. |
| `rest_actual` | No | Actual rest taken after the set (seconds) |
| `exercise_id` | Recommended | Same as the prescribed exercise's `exercise_id`. **Include whenever the exercise comes from a library** so you can see trends by exercise over time; omit only for custom exercises (prescription has `name` only, no `exercise_id`). |
| `feedback` | No | **Per-set feedback** — how that set felt, form notes, or coach comments (e.g. "Leti", "First set 1 in reserve for sure") |
| `media` | No | Photos or videos from this set (e.g. form check on first or last set of the exercise) |

**status**

- `skipped` — set was not attempted (dimensions may be empty).
- `partial` — at least one dimension missed or partially met.
- `completed` — all logged dimensions met (or only met/not_logged).

**dimensions**

Only include dimensions that were **prescribed** for that set. Each value is an object:

- `value` (number) — actual logged value
- `unit` (string, optional) — same units as [dimensions](./set-dimensions) (kg, s, km, bpm, W, etc.)
- `completion` — `met` \| `partial` \| `missed` \| `not_logged`

Example:

```json
{
  "set_ref": { "block": 0, "series": 0, "exercise": 0, "set": 0 },
  "status": "completed",
  "started_at": "2025-02-22T10:00:00Z",
  "completed_at": "2025-02-22T10:01:30Z",
  "dimensions": {
    "reps":  { "value": 8, "completion": "met" },
    "load":  { "value": 60, "unit": "kg", "completion": "met" }
  },
  "rpe": 7,
  "exercise_id": "bench_press",
  "feedback": "Felt easy, 1 in reserve",
  "media": [{ "url": "https://example.com/form-set1.jpg", "type": "photo", "label": "Set 1 form check" }]
}
```

When the prescribed exercise has an `exercise_id` (from a library), always copy it to the set execution record so analytics can aggregate and show trends by exercise over time. Omit `exercise_id` only for custom exercises that use `name` instead of `exercise_id` in the prescription.

**RPE (Rate of Perceived Exertion)** — the client's real feel can be captured in execution in two ways, both optional:

- **Set-level `rpe`** (number 0–10): The client's felt RPE for that set. You can log it **even when RPE was not prescribed** (e.g. coach just wants to know how it felt). Use this for a simple "how hard did it feel?" slot per set.
- **`dimensions.rpe`**: When RPE is prescribed, you can store the actual value here with `completion` (met/partial/missed) to compare against the prescription. You may use set-level `rpe` and/or `dimensions.rpe`; both are optional.

Include RPE only for sets where the client reported it.

**RIR (Reps in Reserve)** — how many repetitions the athlete felt they had left at the end of the set. RIR is typically logged on a **0–5** scale:

- `0` — failure (no reps left)
- `1` — one rep left
- `2` — two reps left

You can capture RIR in execution via **`dimensions.rir`** whenever RIR was prescribed in the workout (e.g. `rir: { "type": "fixed", "value": 2 }` in the prescription). As with RPE, consumers should treat missing `rir` data as “not recorded”, not as zero.

RPE and RIR are related but not identical (roughly `RIR ≈ 10 - RPE` for strength work). Implementations may choose to record one, both, or neither, depending on their coaching model.

## Source / provenance

When execution data comes from a FIT file or another device (e.g. Garmin watch), you can store **provenance** at the session level so you know where it came from and can deduplicate or re-sync.

| Field | Description |
|-------|--------------|
| `provider` | Source type: e.g. `manual`, `fit`, `garmin_connect`, `strava` |
| `activity_id` | Source activity or file id (e.g. FIT activity id) — use to skip re-import of the same file and to link back to the original |
| `imported_at` | When the data was imported or synced (ISO 8601 date-time) |
| `device` | Optional device or app name (e.g. "Garmin Forerunner 965") |
| `mapping_summary` | Optional short summary of what was mapped (e.g. "Session→envelope, 3 Laps→set_executions") |

Example (FIT import):

```json
"source": {
  "provider": "fit",
  "activity_id": "a1b2c3d4-1234-5678-9abc-def012345678",
  "imported_at": "2025-02-22T11:00:00Z",
  "device": "Garmin Forerunner 965",
  "mapping_summary": "Session→envelope, 5 Laps→set_executions"
}
```

Keeping this next to the execution data (not in a separate store) means each session is self-describing: you can tell device-origin vs manual and avoid importing the same FIT twice by checking `activity_id`.

## Feedback and media

Coaches often ask for **feedback** and **photos/videos** at several levels:

| Level | Field | Use |
|-------|--------|-----|
| **Workout** | `feedback` | Overall session (e.g. "Brutal training, feeling perfect. Just consistency on squat.") |
| **Workout** | `media` | Session-level photos or videos |
| **Exercise** | `exercise_feedback[]` | How that exercise felt overall; optional `media` per exercise (e.g. video of last set of bench) |
| **Set** | `feedback` | Per-set comments (e.g. "Leti", "First series 1 in reserve") |
| **Set** | `media` | Photos or videos from that specific set (e.g. form check on set 3) |

Each **exercise_feedback** entry has `exercise_ref` (block, series, exercise indices), `feedback` (string), and optional `media` (array of photos/videos). Each **media** item has `url` (required), optional `type` (`"photo"` or `"video"`), and optional `label` (e.g. "Set 3 form check").

## Completion rules

How to set `completion` per dimension from prescription type:

| Prescription type | Met | Partial | Missed |
|-------------------|-----|--------|--------|
| fixed | value === prescribed | optional (e.g. within tolerance) | otherwise |
| range | min ≤ value ≤ max | optional | value &lt; min or &gt; max |
| min | value ≥ prescribed | optional | value &lt; prescribed |
| amrap / max | value present | — | not logged |
| any | value present | — | not logged |

You can simplify to binary (met vs not_met) and omit `partial` if not needed.

## Workout reference

`workout_ref` identifies which workout (or program slot) was executed.

**Standalone workout**

```json
"workout_ref": {
  "workout_id": "upper-body-push",
  "date": "2025-02-22"
}
```

**Workout from a program**

```json
"workout_ref": {
  "program_id": "4-week-strength",
  "phase_index": 0,
  "workout_index": 1,
  "date": "2025-02-22"
}
```

Implementations can require `workout_id` + `date` or a program path; the schema allows any subset for flexibility.

## Storage strategy

The spec assumes **two storage granularities** so you can reconstruct full workouts and run analytics without a separate “reconstruction” store.

**Session store** — one record per workout execution

- Fields: `execution_id`, `workout_ref`, `started_at`, `completed_at`
- Optional: summary (e.g. sets completed, total volume) for session cards

**Set store** — one record per set execution

- Fields: `execution_id` (link to session), `set_ref`, `status`, `started_at`, `completed_at`, `dimensions`
- **exercise_id**: Include whenever the prescribed exercise has an `exercise_id` (from a library), so trends by exercise over time work without joining prescription; omit only for custom/ad-hoc exercises.

**Reconstructing full workout**

1. Load session by `execution_id`
2. Load all set records with that `execution_id`; order by `set_ref`
3. Optionally load prescription from `workout_ref` for names and prescribed values

Result: full “this workout execution” with every set and prescribed vs actual. An optional cached “full workout execution” JSON blob is a derived view for performance.

**Analytics**

- Per-set (volume, progression): query set store by time range, `exercise_id`, or `execution_id`
- Per-workout: session + count/sum of set records for that `execution_id`
- Per-program: query session store by program/`workout_ref` and date; aggregate set records

Prescription (workout/program docs) stays separate; merge when needed for “plan vs actual”.

## Full example

```json
{
  "openset_version": "1.0",
  "type": "workout_execution",
  "execution_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "workout_ref": { "workout_id": "upper-body-push", "date": "2025-02-22" },
  "started_at": "2025-02-22T09:45:00Z",
  "completed_at": "2025-02-22T10:35:00Z",
  "feedback": "Brutal training, feeling perfect on everything. Just consistency on squat.",
  "set_executions": [
    {
      "set_ref": { "block": 0, "series": 0, "exercise": 0, "set": 0 },
      "status": "completed",
      "started_at": "2025-02-22T09:50:00Z",
      "completed_at": "2025-02-22T09:51:30Z",
      "dimensions": {
        "reps":  { "value": 8, "completion": "met" },
        "load":  { "value": 60, "unit": "kg", "completion": "met" }
      }
    },
    {
      "set_ref": { "block": 0, "series": 0, "exercise": 0, "set": 1 },
      "status": "partial",
      "started_at": "2025-02-22T09:53:30Z",
      "completed_at": "2025-02-22T09:55:00Z",
      "dimensions": {
        "reps":  { "value": 6, "completion": "missed" },
        "load":  { "value": 60, "unit": "kg", "completion": "met" }
      },
      "feedback": "First set 1 in reserve, second set 2 in reserve"
    }
  ],
  "exercise_feedback": [
    { "exercise_ref": { "block": 0, "series": 0, "exercise": 0 }, "feedback": "Squat felt solid today" }
  ],
  "source": {
    "provider": "manual",
    "imported_at": "2025-02-22T10:36:00Z"
  }
}
```

With a FIT import, `source` might look like:

```json
"source": {
  "provider": "fit",
  "activity_id": "a1b2c3d4-1234-5678-9abc-def012345678",
  "imported_at": "2025-02-22T11:00:00Z",
  "device": "Garmin Forerunner 965",
  "mapping_summary": "Session→envelope, 2 set_executions from SetMessage"
}
```

## Mapping FIT data into OpenSet execution

[FIT](https://developer.garmin.com/fit/protocol/) (Garmin and other devices) is a recording format. You can **import** FIT data into OpenSet execution so device data feeds the same execution/audit layer as in-app logging.

**Strength (FIT SetMessage)**

- One FIT `SetMessage` → one set execution record
- `set_ref`: from `workoutStepIndex` or by order
- `started_at` / `completed_at`: from `startTime` and duration
- Dimensions: reps ← `repetitions`, load ← `weight` (convert to kg/lb), duration ← SetMessage `duration`

**Cardio (Session + Lap + Record)**

- FIT **Session** → workout execution envelope (`started_at`, `completed_at`)
- Each FIT **Lap** → one set execution: lap index → `set_ref`; Lap start/end → timestamps
- Dimensions: from Lap summary and/or by aggregating **Record** messages in that lap (duration, distance, heart_rate, power, speed, cadence, calories). Convert FIT units to OpenSet units (see [Dimensions](./set-dimensions)).

After import, set **source** on the workout execution (e.g. `provider: "fit"`, `activity_id` from the FIT file, `imported_at`, optional `device` and `mapping_summary`) so the data stays linked to its origin and you can deduplicate on re-import.

This gives a single execution model for both in-app logging and device import.

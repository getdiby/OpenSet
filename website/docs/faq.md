---
title: FAQ
sidebar_label: FAQ
description: Frequently asked questions about OpenSet, format comparison with Zwift, ERG, FHIR, SWF, TCX/FIT, and interoperability.
keywords: [OpenSet, FAQ, workout format, comparison, interoperability]
---

# Frequently Asked Questions

## How does OpenSet compare to other workout formats?

OpenSet is a **prescription format**: it describes what should be done (exercises, sets, intensity, rest) in a sport-agnostic, machine-readable way. It is not a logging format (no GPS tracks or sensor streams) and not tied to a single app or device.

Other formats often target one sport or one ecosystem. The table below summarizes how OpenSet relates to the most common ones.

| Format | Best for | How OpenSet compares |
|--------|----------|----------------------|
| **Zwift (ZWO)** | Indoor cycling/running in Zwift | OpenSet can express the same workout (blocks → segments, series/sets → power/duration). Use `power` with unit `%FTP` for portable cycling workouts. Conversion is a tooling concern; see [Interoperability](/docs/spec/overview#interoperability-and-related-formats). |
| **ERG / MRC** | Smart trainers (time + power) | Same prescription intent: duration, power (W or %FTP), rest. OpenSet models it as sets with `duration`, `power`, `rest_after`. ERG/MRC are time-series; OpenSet is set-based and semantic. |
| **FHIR Physical Activity** | Healthcare, referrals, goals | FHIR focuses on high-level plans (e.g. 150 min/week). OpenSet describes the actual workout structure. They are complementary: a CarePlan can reference or embed OpenSet for the detailed prescription. |
| **Structured Workout Format (SWF)** | Cross-platform JSON | Similar ideas (sections, intervals, volume + intensity). OpenSet adds execution modes, exercise libraries, and multi-sport support. Conversion between the two is straightforward. |
| **TCX / FIT** | Garmin, devices, recording | Primarily for recording and device targets. OpenSet is prescription-first; you can export from OpenSet to FIT/TCX for use on devices. |

For a short interoperability note and links, see [Interoperability and related formats](/docs/spec/overview#interoperability-and-related-formats) in the spec overview.

---

## What about Zwift (ZWO) workouts specifically?

**ZWO** is Zwift’s XML format. A ZWO file has a single `<workout>` with ordered segments: `<Warmup>`, `<Cooldown>`, `<SteadyState>`, `<IntervalsT>`, `<Ramp>`, `<FreeRide>`, etc. Power is usually given as a fraction of FTP (e.g. `0.65` = 65% FTP), or in absolute watts when `<ftpOverride>` is set.

**In OpenSet:**

- **Segments** → Use **blocks** (e.g. “Warm-up”, “Main”, “Cool-down”) and **series** with the right **execution mode** (e.g. `INTERVAL` for on/off intervals).
- **Power** → Use the `power` dimension with `unit: "W"` for absolute watts or `unit: "%FTP"` for relative (same idea as ZWO/MRC). See [Dimensions — Power](/docs/spec/set-dimensions#known-dimensions).
- **Duration** → Use `duration` (OpenSet uses seconds in the schema; you can use `min` in the unit string where appropriate).
- **In-workout messages** → Use the optional [x_cue](/docs/spec/extensions#in-workout-cues-x_cue) extension for time- or distance-based cues.

OpenSet does not define Zwift-specific features (e.g. camera events, game UI). Those stay in ZWO or app logic. If you need to **convert** ZWO ↔ OpenSet, that’s done by tools (e.g. in [tools/convert](https://github.com/getdiby/openset/tree/main/tools/convert)); the spec encourages such converters but doesn’t mandate them.

---

## Can I use OpenSet for cycling only? Running only?

Yes. OpenSet is sport-agnostic. You can:

- Put `"sports": ["cycling"]` or `"sports": ["running"]` (or both) on a workout or program.
- Use only the dimensions you need: e.g. `power`, `duration`, `cadence` for indoor cycling; `pace`, `distance`, `duration` for running.
- Use `power` with `%FTP` for portable cycling workouts, or `pace` / `speed` for running.

The same document structure (workout → blocks → series → exercises → sets) applies to any sport.

---

## Where do I get exercise definitions?

OpenSet ships a default **exercise library** (`openset-default`) with 42 exercises. Workouts can reference exercises by `exercise_id` from that library or from [custom libraries](/docs/spec/exercise-library). For ad-hoc exercises you can use freeform `name` instead of `exercise_id`. See [Exercise library](/docs/spec/exercise-library) and [Workout library](/docs/spec/workout-library).

---

## How do I convert free text or another format to OpenSet?

- **Free text → OpenSet:** Use the [Conversion tool](/docs/tools/conversion) (LLM-based prompt) to turn a written workout description into valid OpenSet JSON.
- **Other formats (ZWO, ERG, MRC, SWF, etc.):** Conversion is not part of the core spec. Implementations and tools (e.g. in the repo’s `tools/convert` or third-party apps) can implement import/export. The spec’s [interoperability section](/docs/spec/overview#interoperability-and-related-formats) describes how OpenSet maps to these formats conceptually.

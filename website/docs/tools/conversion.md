---
title: Conversion Tool
description: LLM prompt to convert free-text workout descriptions into valid OpenSet JSON. Self-contained conversion tool and online version.
keywords: [OpenSet, conversion, LLM, free text, workout description]
---

# Conversion Tool

OpenSet includes a self-contained LLM prompt that converts free-text workout descriptions into valid OpenSet JSON.

## How It Works

The conversion prompt (`tools/convert/prompt.md`) contains everything an LLM needs:

- The full OpenSet structure and rules
- All valid dimension names and how they compose into sets
- All canonical exercise IDs from the default library
- Conversion examples showing free text to valid JSON
- Instructions for handling ambiguities

## Usage

### With Any LLM

1. Copy the contents of `tools/convert/prompt.md`
2. Paste it as a system prompt or initial context
3. Send the workout text you want to convert

### Example

**Input:**
```
Bench press 5x5 at 100kg, then 3 sets of 10-12 dumbbell rows at RPE 8
```

**Output:**
```json
{
  "openset_version": "1.0",
  "type": "workout",
  "blocks": [
    {
      "series": [
        {
          "execution_mode": "SEQUENTIAL",
          "exercises": [
            {
              "exercise_id": "bench_press",
              "sets": [
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 100, "unit": "kg" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 100, "unit": "kg" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 100, "unit": "kg" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 100, "unit": "kg" } },
                { "dimensions": ["reps", "load"], "reps": { "type": "fixed", "value": 5 }, "load": { "type": "fixed", "value": 100, "unit": "kg" } }
              ]
            },
            {
              "exercise_id": "dumbbell_row",
              "sets": [
                { "dimensions": ["reps", "rpe"], "reps": { "type": "range", "min": 10, "max": 12 }, "rpe": { "type": "fixed", "value": 8 } },
                { "dimensions": ["reps", "rpe"], "reps": { "type": "range", "min": 10, "max": 12 }, "rpe": { "type": "fixed", "value": 8 } },
                { "dimensions": ["reps", "rpe"], "reps": { "type": "range", "min": 10, "max": 12 }, "rpe": { "type": "fixed", "value": 8 } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Online Converter

An online version of the OpenSet converter is available at [getdiby.com/openset](https://getdiby.com/openset). Paste any unstructured workout description and get valid OpenSet JSON back — no setup required.

## Customization

You can modify the prompt to:

- Add domain-specific exercises
- Adjust default units (kg vs lb)
- Include sport-specific conventions
- Add custom dimensions via extensions

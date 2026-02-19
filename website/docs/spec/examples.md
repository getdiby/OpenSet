---
sidebar_position: 9
title: Examples
---

# Examples

The repository includes six example documents demonstrating different use cases.

## Session Examples

| File | Description | Key Features |
|------|-------------|--------------|
| `strength-upper-body.json` | Push/pull upper body session | CIRCUIT, CLUSTER with groups, rest precedence |
| `strength-lower-body.json` | Squat & hinge focused session | SEQUENTIAL, SUPERSET, RPE, per-side work |
| `conditioning-circuit.json` | Full body conditioning | AMRAP, FOR_TIME, TABATA, calories |
| `endurance-run.json` | Threshold running intervals | INTERVAL, pace, heart_rate, distance |
| `mixed-session.json` | Strength + conditioning combo | EMOM, LADDER, 1RM testing |

## Program Example

| File | Description | Key Features |
|------|-------------|--------------|
| `full-program.json` | 4-week strength foundation | Multi-phase, progressive overload, SUPERSET |

## Validating Examples

All examples validate cleanly with zero errors:

```bash
npx openset validate ./examples/strength-upper-body.json --summary
```

```
openset_version: 1.0
type: session
2 blocks, 4 series, 8 exercises, 16 sets

Result: VALID
```

## Minimal Session

The smallest valid OpenSet session:

```json
{
  "openset_version": "1.0",
  "type": "session",
  "blocks": [
    {
      "series": [
        {
          "execution_mode": "SEQUENTIAL",
          "exercises": [
            {
              "name": "Push-ups",
              "sets": [
                {
                  "execution_type": "reps_only",
                  "reps": { "type": "fixed", "value": 20 }
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

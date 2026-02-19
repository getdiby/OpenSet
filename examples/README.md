# OpenSet Examples

This directory contains example OpenSet documents demonstrating different use cases.

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

```bash
npx openset validate ./strength-upper-body.json --summary
```

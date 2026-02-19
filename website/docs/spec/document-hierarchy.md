---
sidebar_position: 2
title: Document Hierarchy
---

# Document Hierarchy

OpenSet documents follow a strict hierarchical structure.

```
PROGRAM
  PHASE
    SESSION          <-- minimum valid standalone document
      BLOCK
        SERIES
          EXERCISE
            SET
```

## Document Types

A valid OpenSet document is either:

1. **Standalone Session** — A single training session with `type: "session"`
2. **Program** — A multi-phase training plan with `type: "program"` containing phases and sessions

## Levels

### Program

Top-level container for a multi-session training plan.

| Field | Required | Description |
|-------|----------|-------------|
| `openset_version` | Yes | Spec version (e.g. `"1.0"`) |
| `type` | Yes | Must be `"program"` |
| `name` | Yes | Program name |
| `description` | No | Program description |
| `sport` | No | Target sport |
| `duration_weeks` | No | Total duration in weeks |
| `phases` | Yes | Array of Phase objects |

### Phase

Groups sessions within a program by training focus or time period.

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Phase name |
| `week_start` | No | Starting week number |
| `week_end` | No | Ending week number |
| `goal` | No | Phase objective |
| `sessions` | Yes | Array of Session objects |

### Session

The minimum valid standalone document. Represents a single training session.

| Field | Required | Description |
|-------|----------|-------------|
| `openset_version` | Yes | Spec version |
| `type` | Yes | Must be `"session"` |
| `name` | No | Session name |
| `date` | No | ISO 8601 date |
| `sport` | No | Target sport |
| `blocks` | Yes | Array of Block objects |

### Block

Groups related series within a session (e.g., warm-up, main work, cooldown).

| Field | Required | Description |
|-------|----------|-------------|
| `name` | No | Block name |
| `series` | Yes | Array of Series objects |

### Series

A group of exercises performed with a specific execution mode.

| Field | Required | Description |
|-------|----------|-------------|
| `execution_mode` | Yes | How exercises flow (see [Execution Modes](./execution-modes)) |
| `rounds` | No | Number of rounds |
| `rest_after` | No | Rest after the series |
| `exercises` | Yes | Array of Exercise objects |

### Exercise

A single exercise within a series.

| Field | Required | Description |
|-------|----------|-------------|
| `exercise_id` | One required | ID from an exercise library |
| `name` | One required | Freeform exercise name |
| `group` | No | Sub-group identifier (for CLUSTER mode) |
| `sets` | Yes | Array of Set objects |

### Set

The atomic unit — a single prescribed effort.

| Field | Required | Description |
|-------|----------|-------------|
| `execution_type` | Yes | The prescription shape (see [Execution Types](./execution-types)) |
| dimensions | Varies | Values for prescribed dimensions |

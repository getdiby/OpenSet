---
title: Validator
description: CLI and programmatic validator for OpenSet documents. Install via npm, validate JSON files and get errors and warnings.
keywords: [OpenSet, validator, CLI, validation]
---

# @diby/openset-validator

A comprehensive validator for OpenSet documents, available as both a CLI tool and a programmatic API.

## Installation

```bash
npm install @diby/openset-validator
```

## CLI Usage

```bash
npx openset validate <file> [options]
```

### Options

| Flag | Description |
|------|-------------|
| `--summary` | Show document summary (counts of blocks, series, exercises, sets) |
| `--verbose` | Show all details including passing checks |
| `--json` | Output results as JSON |

### Example Output

```
openset_version: 1.0
type: workout
2 blocks, 4 series, 12 exercises, 31 sets

ERRORS (1):
  E003  blocks[0].series[1].exercises[0].sets[2]
        dimensions declares "reps" but field is missing from set

WARNINGS (2):
  W003  blocks[1].series[0].exercises[2]
        exercise_id "chest_pass" not found in canonical library

Result: INVALID
```

## Programmatic API

```typescript
import { validate } from '@diby/openset-validator';

const document = {
  openset_version: '1.0',
  type: 'workout',
  blocks: [/* ... */]
};

const result = validate(document);

console.log(result.valid);    // true or false
console.log(result.errors);   // ValidationMessage[]
console.log(result.warnings); // ValidationMessage[]
```

### Options

```typescript
const result = validate(document, {
  library: customExerciseLibrary  // Override default exercise library
});
```

## Validation Rules

### Errors

| Code | Description |
|------|-------------|
| E001 | Unknown dimension name in dimensions array |
| ~~E002~~ | _Removed_ |
| E003 | Dimension declared in dimensions array but missing from set |
| ~~E004~~ | _Removed_ |
| E005 | Invalid value type for dimension |
| E006 | Range min must be less than max |
| E007 | Invalid value type used on dimension |
| E008 | sides value must be 1 or 2 |
| E009 | heart_rate_zone must be 1-5 |
| E010 | rpe must be 1-10 |
| E011 | group only valid in CLUSTER execution mode |
| E012 | Conflicting dimensions on same set (e.g. pace + speed) |
| E013 | Unknown dimension without a valid namespace prefix |
| E014 | Unsupported major version |
| E015 | Extension field has invalid value (must be a ValueObject) |

### Warnings

| Code | Description |
|------|-------------|
| W001 | Set rest_after overrides series rest |
| W002 | rest_after on non-last exercise in a CLUSTER group |
| W003 | exercise_id not found in library |
| W004 | Exercise has no exercise_id and no name |
| W005 | CLUSTER mode but no group fields |
| W006 | Workout has no date field |
| W007 | Load is a range but rpe is absent |
| W008 | Uneven set counts in non-SEQUENTIAL series |
| W009 | Extension field detected |
| W010 | Document minor version newer than validator minor version |

## Version Handling

The validator checks `openset_version` on every document:

- **Same major, same or older minor** (e.g. `1.0`) — validates normally
- **Same major, newer minor** (e.g. `1.1`) — validates with **W010** warning, continues checking all rules
- **Different major** (e.g. `2.0`) — **E014** error, stops validation immediately

This ensures forward compatibility: a v1.0 validator can still validate v1.1 documents (with a warning about potentially unvalidated features), while rejecting incompatible major versions.

## Supported Document Types

The validator supports all four OpenSet document types:

- `workout` — Standalone workout documents
- `program` — Multi-phase training programs
- `exercise_library` — Exercise definition collections
- `workout_library` — Reusable workout template collections

For workout library documents, inner workouts are validated using the same rules as standalone workouts. W006 ("Workout has no date") is suppressed for library workouts since they are templates without a scheduled date.

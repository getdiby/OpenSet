---
sidebar_position: 1
title: Validator
---

# @openset/validator

A comprehensive validator for OpenSet documents, available as both a CLI tool and a programmatic API.

## Installation

```bash
npm install @openset/validator
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
type: session
2 blocks, 4 series, 12 exercises, 31 sets

ERRORS (1):
  E003  blocks[0].series[1].exercises[0].sets[2]
        execution_type "reps_load" requires "reps" - field missing

WARNINGS (2):
  W003  blocks[1].series[0].exercises[2]
        exercise_id "chest_pass" not found in canonical library

Result: INVALID
```

## Programmatic API

```typescript
import { validate } from '@openset/validator';

const document = {
  openset_version: '1.0',
  type: 'session',
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
| E001 | Unknown execution_type |
| E002 | Execution type not compatible with exercise |
| E003 | Required dimension missing for execution type |
| E004 | Dimension not allowed for execution type |
| E005 | Invalid value type for dimension |
| E006 | Range min > max |
| E007 | Invalid value type used on dimension |
| E008 | Missing unit on dimensional value |
| E009 | Invalid tempo format |
| E010 | Fixed value must be positive |
| E011 | Multiple execution types on same set |
| E012 | Conflicting dimensions on same set |
| E013 | Unknown field without extension prefix |

### Warnings

| Code | Description |
|------|-------------|
| W001 | Set rest_after overrides series rest |
| W002 | Series rest_after present on last series |
| W003 | exercise_id not found in library |
| W004 | No exercise library referenced |
| W005 | Extension execution type used |
| W006 | Exercise missing recommended metadata |
| W007 | Unusual dimension value |
| W008 | Duplicate exercise_id in session |
| W009 | Extension field detected |

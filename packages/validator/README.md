# @diby/openset-validator

Validator for [OpenSet](https://github.com/getdiby/openset) training workout and program documents.

Validates documents against the OpenSet v1.0 specification, checking both structural correctness and semantic rules.

## Installation

```bash
npm install @diby/openset-validator
```

## Programmatic API

```typescript
import { validate } from '@diby/openset-validator';

const result = validate(document);

// result shape:
// {
//   valid: boolean;
//   errors: ValidationMessage[];
//   warnings: ValidationMessage[];
// }

// ValidationMessage shape:
// {
//   code: string;          // e.g. "E003"
//   level: 'error' | 'warn';
//   path: string;          // JSON path, e.g. "blocks[0].series[0].exercises[1].sets[0]"
//   message: string;       // Human-readable description
// }
```

## CLI

```bash
# Validate a file
npx openset validate ./my-workout.json

# Validate with structural summary
npx openset validate ./my-workout.json --summary

# Validate with verbose output
npx openset validate ./my-workout.json --verbose

# Output as JSON
npx openset validate ./my-workout.json --json
```

## Validation Rules

### Errors (invalid document)

| Code | Rule |
|------|------|
| E001 | Each entry in the `dimensions` array must be a known dimension name |
| E003 | Every dimension listed in the `dimensions` array must have a corresponding field on the set |
| E005 | Value object type must be valid (fixed, range, min, amrap, max, any) |
| E006 | Range min must be less than max |
| E007 | Dimension must use allowed value types |
| E008 | `sides` must be 1 or 2 |
| E009 | `heart_rate_zone` must be 1-5 |
| E010 | `rpe` must be 1-10 |
| E011 | `group` only valid in CLUSTER mode |
| E012 | Mutually exclusive dimensions (pace+speed, heart_rate+heart_rate_zone) |
| E013 | Unknown dimension without valid namespace prefix |
| E014 | Unsupported major `openset_version` |
| E015 | Extension field has invalid value shape (must be a valid ValueObject) |

### Warnings (valid but suspicious)

| Code | Rule |
|------|------|
| W001 | rest_after at both SET and SERIES level |
| W002 | rest_after in group on non-last exercise |
| W003 | exercise_id not in canonical library |
| W004 | No exercise_id and no name |
| W005 | CLUSTER mode but no group fields |
| W006 | No date field on workout |
| W007 | Load range without rpe |
| W008 | Uneven set counts in non-SEQUENTIAL series |
| W009 | Unknown namespaced extension field |
| W010 | Document minor version newer than validator minor version |

## License

MIT

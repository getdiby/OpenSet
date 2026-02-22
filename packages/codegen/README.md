# @openset/codegen

A fluent TypeScript builder for constructing valid OpenSet documents with full type safety, autocompletion, and optional runtime validation.

## Installation

```bash
npm install @openset/codegen
```

For validated builds, also install the validator:

```bash
npm install @openset/codegen @openset/validator
```

## Quick Start

```typescript
import { workout, set, fixed, range, amrap } from '@openset/codegen';

const doc = workout('Upper Body Push')
  .date('2024-01-15')
  .sports('strength')
  .block('Warm-Up', b => b
    .series('SEQUENTIAL', s => s
      .exercise('push_up', e => e
        .set(set({ reps: fixed(15) }))
      )
    )
  )
  .block('Main Work', b => b
    .series('SEQUENTIAL', s => s
      .exercise('bench_press', e => e
        .set(set({ reps: fixed(5), load: fixed(100, 'kg') }))
        .set(set({ reps: fixed(5), load: fixed(100, 'kg') }))
        .set(set({ reps: amrap(), load: fixed(100, 'kg'), rpe: fixed(9) }))
      )
      .rest(180, 's')
    )
  )
  .build();
```

## Value Helpers

Shorthand functions for creating value objects:

| Function | Output | Example |
|----------|--------|---------|
| `fixed(value, unit?)` | `{ type: 'fixed', value, unit }` | `fixed(100, 'kg')` |
| `range(min, max, unit?)` | `{ type: 'range', min, max, unit }` | `range(8, 12)` |
| `min(value, unit?)` | `{ type: 'min', value, unit }` | `min(5)` |
| `amrap()` | `{ type: 'amrap' }` | `amrap()` |
| `max()` | `{ type: 'max' }` | `max()` |
| `any()` | `{ type: 'any' }` | `any()` |

The `range()` function validates that `min < max` at construction time.

## Set Builder

The `set()` function accepts an object of dimension key-value pairs and **automatically infers** the `dimensions` array from the keys you provide.

```typescript
set({ reps: fixed(5), load: fixed(100, 'kg') })
// produces: { dimensions: ["reps", "load"], reps: { ... }, load: { ... } }
```

Non-dimension fields (`rest_after`, `note`) are supported but excluded from the inferred `dimensions` array.

## Document Builders

### `workout(name?)`

Creates a standalone workout document.

```typescript
workout('Morning Workout')
  .id('w-001')
  .date('2024-01-15')
  .sports('strength')
  .note('Focus on form')
  .block('Block Name', b => { /* ... */ })
  .build()
```

### `program(name)`

Creates a multi-phase program document.

```typescript
program('4-Week Strength')
  .description('Progressive overload program')
  .sports('strength')
  .duration(4, 'week') // or .durationWeeks(4)
  .author('Coach')
  .phase('Base Building', p => p
    .weeks(1, 2)
    .goal('Build work capacity')
    .workout('Day 1', s => { /* ... */ })
  )
  .build()
```

## Hierarchy Builders

Builders use callback-based nesting that mirrors the document hierarchy:

```
workout → block → series → exercise → set
program → phase → workout → block → series → exercise → set
```

### Series

```typescript
.series('CIRCUIT', s => s
  .rounds(fixed(3))
  .rest(120, 's')
  .exercise('push_up', e => { /* ... */ })
  .namedExercise('Custom Drill', e => { /* ... */ })
)
```

### Exercise

```typescript
.exercise('bench_press', e => e
  .group('pair_a')            // for CLUSTER mode
  .note('Control the eccentric')
  .set(set({ reps: fixed(5), load: fixed(100, 'kg') }))
  .sets(3, set({ reps: fixed(8), load: fixed(80, 'kg') }))  // 3 identical sets
)
```

## Validated Builds

The `.buildValidated()` method runs `@openset/validator` on the built document and throws a `ValidationError` if there are errors:

```typescript
import { workout, set, fixed, ValidationError } from '@openset/codegen';

try {
  const doc = await workout('Test')
    .block('A', b => b
      .series('SEQUENTIAL', s => s
        .exercise('bench_press', e => e
          .set(set({ reps: fixed(5), load: fixed(100, 'kg') }))
        )
      )
    )
    .buildValidated();
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.result.errors);
  }
}
```

`buildValidated()` is async and requires `@openset/validator` as a peer dependency.

## License

[MIT](../../LICENSE)

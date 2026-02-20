---
title: Code Generator
---

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

Shorthand functions for creating `ValueObject` instances:

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

The `set()` function is the single builder for all sets. It accepts an object of dimension key-value pairs and **automatically infers** the `dimensions` array from the keys you provide.

```typescript
set({ reps: fixed(5), load: fixed(100, 'kg') })
// produces: { dimensions: ["reps", "load"], reps: { ... }, load: { ... } }
```

Any valid dimension name can be passed as a key. The `dimensions` array on the resulting set object is derived from the keys at build time — you never need to declare it manually.

Common dimension names include: `reps`, `load`, `duration`, `distance`, `power`, `calories`, `rounds`, `height`, `sides`, `tempo`, `velocity`, `pace`, `speed`, `heart_rate`, `heart_rate_zone`, `rpe`, `incline`, `rest_between_sides`, `cadence`, `resistance`.

The `set()` function also accepts `rest_after` and `note` as optional fields (these are not dimensions and are not included in the inferred `dimensions` array).

## Document Builders

### `workout(name?)`

Creates a `WorkoutBuilder` for building standalone workout documents.

```typescript
workout('Morning Workout')
  .id('sess-001')
  .date('2024-01-15')
  .sports('strength')
  .note('Focus on form')
  .extensions(['x_band'])
  .block('Block Name', b => { /* ... */ })
  .build()
```

### `program(name)`

Creates a `ProgramBuilder` for building multi-phase program documents.

```typescript
program('4-Week Strength')
  .description('Progressive overload program')
  .sports('strength')
  .durationWeeks(4)
  .author('Coach')
  .createdAt('2024-01-01')
  .phase('Base Building', p => p
    .weeks(1, 2)
    .goal('Build work capacity')
    .workout('Day 1', s => { /* ... */ })
  )
  .build()
```

## Hierarchy Builders

The builders use **callback-based nesting** that mirrors the document hierarchy:

```
workout → block → series → exercise → set
program → phase → workout → block → series → exercise → set
```

### Block

```typescript
.block('Name', b => b
  .id('block-1')
  .note('Heavy work')
  .series('SEQUENTIAL', s => { /* ... */ })
)
```

### Series

```typescript
.series('CIRCUIT', s => s
  .id('series-1')
  .rounds(fixed(3))
  .rest(120, 's')           // shorthand for fixed rest
  .restAfter(range(60, 90, 's'))  // or full ValueObject
  .note('3 rounds, minimal rest')
  .exercise('push_up', e => { /* ... */ })
  .namedExercise('Custom Drill', e => { /* ... */ })
)
```

### Exercise

```typescript
.exercise('bench_press', e => e
  .name('Bench Press')        // optional display name
  .group('pair_a')           // for CLUSTER mode
  .note('Control the eccentric')
  .set(set({ reps: fixed(5), load: fixed(100, 'kg') }))
  .sets(3, set({ reps: fixed(8), load: fixed(80, 'kg') }))  // 3 identical sets
)
```

The `.sets(count, set)` method creates N shallow copies — useful for "3×8 at 80kg" patterns.

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

  console.log('Valid!', doc);
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.result.errors);  // ValidationMessage[]
  }
}
```

:::note
`buildValidated()` is async and requires `@openset/validator` to be installed. If the validator is not installed, it throws an error with installation instructions.
:::

## Full Program Example

```typescript
import { program, set, fixed, range } from '@openset/codegen';

const plan = program('4-Week Strength Foundation')
  .sports('strength')
  .durationWeeks(4)
  .author('Coach')
  .phase('Base Building', p => p
    .weeks(1, 2)
    .goal('Build work capacity with moderate loads')
    .workout('Upper Body', s => s
      .block('Main Work', b => b
        .series('SEQUENTIAL', ser => ser
          .exercise('bench_press', e => e
            .sets(3, set({
              reps: fixed(8),
              load: fixed(60, 'kg'),
              rpe: fixed(7),
              rest_after: fixed(120, 's'),
            }))
          )
        )
      )
    )
  )
  .phase('Intensification', p => p
    .weeks(3, 4)
    .goal('Increase intensity with heavier loads')
    .workout('Upper Body', s => s
      .block('Main Work', b => b
        .series('SEQUENTIAL', ser => ser
          .exercise('bench_press', e => e
            .sets(5, set({
              reps: fixed(5),
              load: fixed(70, 'kg'),
              rpe: fixed(8),
              rest_after: fixed(180, 's'),
            }))
          )
        )
      )
    )
  )
  .build();
```

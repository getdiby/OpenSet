import { describe, it, expect } from 'vitest';
import { validate, countElements } from '../src/index.js';

function workout(blocks: any[]) {
  return { openset_version: '1.0', type: 'workout', name: 'Test', date: '2026-01-01', blocks };
}

function block(series: any[]) {
  return { name: 'Block', series };
}

function series(mode: string, exercises: any[], extra: any = {}) {
  return { execution_mode: mode, exercises, ...extra };
}

function exercise(id: string, sets: any[], extra: any = {}) {
  return { exercise_id: id, sets, ...extra };
}

function namedExercise(name: string, sets: any[], extra: any = {}) {
  return { name, sets, ...extra };
}

// === E001: Unknown dimension name ===
describe('E001 — unknown dimension name', () => {
  it('should error on unknown dimension in dimensions array', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{ dimensions: ['reps', 'unknown_dim'], reps: { type: 'fixed', value: 5 } }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E001')).toBe(true);
  });

  it('should pass on valid dimensions', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{ dimensions: ['reps', 'load'], reps: { type: 'fixed', value: 5 }, load: { type: 'fixed', value: 100, unit: 'kg' } }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E001')).toBe(false);
  });
});

// === E003: Dimension declared but missing from set ===
describe('E003 — dimension declared but missing from set', () => {
  it('should error when declared dimension is missing from set', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{ dimensions: ['reps', 'load'] }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E003')).toBe(true);
  });

  it('should pass when all declared dimensions are present', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{ dimensions: ['reps', 'load'], reps: { type: 'fixed', value: 5 }, load: { type: 'fixed', value: 100, unit: 'kg' } }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E003')).toBe(false);
  });
});

// === E005: Invalid value type ===
describe('E005 — invalid value object type', () => {
  it('should error on unknown value type', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'invalid', value: 5 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E005')).toBe(true);
  });
});

// === E006: Range min >= max ===
describe('E006 — range min >= max', () => {
  it('should error when range min equals max', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'range', min: 10, max: 10 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E006')).toBe(true);
  });

  it('should error when range min > max', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'range', min: 12, max: 8 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E006')).toBe(true);
  });

  it('should pass when range min < max', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'range', min: 8, max: 12 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E006')).toBe(false);
  });
});

// === E007: Dimension does not allow value type ===
describe('E007 — dimension does not allow value type', () => {
  it('should error when dimension uses disallowed value type', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps', 'load'],
        reps: { type: 'fixed', value: 5 },
        load: { type: 'amrap' },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E007')).toBe(true);
  });
});

// === E008: sides must be 1 or 2 ===
describe('E008 — sides value constraint', () => {
  it('should error when sides is not 1 or 2', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('lunge', [{
        dimensions: ['reps', 'sides'],
        reps: { type: 'fixed', value: 10 },
        sides: { type: 'fixed', value: 3 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E008')).toBe(true);
  });

  it('should pass when sides is 2', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('lunge', [{
        dimensions: ['reps', 'sides'],
        reps: { type: 'fixed', value: 10 },
        sides: { type: 'fixed', value: 2 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E008')).toBe(false);
  });
});

// === E009: heart_rate_zone must be 1-5 ===
describe('E009 — heart_rate_zone constraint', () => {
  it('should error when heart_rate_zone is 0', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('run', [{
        dimensions: ['duration'],
        duration: { type: 'fixed', value: 1800, unit: 's' },
        heart_rate_zone: { type: 'fixed', value: 0 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E009')).toBe(true);
  });

  it('should error when heart_rate_zone is 6', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('run', [{
        dimensions: ['duration'],
        duration: { type: 'fixed', value: 1800, unit: 's' },
        heart_rate_zone: { type: 'fixed', value: 6 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E009')).toBe(true);
  });
});

// === E010: rpe must be 1-10 ===
describe('E010 — rpe constraint', () => {
  it('should error when rpe is 0', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'fixed', value: 5 },
        rpe: { type: 'fixed', value: 0 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E010')).toBe(true);
  });

  it('should error when rpe is 11', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'fixed', value: 5 },
        rpe: { type: 'fixed', value: 11 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E010')).toBe(true);
  });
});

// === E011: group only valid in CLUSTER ===
describe('E011 — group only in CLUSTER', () => {
  it('should error when group used outside CLUSTER', () => {
    const doc = workout([block([series('CIRCUIT', [
      exercise('back_squat', [{ dimensions: ['reps'], reps: { type: 'fixed', value: 5 } }], { group: 'pair_a' }),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E011')).toBe(true);
  });

  it('should pass when group used in CLUSTER', () => {
    const doc = workout([block([series('CLUSTER', [
      exercise('back_squat', [{ dimensions: ['reps'], reps: { type: 'fixed', value: 5 } }], { group: 'pair_a' }),
      exercise('bench_press', [{ dimensions: ['reps'], reps: { type: 'fixed', value: 5 } }], { group: 'pair_a' }),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E011')).toBe(false);
  });
});

// === E012: Mutually exclusive dimensions ===
describe('E012 — mutually exclusive dimensions', () => {
  it('should error when pace and speed both present', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('run', [{
        dimensions: ['distance'],
        distance: { type: 'fixed', value: 5, unit: 'km' },
        pace: { type: 'fixed', value: 5, unit: 'min/km' },
        speed: { type: 'fixed', value: 12, unit: 'km/h' },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E012')).toBe(true);
  });

  it('should error when heart_rate and heart_rate_zone both present', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('run', [{
        dimensions: ['distance'],
        distance: { type: 'fixed', value: 5, unit: 'km' },
        heart_rate: { type: 'fixed', value: 150, unit: 'bpm' },
        heart_rate_zone: { type: 'fixed', value: 3 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E012')).toBe(true);
  });
});

// === E013: Unknown dimension without namespace prefix ===
describe('E013 — unknown dimension without namespace', () => {
  it('should error on unknown unprefixed dimension', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'fixed', value: 5 },
        grip_width: { type: 'fixed', value: 30, unit: 'cm' },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E013')).toBe(true);
  });

  it('should warn (not error) on x_ prefixed extension', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'fixed', value: 5 },
        x_grip_width: { type: 'fixed', value: 30, unit: 'cm' },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E013')).toBe(false);
    expect(result.warnings.some(w => w.code === 'W009')).toBe(true);
  });
});

// === W001: rest_after at SET and SERIES ===
describe('W001 — rest at SET and SERIES', () => {
  it('should warn when rest_after at both levels', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'fixed', value: 5 },
        rest_after: { type: 'fixed', value: 60, unit: 's' },
      }]),
    ], { rest_after: { type: 'fixed', value: 90, unit: 's' } })])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W001')).toBe(true);
  });
});

// === W003: Unknown exercise_id ===
describe('W003 — unknown exercise_id', () => {
  it('should warn on unknown exercise_id', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('made_up_exercise', [{ dimensions: ['reps'], reps: { type: 'fixed', value: 5 } }]),
    ])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W003')).toBe(true);
  });
});

// === W004: No exercise_id and no name ===
describe('W004 — no exercise_id and no name', () => {
  it('should warn when exercise has neither id nor name', () => {
    const doc = workout([block([series('SEQUENTIAL', [{
      sets: [{ dimensions: ['reps'], reps: { type: 'fixed', value: 5 } }],
    }])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W004')).toBe(true);
  });
});

// === W005: CLUSTER without group ===
describe('W005 — CLUSTER without group', () => {
  it('should warn when CLUSTER mode but no group fields', () => {
    const doc = workout([block([series('CLUSTER', [
      exercise('back_squat', [{ dimensions: ['reps'], reps: { type: 'fixed', value: 5 } }]),
      exercise('bench_press', [{ dimensions: ['reps'], reps: { type: 'fixed', value: 5 } }]),
    ])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W005')).toBe(true);
  });
});

// === W006: No date field ===
describe('W006 — no date field', () => {
  it('should warn when workout has no date', () => {
    const doc = {
      openset_version: '1.0',
      type: 'workout',
      name: 'Test',
      blocks: [block([series('SEQUENTIAL', [
        exercise('back_squat', [{ dimensions: ['reps'], reps: { type: 'fixed', value: 5 } }]),
      ])])],
    };
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W006')).toBe(true);
  });
});

// === W007: Load range without rpe ===
describe('W007 — load range without rpe', () => {
  it('should warn when load is range but rpe absent', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps', 'load'],
        reps: { type: 'fixed', value: 5 },
        load: { type: 'range', min: 80, max: 100, unit: 'kg' },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W007')).toBe(true);
  });

  it('should not warn when load is range and rpe is present', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps', 'load'],
        reps: { type: 'fixed', value: 5 },
        load: { type: 'range', min: 80, max: 100, unit: 'kg' },
        rpe: { type: 'fixed', value: 8 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W007')).toBe(false);
  });
});

// === W008: Uneven set counts ===
describe('W008 — uneven set counts', () => {
  it('should warn when exercises have uneven set counts in CIRCUIT', () => {
    const doc = workout([block([series('CIRCUIT', [
      exercise('back_squat', [
        { dimensions: ['reps'], reps: { type: 'fixed', value: 5 } },
        { dimensions: ['reps'], reps: { type: 'fixed', value: 5 } },
        { dimensions: ['reps'], reps: { type: 'fixed', value: 5 } },
      ]),
      exercise('plank', [
        { dimensions: ['duration'], duration: { type: 'fixed', value: 45, unit: 's' } },
        { dimensions: ['duration'], duration: { type: 'fixed', value: 45, unit: 's' } },
      ]),
    ])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W008')).toBe(true);
  });

  it('should not warn in SEQUENTIAL mode', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [
        { dimensions: ['reps'], reps: { type: 'fixed', value: 5 } },
        { dimensions: ['reps'], reps: { type: 'fixed', value: 5 } },
      ]),
      exercise('plank', [
        { dimensions: ['duration'], duration: { type: 'fixed', value: 45, unit: 's' } },
      ]),
    ])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W008')).toBe(false);
  });
});

// === E014: Unsupported major version ===
describe('E014 — unsupported major version', () => {
  it('should error on major version 2', () => {
    const doc = {
      openset_version: '2.0',
      type: 'workout',
      name: 'Test',
      date: '2026-01-01',
      blocks: [block([series('SEQUENTIAL', [
        exercise('back_squat', [{ dimensions: ['reps'], reps: { type: 'fixed', value: 5 } }]),
      ])])],
    };
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E014')).toBe(true);
    expect(result.valid).toBe(false);
  });

  it('should pass on version 1.0', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{ dimensions: ['reps'], reps: { type: 'fixed', value: 5 } }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E014')).toBe(false);
  });
});

// === W010: Newer minor version ===
describe('W010 — newer minor version', () => {
  it('should warn on version 1.1', () => {
    const doc = {
      openset_version: '1.1',
      type: 'workout',
      name: 'Test',
      date: '2026-01-01',
      blocks: [block([series('SEQUENTIAL', [
        exercise('back_squat', [{ dimensions: ['reps'], reps: { type: 'fixed', value: 5 } }]),
      ])])],
    };
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W010')).toBe(true);
    // Should still validate the rest of the document
    expect(result.valid).toBe(true);
  });

  it('should not warn on version 1.0', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{ dimensions: ['reps'], reps: { type: 'fixed', value: 5 } }]),
    ])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W010')).toBe(false);
  });
});

// === E015: Extension field with invalid value shape ===
describe('E015 — extension field invalid value shape', () => {
  it('should error when extension field is a plain string', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'fixed', value: 5 },
        x_custom: 'not a value object',
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E015')).toBe(true);
  });

  it('should error when extension field is a number', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'fixed', value: 5 },
        app_tracking_id: 42,
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E015')).toBe(true);
  });

  it('should error when extension field is an object without type', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'fixed', value: 5 },
        x_grip: { value: 30, unit: 'cm' },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E015')).toBe(true);
  });

  it('should pass when extension field is a valid ValueObject', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'fixed', value: 5 },
        x_grip_width: { type: 'fixed', value: 30, unit: 'cm' },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E015')).toBe(false);
    // Should still warn about extension field
    expect(result.warnings.some(w => w.code === 'W009')).toBe(true);
  });
});

// === Extension regex alignment ===
describe('Extension regex — reverse-DNS pattern', () => {
  it('should accept com_myapp_ prefixed fields as extensions', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'fixed', value: 5 },
        com_myapp_tracking: { type: 'fixed', value: 1 },
      }]),
    ])])]);
    const result = validate(doc);
    // Should be a W009 warning, not E013 error
    expect(result.errors.some(e => e.code === 'E013')).toBe(false);
    expect(result.warnings.some(w => w.code === 'W009')).toBe(true);
  });
});

// === Integration: Valid document ===
describe('Integration — valid document', () => {
  it('should validate a complete valid workout', () => {
    const doc = {
      openset_version: '1.0',
      type: 'workout',
      name: 'Upper Body — Push/Pull',
      date: '2026-02-17',
      sports: ['strength'],
      blocks: [
        {
          name: 'Block A',
          series: [
            {
              execution_mode: 'SUPERSET',
              rounds: { type: 'fixed', value: 3 },
              exercises: [
                {
                  exercise_id: 'bench_press',
                  sets: [
                    { dimensions: ['reps', 'load'], reps: { type: 'fixed', value: 8 }, load: { type: 'fixed', value: 80, unit: 'kg' } },
                    { dimensions: ['reps', 'load'], reps: { type: 'fixed', value: 8 }, load: { type: 'fixed', value: 80, unit: 'kg' } },
                    { dimensions: ['reps', 'load'], reps: { type: 'fixed', value: 8 }, load: { type: 'fixed', value: 80, unit: 'kg' } },
                  ],
                },
                {
                  exercise_id: 'pull_up',
                  sets: [
                    { dimensions: ['reps'], reps: { type: 'fixed', value: 10 } },
                    { dimensions: ['reps'], reps: { type: 'fixed', value: 10 } },
                    { dimensions: ['reps'], reps: { type: 'fixed', value: 10 } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const result = validate(doc);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// === Dimensions flexibility: any known dimension is optional ===
describe('Dimensions flexibility', () => {
  it('should allow extra known dimensions not in dimensions array', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'fixed', value: 10 },
        distance: { type: 'fixed', value: 100, unit: 'm' },
      }]),
    ])])]);
    const result = validate(doc);
    // No E004 error — any known dimension is freely allowed
    expect(result.errors).toHaveLength(0);
  });

  it('should allow rest_after on any set', () => {
    const doc = workout([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        dimensions: ['reps'],
        reps: { type: 'fixed', value: 10 },
        rest_after: { type: 'fixed', value: 60, unit: 's' },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors).toHaveLength(0);
  });
});

// === countElements ===
describe('countElements', () => {
  it('should count elements correctly', () => {
    const doc = {
      blocks: [
        {
          series: [
            { exercises: [{ sets: [{}, {}] }, { sets: [{}] }] },
            { exercises: [{ sets: [{}] }] },
          ],
        },
        {
          series: [{ exercises: [{ sets: [{}, {}, {}] }] }],
        },
      ],
    };
    const counts = countElements(doc);
    expect(counts.blocks).toBe(2);
    expect(counts.series).toBe(3);
    expect(counts.exercises).toBe(4);
    expect(counts.sets).toBe(7);
  });
});

// === Workout Library validation ===
describe('Workout Library validation', () => {
  const workoutLibrary = (workouts: any[]) => ({
    openset_version: '1.0',
    type: 'workout_library',
    id: 'test-lib',
    name: 'Test Library',
    version: '1.0.0',
    provider: 'test',
    license: 'MIT',
    workouts,
  });

  const validWorkout = {
    id: 'bench_day',
    name: 'Bench Day',
    blocks: [{
      series: [{
        execution_mode: 'SEQUENTIAL',
        exercises: [{
          exercise_id: 'bench_press',
          sets: [{ dimensions: ['reps', 'load'], reps: { type: 'fixed', value: 5 }, load: { type: 'fixed', value: 100, unit: 'kg' } }],
        }],
      }],
    }],
  };

  it('accepts a valid workout library', () => {
    const result = validate(workoutLibrary([validWorkout]));
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('errors on empty workouts array', () => {
    const result = validate(workoutLibrary([]));
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe('SCHEMA');
    expect(result.errors[0].path).toBe('workouts');
  });

  it('errors on missing workout id', () => {
    const result = validate(workoutLibrary([{ name: 'Test', blocks: validWorkout.blocks }]));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('"id"'))).toBe(true);
  });

  it('errors on missing workout name', () => {
    const result = validate(workoutLibrary([{ id: 'test', blocks: validWorkout.blocks }]));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('"name"'))).toBe(true);
  });

  it('errors on missing workout blocks', () => {
    const result = validate(workoutLibrary([{ id: 'test', name: 'Test' }]));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('"blocks"'))).toBe(true);
  });

  it('errors on duplicate workout IDs', () => {
    const result = validate(workoutLibrary([validWorkout, { ...validWorkout }]));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('Duplicate'))).toBe(true);
  });

  it('validates inner blocks with correct path prefix', () => {
    const badWorkout = {
      id: 'bad',
      name: 'Bad',
      blocks: [{
        series: [{
          execution_mode: 'SEQUENTIAL',
          exercises: [{
            exercise_id: 'bench_press',
            sets: [{ dimensions: ['reps'], load: { type: 'fixed', value: 100, unit: 'kg' } }],
          }],
        }],
      }],
    };
    const result = validate(workoutLibrary([badWorkout]));
    // Should have inner validation messages with "workouts[0]." prefix in path
    const allPaths = [...result.errors, ...result.warnings].map(m => m.path);
    expect(allPaths.some(p => p.startsWith('workouts[0]'))).toBe(true);
  });

  it('suppresses W006 for library workouts', () => {
    // Library workouts are templates and should not get "no date" warnings
    const result = validate(workoutLibrary([validWorkout]));
    expect(result.warnings.every(w => w.code !== 'W006')).toBe(true);
  });
});

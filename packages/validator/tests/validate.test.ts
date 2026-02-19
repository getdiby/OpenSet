import { describe, it, expect } from 'vitest';
import { validate, countElements } from '../src/index.js';

function session(blocks: any[]) {
  return { openset_version: '1.0', type: 'session', name: 'Test', date: '2026-01-01', blocks };
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

// === E001: Unknown execution_type ===
describe('E001 — unknown execution_type', () => {
  it('should error on unknown execution_type', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{ execution_type: 'unknown_type', reps: { type: 'fixed', value: 5 } }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E001')).toBe(true);
  });

  it('should pass on valid execution_type', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{ execution_type: 'reps_load', reps: { type: 'fixed', value: 5 }, load: { type: 'fixed', value: 100, unit: 'kg' } }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E001')).toBe(false);
  });
});

// === E002: execution_type not allowed for exercise ===
describe('E002 — execution_type not allowed for exercise', () => {
  it('should error when execution_type is not in exercise allowed list', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('plank', [{ execution_type: 'reps_load', reps: { type: 'fixed', value: 5 }, load: { type: 'fixed', value: 10, unit: 'kg' } }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E002')).toBe(true);
  });

  it('should pass when execution_type is allowed for exercise', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('plank', [{ execution_type: 'duration_only', duration: { type: 'fixed', value: 60, unit: 's' } }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E002')).toBe(false);
  });
});

// === E003: Required dimension missing ===
describe('E003 — required dimension missing', () => {
  it('should error when required dimension is missing', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{ execution_type: 'reps_load' }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E003')).toBe(true);
  });

  it('should pass when all required dimensions present', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{ execution_type: 'reps_load', reps: { type: 'fixed', value: 5 }, load: { type: 'fixed', value: 100, unit: 'kg' } }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E003')).toBe(false);
  });
});

// === E004: Extra dimension not allowed ===
describe('E004 — dimension not allowed for execution_type', () => {
  it('should error on dimension not in required or optional', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_only',
        reps: { type: 'fixed', value: 10 },
        distance: { type: 'fixed', value: 100, unit: 'm' },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E004')).toBe(true);
  });

  it('should allow rest_after on any set', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_only',
        reps: { type: 'fixed', value: 10 },
        rest_after: { type: 'fixed', value: 60, unit: 's' },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E004')).toBe(false);
  });
});

// === E005: Invalid value type ===
describe('E005 — invalid value object type', () => {
  it('should error on unknown value type', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_only',
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
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_only',
        reps: { type: 'range', min: 10, max: 10 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E006')).toBe(true);
  });

  it('should error when range min > max', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_only',
        reps: { type: 'range', min: 12, max: 8 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E006')).toBe(true);
  });

  it('should pass when range min < max', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_only',
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
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_load',
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
    const doc = session([block([series('SEQUENTIAL', [
      exercise('lunge', [{
        execution_type: 'reps_per_side',
        reps: { type: 'fixed', value: 10 },
        sides: { type: 'fixed', value: 3 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E008')).toBe(true);
  });

  it('should pass when sides is 2', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('lunge', [{
        execution_type: 'reps_per_side',
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
    const doc = session([block([series('SEQUENTIAL', [
      exercise('run', [{
        execution_type: 'duration_only',
        duration: { type: 'fixed', value: 1800, unit: 's' },
        heart_rate_zone: { type: 'fixed', value: 0 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E009')).toBe(true);
  });

  it('should error when heart_rate_zone is 6', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('run', [{
        execution_type: 'duration_only',
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
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_only',
        reps: { type: 'fixed', value: 5 },
        rpe: { type: 'fixed', value: 0 },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E010')).toBe(true);
  });

  it('should error when rpe is 11', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_only',
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
    const doc = session([block([series('CIRCUIT', [
      exercise('back_squat', [{ execution_type: 'reps_only', reps: { type: 'fixed', value: 5 } }], { group: 'pair_a' }),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E011')).toBe(true);
  });

  it('should pass when group used in CLUSTER', () => {
    const doc = session([block([series('CLUSTER', [
      exercise('back_squat', [{ execution_type: 'reps_only', reps: { type: 'fixed', value: 5 } }], { group: 'pair_a' }),
      exercise('bench_press', [{ execution_type: 'reps_only', reps: { type: 'fixed', value: 5 } }], { group: 'pair_a' }),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E011')).toBe(false);
  });
});

// === E012: Mutually exclusive dimensions ===
describe('E012 — mutually exclusive dimensions', () => {
  it('should error when pace and speed both present', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('run', [{
        execution_type: 'distance_only',
        distance: { type: 'fixed', value: 5, unit: 'km' },
        pace: { type: 'fixed', value: 5, unit: 'min/km' },
        speed: { type: 'fixed', value: 12, unit: 'km/h' },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E012')).toBe(true);
  });

  it('should error when heart_rate and heart_rate_zone both present', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('run', [{
        execution_type: 'distance_only',
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
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_only',
        reps: { type: 'fixed', value: 5 },
        grip_width: { type: 'fixed', value: 30, unit: 'cm' },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.errors.some(e => e.code === 'E013')).toBe(true);
  });

  it('should warn (not error) on x_ prefixed extension', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_only',
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
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_only',
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
    const doc = session([block([series('SEQUENTIAL', [
      exercise('made_up_exercise', [{ execution_type: 'reps_only', reps: { type: 'fixed', value: 5 } }]),
    ])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W003')).toBe(true);
  });
});

// === W004: No exercise_id and no name ===
describe('W004 — no exercise_id and no name', () => {
  it('should warn when exercise has neither id nor name', () => {
    const doc = session([block([series('SEQUENTIAL', [{
      sets: [{ execution_type: 'reps_only', reps: { type: 'fixed', value: 5 } }],
    }])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W004')).toBe(true);
  });
});

// === W005: CLUSTER without group ===
describe('W005 — CLUSTER without group', () => {
  it('should warn when CLUSTER mode but no group fields', () => {
    const doc = session([block([series('CLUSTER', [
      exercise('back_squat', [{ execution_type: 'reps_only', reps: { type: 'fixed', value: 5 } }]),
      exercise('bench_press', [{ execution_type: 'reps_only', reps: { type: 'fixed', value: 5 } }]),
    ])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W005')).toBe(true);
  });
});

// === W006: No date field ===
describe('W006 — no date field', () => {
  it('should warn when session has no date', () => {
    const doc = {
      openset_version: '1.0',
      type: 'session',
      name: 'Test',
      blocks: [block([series('SEQUENTIAL', [
        exercise('back_squat', [{ execution_type: 'reps_only', reps: { type: 'fixed', value: 5 } }]),
      ])])],
    };
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W006')).toBe(true);
  });
});

// === W007: Load range without rpe ===
describe('W007 — load range without rpe', () => {
  it('should warn when load is range but rpe absent', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_load',
        reps: { type: 'fixed', value: 5 },
        load: { type: 'range', min: 80, max: 100, unit: 'kg' },
      }]),
    ])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W007')).toBe(true);
  });

  it('should not warn when load is range and rpe is present', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [{
        execution_type: 'reps_load',
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
    const doc = session([block([series('CIRCUIT', [
      exercise('back_squat', [
        { execution_type: 'reps_only', reps: { type: 'fixed', value: 5 } },
        { execution_type: 'reps_only', reps: { type: 'fixed', value: 5 } },
        { execution_type: 'reps_only', reps: { type: 'fixed', value: 5 } },
      ]),
      exercise('plank', [
        { execution_type: 'duration_only', duration: { type: 'fixed', value: 45, unit: 's' } },
        { execution_type: 'duration_only', duration: { type: 'fixed', value: 45, unit: 's' } },
      ]),
    ])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W008')).toBe(true);
  });

  it('should not warn in SEQUENTIAL mode', () => {
    const doc = session([block([series('SEQUENTIAL', [
      exercise('back_squat', [
        { execution_type: 'reps_only', reps: { type: 'fixed', value: 5 } },
        { execution_type: 'reps_only', reps: { type: 'fixed', value: 5 } },
      ]),
      exercise('plank', [
        { execution_type: 'duration_only', duration: { type: 'fixed', value: 45, unit: 's' } },
      ]),
    ])])]);
    const result = validate(doc);
    expect(result.warnings.some(w => w.code === 'W008')).toBe(false);
  });
});

// === Integration: Valid document ===
describe('Integration — valid document', () => {
  it('should validate a complete valid session', () => {
    const doc = {
      openset_version: '1.0',
      type: 'session',
      name: 'Upper Body — Push/Pull',
      date: '2026-02-17',
      sport: 'strength',
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
                    { execution_type: 'reps_load', reps: { type: 'fixed', value: 8 }, load: { type: 'fixed', value: 80, unit: 'kg' } },
                    { execution_type: 'reps_load', reps: { type: 'fixed', value: 8 }, load: { type: 'fixed', value: 80, unit: 'kg' } },
                    { execution_type: 'reps_load', reps: { type: 'fixed', value: 8 }, load: { type: 'fixed', value: 80, unit: 'kg' } },
                  ],
                },
                {
                  exercise_id: 'pull_up',
                  sets: [
                    { execution_type: 'reps_only', reps: { type: 'fixed', value: 10 } },
                    { execution_type: 'reps_only', reps: { type: 'fixed', value: 10 } },
                    { execution_type: 'reps_only', reps: { type: 'fixed', value: 10 } },
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

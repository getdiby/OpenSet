import { describe, it, expect } from 'vitest';
import { validate } from '@openset/validator';
import { workout, program, set } from '../src/index.js';
import { fixed, range, amrap, max } from '../src/values.js';

describe('Integration: build documents and validate', () => {
  it('strength-upper-body.json equivalent', () => {
    const doc = workout('Upper Body — Push/Pull')
      .date('2026-02-17')
      .sports('strength')
      .block('Block A', b => b
        .series('CIRCUIT', s => s
          .rounds(fixed(3))
          .exercise('incline_bench_press', e => e
            .set(set({ reps: fixed(15), load: fixed(20, 'kg'), note: 'add barbell weight to load' }))
            .set(set({ reps: fixed(12), load: fixed(25, 'kg'), note: 'add barbell weight to load' }))
            .set(set({ reps: range(8, 10), load: fixed(25, 'kg'), note: 'add barbell weight to load' }))
          )
          .exercise('pull_up', e => e
            .sets(3, set({ reps: fixed(10) }))
          )
        )
      )
      .block('Block B', b => b
        .series('CLUSTER', s => s
          .rounds(fixed(3))
          .note('Pair A back to back, then 30s, then Pair B, then 120s')
          .exercise('pull_up', e => e
            .group('pair_a')
            .set(set({ reps: fixed(15) }))
            .set(set({ reps: fixed(12) }))
            .set(set({ reps: fixed(8) }))
          )
          .exercise('decline_push_up', e => e
            .group('pair_a')
            .set(set({ reps: fixed(32), rest_after: fixed(30, 's') }))
            .set(set({ reps: fixed(26), rest_after: fixed(30, 's') }))
            .set(set({ reps: fixed(19), rest_after: fixed(30, 's') }))
          )
          .exercise('pull_up', e => e
            .group('pair_b')
            .set(set({ reps: fixed(7) }))
            .set(set({ reps: fixed(7) }))
            .set(set({ reps: fixed(5) }))
          )
          .exercise('decline_push_up', e => e
            .group('pair_b')
            .set(set({ reps: fixed(14), rest_after: fixed(120, 's') }))
            .set(set({ reps: fixed(14), rest_after: fixed(120, 's') }))
            .set(set({ reps: fixed(11), rest_after: fixed(120, 's') }))
          )
        )
      )
      .block('Core', b => b
        .series('CIRCUIT', s => s
          .rounds(fixed(1))
          .exercise('leg_raise', e => e.set(set({ reps: fixed(20) })))
          .exercise('crunch', e => e.set(set({ reps: fixed(20) })))
          .exercise('sit_up', e => e.set(set({ reps: fixed(20) })))
        )
      )
      .build();

    const result = validate(doc);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('strength-lower-body.json equivalent', () => {
    const doc = workout('Lower Body — Squat & Hinge')
      .date('2026-02-18')
      .sports('strength')
      .block('Warm-up', b => b
        .series('SEQUENTIAL', s => s
          .exercise('wall_sit', e => e
            .set(set({ duration: fixed(30, 's') }))
            .set(set({ duration: fixed(45, 's') }))
          )
        )
      )
      .block('Main Lifts', b => b
        .series('SEQUENTIAL', s => s
          .exercise('back_squat', e => e
            .set(set({ reps: fixed(5), load: fixed(100, 'kg'), rpe: fixed(7), rest_after: fixed(180, 's') }))
            .set(set({ reps: fixed(5), load: fixed(110, 'kg'), rpe: fixed(8), rest_after: fixed(180, 's') }))
            .set(set({ reps: fixed(3), load: fixed(120, 'kg'), rpe: fixed(9), rest_after: fixed(240, 's') }))
            .set(set({ reps: fixed(3), load: fixed(125, 'kg'), rpe: fixed(9), rest_after: fixed(240, 's') }))
            .set(set({ reps: fixed(3), load: fixed(130, 'kg'), rpe: max() }))
          )
        )
        .series('SEQUENTIAL', s => s
          .exercise('romanian_deadlift', e => e
            .set(set({ reps: range(8, 12), load: fixed(80, 'kg'), rpe: fixed(7), rest_after: fixed(120, 's') }))
            .set(set({ reps: range(8, 12), load: fixed(80, 'kg'), rpe: fixed(8), rest_after: fixed(120, 's') }))
            .set(set({ reps: range(8, 12), load: fixed(80, 'kg'), rpe: fixed(8) }))
          )
        )
      )
      .block('Accessories', b => b
        .series('SUPERSET', s => s
          .rounds(fixed(3))
          .restAfter(fixed(90, 's'))
          .exercise('bulgarian_split_squat', e => e
            .sets(3, set({ reps: fixed(10), sides: fixed(2), load: fixed(16, 'kg') }))
          )
          .exercise('leg_curl', e => e
            .sets(3, set({ reps: range(10, 15), load: fixed(40, 'kg') }))
          )
        )
        .series('SEQUENTIAL', s => s
          .exercise('single_leg_calf_raise_elevated', e => e
            .set(set({ reps: fixed(15), sides: fixed(2), rest_after: fixed(60, 's') }))
            .set(set({ reps: fixed(15), sides: fixed(2), rest_after: fixed(60, 's') }))
            .set(set({ reps: fixed(15), sides: fixed(2) }))
          )
        )
      )
      .build();

    const result = validate(doc);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('conditioning-circuit.json equivalent', () => {
    const doc = workout('Full Body Conditioning Circuit')
      .date('2026-02-19')
      .sports('general_fitness')
      .block('AMRAP Block', b => b
        .series('AMRAP', s => s
          .rounds(amrap())
          .note('12 minute AMRAP — as many rounds as possible')
          .exercise('push_up', e => e.set(set({ reps: fixed(15) })))
          .exercise('back_squat', e => e
            .note('Use empty barbell or light load')
            .set(set({ reps: fixed(15), load: fixed(20, 'kg') }))
          )
          .exercise('row_ergometer', e => e.set(set({ calories: fixed(15) })))
        )
      )
      .block('For Time', b => b
        .series('FOR_TIME', s => s
          .rounds(fixed(3))
          .note('Complete 3 rounds as fast as possible')
          .exercise('run', e => e
            .sets(3, set({ distance: fixed(400, 'm') }))
          )
          .exercise('box_jump', e => e
            .sets(3, set({ reps: fixed(15), height: fixed(60, 'cm') }))
          )
          .exercise('pull_up', e => e
            .sets(3, set({ reps: fixed(10) }))
          )
        )
      )
      .block('Tabata Finisher', b => b
        .series('TABATA', s => s
          .rounds(fixed(8))
          .exercise('assault_bike', e => e
            .sets(8, set({ duration: fixed(20, 's'), rpe: max() }))
          )
        )
      )
      .build();

    const result = validate(doc);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('mixed-workout.json equivalent', () => {
    const doc = workout('Mixed Modal — Strength + Conditioning')
      .date('2026-02-21')
      .sports('crossfit')
      .block('Strength', b => b
        .series('SEQUENTIAL', s => s
          .exercise('deadlift', e => e
            .set(set({ reps: fixed(5), load: fixed(140, 'kg'), rpe: fixed(7), rest_after: fixed(180, 's') }))
            .set(set({ reps: fixed(3), load: fixed(160, 'kg'), rpe: fixed(8), rest_after: fixed(240, 's') }))
            .set(set({ reps: fixed(1), load: max(), note: 'Test 1RM' }))
          )
        )
      )
      .block('EMOM Conditioning', b => b
        .series('EMOM', s => s
          .rounds(fixed(10))
          .note('Alternating minutes — odd = work, even = recovery')
          .exercise('row_ergometer', e => e
            .note('Odd minutes — row hard')
            .sets(5, set({ distance: fixed(200, 'm') }))
          )
          .exercise('jump_rope', e => e
            .note('Even minutes — easy pace, full minute')
            .sets(5, set({ duration: fixed(60, 's'), rpe: fixed(3) }))
          )
        )
      )
      .block('Ladder Finisher', b => b
        .series('LADDER', s => s
          .restAfter(fixed(60, 's'))
          .exercise('push_up', e => e
            .note('Ascending then descending ladder')
            .set(set({ reps: fixed(5) }))
            .set(set({ reps: fixed(10) }))
            .set(set({ reps: fixed(15) }))
            .set(set({ reps: fixed(20) }))
            .set(set({ reps: fixed(15) }))
            .set(set({ reps: fixed(10) }))
            .set(set({ reps: fixed(5) }))
          )
        )
      )
      .build();

    const result = validate(doc);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('endurance-run.json equivalent', () => {
    const doc = workout('Threshold Intervals — 6×1km')
      .date('2026-02-20')
      .sports('running')
      .block('Warm-up', b => b
        .series('SEQUENTIAL', s => s
          .exercise('run', e => e
            .note('Easy jog to warm up')
            .set(set({ duration: fixed(600, 's'), heart_rate_zone: fixed(2) }))
          )
        )
      )
      .block('Intervals', b => b
        .series('INTERVAL', s => s
          .rounds(fixed(6))
          .exercise('run', e => {
            e.note('6 × 1km at threshold pace. HR ceiling 175bpm — if exceeded, reduce pace.');
            // 5 intervals with rest, 1 final without
            for (let i = 0; i < 5; i++) {
              e.set(set({
                distance: fixed(1, 'km'),
                pace: range(3.8, 4.0, 'min/km'),
                heart_rate: max(),
                rest_after: fixed(90, 's'),
              }));
            }
            e.set(set({
              distance: fixed(1, 'km'),
              pace: range(3.8, 4.0, 'min/km'),
              heart_rate: max(),
            }));
          })
        )
      )
      .block('Cool-down', b => b
        .series('SEQUENTIAL', s => s
          .exercise('run', e => e
            .note('Easy jog cool-down')
            .set(set({ duration: fixed(600, 's'), heart_rate_zone: fixed(1) }))
          )
        )
      )
      .build();

    const result = validate(doc);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('full-program.json equivalent', () => {
    const doc = program('4-Week Strength Foundation')
      .description('A beginner-friendly 4-week program focusing on compound movements with progressive overload.')
      .sports('strength')
      .durationWeeks(4)
      .author('OpenSet')
      .phase('Phase 1 — Base Building', p => p
        .weeks(1, 2)
        .goal('Build movement quality and work capacity with moderate loads')
        .workout('Day 1 — Upper Body', s => s
          .block('Main Work', b => b
            .series('SEQUENTIAL', ser => ser
              .exercise('bench_press', e => e
                .set(set({ reps: fixed(8), load: fixed(60, 'kg'), rpe: fixed(7), rest_after: fixed(120, 's') }))
                .set(set({ reps: fixed(8), load: fixed(60, 'kg'), rpe: fixed(7), rest_after: fixed(120, 's') }))
                .set(set({ reps: fixed(8), load: fixed(60, 'kg'), rpe: fixed(7) }))
              )
              .exercise('seated_row', e => e
                .set(set({ reps: fixed(10), load: fixed(50, 'kg'), rest_after: fixed(90, 's') }))
                .set(set({ reps: fixed(10), load: fixed(50, 'kg'), rest_after: fixed(90, 's') }))
                .set(set({ reps: fixed(10), load: fixed(50, 'kg') }))
              )
            )
          )
          .block('Accessories', b => b
            .series('SUPERSET', ser => ser
              .rounds(fixed(3))
              .restAfter(fixed(60, 's'))
              .exercise('triceps_cable_pushdown', e => e
                .sets(3, set({ reps: range(12, 15), load: fixed(20, 'kg') }))
              )
              .exercise('bicep_curl', e => e
                .sets(3, set({ reps: range(12, 15), load: fixed(10, 'kg') }))
              )
            )
          )
        )
        .workout('Day 2 — Lower Body', s => s
          .block('Main Work', b => b
            .series('SEQUENTIAL', ser => ser
              .exercise('back_squat', e => e
                .set(set({ reps: fixed(8), load: fixed(80, 'kg'), rpe: fixed(7), rest_after: fixed(150, 's') }))
                .set(set({ reps: fixed(8), load: fixed(80, 'kg'), rpe: fixed(7), rest_after: fixed(150, 's') }))
                .set(set({ reps: fixed(8), load: fixed(80, 'kg'), rpe: fixed(7) }))
              )
              .exercise('hip_thrust', e => e
                .set(set({ reps: fixed(10), load: fixed(60, 'kg'), rest_after: fixed(90, 's') }))
                .set(set({ reps: fixed(10), load: fixed(60, 'kg'), rest_after: fixed(90, 's') }))
                .set(set({ reps: fixed(10), load: fixed(60, 'kg') }))
              )
            )
          )
        )
      )
      .phase('Phase 2 — Intensification', p => p
        .weeks(3, 4)
        .goal('Increase intensity with heavier loads and lower rep ranges')
        .workout('Day 1 — Upper Body', s => s
          .block('Main Work', b => b
            .series('SEQUENTIAL', ser => ser
              .exercise('bench_press', e => {
                for (let i = 0; i < 4; i++) {
                  e.set(set({ reps: fixed(5), load: fixed(70, 'kg'), rpe: fixed(8), rest_after: fixed(180, 's') }));
                }
                e.set(set({ reps: fixed(5), load: fixed(70, 'kg'), rpe: fixed(8) }));
              })
              .exercise('lat_pulldown', e => e
                .set(set({ reps: fixed(8), load: fixed(55, 'kg'), rest_after: fixed(90, 's') }))
                .set(set({ reps: fixed(8), load: fixed(55, 'kg'), rest_after: fixed(90, 's') }))
                .set(set({ reps: fixed(8), load: fixed(55, 'kg') }))
              )
            )
          )
        )
        .workout('Day 2 — Lower Body', s => s
          .block('Main Work', b => b
            .series('SEQUENTIAL', ser => ser
              .exercise('back_squat', e => e
                .set(set({ reps: fixed(5), load: fixed(90, 'kg'), rpe: fixed(8), rest_after: fixed(180, 's') }))
                .set(set({ reps: fixed(5), load: fixed(90, 'kg'), rpe: fixed(8), rest_after: fixed(180, 's') }))
                .set(set({ reps: fixed(5), load: fixed(90, 'kg'), rpe: fixed(8) }))
              )
              .exercise('deadlift', e => e
                .set(set({ reps: fixed(5), load: fixed(120, 'kg'), rpe: fixed(8), rest_after: fixed(180, 's') }))
                .set(set({ reps: fixed(5), load: fixed(120, 'kg'), rpe: fixed(8), rest_after: fixed(180, 's') }))
                .set(set({ reps: fixed(5), load: fixed(120, 'kg'), rpe: fixed(8) }))
              )
            )
          )
        )
      )
      .build();

    const result = validate(doc);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

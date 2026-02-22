import { describe, it, expect } from 'vitest';
import { workout, program, ExerciseBuilder, SeriesBuilder, BlockBuilder } from '../src/index.js';
import { set } from '../src/sets.js';
import { fixed, range, amrap, max } from '../src/values.js';

describe('ExerciseBuilder', () => {
  it('builds exercise with exercise_id', () => {
    const builder = new ExerciseBuilder('bench_press');
    builder.set(set({ reps: fixed(5), load: fixed(100, 'kg') }));
    const ex = builder.build();
    expect(ex.exercise_id).toBe('bench_press');
    expect(ex.sets).toHaveLength(1);
    expect(ex.sets[0].dimensions).toContain('reps');
    expect(ex.sets[0].dimensions).toContain('load');
  });

  it('builds exercise with name (custom)', () => {
    const builder = new ExerciseBuilder('My Custom Exercise', true);
    builder.set(set({ reps: fixed(10) }));
    const ex = builder.build();
    expect(ex.name).toBe('My Custom Exercise');
    expect(ex.exercise_id).toBeUndefined();
  });

  it('.sets() adds N identical sets', () => {
    const builder = new ExerciseBuilder('pull_up');
    builder.sets(3, set({ reps: fixed(10) }));
    const ex = builder.build();
    expect(ex.sets).toHaveLength(3);
    ex.sets.forEach(s => {
      expect(s.dimensions).toEqual(['reps']);
      expect(s.reps).toEqual({ type: 'fixed', value: 10 });
    });
  });

  it('.sets() creates independent copies', () => {
    const s = set({ reps: fixed(10) });
    const builder = new ExerciseBuilder('push_up');
    builder.sets(2, s);
    const ex = builder.build();
    expect(ex.sets[0]).not.toBe(ex.sets[1]); // different references
    expect(ex.sets[0]).toEqual(ex.sets[1]); // same content
  });

  it('supports group and note', () => {
    const builder = new ExerciseBuilder('pull_up');
    builder.group('pair_a').note('Supinated grip');
    builder.set(set({ reps: fixed(10) }));
    const ex = builder.build();
    expect(ex.group).toBe('pair_a');
    expect(ex.note).toBe('Supinated grip');
  });
});

describe('SeriesBuilder', () => {
  it('builds series with execution_mode and exercises', () => {
    const builder = new SeriesBuilder('SEQUENTIAL');
    builder.exercise('bench_press', e => {
      e.set(set({ reps: fixed(5), load: fixed(100, 'kg') }));
    });
    const ser = builder.build();
    expect(ser.execution_mode).toBe('SEQUENTIAL');
    expect(ser.exercises).toHaveLength(1);
  });

  it('.rest() creates fixed rest_after', () => {
    const builder = new SeriesBuilder('CIRCUIT');
    builder.rest(120, 's');
    builder.exercise('push_up', e => e.set(set({ reps: fixed(10) })));
    const ser = builder.build();
    expect(ser.rest_after).toEqual({ type: 'fixed', value: 120, unit: 's' });
  });

  it('.rounds() sets series rounds', () => {
    const builder = new SeriesBuilder('AMRAP');
    builder.rounds(amrap());
    builder.exercise('push_up', e => e.set(set({ reps: fixed(15) })));
    const ser = builder.build();
    expect(ser.rounds).toEqual({ type: 'amrap' });
  });

  it('.namedExercise() creates exercise by name', () => {
    const builder = new SeriesBuilder('SEQUENTIAL');
    builder.namedExercise('Custom Drill', e => {
      e.set(set({ duration: fixed(60, 's') }));
    });
    const ser = builder.build();
    expect(ser.exercises[0].name).toBe('Custom Drill');
    expect(ser.exercises[0].exercise_id).toBeUndefined();
  });

  it('supports note and id', () => {
    const builder = new SeriesBuilder('EMOM');
    builder.id('emom-1').note('Alternating minutes');
    builder.exercise('row_ergometer', e => e.set(set({ distance: fixed(200, 'm') })));
    const ser = builder.build();
    expect(ser.id).toBe('emom-1');
    expect(ser.note).toBe('Alternating minutes');
  });
});

describe('BlockBuilder', () => {
  it('builds block with name and series', () => {
    const builder = new BlockBuilder('Warm-Up');
    builder.series('SEQUENTIAL', s => {
      s.exercise('wall_sit', e => {
        e.set(set({ duration: fixed(30, 's') }));
      });
    });
    const blk = builder.build();
    expect(blk.name).toBe('Warm-Up');
    expect(blk.series).toHaveLength(1);
  });

  it('builds block without name', () => {
    const builder = new BlockBuilder();
    builder.series('CIRCUIT', s => {
      s.exercise('push_up', e => e.set(set({ reps: fixed(10) })));
    });
    const blk = builder.build();
    expect(blk.name).toBeUndefined();
  });

  it('supports id and note', () => {
    const builder = new BlockBuilder('Main');
    builder.id('block-1').note('Heavy work');
    builder.series('SEQUENTIAL', s => {
      s.exercise('deadlift', e => e.set(set({ reps: fixed(5), load: fixed(140, 'kg') })));
    });
    const blk = builder.build();
    expect(blk.id).toBe('block-1');
    expect(blk.note).toBe('Heavy work');
  });
});

describe('WorkoutBuilder', () => {
  it('builds a minimal workout', () => {
    const doc = workout()
      .block('A', b => b
        .series('SEQUENTIAL', s => s
          .exercise('push_up', e => e
            .set(set({ reps: fixed(10) }))
          )
        )
      )
      .build();

    expect(doc.openset_version).toBe('1.0');
    expect(doc.type).toBe('workout');
    expect(doc.blocks).toHaveLength(1);
    expect(doc.blocks[0].name).toBe('A');
  });

  it('builds workout with all metadata', () => {
    const doc = workout('Upper Body')
      .id('sess-1')
      .date('2024-01-15')
      .sports('strength')
      .duration(45, 'min')
      .note('First week')
      .extensions(['x_band'])
      .block('Main', b => b
        .series('SEQUENTIAL', s => s
          .exercise('bench_press', e => e
            .set(set({ reps: fixed(5), load: fixed(100, 'kg') }))
          )
        )
      )
      .build();

    expect(doc.name).toBe('Upper Body');
    expect(doc.id).toBe('sess-1');
    expect(doc.date).toBe('2024-01-15');
    expect(doc.sports).toEqual(['strength']);
    expect((doc as unknown as Record<string, unknown>).duration).toEqual({ value: 45, unit: 'min' });
    expect(doc.note).toBe('First week');
    expect(doc.x_extensions).toEqual(['x_band']);
  });

  it('block overload without name', () => {
    const doc = workout()
      .block(b => b
        .series('SEQUENTIAL', s => s
          .exercise('push_up', e => e.set(set({ reps: fixed(10) })))
        )
      )
      .build();

    expect(doc.blocks[0].name).toBeUndefined();
  });

  it('omits undefined optional fields', () => {
    const doc = workout()
      .block('A', b => b
        .series('SEQUENTIAL', s => s
          .exercise('push_up', e => e.set(set({ reps: fixed(10) })))
        )
      )
      .build();

    expect(doc.date).toBeUndefined();
    expect(doc.sports).toBeUndefined();
    expect(doc.note).toBeUndefined();
    expect(doc.id).toBeUndefined();
    expect(doc.x_extensions).toBeUndefined();
  });
});

describe('ProgramBuilder', () => {
  it('builds a minimal program', () => {
    const doc = program('4-Week Strength')
      .phase('Base', p => p
        .workout('Day 1', s => s
          .block('Main', b => b
            .series('SEQUENTIAL', ser => ser
              .exercise('back_squat', e => e
                .set(set({ reps: fixed(8), load: fixed(80, 'kg') }))
              )
            )
          )
        )
      )
      .build();

    expect(doc.openset_version).toBe('1.0');
    expect(doc.type).toBe('program');
    expect(doc.name).toBe('4-Week Strength');
    expect(doc.phases).toHaveLength(1);
    expect(doc.phases[0].name).toBe('Base');
  });

  it('builds program with all metadata', () => {
    const doc = program('Test Program')
      .id('prog-1')
      .description('A test program')
      .sports('strength')
      .duration(28, 'day')
      .author('Coach')
      .createdAt('2024-01-01')
      .extensions(['x_custom'])
      .phase('Phase 1', p => p
        .weeks(1, 2)
        .goal('Build base')
        .workout('Day 1', s => s
          .block('A', b => b
            .series('SEQUENTIAL', ser => ser
              .exercise('push_up', e => e.set(set({ reps: fixed(10) })))
            )
          )
        )
      )
      .build();

    expect(doc.id).toBe('prog-1');
    expect(doc.description).toBe('A test program');
    expect(doc.sports).toEqual(['strength']);
    expect((doc as unknown as Record<string, unknown>).duration).toEqual({ value: 28, unit: 'day' });
    expect(doc.metadata?.author).toBe('Coach');
    expect(doc.metadata?.created_at).toBe('2024-01-01');
    expect(doc.x_extensions).toEqual(['x_custom']);
    expect(doc.phases[0].week_start).toBe(1);
    expect(doc.phases[0].week_end).toBe(2);
    expect(doc.phases[0].goal).toBe('Build base');
  });

  it('workouts inside phases do not have openset_version or type', () => {
    const doc = program('Test')
      .phase('P1', p => p
        .workout('S1', s => s
          .block('B1', b => b
            .series('SEQUENTIAL', ser => ser
              .exercise('push_up', e => e.set(set({ reps: fixed(10) })))
            )
          )
        )
      )
      .build();

    const innerWorkout = doc.phases[0].workouts[0] as unknown as Record<string, unknown>;
    expect(innerWorkout.openset_version).toBeUndefined();
    expect(innerWorkout.type).toBeUndefined();
    expect(innerWorkout.name).toBe('S1');
    expect(innerWorkout.blocks).toBeDefined();
  });
});

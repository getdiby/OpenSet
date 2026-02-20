import { describe, it, expect } from 'vitest';
import { workout, set } from '../src/index.js';
import { fixed } from '../src/values.js';
import { ValidationError } from '../src/validation.js';

describe('buildValidated()', () => {
  it('resolves on a valid workout', async () => {
    const doc = await workout('Test')
      .block('A', b => b
        .series('SEQUENTIAL', s => s
          .exercise('bench_press', e => e
            .set(set({ reps: fixed(5), load: fixed(100, 'kg') }))
          )
        )
      )
      .buildValidated();

    expect(doc.openset_version).toBe('1.0');
    expect(doc.type).toBe('workout');
  });

  it('throws ValidationError on invalid document (missing declared dimension)', async () => {
    // Create a set manually with dimension declared but field missing
    const invalidWorkout = {
      openset_version: '1.0',
      type: 'workout' as const,
      blocks: [{
        series: [{
          execution_mode: 'SEQUENTIAL' as const,
          exercises: [{
            exercise_id: 'bench_press',
            sets: [{
              dimensions: ['reps', 'load'],
              // missing required 'reps' and 'load' fields
            }],
          }],
        }],
      }],
    };

    const { validateAndThrow } = await import('../src/validation.js');
    await expect(validateAndThrow(invalidWorkout)).rejects.toThrow(ValidationError);
  });

  it('ValidationError has result with errors array', async () => {
    const { validateAndThrow } = await import('../src/validation.js');
    const invalidDoc = {
      openset_version: '1.0',
      type: 'workout',
      blocks: [{
        series: [{
          execution_mode: 'SEQUENTIAL',
          exercises: [{
            exercise_id: 'bench_press',
            sets: [{
              dimensions: ['reps', 'load'],
              // missing reps and load
            }],
          }],
        }],
      }],
    };

    try {
      await validateAndThrow(invalidDoc);
      expect.fail('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      const ve = err as ValidationError;
      expect(ve.result.valid).toBe(false);
      expect(ve.result.errors.length).toBeGreaterThan(0);
      expect(ve.result.errors[0].code).toBe('E003');
    }
  });
});

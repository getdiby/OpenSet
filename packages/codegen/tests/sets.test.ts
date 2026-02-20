import { describe, it, expect } from 'vitest';
import { set } from '../src/sets.js';
import { fixed, range, amrap, max } from '../src/values.js';

describe('set() builder', () => {
  it('auto-infers dimensions from provided keys', () => {
    const s = set({ reps: fixed(10) });
    expect(s.dimensions).toEqual(['reps']);
    expect(s.reps).toEqual({ type: 'fixed', value: 10 });
  });

  it('auto-infers multiple dimensions', () => {
    const s = set({ reps: fixed(5), load: fixed(100, 'kg') });
    expect(s.dimensions).toContain('reps');
    expect(s.dimensions).toContain('load');
    expect(s.dimensions).toHaveLength(2);
  });

  it('uses explicit dimensions when provided', () => {
    const s = set({ dimensions: ['reps'], reps: fixed(5), rpe: fixed(8) });
    expect(s.dimensions).toEqual(['reps']);
    expect(s.reps).toEqual({ type: 'fixed', value: 5 });
    expect(s.rpe).toEqual({ type: 'fixed', value: 8 });
  });

  it('does not include rest_after in auto-inferred dimensions', () => {
    const s = set({ reps: fixed(10), rest_after: fixed(120, 's') });
    expect(s.dimensions).toEqual(['reps']);
    expect(s.rest_after).toEqual({ type: 'fixed', value: 120, unit: 's' });
  });

  it('does not include note in auto-inferred dimensions', () => {
    const s = set({ reps: fixed(5), load: fixed(100, 'kg'), note: 'add barbell weight' });
    expect(s.dimensions).toContain('reps');
    expect(s.dimensions).toContain('load');
    expect(s.dimensions).not.toContain('note');
    expect(s.note).toBe('add barbell weight');
  });

  it('supports reps + sides (per-side exercises)', () => {
    const s = set({ reps: fixed(10), sides: fixed(2), load: fixed(16, 'kg') });
    expect(s.dimensions).toContain('reps');
    expect(s.dimensions).toContain('sides');
    expect(s.dimensions).toContain('load');
    expect(s.sides).toEqual({ type: 'fixed', value: 2 });
  });

  it('supports reps + height', () => {
    const s = set({ reps: fixed(15), height: fixed(60, 'cm') });
    expect(s.dimensions).toContain('reps');
    expect(s.dimensions).toContain('height');
    expect(s.height).toEqual({ type: 'fixed', value: 60, unit: 'cm' });
  });

  it('supports duration only', () => {
    const s = set({ duration: fixed(30, 's') });
    expect(s.dimensions).toEqual(['duration']);
    expect(s.duration).toEqual({ type: 'fixed', value: 30, unit: 's' });
  });

  it('supports duration with heart_rate_zone', () => {
    const s = set({ duration: fixed(600, 's'), heart_rate_zone: fixed(2) });
    expect(s.dimensions).toContain('duration');
    expect(s.dimensions).toContain('heart_rate_zone');
    expect(s.heart_rate_zone).toEqual({ type: 'fixed', value: 2 });
  });

  it('supports duration + power', () => {
    const s = set({ duration: fixed(120, 's'), power: fixed(250, 'W') });
    expect(s.dimensions).toContain('duration');
    expect(s.dimensions).toContain('power');
    expect(s.power).toEqual({ type: 'fixed', value: 250, unit: 'W' });
  });

  it('supports distance only', () => {
    const s = set({ distance: fixed(400, 'm') });
    expect(s.dimensions).toEqual(['distance']);
    expect(s.distance).toEqual({ type: 'fixed', value: 400, unit: 'm' });
  });

  it('supports distance with pace and heart_rate', () => {
    const s = set({
      distance: fixed(1, 'km'),
      pace: range(3.8, 4.0, 'min/km'),
      heart_rate: max(),
    });
    expect(s.pace).toEqual({ type: 'range', min: 3.8, max: 4.0, unit: 'min/km' });
    expect(s.heart_rate).toEqual({ type: 'max' });
  });

  it('supports distance + duration (timed distance)', () => {
    const s = set({ distance: fixed(5, 'km'), duration: fixed(1500, 's') });
    expect(s.dimensions).toContain('distance');
    expect(s.dimensions).toContain('duration');
  });

  it('supports power + duration', () => {
    const s = set({ power: fixed(200, 'W'), duration: fixed(300, 's') });
    expect(s.dimensions).toContain('power');
    expect(s.dimensions).toContain('duration');
  });

  it('supports power + distance', () => {
    const s = set({ power: fixed(250, 'W'), distance: fixed(10, 'km') });
    expect(s.dimensions).toContain('power');
    expect(s.dimensions).toContain('distance');
  });

  it('supports calories', () => {
    const s = set({ calories: fixed(15) });
    expect(s.dimensions).toEqual(['calories']);
    expect(s.calories).toEqual({ type: 'fixed', value: 15 });
  });

  it('supports rounds + duration', () => {
    const s = set({ rounds: fixed(5), duration: fixed(300, 's') });
    expect(s.dimensions).toContain('rounds');
    expect(s.dimensions).toContain('duration');
  });

  it('range values work in set params', () => {
    const s = set({ reps: range(8, 12), load: fixed(60, 'kg') });
    expect(s.reps).toEqual({ type: 'range', min: 8, max: 12 });
  });

  it('amrap value works in set params', () => {
    const s = set({ reps: amrap(), load: fixed(100, 'kg') });
    expect(s.reps).toEqual({ type: 'amrap' });
  });
});

import { describe, it, expect } from 'vitest';
import { fixed, range, min, amrap, max, any } from '../src/values.js';

describe('Value Helpers', () => {
  describe('fixed()', () => {
    it('creates a fixed value without unit', () => {
      expect(fixed(100)).toEqual({ type: 'fixed', value: 100 });
    });

    it('creates a fixed value with unit', () => {
      expect(fixed(100, 'kg')).toEqual({ type: 'fixed', value: 100, unit: 'kg' });
    });

    it('handles zero', () => {
      expect(fixed(0)).toEqual({ type: 'fixed', value: 0 });
    });

    it('handles decimal values', () => {
      expect(fixed(3.8, 'min/km')).toEqual({ type: 'fixed', value: 3.8, unit: 'min/km' });
    });
  });

  describe('range()', () => {
    it('creates a range value without unit', () => {
      expect(range(8, 12)).toEqual({ type: 'range', min: 8, max: 12 });
    });

    it('creates a range value with unit', () => {
      expect(range(3.8, 4.0, 'min/km')).toEqual({ type: 'range', min: 3.8, max: 4.0, unit: 'min/km' });
    });

    it('throws if min >= max', () => {
      expect(() => range(10, 10)).toThrow('min < max');
      expect(() => range(15, 10)).toThrow('min < max');
    });
  });

  describe('min()', () => {
    it('creates a min value without unit', () => {
      expect(min(5)).toEqual({ type: 'min', value: 5 });
    });

    it('creates a min value with unit', () => {
      expect(min(30, 's')).toEqual({ type: 'min', value: 30, unit: 's' });
    });
  });

  describe('amrap()', () => {
    it('creates an amrap value', () => {
      expect(amrap()).toEqual({ type: 'amrap' });
    });
  });

  describe('max()', () => {
    it('creates a max value', () => {
      expect(max()).toEqual({ type: 'max' });
    });
  });

  describe('any()', () => {
    it('creates an any value', () => {
      expect(any()).toEqual({ type: 'any' });
    });
  });
});

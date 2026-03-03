import type {
  Workout,
  Program,
  ExecutionMode,
  ValueObject,
  ValidationResult,
  Set,
} from '../src/index.js';

const sampleSet: Set = {
  dimensions: ['reps', 'load', 'rpe'],
  reps: { type: 'fixed', value: 5 },
  load: { type: 'fixed', value: 160, unit: 'kg' },
  rpe: { type: 'fixed', value: 7 },
};

const workout: Workout = {
  openset_version: '1.0',
  type: 'workout',
  name: 'Typecheck Workout',
  date: '2026-03-02',
  blocks: [
    {
      name: 'Block A',
      series: [
        {
          execution_mode: 'SEQUENTIAL' as ExecutionMode,
          exercises: [
            {
              exercise_id: 'back_squat',
              sets: [sampleSet],
            },
          ],
        },
      ],
    },
  ],
};

const program: Program = {
  openset_version: '1.0',
  type: 'program',
  name: 'Typecheck Program',
  phases: [
    {
      name: 'Phase 1',
      week_start: 1,
      week_end: 4,
      workouts: [
        {
          name: 'Day 1',
          blocks: workout.blocks,
        },
      ],
    },
  ],
};

const value: ValueObject = { type: 'range', min: 1, max: 3 };

const result: ValidationResult = {
  valid: true,
  errors: [],
  warnings: [],
};

void workout;
void program;
void value;
void result;

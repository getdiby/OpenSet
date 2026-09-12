import { resolveText, resolveTextList } from '../src/index.js';
import type {
  ExerciseDefinition,
  LocalizedText,
  LocalizedTextList,
  MediaAnimation,
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


// === 1.2: localized text and animations compile in both forms ===

const plainName: LocalizedText = 'Back Squat';
const mappedName: LocalizedText = { en: 'Back Squat', hr: 'Stražnji čučanj', 'pt-BR': 'Agachamento' };
const plainAliases: LocalizedTextList = ['Squat', 'Barbell Back Squat'];
const mappedAliases: LocalizedTextList = { en: ['Squat'], hr: ['Čučanj'] };

const loop: MediaAnimation = {
  url: 'https://cdn.example.com/back_squat/loop.png',
  label: 'loop',
  format: 'apng',
  fps: 12,
  loop: true,
};

// A 1.0-shaped exercise still satisfies the type.
const plainExercise: ExerciseDefinition = {
  id: 'goblet_squat',
  name: plainName,
  aliases: plainAliases,
  description: 'Squat holding one dumbbell at the chest.',
  common_dimensions: [['reps', 'load']],
};

const localizedExercise: ExerciseDefinition = {
  id: 'back_squat',
  name: mappedName,
  aliases: mappedAliases,
  description: { en: 'Squat with the barbell across the upper back.' },
  common_dimensions: [['reps', 'load']],
  media: { animations: [loop] },
};

const resolved: string | undefined = resolveText(localizedExercise.name, 'hr');
const resolvedList: string[] | undefined = resolveTextList(localizedExercise.aliases, 'en');

export { plainExercise, localizedExercise, resolved, resolvedList };

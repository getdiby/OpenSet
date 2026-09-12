import type { ValidationMessage } from '@diby/openset-types';
import { formatMessage } from '../messages.js';

/**
 * Validates `exercise_library` documents — the only document type `validate()` had no path for,
 * so one fell through to "must have blocks or phases" and reported a library as a broken workout.
 *
 * Rules: E016, E017, E018, W011, W012.
 */

const ID_PATTERN = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;
const LOCALE_PATTERN = /^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * A localized field is either the plain form or a map keyed by locale (1.2).
 * `entryIsList` says which plain form this field takes.
 */
export function localizedTextRules(
  value: unknown,
  path: string,
  field: string,
  entryIsList: boolean,
  errors: ValidationMessage[],
  warnings: ValidationMessage[],
): void {
  if (value === undefined) return;

  const plainOk = entryIsList
    ? Array.isArray(value) && value.every(v => typeof v === 'string')
    : typeof value === 'string';
  if (plainOk) return;

  if (!isPlainObject(value)) {
    errors.push({
      code: 'E016',
      level: 'error',
      path,
      message: formatMessage('E016', field, entryIsList ? 'an array of strings' : 'a string'),
    });
    return;
  }

  const locales = Object.keys(value);
  if (locales.length === 0) {
    errors.push({ code: 'E017', level: 'error', path, message: formatMessage('E017', field) });
    return;
  }

  for (const locale of locales) {
    if (!LOCALE_PATTERN.test(locale)) {
      errors.push({ code: 'E018', level: 'error', path, message: formatMessage('E018', locale, field) });
      continue;
    }
    const entry = value[locale];
    const entryOk = entryIsList
      ? Array.isArray(entry) && entry.every(v => typeof v === 'string')
      : typeof entry === 'string';
    if (!entryOk) {
      errors.push({
        code: 'E016',
        level: 'error',
        path: `${path}.${locale}`,
        message: formatMessage('E016', `${field}.${locale}`, entryIsList ? 'an array of strings' : 'a string'),
      });
    }
  }

  if (!locales.includes('en')) {
    warnings.push({ code: 'W011', level: 'warn', path, message: formatMessage('W011', field) });
  }
}

export function exerciseLibraryDocumentRules(
  doc: any,
  errors: ValidationMessage[],
  warnings: ValidationMessage[],
): void {
  localizedTextRules(doc.name, 'name', 'name', false, errors, warnings);

  if (!Array.isArray(doc.exercises) || doc.exercises.length === 0) {
    errors.push({
      code: 'SCHEMA',
      level: 'error',
      path: 'exercises',
      message: 'exercise_library must have a non-empty "exercises" array',
    });
    return;
  }

  const ids = new Set<string>();
  for (const [i, ex] of doc.exercises.entries()) {
    const path = `exercises[${i}]`;

    if (typeof ex.id !== 'string' || ex.id === '') {
      errors.push({ code: 'SCHEMA', level: 'error', path, message: 'Exercise is missing required field "id"' });
    } else {
      if (!ID_PATTERN.test(ex.id)) {
        errors.push({
          code: 'SCHEMA',
          level: 'error',
          path: `${path}.id`,
          message: `Exercise id "${ex.id}" is not snake_case`,
        });
      }
      if (ids.has(ex.id)) {
        errors.push({ code: 'SCHEMA', level: 'error', path: `${path}.id`, message: `Duplicate exercise id "${ex.id}"` });
      }
      ids.add(ex.id);
    }

    if (ex.name === undefined) {
      errors.push({ code: 'SCHEMA', level: 'error', path, message: 'Exercise is missing required field "name"' });
    }
    localizedTextRules(ex.name, `${path}.name`, 'name', false, errors, warnings);
    localizedTextRules(ex.description, `${path}.description`, 'description', false, errors, warnings);
    localizedTextRules(ex.aliases, `${path}.aliases`, 'aliases', true, errors, warnings);

    if (!Array.isArray(ex.common_dimensions)) {
      errors.push({
        code: 'SCHEMA',
        level: 'error',
        path: `${path}.common_dimensions`,
        message: 'Exercise is missing required field "common_dimensions"',
      });
    }
  }

  // W012: an easier / harder / similar link that points outside this library resolves to nothing.
  for (const [i, ex] of doc.exercises.entries()) {
    for (const field of ['progressions', 'regressions', 'variations'] as const) {
      for (const ref of ex[field] ?? []) {
        if (!ids.has(ref)) {
          warnings.push({
            code: 'W012',
            level: 'warn',
            path: `exercises[${i}].${field}`,
            message: formatMessage('W012', ref, field),
          });
        }
      }
    }
  }
}

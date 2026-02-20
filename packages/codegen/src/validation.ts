import type { ValidationResult } from '@openset/types';

/** Error thrown when buildValidated() finds validation errors */
export class ValidationError extends Error {
  public result: ValidationResult;

  constructor(result: ValidationResult) {
    const errorSummary = result.errors
      .map(e => `  ${e.code} ${e.path}: ${e.message}`)
      .join('\n');
    super(`OpenSet validation failed:\n${errorSummary}`);
    this.name = 'ValidationError';
    this.result = result;
  }
}

/**
 * Validate an OpenSet document and throw if invalid.
 * Uses dynamic import so @openset/validator is only loaded when needed.
 */
export async function validateAndThrow(document: unknown): Promise<void> {
  let validate: (doc: unknown) => ValidationResult;
  try {
    const mod = await import('@openset/validator');
    validate = mod.validate;
  } catch {
    throw new Error(
      'buildValidated() requires @openset/validator to be installed.\n' +
      'Install it with: npm install @openset/validator'
    );
  }

  const result = validate(document);
  if (!result.valid) {
    throw new ValidationError(result);
  }
}

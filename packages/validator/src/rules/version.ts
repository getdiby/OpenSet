import type { ValidationMessage } from '@diby/openset-types';
import { SUPPORTED_VERSIONS, CURRENT_VERSION } from '../data.js';
import { formatMessage } from '../messages.js';

/**
 * Rules: E014, W010
 *
 * Version checking logic:
 * - Missing openset_version: skip (structural validation handles this)
 * - Different major version: E014 error, short-circuit
 * - Newer minor version: W010 warning, continue validation
 * - Supported version: pass silently
 *
 * Returns false if validation should stop (major version mismatch).
 */
export function versionRules(
  doc: any,
  errors: ValidationMessage[],
  warnings: ValidationMessage[],
): boolean {
  const version = doc.openset_version;

  // No version field — structural validation or JSON Schema handles this
  if (version === undefined) return true;

  if (typeof version !== 'string') return true;

  // Parse major.minor
  const parts = version.split('.');
  const docMajor = parseInt(parts[0], 10);
  const docMinor = parseInt(parts[1] ?? '0', 10);

  const currentParts = CURRENT_VERSION.split('.');
  const currentMajor = parseInt(currentParts[0], 10);
  const currentMinor = parseInt(currentParts[1] ?? '0', 10);

  // E014: Major version mismatch — incompatible, stop validation
  if (!isNaN(docMajor) && docMajor !== currentMajor) {
    const supportedList = Array.from(SUPPORTED_VERSIONS).join(', ');
    errors.push({
      code: 'E014',
      level: 'error',
      path: 'openset_version',
      message: formatMessage('E014', version, supportedList),
    });
    return false;
  }

  // W010: Minor version is newer than what we know — warn but continue
  if (!isNaN(docMinor) && docMinor > currentMinor) {
    warnings.push({
      code: 'W010',
      level: 'warn',
      path: 'openset_version',
      message: formatMessage('W010', version, CURRENT_VERSION),
    });
  }

  return true;
}

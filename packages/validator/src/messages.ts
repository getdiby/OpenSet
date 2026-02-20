export interface MessageTemplate {
  level: 'error' | 'warn';
  template: string;
}

export const MESSAGES: Record<string, MessageTemplate> = {
  // Structural rules
  E001: { level: 'error', template: '"{0}" in dimensions array is not a known dimension name' },
  E003: { level: 'error', template: 'Dimension "{0}" is listed in dimensions array but missing from the set' },
  E005: { level: 'error', template: 'Value object type must be one of: fixed, range, min, amrap, max, any — got "{0}"' },
  E006: { level: 'error', template: 'Range min ({0}) must be less than max ({1})' },
  E007: { level: 'error', template: 'Dimension "{0}" does not allow value type "{1}"' },
  E008: { level: 'error', template: '"sides" value must be 1 or 2, got {0}' },
  E009: { level: 'error', template: '"heart_rate_zone" value must be between 1 and 5, got {0}' },
  E010: { level: 'error', template: '"rpe" value must be between 1 and 10, got {0}' },
  E011: { level: 'error', template: '"group" on an exercise is only valid when series execution_mode is CLUSTER' },
  E012: { level: 'error', template: 'Mutually exclusive dimensions present on the same set: "{0}" and "{1}"' },
  E013: { level: 'error', template: 'Unknown dimension "{0}" without a valid namespace prefix (x_, app_, or reverse-DNS)' },
  E014: { level: 'error', template: 'Unsupported major version "{0}" — this validator supports version(s): {1}' },
  E015: { level: 'error', template: 'Extension field "{0}" has an invalid value — extension dimensions must be ValueObjects with a valid "type" field' },

  // Warnings
  W010: { level: 'warn', template: 'Document version "{0}" is newer than this validator\'s version "{1}" — some features may not be validated' },
  W001: { level: 'warn', template: 'rest_after present at both SET and SERIES level — SET takes precedence, SERIES value is ignored' },
  W002: { level: 'warn', template: 'rest_after present inside a group on a non-last exercise — rest fires after the last exercise in the group, not here' },
  W003: { level: 'warn', template: 'exercise_id "{0}" not found in canonical library — treated as custom exercise' },
  W004: { level: 'warn', template: 'Exercise has no exercise_id and no name — technically valid but not useful' },
  W005: { level: 'warn', template: 'Series has execution_mode CLUSTER but no exercises have a "group" field' },
  W006: { level: 'warn', template: 'Workout has no "date" field' },
  W007: { level: 'warn', template: '"load" is a range type but "rpe" is absent — consider adding RPE guidance' },
  W008: { level: 'warn', template: 'Exercises in a non-SEQUENTIAL series have uneven set counts — later cycles will skip missing exercises' },
  W009: { level: 'warn', template: 'Unknown namespaced extension field "{0}" present — valid but not part of the OpenSet standard' },
};

export function formatMessage(code: string, ...args: (string | number)[]): string {
  const msg = MESSAGES[code];
  if (!msg) return `Unknown validation code: ${code}`;
  let result = msg.template;
  for (let i = 0; i < args.length; i++) {
    result = result.replace(`{${i}}`, String(args[i]));
  }
  return result;
}

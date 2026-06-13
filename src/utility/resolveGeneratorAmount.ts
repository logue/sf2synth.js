import type { GeneratorValue } from '../types/SoundFontSynthTypes';

/**
 * Safely resolve the amount value from a GeneratorValue.
 * Handles union types (single value, array, or undefined).
 *
 * @param value The GeneratorValue to resolve
 * @returns The amount number if found, null otherwise
 */
export function resolveGeneratorAmount(
  value: GeneratorValue | GeneratorValue[] | undefined
): number | null {
  if (value === undefined) {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      if (item && typeof (item as any).amount === 'number') {
        return (item as any).amount;
      }
    }
    return null;
  }

  return typeof (value as any).amount === 'number'
    ? (value as any).amount
    : null;
}

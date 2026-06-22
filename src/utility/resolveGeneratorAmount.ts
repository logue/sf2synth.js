import type { GeneratorValue } from '@/types/SynthesizerTypes';

/**
 * Safely resolve the amount value from a GeneratorValue.
 * Handles union types (single value, array, or undefined).
 *
 * @param value The GeneratorValue to resolve
 * @returns The amount number if found, null otherwise
 */
export function resolveGeneratorAmount(
  value: GeneratorValue | GeneratorValue[] | undefined,
): number | null {
  if (value === undefined) {
    return null;
  }

  if (Array.isArray(value)) {
    const [first] = value;
    return first && typeof first.amount === 'number' ? first.amount : null;
  }

  return typeof value.amount === 'number' ? value.amount : null;
}

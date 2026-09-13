import type { GeneratorValue } from '@/types/SynthesizerTypes';

/**
 * Safely resolve the amount value from a GeneratorValue.
 * Handles union types (single value, array, or undefined).
 *
 * @param value The GeneratorValue to resolve
 * @returns The amount number if found, undefined otherwise
 */
export function resolveGeneratorAmount(
  value: GeneratorValue | GeneratorValue[] | undefined,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const [first] = value;
    return first && typeof first.amount === 'number' ? first.amount : undefined;
  }

  return typeof value.amount === 'number' ? value.amount : undefined;
}

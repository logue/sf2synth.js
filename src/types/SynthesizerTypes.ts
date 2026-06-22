import type { PresetHeader } from '@/interfaces/SynthesizerInterface';

export type GeneratorAmount = { amount: number };
export type GeneratorRange = { amount: null; lo: number; hi: number };
export type GeneratorCodeRange = {
  code: number;
  amount: number;
  lo: number;
  hi: number;
};
export type GeneratorValue =
  | GeneratorAmount
  | GeneratorRange
  | GeneratorCodeRange;

export type GeneratorEntry = { type: string; value: GeneratorValue };

export type ModGen = {
  [key: string]: GeneratorValue | GeneratorValue[] | undefined;
  unknown: GeneratorValue[];
  keyRange: GeneratorRange;
  amount?: GeneratorAmount;
};

export type AdjustedSampleData = {
  sample: Int16Array;
  multiply: number;
};
export type ZoneInfo = {
  generator: ModGen;
  generatorSequence: GeneratorEntry[];
  modulator: ModGen;
  modulatorSequence: GeneratorEntry[];
};
export type InstrumentDefinition = { name: string; info: ZoneInfo[] };
export type PresetDefinition = {
  name: string;
  info: ZoneInfo[];
  header: PresetHeader;
  instrument: number | null;
};
export type GeneratorBundle = {
  generator: ModGen;
  generatorInfo: GeneratorEntry[];
};
export type ModulatorBundle = {
  modulator: ModGen;
  modulatorInfo: GeneratorEntry[];
};
export type ModGenBundle = { modgen: ModGen; modgenInfo: GeneratorEntry[] };

export type SynthesizerMode = 'GM' | 'GM2' | 'XG' | 'GS';

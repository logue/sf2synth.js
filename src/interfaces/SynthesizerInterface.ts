import type { RiffOptions } from '@/types/RiffOptions';
import type { GeneratorAmount, GeneratorRange } from '@/types/SynthesizerTypes';
import type Reverb from '@logue/reverb';

export interface ParserOptions {
  parserOption?: RiffOptions;
  sampleRate?: number;
}
export interface PresetHeader {
  bank: number;
  genre: number;
  library: number;
  morphology: number;
  preset: number;
  presetBagIndex: number;
  presetName: string;
}

export interface PresetZone {
  presetGeneratorIndex: number;
  presetModulatorIndex: number;
}

export interface InstrumentHeader {
  instrumentBagIndex: number;
  instrumentName: string;
}

export interface InstrumentZone {
  instrumentGeneratorIndex: number;
  instrumentModulatorIndex: number;
}

export interface SampleHeader {
  end: number;
  endLoop: number;
  originalPitch: number;
  pitchCorrection: number;
  sampleLink: number;
  sampleName: string;
  sampleRate: number;
  sampleType: number;
  start: number;
  startLoop: number;
}

export interface GeneratorMap {
  keyRange: GeneratorRange;
  sampleID?: GeneratorAmount;
  [key: string]: unknown;
}

export interface ParsedZoneInfo {
  generator: GeneratorMap;
}

export interface ParsedInstrument {
  info: ParsedZoneInfo[];
  name: string;
}

export interface ParsedPreset {
  header: {
    preset: number;
    bank: number;
  };
  instrument: number | null;
  name: string;
}

export interface SampleHeaderInfo {
  endLoop: number;
  pitchCorrection: number;
  sampleRate: number;
  startLoop: number;
}

export interface SynthInstrument {
  basePlaybackRate: number;
  channel?: number;
  cutOffFrequency?: number;
  end: number;
  expression?: number;
  freqVibLFO: number;
  harmonicContent?: number;
  initialAttenuation: number;
  initialFilterFc: number;
  initialFilterQ: number;
  key?: number;
  loopEnd: number;
  loopStart: number;
  modAttack: number;
  modDecay: number;
  modDelay: number;
  modEnvToFilterFc: number;
  modEnvToPitch: number;
  modHold: number;
  modRelease: number;
  modSustain: number;
  modulation?: number;
  mute?: boolean;
  pan: number;
  panpot?: number;
  pitchBend?: number;
  pitchBendSensitivity?: number;
  releaseTime?: number;
  reverb?: Reverb;
  reverbEffectSend: number;
  sample: Int16Array;
  sampleModes: number;
  sampleRate: number;
  scaleTuning: number;
  start: number;
  velocity?: number;
  volAttack: number;
  volDecay: number;
  volDelay: number;
  volHold: number;
  volRelease: number;
  volSustain: number;
  volume?: number;
}

export interface InstrumentPreset {
  name: string;
  volume?: number;
  [key: number]: SynthInstrument | undefined;
}

export interface Bank extends Array<InstrumentPreset | undefined> {
  [key: number]: InstrumentPreset | undefined;
}

export interface BankSet extends Array<Bank | undefined> {
  [key: number]: Bank | undefined;
}

import type Reverb from '@logue/reverb';
import type {
  GeneratorAmount,
  GeneratorRange,
} from '../types/SoundFontSynthTypes';
import type { RiffOptions } from './RiffOptions';

export interface ParserOptions {
  parserOption?: RiffOptions;
  sampleRate?: number;
}
export interface PresetHeader {
  presetName: string;
  preset: number;
  bank: number;
  presetBagIndex: number;
  library: number;
  genre: number;
  morphology: number;
}

export interface PresetZone {
  presetGeneratorIndex: number;
  presetModulatorIndex: number;
}

export interface InstrumentHeader {
  instrumentName: string;
  instrumentBagIndex: number;
}

export interface InstrumentZone {
  instrumentGeneratorIndex: number;
  instrumentModulatorIndex: number;
}

export interface SampleHeader {
  sampleName: string;
  start: number;
  end: number;
  startLoop: number;
  endLoop: number;
  sampleRate: number;
  originalPitch: number;
  pitchCorrection: number;
  sampleLink: number;
  sampleType: number;
}

export interface GeneratorMap {
  [key: string]: unknown;
  keyRange: GeneratorRange;
  sampleID?: GeneratorAmount;
}

export interface ParsedZoneInfo {
  generator: GeneratorMap;
}

export interface ParsedInstrument {
  name: string;
  info: ParsedZoneInfo[];
}

export interface ParsedPreset {
  header: { preset: number; bank: number };
  name: string;
  instrument: number | null;
}

export interface SampleHeaderInfo {
  sampleRate: number;
  pitchCorrection: number;
  startLoop: number;
  endLoop: number;
}

export interface SynthInstrument {
  sample: Int16Array;
  sampleRate: number;
  sampleModes: number;
  basePlaybackRate: number;
  modEnvToPitch: number;
  scaleTuning: number;
  start: number;
  end: number;
  loopStart: number;
  loopEnd: number;
  volDelay: number;
  volAttack: number;
  volHold: number;
  volDecay: number;
  volSustain: number;
  volRelease: number;
  modDelay: number;
  modAttack: number;
  modHold: number;
  modDecay: number;
  modSustain: number;
  modRelease: number;
  initialFilterFc: number;
  modEnvToFilterFc: number;
  initialFilterQ: number;
  reverbEffectSend: number;
  initialAttenuation: number;
  freqVibLFO: number;
  pan: number;
  channel?: number;
  key?: number;
  velocity?: number;
  panpot?: number;
  volume?: number;
  pitchBend?: number;
  expression?: number;
  pitchBendSensitivity?: number;
  mute?: boolean;
  releaseTime?: number;
  cutOffFrequency?: number;
  harmonicContent?: number;
  reverb?: Reverb;
  modulation?: number;
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

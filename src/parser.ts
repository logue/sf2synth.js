import { Riff } from './riff.ts';

interface GeneratorTable {
  startAddrsOffset: number;
  endAddrsOffset: number;
  startloopAddrsOffset: number;
  endloopAddrsOffset: number;
  startAddrsCoarseOffset: number;
  modLfoToPitch: number;
  vibLfoToPitch: number;
  modEnvToPitch: number;
  initialFilterFc: number;
  initialFilterQ: number;
  modLfoToFilterFc: number;
  modEnvToFilterFc: number;
  endAddrsCoarseOffset: number;
  modLfoToVolume: number;
  unused1: undefined;
  chorusEffectsSend: number;
  reverbEffectsSend: number;
  pan: number;
  unused2: undefined;
  unused3: undefined;
  unused4: undefined;
  delayModLFO: number;
  freqModLFO: number;
  delayVibLFO: number;
  freqVibLFO: number;
  delayModEnv: number;
  attackModEnv: number;
  holdModEnv: number;
  decayModEnv: number;
  sustainModEnv: number;
  releaseModEnv: number;
  keynumToModEnvHold: number;
  keynumToModEnvDecay: number;
  delayVolEnv: number;
  attackVolEnv: number;
  holdVolEnv: number;
  decayVolEnv: number;
  sustainVolEnv: number;
  releaseVolEnv: number;
  keynumToVolEnvHold: number;
  keynumToVolEnvDecay: number;
  instrument: number | null;
  reserved1: undefined;
  keyRange: number | null;
  velRange: number | null;
  startloopAddrsCoarseOffset: number;
  keynum: number | null;
  velocity: number | null;
  initialAttenuation: number;
  reserved2: undefined;
  endloopAddrsCoarseOffset: number;
  coarseTune: number;
  fineTune: number;
  sampleID: number | null;
  sampleModes: number;
  reserved3: undefined;
  scaleTuning: number;
  exclusiveClass: number | null;
  overridingRootKey: number | null;
  unuded5: undefined;
  endOper: undefined;
}

interface ParserOptions {
  parserOption?: Record<string, unknown>;
  sampleRate?: number;
}

interface SamplingData {
  offset: number;
  size: number;
}

/**
 * SoundFont Parser Class
 *
 * @author imaya
 */
export default class Parser {
  private input: Uint8Array;
  private parserOption: Record<string, unknown>;
  private sampleRate: number;
  private presetHeader: Array<{
    presetName: string;
    preset: number;
    bank: number;
    presetBagIndex: number;
    library: number;
    genre: number;
    morphology: number;
  }>;
  private presetZone: Array<{
    presetGeneratorIndex: number;
    presetModulatorIndex: number;
  }>;
  private presetZoneModulator: Array<{
    type: string;
    value: {
      amount?: number;
      lo?: number;
      hi?: number;
      code?: number;
    };
  }>;
  private presetZoneGenerator: Array<{
    type: string;
    value: {
      amount?: number;
      lo?: number;
      hi?: number;
      code?: number;
    };
  }>;
  private instrument: Array<{
    instrumentName: string;
    instrumentBagIndex: number;
  }>;
  private instrumentZone: Array<{
    instrumentGeneratorIndex: number;
    instrumentModulatorIndex: number;
  }>;
  private instrumentZoneModulator: Array<{
    type: string;
    value: {
      amount?: number;
      lo?: number;
      hi?: number;
      code?: number;
    };
  }>;
  private instrumentZoneGenerator: Array<{
    type: string;
    value: {
      amount?: number;
      lo?: number;
      hi?: number;
      code?: number;
    };
  }>;
  private sampleHeader: Array<{
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
  }>;
  private samplingData?: SamplingData;
  private GeneratorEnumeratorTable: string[];

  constructor(input: Uint8Array, optParams: ParserOptions = {}) {
    this.input = input;
    this.parserOption = optParams.parserOption || {};
    this.sampleRate = optParams.sampleRate || 22050;
    this.presetHeader = [];
    this.presetZone = [];
    this.presetZoneModulator = [];
    this.presetZoneGenerator = [];
    this.instrument = [];
    this.instrumentZone = [];
    this.instrumentZoneModulator = [];
    this.instrumentZoneGenerator = [];
    this.sampleHeader = [];
    this.GeneratorEnumeratorTable = Object.keys(Parser.getGeneratorTable());
  }

  static getGeneratorTable(): GeneratorTable {
    return Object.freeze({
      startAddrsOffset: 0,
      endAddrsOffset: 0,
      startloopAddrsOffset: 0,
      endloopAddrsOffset: 0,
      startAddrsCoarseOffset: 0,
      modLfoToPitch: 0,
      vibLfoToPitch: 0,
      modEnvToPitch: 0,
      initialFilterFc: 13500,
      initialFilterQ: 0,
      modLfoToFilterFc: 0,
      modEnvToFilterFc: 0,
      endAddrsCoarseOffset: 0,
      modLfoToVolume: 0,
      unused1: undefined,
      chorusEffectsSend: 0,
      reverbEffectsSend: 0,
      pan: 0,
      unused2: undefined,
      unused3: undefined,
      unused4: undefined,
      delayModLFO: -12000,
      freqModLFO: 0,
      delayVibLFO: -12000,
      freqVibLFO: 0,
      delayModEnv: -12000,
      attackModEnv: -12000,
      holdModEnv: -12000,
      decayModEnv: -12000,
      sustainModEnv: 0,
      releaseModEnv: -12000,
      keynumToModEnvHold: 0,
      keynumToModEnvDecay: 0,
      delayVolEnv: -12000,
      attackVolEnv: -12000,
      holdVolEnv: -12000,
      decayVolEnv: -12000,
      sustainVolEnv: 0,
      releaseVolEnv: -12000,
      keynumToVolEnvHold: 0,
      keynumToVolEnvDecay: 0,
      instrument: null,
      reserved1: undefined,
      keyRange: null,
      velRange: null,
      startloopAddrsCoarseOffset: 0,
      keynum: null,
      velocity: null,
      initialAttenuation: 0,
      reserved2: undefined,
      endloopAddrsCoarseOffset: 0,
      coarseTune: 0,
      fineTune: 0,
      sampleID: null,
      sampleModes: 0,
      reserved3: undefined,
      scaleTuning: 100,
      exclusiveClass: null,
      overridingRootKey: null,
      unuded5: undefined,
      endOper: undefined,
    });
  }

  parse(): void {
    const parser = new Riff(this.input, this.parserOption);

    // parse RIFF chunk
    parser.parse();
    if (parser.chunkList.length !== 1) {
      throw new Error('wrong chunk length');
    }

    const chunk = parser.getChunk(0);
    if (chunk === null) {
      throw new Error('chunk not found');
    }

    this.parseRiffChunk(chunk);
    this.input = new Uint8Array(0); // Clear input instead of setting to null
  }

  // ... rest of the methods with proper TypeScript types ...
} 
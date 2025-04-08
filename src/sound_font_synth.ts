import Reverb from '@logue/reverb';
import Parser from './parser.ts';
import SynthesizerNote from './sound_font_synth_note.ts';

type Mode = 'GM' | 'GM2' | 'XG' | 'GS';

interface BankSet {
  [key: number]: {
    [key: number]: {
      name: string;
      [key: number]: {
        sample: Uint8Array;
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
      };
    };
  };
}

/**
 * Synthesizer Class
 *
 * @author imaya
 */
export default class Synthesizer {
  private input: Uint8Array;
  private parser: Parser | null;
  private bank: number;
  private bankSet: BankSet;
  private bufferSize: number;
  private ctx: AudioContext;
  private gainMaster: GainNode;
  private bufSrc: AudioBufferSourceNode;
  private channelInstrument: number[];
  private channelBank: number[];
  private channelVolume: number[];
  private channelPanpot: number[];
  private channelPitchBend: number[];
  private channelPitchBendSensitivity: number[];
  private channelExpression: number[];
  private channelAttack: number[];
  private channelDecay: number[];
  private channelSustin: number[];
  private channelRelease: number[];
  private channelHold: boolean[];
  private channelHarmonicContent: number[];
  private channelCutOffFrequency: number[];
  private mode: Mode;
  private programSet: string[][];
  private channelMute: boolean[];
  private currentNoteOn: SynthesizerNote[][];
  private baseVolume: number;
  private masterVolume: number;
  private percussionPart: boolean[];
  private percussionVolume: number[];
  private reverb: Reverb[];
  private modulation: number[];
  private filter: BiquadFilterNode[];
  private items: string[];
  private intersection: IntersectionObserver;
  private timer: NodeJS.Timeout | null;
  private drag: boolean;
  private element: HTMLElement | null;

  constructor(input: Uint8Array) {
    this.input = input;
    this.parser = null;
    this.bank = 0;
    this.bankSet = {};
    this.bufferSize = 2048;
    this.ctx = this.getAudioContext();
    this.gainMaster = this.ctx.createGain();
    this.bufSrc = this.ctx.createBufferSource();
    this.channelInstrument = new Array(16).fill(0);
    this.channelBank = new Array(16).fill(0);
    this.channelBank[9] = 127; // Channel 10 is percussion
    this.channelVolume = new Array(16).fill(100);
    this.channelPanpot = new Array(16).fill(64);
    this.channelPitchBend = new Array(16).fill(0);
    this.channelPitchBendSensitivity = new Array(16).fill(2);
    this.channelExpression = new Array(16).fill(127);
    this.channelAttack = new Array(16).fill(64);
    this.channelDecay = new Array(16).fill(64);
    this.channelSustin = new Array(16).fill(64);
    this.channelRelease = new Array(16).fill(64);
    this.channelHold = new Array(16).fill(false);
    this.channelHarmonicContent = new Array(16).fill(64);
    this.channelCutOffFrequency = new Array(16).fill(64);
    this.mode = 'GM2';
    this.programSet = [];
    this.channelMute = new Array(16).fill(false);
    this.currentNoteOn = Array.from({ length: 16 }, () => []);
    this.baseVolume = 1 / 0xffff;
    this.masterVolume = 16384;
    this.percussionPart = new Array(16).fill(false);
    this.percussionPart[9] = true; // Channel 10 is percussion
    this.percussionVolume = new Array(128).fill(127);
    this.reverb = [];
    this.modulation = new Array(16).fill(0);
    this.filter = [];
    this.items = [];
    this.intersection = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.target instanceof HTMLElement) {
            entry.target.dataset.isIntersecting = entry.isIntersecting.toString();
          }
        });
      },
      {}
    );
    this.timer = null;
    this.drag = false;
    this.element = null;

    // Initialize reverb and filter for each channel
    for (let i = 0; i < 16; ++i) {
      this.reverb[i] = new Reverb(this.ctx, { noise: 'violet' });
      this.filter[i] = this.ctx.createBiquadFilter();
    }
  }

  private getAudioContext(): AudioContext {
    const ctx = new AudioContext();

    // Defreeze AudioContext for iOS
    const initAudioContext = () => {
      document.removeEventListener('touchstart', initAudioContext);
      const emptySource = ctx.createBufferSource();
      emptySource.start();
      emptySource.stop();
    };

    document.addEventListener('touchstart', initAudioContext);

    return ctx;
  }

  // ... rest of the methods with proper TypeScript types ...
} 
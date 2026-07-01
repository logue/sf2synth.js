import type Reverb from '@logue/reverb';

import { CENTS_PER_OCTAVE, SEMITONE_RATIO } from '@/Constants';
import type { SynthInstrument } from '@/interfaces/SynthesizerInterface';
import type { EnvelopeTiming } from '@/types/EnvelopeTiming';

/**
 * SynthesizerNote Class
 *
 * @author imaya
 */
export default class SynthesizerNote {
  // Constants
  static readonly MIDI_CENTER_VALUE = 64;
  static readonly MIDI_MAX_VALUE = 127;
  static readonly DEFAULT_Q_VALUE = 10;
  static readonly Q_DIVISOR = 200;
  static readonly PITCH_BEND_RANGE = 8192;
  static readonly PITCH_BEND_MAX = 8191;

  static readonly SAMPLE_MODE = {
    NO_LOOP: 0,
    CONTINUOUS_LOOP: 1,
    UNUSED: 2,
    LOOP_UNTIL_NOTE_OFF: 3,
  };

  private readonly ctx: AudioContext;
  private readonly destination: AudioNode;
  private readonly instrument: SynthInstrument;

  // Instrument properties
  private readonly channel: number;
  private readonly key: number;
  private readonly velocity: number;
  private readonly buffer: Int16Array;
  private readonly playbackRate: number;
  private readonly loopStart: number;
  private readonly loopEnd: number;
  private readonly sampleRate: number;
  private readonly volume: number;
  private readonly panpot: number;
  private readonly pitchBend: number;
  private readonly pitchBendSensitivity: number;
  private readonly modEnvToPitch: number;
  private expression: number;
  private readonly modulation: number;
  private readonly cutOffFrequency: number;
  private readonly harmonicContent: number;
  private readonly reverb: Reverb | undefined;
  private readonly onEnded?: () => void;

  private readonly startTime: number;
  private computedPlaybackRate: number;
  private noteOffState: boolean;
  private audioBuffer: AudioBuffer | null;
  private readonly bufferSource: AudioBufferSourceNode;
  private readonly panner: PannerNode;
  private readonly outputGainNode: GainNode;
  private readonly expressionGainNode: GainNode;
  private filter: BiquadFilterNode;
  private readonly modulator: BiquadFilterNode;
  private lfo: OscillatorNode | null;
  private lfoDepth: GainNode | null;

  constructor(
    ctx: AudioContext,
    destination: AudioNode,
    instrument: SynthInstrument,
    onEnded?: () => void,
  ) {
    this.ctx = ctx;
    this.destination = destination;
    this.instrument = instrument;

    // Instrument properties
    const {
      channel,
      key,
      velocity,
      sample,
      basePlaybackRate,
      loopStart,
      loopEnd,
      sampleRate,
      volume,
      panpot,
      pitchBend,
      pitchBendSensitivity,
      modEnvToPitch,
      expression,
      modulation,
      cutOffFrequency,
      harmonicContent,
      reverb,
    } = instrument;
    // Validate required fields and provide safe defaults for optional ones
    if (
      typeof channel !== 'number' ||
      typeof key !== 'number' ||
      typeof velocity !== 'number' ||
      !(sample instanceof Int16Array) ||
      typeof sampleRate !== 'number'
    ) {
      throw new TypeError('[SynthesizerNote] Invalid instrument data provided');
    }

    this.channel = channel;
    this.key = key;
    this.velocity = velocity;
    this.buffer = sample;
    this.playbackRate = basePlaybackRate ?? 1;
    this.loopStart = loopStart ?? 0;
    this.loopEnd = loopEnd ?? 0;
    this.sampleRate = sampleRate;
    this.volume = volume ?? 1;
    this.panpot = panpot ?? SynthesizerNote.MIDI_CENTER_VALUE;
    this.pitchBend = pitchBend ?? 0;
    this.pitchBendSensitivity =
      pitchBendSensitivity ?? SynthesizerNote.MIDI_CENTER_VALUE;
    this.modEnvToPitch = modEnvToPitch ?? 0;
    this.expression = expression ?? SynthesizerNote.MIDI_MAX_VALUE;
    this.modulation = modulation ?? 0;
    this.cutOffFrequency = cutOffFrequency ?? 0;
    this.harmonicContent = harmonicContent ?? SynthesizerNote.MIDI_CENTER_VALUE;
    this.reverb = reverb;
    this.onEnded = onEnded;

    // state
    this.startTime = ctx.currentTime;
    this.computedPlaybackRate = this.playbackRate;
    this.noteOffState = false;

    // ---------------------------------------------------------------------------
    // audio node
    // ---------------------------------------------------------------------------

    this.audioBuffer = null;
    this.bufferSource = ctx.createBufferSource();
    this.panner = ctx.createPanner();
    this.outputGainNode = ctx.createGain();
    this.expressionGainNode = ctx.createGain();
    this.filter = ctx.createBiquadFilter();
    this.modulator = ctx.createBiquadFilter();

    // Vibrato (LFO) nodes
    this.lfo = null;
    this.lfoDepth = null;
  }

  /**
   * Ensure value is finite, otherwise return default
   * @param value Value to validate
   * @param defaultValue Default value if not finite
   * @returns Validated finite value
   */
  private ensureFinite(value: number, defaultValue = 0): number {
    return Number.isFinite(value) ? value : defaultValue;
  }

  /**
   * Ensure value is finite and positive for exponential ramps
   * @param value Value to validate
   * @param defaultValue Default value if not finite or non-positive
   * @returns Validated positive finite value
   */
  private ensurePositiveFinite(
    value: number,
    defaultValue: number = 0.001,
  ): number {
    return Number.isFinite(value) && value > 0 ? value : defaultValue;
  }

  /**
   * Calculate envelope timing parameters
   * @returns Envelope timing parameters
   */
  private calculateEnvelopeTiming(): EnvelopeTiming {
    const { instrument } = this;
    const now = this.ctx.currentTime || 0;

    return {
      now,
      volDelay: now + instrument.volDelay,
      modDelay: now + instrument.modDelay,
      volAttack: now + instrument.volDelay + instrument.volAttack,
      modAttack: now + instrument.modDelay + instrument.modAttack,
      volHold:
        now + instrument.volDelay + instrument.volAttack + instrument.volHold,
      modHold:
        now + instrument.modDelay + instrument.modAttack + instrument.modHold,
      volDecay:
        now +
        instrument.volDelay +
        instrument.volAttack +
        instrument.volHold +
        instrument.volDecay,
      modDecay:
        now +
        instrument.modDelay +
        instrument.modAttack +
        instrument.modHold +
        instrument.modDecay,
    };
  }

  /**
   * Setup audio buffer from sample data
   */
  private setupAudioBuffer(): AudioBuffer {
    const { sampleRate, buffer: sampleBuffer } = this;
    const audioBuffer = this.ctx.createBuffer(
      1,
      sampleBuffer.length,
      sampleRate,
    );
    const channelData = audioBuffer.getChannelData(0);

    for (let i = 0, il = sampleBuffer.length; i < il; ++i) {
      channelData[i] = sampleBuffer[i] / 32768; // 32,768 is the max value for 16-bit signed audio
    }

    return audioBuffer;
  }

  /** Note on */
  noteOn() {
    const { instrument } = this;
    const timing = this.calculateEnvelopeTiming();

    /*
    console.debug(
      '[SynthesizerNote] noteOn: channel=%d key=%d velocity=%d sampleLen=%d',
      this.channel,
      this.key,
      this.velocity,
      this.buffer?.length ?? 0,
    );
    */

    const loopStart = instrument.loopStart / this.sampleRate;
    const loopEnd = instrument.loopEnd / this.sampleRate;
    const startTime = instrument.start / this.sampleRate;
    // TODO: ドラムパートのPanが変化した場合、その計算をしなければならない
    // http://cpansearch.perl.org/src/PJB/MIDI-SoundFont-1.08/doc/sfspec21.html#8.4.6
    const pan = instrument.pan === 0 ? this.panpot : instrument.pan;

    // Setup audio buffer
    this.audioBuffer = this.setupAudioBuffer();

    // Configure buffer source
    const { bufferSource } = this;
    bufferSource.buffer = this.audioBuffer;
    bufferSource.loop =
      instrument.sampleModes !== SynthesizerNote.SAMPLE_MODE.NO_LOOP;
    bufferSource.loopStart = loopStart;
    bufferSource.loopEnd = loopEnd;
    this.updatePitchBend(this.pitchBend);

    // Configure expression
    this.expressionGainNode.gain.value =
      this.expression / SynthesizerNote.MIDI_MAX_VALUE;

    // Configure panner
    this.setupPanner(pan);

    // ---------------------------------------------------------------------------
    // Volume Envelope: Delay, Attack, Hold, Decay, Sustain
    // ---------------------------------------------------------------------------
    this.setupVolumeEnvelope(timing);

    // ---------------------------------------------------------------------------
    // Modulation Envelope
    // ---------------------------------------------------------------------------
    this.setupModulationEnvelope(timing);

    // ---------------------------------------------------------------------------
    // Vibrato (LFO)
    // ---------------------------------------------------------------------------
    this.setupVibrato();

    // ---------------------------------------------------------------------------
    // Audio Node Connections
    // ---------------------------------------------------------------------------
    this.connectAudioNodes();

    // cleanup when the source finishes playing
    bufferSource.onended = () => {
      try {
        this.disconnect();
      } catch (_error) {
        // ignore cleanup failures
      }
      this.onEnded?.();
    };

    // fire
    bufferSource.start(0, startTime);
  }

  /**
   * Setup panner node for spatial positioning
   * @param pan Pan position (-1 to 1)
   */
  private setupPanner(pan: number = 0) {
    const { panner } = this;
    panner.panningModel = 'equalpower';
    panner.distanceModel = 'inverse';
    panner.positionX.setValueAtTime(Math.sin((pan * Math.PI) / 2), 0);
    panner.positionY.setValueAtTime(0, 0);
    panner.positionZ.setValueAtTime(Math.cos((pan * Math.PI) / 2), 0);
  }

  /**
   * Setup volume envelope (DAHDSR)
   * @param timing Envelope timing parameters
   */
  private setupVolumeEnvelope(timing: EnvelopeTiming) {
    const { instrument, velocity, volume } = this;
    const { now, volDelay, volHold, volDecay } = timing;

    const calculatedVolume = this.ensureFinite(
      Math.max(
        0,
        volume *
          (velocity / SynthesizerNote.MIDI_MAX_VALUE) *
          (1 - instrument.initialAttenuation / 1000),
      ),
      0,
    );

    const sustainValue = this.ensureFinite(
      calculatedVolume * (1 - instrument.volSustain),
      0,
    );

    const outputGain = this.outputGainNode.gain;
    outputGain.setValueAtTime(0, this.ensureFinite(now, 0));
    outputGain.setValueAtTime(0, this.ensureFinite(volDelay, 0));
    outputGain.setTargetAtTime(
      calculatedVolume,
      this.ensureFinite(volDelay, 0),
      this.ensureFinite(instrument.volAttack, 0.001),
    );
    outputGain.setValueAtTime(calculatedVolume, this.ensureFinite(volHold, 0));
    outputGain.linearRampToValueAtTime(
      sustainValue,
      this.ensureFinite(volDecay, 0),
    );
  }

  /**
   * Setup modulation envelope for filter frequency
   * @param timing Envelope timing parameters
   */
  private setupModulationEnvelope(timing: EnvelopeTiming) {
    const { instrument } = this;
    const { now, modDelay, modHold, modDecay } = timing;
    const { modulator } = this;

    const baseFreq = this.ensurePositiveFinite(instrument.initialFilterFc, 350);
    const peekFreq = this.ensurePositiveFinite(
      baseFreq + instrument.modEnvToFilterFc,
      baseFreq,
    );
    const sustainFreq = this.ensurePositiveFinite(
      baseFreq + (peekFreq - baseFreq) * (1 - instrument.modSustain),
      baseFreq,
    );

    const qValue = this.ensurePositiveFinite(
      SynthesizerNote.DEFAULT_Q_VALUE **
        (instrument.initialFilterQ / SynthesizerNote.Q_DIVISOR),
      1,
    );

    modulator.Q.setValueAtTime(qValue, this.ensureFinite(now, 0));
    modulator.frequency.value = baseFreq;
    modulator.type = 'lowpass';
    modulator.frequency.setTargetAtTime(
      this.ensurePositiveFinite(
        baseFreq / SynthesizerNote.MIDI_MAX_VALUE,
        0.001,
      ),
      this.ensureFinite(this.ctx.currentTime, 0),
      0.5,
    );
    modulator.frequency.setValueAtTime(baseFreq, this.ensureFinite(now, 0));
    modulator.frequency.setValueAtTime(
      baseFreq,
      this.ensureFinite(modDelay, 0),
    );
    modulator.frequency.setTargetAtTime(
      peekFreq,
      this.ensureFinite(modDelay, 0),
      this.ensureFinite(instrument.modAttack, 0.001),
    );
    modulator.frequency.setValueAtTime(peekFreq, this.ensureFinite(modHold, 0));
    modulator.frequency.exponentialRampToValueAtTime(
      sustainFreq,
      this.ensureFinite(modDecay, 0),
    );
  }

  /**
   * Setup vibrato (LFO) for modulation
   */
  private setupVibrato() {
    const { instrument, modulation } = this;

    // Only setup vibrato if modulation is enabled
    if (!modulation || !instrument.freqVibLFO) {
      return;
    }

    try {
      // Create LFO oscillator
      this.lfo = this.ctx.createOscillator();
      this.lfoDepth = this.ctx.createGain();

      // Configure LFO parameters
      this.lfo.type = 'sine';
      this.lfo.frequency.value = instrument.freqVibLFO;

      // Set vibrato depth based on modulation level
      // Modulation depth controls the intensity of the vibrato
      // Scale down the modulation to a more subtle effect (typical MIDI vibrato depth)
      const vibratoDepth = (modulation / SynthesizerNote.MIDI_MAX_VALUE) * 0.01;
      this.lfoDepth.gain.value = vibratoDepth;

      // Connect LFO to buffer source playback rate
      this.lfo.connect(this.lfoDepth);
      this.lfoDepth.connect(this.bufferSource.playbackRate);

      // Start the LFO
      this.lfo.start(0);
    } catch (error) {
      console.warn('[SynthesizerNote] Failed to setup vibrato:', error);
      // Clean up if setup fails
      if (this.lfo) {
        try {
          this.lfo.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
        this.lfo = null;
      }
      if (this.lfoDepth) {
        try {
          this.lfoDepth.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
        this.lfoDepth = null;
      }
    }
  }

  /**
   * Connect audio nodes in the signal chain
   */
  private connectAudioNodes() {
    const {
      bufferSource,
      modulator,
      panner,
      expressionGainNode,
      outputGainNode,
      instrument,
    } = this;

    bufferSource.connect(modulator);
    modulator.connect(panner);
    panner.connect(expressionGainNode);

    /*
    console.debug(
      '[SynthesizerNote] connectAudioNodes: instrument.mute=',
      !!instrument.mute
    );
    */
    if (!instrument.mute) {
      this.connect();
      /*
      console.debug(
        '[SynthesizerNote] connectAudioNodes: connected outputGainNode to destination'
      );
      */
    } else {
      /*
      console.debug(
        '[SynthesizerNote] connectAudioNodes: skipped destination connect because instrument is muted'
      );
      */
    }

    expressionGainNode.connect(outputGainNode);
    /*
    console.debug(
      '[SynthesizerNote] connectAudioNodes: expressionGain=',
      expressionGainNode.gain.value,
      'outputGain=',
      outputGainNode.gain.value,
      'pannerPosX=',
      panner.positionX?.value ?? 'n/a',
      'pannerPosY=',
      panner.positionY?.value ?? 'n/a',
      'pannerPosZ=',
      panner.positionZ?.value ?? 'n/a'
    );
    */
  }

  /**
   * Convert SoundFont amount to frequency
   * @param val Amount value (cents)
   * @return Frequency in Hz
   */
  public amountToFreq(val: number): number {
    const A440_REF = 440;
    const CENTS_OFFSET = 6900;
    return 2 ** ((val - CENTS_OFFSET) / CENTS_PER_OCTAVE) * A440_REF;
  }

  /** Note off */
  noteOff(): void {
    this.noteOffState = true;
  }

  isNoteOff(): boolean {
    return this.noteOffState;
  }

  /** Get note key (public accessor) */
  getKey(): number {
    return this.key;
  }

  /**
   * Release the note
   */
  release(): void {
    const { instrument, outputGainNode: output, ctx, modulator } = this;
    const now = this.ensureFinite(ctx.currentTime, 0);
    const release =
      (instrument.releaseTime ?? SynthesizerNote.MIDI_CENTER_VALUE) -
      SynthesizerNote.MIDI_CENTER_VALUE;

    if (!this.audioBuffer) {
      return;
    }

    // Stop LFO if active
    if (this.lfo) {
      try {
        this.lfo.stop(now);
      } catch (error) {
        // LFO might already be stopped
      }
    }

    // Calculate release times
    const volEndTimeTmp = this.ensureFinite(
      instrument.volRelease * output.gain.value,
      0.1,
    );
    const releaseMultiplier = this.ensureFinite(
      1 + release / (release < 0 ? SynthesizerNote.MIDI_CENTER_VALUE : 63),
      1,
    );
    const volEndTime = this.ensureFinite(
      now + volEndTimeTmp * releaseMultiplier,
      now + 0.1,
    );

    const baseFreq = this.ensurePositiveFinite(instrument.initialFilterFc, 350);
    const peekFreq = this.ensurePositiveFinite(
      baseFreq + instrument.modEnvToFilterFc,
      baseFreq,
    );
    const modEndTimeMultiplier =
      baseFreq === peekFreq
        ? 1
        : (modulator.frequency.value - baseFreq) / (peekFreq - baseFreq);
    const modEndTime = this.ensureFinite(
      now + instrument.modRelease * this.ensureFinite(modEndTimeMultiplier, 1),
      now + 0.1,
    );

    // Apply release envelope based on sample mode
    this.applySampleModeRelease(volEndTime, modEndTime, baseFreq);
  }

  /**
   * Apply release envelope based on sample mode
   * @param volEndTime Volume release end time
   * @param modEndTime Modulation release end time
   * @param baseFreq Base frequency
   */
  private applySampleModeRelease(
    volEndTime: number,
    modEndTime: number,
    baseFreq: number,
  ) {
    const {
      instrument,
      bufferSource,
      outputGainNode: output,
      modulator,
      ctx,
    } = this;
    const now = this.ensureFinite(ctx.currentTime, 0);

    // Ensure times are valid before using
    const validVolEndTime = this.ensureFinite(volEndTime, now + 0.1);
    const validModEndTime = this.ensureFinite(modEndTime, now + 0.1);
    const validBaseFreq = this.ensurePositiveFinite(baseFreq, 350);

    switch (instrument.sampleModes) {
      case SynthesizerNote.SAMPLE_MODE.NO_LOOP:
        bufferSource.loop = false;
        bufferSource.stop(validVolEndTime);
        break;

      case SynthesizerNote.SAMPLE_MODE.CONTINUOUS_LOOP:
      case SynthesizerNote.SAMPLE_MODE.LOOP_UNTIL_NOTE_OFF:
        this.scheduleRelease(
          output,
          modulator,
          bufferSource,
          now,
          validVolEndTime,
          validModEndTime,
          validBaseFreq,
        );
        if (
          instrument.sampleModes ===
          SynthesizerNote.SAMPLE_MODE.LOOP_UNTIL_NOTE_OFF
        ) {
          bufferSource.loop = false;
          bufferSource.buffer = null;
        } else {
          try {
            bufferSource.stop(validVolEndTime);
          } catch (error) {
            console.warn(
              '[SynthesizerNote] Failed to stop buffer source:',
              error,
            );
            // Fallback: try stopping immediately
            try {
              bufferSource.stop();
            } catch (fallbackError) {
              // Already stopped or in invalid state
            }
          }
        }
        break;

      case SynthesizerNote.SAMPLE_MODE.UNUSED:
        throw new Error('[SynthesizerNote] Detected unused sampleModes');

      default:
        throw new Error(
          `[SynthesizerNote] ${instrument.sampleModes} is an undefined sampleMode`,
        );
    }
  }

  /**
   * Schedule release envelope
   */
  private scheduleRelease(
    output: GainNode,
    modulator: BiquadFilterNode,
    bufferSource: AudioBufferSourceNode,
    now: number,
    volEndTime: number,
    modEndTime: number,
    baseFreq: number,
  ) {
    // Volume release
    output.gain.cancelScheduledValues(0);
    output.gain.setValueAtTime(
      this.ensureFinite(output.gain.value, 0),
      this.ensureFinite(now, 0),
    );
    output.gain.linearRampToValueAtTime(0, this.ensureFinite(volEndTime, 0));

    // Modulation release
    modulator.frequency.cancelScheduledValues(0);
    modulator.frequency.setValueAtTime(
      this.ensurePositiveFinite(modulator.frequency.value, 350),
      this.ensureFinite(now, 0),
    );
    modulator.frequency.exponentialRampToValueAtTime(
      this.ensurePositiveFinite(baseFreq, 350),
      this.ensureFinite(modEndTime, 0),
    );

    // Playback rate release
    bufferSource.playbackRate.cancelScheduledValues(0);
    bufferSource.playbackRate.setValueAtTime(
      this.ensurePositiveFinite(bufferSource.playbackRate.value, 1),
      this.ensureFinite(now, 0),
    );
    bufferSource.playbackRate.exponentialRampToValueAtTime(
      this.ensurePositiveFinite(this.computedPlaybackRate, 1),
      this.ensureFinite(modEndTime, 0),
    );
  }

  /** Connect AudioContext */
  public connect() {
    if (this.reverb) {
      this.reverb.connect(this.outputGainNode).connect(this.destination);
      return;
    }

    this.outputGainNode.connect(this.destination);
  }

  /** Disconnect AudioContext */
  public disconnect() {
    this.outputGainNode.disconnect();

    // Clean up LFO nodes
    if (this.lfo) {
      try {
        this.lfo.disconnect();
      } catch (error) {
        // Ignore disconnect errors
      }
      this.lfo = null;
    }
    if (this.lfoDepth) {
      try {
        this.lfoDepth.disconnect();
      } catch (error) {
        // Ignore disconnect errors
      }
      this.lfoDepth = null;
    }
  }

  /**
   * Calculate and schedule playback rate envelope
   */
  private schedulePlaybackRate() {
    const {
      bufferSource,
      computedPlaybackRate,
      startTime,
      instrument,
      modEnvToPitch,
    } = this;
    const playbackRate = bufferSource.playbackRate;
    const modAttack = this.ensureFinite(
      startTime + instrument.modAttack,
      this.ctx.currentTime,
    );
    const modDecay = this.ensureFinite(
      modAttack + instrument.modDecay,
      modAttack,
    );

    const peekPitch = this.ensureFinite(
      computedPlaybackRate *
        SEMITONE_RATIO ** (modEnvToPitch * instrument.scaleTuning),
      computedPlaybackRate,
    );

    const sustainPitch = this.ensureFinite(
      computedPlaybackRate +
        (peekPitch - computedPlaybackRate) * (1 - instrument.modSustain),
      computedPlaybackRate,
    );

    playbackRate.cancelScheduledValues(0);
    playbackRate.setValueAtTime(
      this.ensureFinite(computedPlaybackRate, 1),
      this.ensureFinite(startTime, this.ctx.currentTime),
    );
    playbackRate.linearRampToValueAtTime(peekPitch, modAttack);
    playbackRate.linearRampToValueAtTime(sustainPitch, modDecay);
  }

  /**
   * Update expression (volume) value
   * @param expression Expression value (0-127)
   */
  public updateExpression(expression: number) {
    this.expression = expression;
    this.expressionGainNode.gain.value =
      expression / SynthesizerNote.MIDI_MAX_VALUE;
  }

  /**
   * Update pitch bend value
   * @param pitchBend Pitch bend value (-8192 to 8191)
   */
  public updatePitchBend(pitchBend: number) {
    const bendRange =
      pitchBend < 0
        ? SynthesizerNote.PITCH_BEND_RANGE
        : SynthesizerNote.PITCH_BEND_MAX;

    this.computedPlaybackRate =
      this.playbackRate *
      SEMITONE_RATIO **
        ((pitchBend / bendRange) *
          this.pitchBendSensitivity *
          this.instrument.scaleTuning);
    this.schedulePlaybackRate();
  }
}

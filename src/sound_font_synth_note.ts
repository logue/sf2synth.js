import Reverb from '@logue/reverb';

interface Instrument {
  channel: number;
  key: number;
  velocity: number;
  sample: Uint8Array;
  basePlaybackRate: number;
  loopStart: number;
  loopEnd: number;
  sampleRate: number;
  volume: number;
  panpot: number;
  pitchBend: number;
  pitchBendSensitivity: number;
  modEnvToPitch: number;
  expression: number;
  modulation: number;
  cutOffFrequency: number;
  hermonicContent: number;
  reverb: Reverb;
  volDelay: number;
  modDelay: number;
  volAttack: number;
  modAttack: number;
  volHold: number;
  modHold: number;
  volDecay: number;
  modDecay: number;
  releaseTime: number;
  volRelease: number;
  modRelease: number;
  start: number;
  end: number;
  pan: number;
  sampleModes: number;
  initialAttenuation: number;
  volSustain: number;
  modSustain: number;
  initialFilterFc: number;
  modEnvToFilterFc: number;
  initialFilterQ: number;
  mute: number;
  scaleTuning: number;
}

/**
 * SynthesizerNote Class
 *
 * @author imaya
 * @private
 */
export default class SynthesizerNote {
  private ctx: AudioContext;
  private destination: AudioNode;
  private instrument: Instrument;
  private channel: number;
  private key: number;
  private velocity: number;
  private buffer: Uint8Array;
  private playbackRate: number;
  private loopStart: number;
  private loopEnd: number;
  private sampleRate: number;
  private volume: number;
  private panpot: number;
  private pitchBend: number;
  private pitchBendSensitivity: number;
  private modEnvToPitch: number;
  private expression: number;
  private modulation: number;
  private cutOffFrequency: number;
  private hermonicContent: number;
  private reverb: Reverb;
  private startTime: number;
  private computedPlaybackRate: number;
  private noteOffState: boolean;
  private audioBuffer: AudioBuffer | null;
  private bufferSource: AudioBufferSourceNode;
  private panner: PannerNode;
  private outputGainNode: GainNode;
  private expressionGainNode: GainNode;
  private filter: BiquadFilterNode;
  private modulator: BiquadFilterNode;

  constructor(ctx: AudioContext, destination: AudioNode, instrument: Instrument) {
    this.ctx = ctx;
    this.destination = destination;
    this.instrument = instrument;
    this.channel = instrument.channel;
    this.key = instrument.key;
    this.velocity = instrument.velocity;
    this.buffer = instrument.sample;
    this.playbackRate = instrument.basePlaybackRate;
    this.loopStart = instrument.loopStart;
    this.loopEnd = instrument.loopEnd;
    this.sampleRate = instrument.sampleRate;
    this.volume = instrument.volume;
    this.panpot = instrument.panpot;
    this.pitchBend = instrument.pitchBend;
    this.pitchBendSensitivity = instrument.pitchBendSensitivity;
    this.modEnvToPitch = instrument.modEnvToPitch;
    this.expression = instrument.expression;
    this.modulation = instrument.modulation;
    this.cutOffFrequency = instrument.cutOffFrequency;
    this.hermonicContent = instrument.hermonicContent;
    this.reverb = instrument.reverb;

    // state
    this.startTime = ctx.currentTime;
    this.computedPlaybackRate = this.playbackRate | 0;
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
  }

  /** Note on */
  noteOn(): void {
    const ctx = this.ctx;
    const instrument = this.instrument;
    const now = this.ctx.currentTime || 0;
    const volDelay = now + instrument.volDelay;
    const modDelay = now + instrument.modDelay;
    const volAttack = volDelay + instrument.volAttack;
    const modAttack = volDelay + instrument.modAttack;
    const volHold = volAttack + instrument.volHold;
    const modHold = modAttack + instrument.modHold;
    const volDecay = volHold + instrument.volDecay;
    const modDecay = modHold + instrument.modDecay;
    const loopStart = instrument.loopStart / this.sampleRate;
    const loopEnd = instrument.loopEnd / this.sampleRate;
    const startTime = instrument.start / this.sampleRate;
    const pan = instrument.pan !== 0 ? instrument.pan : this.panpot;

    const sample = this.buffer.subarray(0, this.buffer.length + instrument.end);
    const buffer = (this.audioBuffer = ctx.createBuffer(
      1,
      sample.length,
      this.sampleRate
    ));
    const channelData = buffer.getChannelData(0);
    channelData.set(sample);

    // buffer source
    const bufferSource = this.bufferSource;
    bufferSource.buffer = buffer;
    bufferSource.loop = instrument.sampleModes !== 0;
    bufferSource.loopStart = loopStart;
    bufferSource.loopEnd = loopEnd;
    this.updatePitchBend(this.pitchBend);

    // Output
    const output = this.outputGainNode;

    // expression
    this.expressionGainNode.gain.value = this.expression / 127;

    // panpot
    const panner = this.panner;
    panner.panningModel = 'equalpower';
    panner.distanceModel = 'inverse';
    panner.positionX.setValueAtTime(Math.sin((pan * Math.PI) / 2), 0);
    panner.positionY.setValueAtTime(0, 0);
    panner.positionZ.setValueAtTime(Math.cos((pan * Math.PI) / 2), 0);

    // ---------------------------------------------------------------------------
    // Delay, Attack, Hold, Decay, Sustain
    // ---------------------------------------------------------------------------

    let volume =
      this.volume *
      (this.velocity / 127) *
      (1 - instrument.initialAttenuation / 1000);
    if (volume < 0) {
      volume = 0;
    }

    const outputGain = output.gain;
    outputGain.setValueAtTime(0, now);
    outputGain.setValueAtTime(0, volDelay);
    outputGain.setTargetAtTime(volume, volDelay, instrument.volAttack);
    outputGain.setValueAtTime(volume, volHold);
    outputGain.linearRampToValueAtTime(
      volume * (1 - instrument.volSustain),
      volDecay
    );

    // modulation envelope
    const baseFreq = instrument.initialFilterFc;
    const peekFreq = instrument.initialFilterFc + instrument.modEnvToFilterFc;
    const sustainFreq =
      baseFreq + (peekFreq - baseFreq) * (1 - instrument.modSustain);

    const modulator = this.modulator;
    modulator.Q.setValueAtTime(10 ** (instrument.initialFilterQ / 200), now);
    modulator.frequency.value = baseFreq;
    modulator.type = 'lowpass';
    modulator.frequency.setTargetAtTime(
      baseFreq / 127,
      this.ctx.currentTime,
      0.5
    );
    modulator.frequency.setValueAtTime(baseFreq, now);
    modulator.frequency.setValueAtTime(baseFreq, modDelay);
    modulator.frequency.setTargetAtTime(
      peekFreq,
      modDelay,
      instrument.modAttack
    );
    modulator.frequency.setValueAtTime(peekFreq, modHold);
    modulator.frequency.exponentialRampToValueAtTime(sustainFreq, modDecay);

    bufferSource.connect(modulator);
    modulator.connect(panner);
    panner.connect(this.expressionGainNode);

    if (!instrument.mute) {
      this.connect();
    }

    this.expressionGainNode.connect(output);

    // fire
    bufferSource.start(0, startTime);
  }

  /**
   * @param {number} val
   * @return {number}
   */
  amountToFreq(val: number): number {
    return 2 ** ((val - 6900) / 1200) * 440;
  }

  /** Note off */
  noteOff(): void {
    this.noteOffState = true;
  }

  /** @return {boolean} */
  isNoteOff(): boolean {
    return this.noteOffState;
  }

  /** @return {void} */
  release(): void {
    const instrument = this.instrument;
    const bufferSource = this.bufferSource;
    const output = this.outputGainNode;
    const now = this.ctx.currentTime;
    const release = instrument.releaseTime - 64;

    // ---------------------------------------------------------------------------
    // volume release time
    // ---------------------------------------------------------------------------
    const volEndTimeTmp = instrument.volRelease * output.gain.value;
    const volEndTime =
      now + volEndTimeTmp * (1 + release / (release < 0 ? 64 : 63));

    // ---------------------------------------------------------------------------
    // modulation release time
    // ---------------------------------------------------------------------------
    const modulator = this.modulator;
    const baseFreq = instrument.initialFilterFc;
    const peekFreq = instrument.initialFilterFc + instrument.modEnvToFilterFc;
    const modEndTime =
      now +
      instrument.modRelease *
        (baseFreq === peekFreq
          ? 1
          : (modulator.frequency.value - baseFreq) / (peekFreq - baseFreq));

    if (!this.audioBuffer) {
      return;
    }

    // ---------------------------------------------------------------------------
    // Release
    // ---------------------------------------------------------------------------

    switch (instrument.sampleModes) {
      case 0:
        // ループしない
        bufferSource.loop = false;
        break;
      case 1:
        // ループさせる
        output.gain.cancelScheduledValues(0);
        output.gain.setValueAtTime(output.gain.value, now);
        output.gain.linearRampToValueAtTime(0, volEndTime);

        modulator.frequency.cancelScheduledValues(0);
        modulator.frequency.setValueAtTime(modulator.frequency.value, now);
        modulator.frequency.exponentialRampToValueAtTime(baseFreq, modEndTime);

        bufferSource.playbackRate.cancelScheduledValues(0);
        bufferSource.playbackRate.setValueAtTime(
          bufferSource.playbackRate.value,
          now
        );
        bufferSource.playbackRate.exponentialRampToValueAtTime(
          this.computedPlaybackRate,
          modEndTime
        );

        bufferSource.stop(volEndTime);
        break;
      case 2:
        // 未定義
        throw Error('[SynthesizerNote] Detect unused sampleModes');
      case 3:
        // ノートオフまでループさせる
        output.gain.cancelScheduledValues(0);
        output.gain.setValueAtTime(output.gain.value, now);
        output.gain.linearRampToValueAtTime(0, volEndTime);

        modulator.frequency.cancelScheduledValues(0);
        modulator.frequency.setValueAtTime(modulator.frequency.value, now);
        modulator.frequency.exponentialRampToValueAtTime(baseFreq, modEndTime);

        bufferSource.playbackRate.cancelScheduledValues(0);
        bufferSource.playbackRate.setValueAtTime(
          bufferSource.playbackRate.value,
          now
        );
        bufferSource.playbackRate.exponentialRampToValueAtTime(
          this.computedPlaybackRate,
          modEndTime
        );
        bufferSource.loop = false;
        bufferSource.buffer = null;
        break;
      default:
        throw Error(
          `[SynthesizerNote] ${instrument.sampleModes} is undefined sampleModes.`
        );
    }
  }

  /** Connect AudioContext */
  connect(): void {
    this.reverb.connect(this.outputGainNode).connect(this.destination);
  }

  /** Disconnect AudioContext */
  disconnect(): void {
    this.outputGainNode.disconnect(0);
  }

  /** Caluclate playback rate */
  schedulePlaybackRate(): void {
    const playbackRate = this.bufferSource.playbackRate;
    const computed = this.computedPlaybackRate;
    const start = this.startTime;
    const instrument = this.instrument;
    const modAttack = start + instrument.modAttack;
    const modDecay = modAttack + instrument.modDecay;
    const peekPitch =
      computed *
      1.0594630943592953 ** // Math.pow(2, 1 / 12)
        (this.modEnvToPitch * this.instrument.scaleTuning);

    playbackRate.cancelScheduledValues(0);
    playbackRate.setValueAtTime(computed, start);
    playbackRate.linearRampToValueAtTime(peekPitch, modAttack);
    playbackRate.linearRampToValueAtTime(
      computed + (peekPitch - computed) * (1 - instrument.modSustain),
      modDecay
    );
  }

  /** @param {number} expression */
  updateExpression(expression: number): void {
    this.expressionGainNode.gain.value = (this.expression = expression) / 127;
  }

  /** @param {number} pitchBend */
  updatePitchBend(pitchBend: number): void {
    this.computedPlaybackRate =
      this.playbackRate *
      1.0594630943592953 ** // Math.pow(2, 1 / 12)
        ((pitchBend / (pitchBend < 0 ? 8192 : 8191)) *
          this.pitchBendSensitivity *
          this.instrument.scaleTuning);
    this.schedulePlaybackRate();
  }
} 
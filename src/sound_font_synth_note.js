/**
 * SynthesizerNote Class
 *
 * @author imaya
 * @private
 */
export default class SynthesizerNote {
  // Constants
  static SEMITONE_RATIO = 1.0594630943592953; // 2^(1/12)
  static MIDI_CENTER_VALUE = 64;
  static MIDI_MAX_VALUE = 127;
  static CENTS_PER_OCTAVE = 1200;
  static DEFAULT_Q_VALUE = 10;
  static Q_DIVISOR = 200;
  /**
   * @param {AudioContext} ctx
   * @param {AudioNode} destination
   * @param {{
   *   channel: number;
   *   key: number;
   *   velocity: number;
   *   sample: Uint8Array;
   *   basePlaybackRate: number;
   *   loopStart: number;
   *   loopEnd: number;
   *   sampleRate: number;
   *   volume: number;
   *   panpot: number;
   *   pitchBend: number;
   *   pitchBendSensitivity: number;
   *   modEnvToPitch: number;
   *   expression: number;
   *   modulation: number;
   *   cutOffFrequency: number;
   *   hermonicContent: number;
   *   reverb: import('@logue/reverb').default;
   *   volDelay: number;
   *   modDelay: number;
   *   volAttack: number;
   *   modAttack: number;
   *   volHold: number;
   *   modHold: number;
   *   volDecay: number;
   *   modDecay: number;
   *   releaseTime: number;
   *   volRelease: number;
   *   modRelease: number;
   *   start: number;
   *   end: number;
   *   pan: number;
   *   sampleModes: number;
   *   initialAttenuation: number;
   *   volSustain:number;
   *   modSustain:number;
   *   initialFilterFc :number;
   *   modEnvToFilterFc:number;
   *   initialFilterQ: number;
   *   mute: number;
   *   scaleTuning: number;
   * }} instrument
   */
  constructor(ctx, destination, instrument) {
    /** @type {AudioContext} */
    this.ctx = ctx;
    /** @type {AudioNode} */
    this.destination = destination;
    /** @type {Object} */
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
      hermonicContent,
      reverb,
    } = instrument;

    this.channel = channel;
    this.key = key;
    this.velocity = velocity;
    this.buffer = sample;
    this.playbackRate = basePlaybackRate;
    this.loopStart = loopStart;
    this.loopEnd = loopEnd;
    this.sampleRate = sampleRate;
    this.volume = volume;
    this.panpot = panpot;
    this.pitchBend = pitchBend;
    this.pitchBendSensitivity = pitchBendSensitivity;
    this.modEnvToPitch = modEnvToPitch;
    this.expression = expression;
    this.modulation = modulation;
    this.cutOffFrequency = cutOffFrequency;
    this.hermonicContent = hermonicContent;
    this.reverb = reverb;

    // state
    /** @type {number} */
    this.startTime = ctx.currentTime;
    /** @type {number} */
    this.computedPlaybackRate = this.playbackRate | 0;
    /** @type {boolean} */
    this.noteOffState = false;

    // ---------------------------------------------------------------------------
    // audio node
    // ---------------------------------------------------------------------------

    /** @type {AudioBuffer} */
    this.audioBuffer = null;
    /** @type {AudioBufferSourceNode} */
    this.bufferSource = ctx.createBufferSource();
    /** @type {PannerNode} */
    this.panner = ctx.createPanner();
    /** @type {GainNode} */
    this.outputGainNode = ctx.createGain();
    /** @type {GainNode} */
    this.expressionGainNode = ctx.createGain();
    /** @type {BiquadFilterNode} */
    this.filter = ctx.createBiquadFilter();
    /** @type {BiquadFilterNode} */
    this.modulator = ctx.createBiquadFilter();

    // Vibrato (LFO) nodes
    /** @type {OscillatorNode|null} */
    this.lfo = null;
    /** @type {GainNode|null} */
    this.lfoDepth = null;
  }

  /**
   * Calculate envelope timing parameters
   * @private
   * @returns {Object} Envelope timing parameters
   */
  calculateEnvelopeTiming() {
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
   * @private
   * @returns {AudioBuffer}
   */
  setupAudioBuffer() {
    const { instrument, sampleRate, buffer: sampleBuffer } = this;
    const sample = sampleBuffer.subarray(
      0,
      sampleBuffer.length + instrument.end
    );
    const audioBuffer = this.ctx.createBuffer(1, sample.length, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    channelData.set(sample);
    return audioBuffer;
  }

  /** Note on */
  noteOn() {
    const { instrument } = this;
    const timing = this.calculateEnvelopeTiming();

    const loopStart = instrument.loopStart / this.sampleRate;
    const loopEnd = instrument.loopEnd / this.sampleRate;
    const startTime = instrument.start / this.sampleRate;
    // TODO: ドラムパートのPanが変化した場合、その計算をしなければならない
    // http://cpansearch.perl.org/src/PJB/MIDI-SoundFont-1.08/doc/sfspec21.html#8.4.6
    const pan = instrument.pan !== 0 ? instrument.pan : this.panpot;

    // Setup audio buffer
    this.audioBuffer = this.setupAudioBuffer();

    // Configure buffer source
    const { bufferSource } = this;
    bufferSource.buffer = this.audioBuffer;
    bufferSource.loop = instrument.sampleModes !== 0;
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

    if (!instrument.mute) {
      this.connect();
    }

    this.expressionGainNode.connect(this.outputGainNode);

    // fire
    bufferSource.start(0, startTime);
  }

  /**
   * Setup panner node for spatial positioning
   * @private
   * @param {number} pan Pan position (-1 to 1)
   */
  setupPanner(pan) {
    const { panner } = this;
    panner.panningModel = 'equalpower';
    panner.distanceModel = 'inverse';
    panner.positionX.setValueAtTime(Math.sin((pan * Math.PI) / 2), 0);
    panner.positionY.setValueAtTime(0, 0);
    panner.positionZ.setValueAtTime(Math.cos((pan * Math.PI) / 2), 0);
  }

  /**
   * Setup volume envelope (DAHDSR)
   * @private
   * @param {Object} timing Envelope timing parameters
   */
  setupVolumeEnvelope(timing) {
    const { instrument, velocity, volume } = this;
    const { now, volDelay, volHold, volDecay } = timing;

    const calculatedVolume = Math.max(
      0,
      volume *
        (velocity / SynthesizerNote.MIDI_MAX_VALUE) *
        (1 - instrument.initialAttenuation / 1000)
    );

    const outputGain = this.outputGainNode.gain;
    outputGain.setValueAtTime(0, now);
    outputGain.setValueAtTime(0, volDelay);
    outputGain.setTargetAtTime(
      calculatedVolume,
      volDelay,
      instrument.volAttack
    );
    outputGain.setValueAtTime(calculatedVolume, volHold);
    outputGain.linearRampToValueAtTime(
      calculatedVolume * (1 - instrument.volSustain),
      volDecay
    );
  }

  /**
   * Setup modulation envelope for filter frequency
   * @private
   * @param {Object} timing Envelope timing parameters
   */
  setupModulationEnvelope(timing) {
    const { instrument } = this;
    const { now, modDelay, modHold, modDecay } = timing;
    const { modulator } = this;

    const baseFreq = instrument.initialFilterFc;
    const peekFreq = baseFreq + instrument.modEnvToFilterFc;
    const sustainFreq =
      baseFreq + (peekFreq - baseFreq) * (1 - instrument.modSustain);

    modulator.Q.setValueAtTime(
      SynthesizerNote.DEFAULT_Q_VALUE **
        (instrument.initialFilterQ / SynthesizerNote.Q_DIVISOR),
      now
    );
    modulator.frequency.value = baseFreq;
    modulator.type = 'lowpass';
    modulator.frequency.setTargetAtTime(
      baseFreq / SynthesizerNote.MIDI_MAX_VALUE,
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
  }

  /**
   * Setup vibrato (LFO) for modulation
   * @private
   */
  setupVibrato() {
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
      const vibratoDepth = (modulation / SynthesizerNote.MIDI_MAX_VALUE) * 10; // Adjust multiplier as needed
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
   * @private
   */
  connectAudioNodes() {
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

    if (!instrument.mute) {
      this.connect();
    }

    expressionGainNode.connect(outputGainNode);
  }

  /**
   * Convert SoundFont amount to frequency
   * @param {number} val Amount value (cents)
   * @return {number} Frequency in Hz
   */
  amountToFreq(val) {
    const A440_REF = 440;
    const CENTS_OFFSET = 6900;
    return (
      2 ** ((val - CENTS_OFFSET) / SynthesizerNote.CENTS_PER_OCTAVE) * A440_REF
    );
  }

  /** Note off */
  noteOff() {
    this.noteOffState = true;
  }

  /** @return {boolean} */
  isNoteOff() {
    return this.noteOffState;
  }

  /**
   * Release the note
   * @return {void}
   */
  release() {
    const { instrument, outputGainNode: output, ctx, modulator } = this;
    const now = ctx.currentTime;
    const release = instrument.releaseTime - SynthesizerNote.MIDI_CENTER_VALUE;

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
    const volEndTimeTmp = instrument.volRelease * output.gain.value;
    const volEndTime =
      now +
      volEndTimeTmp *
        (1 + release / (release < 0 ? SynthesizerNote.MIDI_CENTER_VALUE : 63));

    const baseFreq = instrument.initialFilterFc;
    const peekFreq = baseFreq + instrument.modEnvToFilterFc;
    const modEndTime =
      now +
      instrument.modRelease *
        (baseFreq === peekFreq
          ? 1
          : (modulator.frequency.value - baseFreq) / (peekFreq - baseFreq));

    // Apply release envelope based on sample mode
    this.applySampleModeRelease(volEndTime, modEndTime, baseFreq);
  }

  /**
   * Apply release envelope based on sample mode
   * @private
   * @param {number} volEndTime Volume release end time
   * @param {number} modEndTime Modulation release end time
   * @param {number} baseFreq Base frequency
   */
  applySampleModeRelease(volEndTime, modEndTime, baseFreq) {
    const {
      instrument,
      bufferSource,
      outputGainNode: output,
      modulator,
      ctx,
    } = this;
    const now = ctx.currentTime;

    const SAMPLE_MODE = {
      NO_LOOP: 0,
      CONTINUOUS_LOOP: 1,
      UNUSED: 2,
      LOOP_UNTIL_NOTE_OFF: 3,
    };

    switch (instrument.sampleModes) {
      case SAMPLE_MODE.NO_LOOP:
        bufferSource.loop = false;
        break;

      case SAMPLE_MODE.CONTINUOUS_LOOP:
      case SAMPLE_MODE.LOOP_UNTIL_NOTE_OFF:
        this.scheduleRelease(
          output,
          modulator,
          bufferSource,
          now,
          volEndTime,
          modEndTime,
          baseFreq
        );
        if (instrument.sampleModes === SAMPLE_MODE.LOOP_UNTIL_NOTE_OFF) {
          bufferSource.loop = false;
          bufferSource.buffer = null;
        } else {
          bufferSource.stop(volEndTime);
        }
        break;

      case SAMPLE_MODE.UNUSED:
        throw new Error('[SynthesizerNote] Detected unused sampleModes');

      default:
        throw new Error(
          `[SynthesizerNote] ${instrument.sampleModes} is an undefined sampleMode`
        );
    }
  }

  /**
   * Schedule release envelope
   * @private
   */
  scheduleRelease(
    output,
    modulator,
    bufferSource,
    now,
    volEndTime,
    modEndTime,
    baseFreq
  ) {
    // Volume release
    output.gain.cancelScheduledValues(0);
    output.gain.setValueAtTime(output.gain.value, now);
    output.gain.linearRampToValueAtTime(0, volEndTime);

    // Modulation release
    modulator.frequency.cancelScheduledValues(0);
    modulator.frequency.setValueAtTime(modulator.frequency.value, now);
    modulator.frequency.exponentialRampToValueAtTime(baseFreq, modEndTime);

    // Playback rate release
    bufferSource.playbackRate.cancelScheduledValues(0);
    bufferSource.playbackRate.setValueAtTime(
      bufferSource.playbackRate.value,
      now
    );
    bufferSource.playbackRate.exponentialRampToValueAtTime(
      this.computedPlaybackRate,
      modEndTime
    );
  }

  /** Connect AudioContext */
  connect() {
    this.reverb.connect(this.outputGainNode).connect(this.destination);
  }

  /** Disconnect AudioContext */
  disconnect() {
    this.outputGainNode.disconnect(0);

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
  schedulePlaybackRate() {
    const {
      bufferSource,
      computedPlaybackRate,
      startTime,
      instrument,
      modEnvToPitch,
    } = this;
    const playbackRate = bufferSource.playbackRate;
    const modAttack = startTime + instrument.modAttack;
    const modDecay = modAttack + instrument.modDecay;

    const peekPitch =
      computedPlaybackRate *
      SynthesizerNote.SEMITONE_RATIO **
        (modEnvToPitch * instrument.scaleTuning);

    playbackRate.cancelScheduledValues(0);
    playbackRate.setValueAtTime(computedPlaybackRate, startTime);
    playbackRate.linearRampToValueAtTime(peekPitch, modAttack);
    playbackRate.linearRampToValueAtTime(
      computedPlaybackRate +
        (peekPitch - computedPlaybackRate) * (1 - instrument.modSustain),
      modDecay
    );
  }

  /**
   * Update expression (volume) value
   * @param {number} expression Expression value (0-127)
   */
  updateExpression(expression) {
    this.expression = expression;
    this.expressionGainNode.gain.value =
      expression / SynthesizerNote.MIDI_MAX_VALUE;
  }

  /**
   * Update pitch bend value
   * @param {number} pitchBend Pitch bend value (-8192 to 8191)
   */
  updatePitchBend(pitchBend) {
    const PITCH_BEND_RANGE = 8192;
    const PITCH_BEND_MAX = 8191;
    const bendRange = pitchBend < 0 ? PITCH_BEND_RANGE : PITCH_BEND_MAX;

    this.computedPlaybackRate =
      this.playbackRate *
      SynthesizerNote.SEMITONE_RATIO **
        ((pitchBend / bendRange) *
          this.pitchBendSensitivity *
          this.instrument.scaleTuning);
    this.schedulePlaybackRate();
  }
}

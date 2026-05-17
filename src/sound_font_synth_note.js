/**
 * @typedef {{
 *   channel: number;
 *   key: number;
 *   velocity: number;
 *   sample: Int16Array;
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
 *   harmonicContent: number;
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
 *   volSustain: number;
 *   modSustain: number;
 *   initialFilterFc: number;
 *   modEnvToFilterFc: number;
 *   initialFilterQ: number;
 *   mute: boolean;
 *   scaleTuning: number;
 *   freqVibLFO: number;
 * }} SynthInstrument
 */

/**
 * @typedef {{
 *   now: number;
 *   volDelay: number;
 *   modDelay: number;
 *   volAttack: number;
 *   modAttack: number;
 *   volHold: number;
 *   modHold: number;
 *   volDecay: number;
 *   modDecay: number;
 * }} EnvelopeTiming
 */

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
   * @param {SynthInstrument} instrument
   */
  constructor(ctx, destination, instrument) {
    /** @type {AudioContext} */
    this.ctx = ctx;
    /** @type {AudioNode} */
    this.destination = destination;
    /** @type {SynthInstrument} */
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
    this.harmonicContent = harmonicContent;
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
   * Ensure value is finite, otherwise return default
   * @private
   * @param {number} value Value to validate
   * @param {number} defaultValue Default value if not finite
   * @returns {number} Validated finite value
   */
  ensureFinite(value, defaultValue = 0) {
    return Number.isFinite(value) ? value : defaultValue;
  }

  /**
   * Ensure value is finite and positive for exponential ramps
   * @private
   * @param {number} value Value to validate
   * @param {number} defaultValue Default value if not finite or non-positive
   * @returns {number} Validated positive finite value
   */
  ensurePositiveFinite(value, defaultValue = 0.001) {
    return Number.isFinite(value) && value > 0 ? value : defaultValue;
  }

  /**
   * Calculate envelope timing parameters
   * @private
   * @returns {EnvelopeTiming} Envelope timing parameters
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
  setupPanner(pan = 0) {
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
   * @param {EnvelopeTiming} timing Envelope timing parameters
   */
  setupVolumeEnvelope(timing) {
    const { instrument, velocity, volume } = this;
    const { now, volDelay, volHold, volDecay } = timing;

    const calculatedVolume = this.ensureFinite(
      Math.max(
        0,
        volume *
          (velocity / SynthesizerNote.MIDI_MAX_VALUE) *
          (1 - instrument.initialAttenuation / 1000)
      ),
      0
    );

    const sustainValue = this.ensureFinite(
      calculatedVolume * (1 - instrument.volSustain),
      0
    );

    const outputGain = this.outputGainNode.gain;
    outputGain.setValueAtTime(0, this.ensureFinite(now, 0));
    outputGain.setValueAtTime(0, this.ensureFinite(volDelay, 0));
    outputGain.setTargetAtTime(
      calculatedVolume,
      this.ensureFinite(volDelay, 0),
      this.ensureFinite(instrument.volAttack, 0.001)
    );
    outputGain.setValueAtTime(calculatedVolume, this.ensureFinite(volHold, 0));
    outputGain.linearRampToValueAtTime(
      sustainValue,
      this.ensureFinite(volDecay, 0)
    );
  }

  /**
   * Setup modulation envelope for filter frequency
   * @private
   * @param {EnvelopeTiming} timing Envelope timing parameters
   */
  setupModulationEnvelope(timing) {
    const { instrument } = this;
    const { now, modDelay, modHold, modDecay } = timing;
    const { modulator } = this;

    const baseFreq = this.ensurePositiveFinite(instrument.initialFilterFc, 350);
    const peekFreq = this.ensurePositiveFinite(
      baseFreq + instrument.modEnvToFilterFc,
      baseFreq
    );
    const sustainFreq = this.ensurePositiveFinite(
      baseFreq + (peekFreq - baseFreq) * (1 - instrument.modSustain),
      baseFreq
    );

    const qValue = this.ensurePositiveFinite(
      SynthesizerNote.DEFAULT_Q_VALUE **
        (instrument.initialFilterQ / SynthesizerNote.Q_DIVISOR),
      1
    );

    modulator.Q.setValueAtTime(qValue, this.ensureFinite(now, 0));
    modulator.frequency.value = baseFreq;
    modulator.type = 'lowpass';
    modulator.frequency.setTargetAtTime(
      this.ensurePositiveFinite(
        baseFreq / SynthesizerNote.MIDI_MAX_VALUE,
        0.001
      ),
      this.ensureFinite(this.ctx.currentTime, 0),
      0.5
    );
    modulator.frequency.setValueAtTime(baseFreq, this.ensureFinite(now, 0));
    modulator.frequency.setValueAtTime(
      baseFreq,
      this.ensureFinite(modDelay, 0)
    );
    modulator.frequency.setTargetAtTime(
      peekFreq,
      this.ensureFinite(modDelay, 0),
      this.ensureFinite(instrument.modAttack, 0.001)
    );
    modulator.frequency.setValueAtTime(peekFreq, this.ensureFinite(modHold, 0));
    modulator.frequency.exponentialRampToValueAtTime(
      sustainFreq,
      this.ensureFinite(modDecay, 0)
    );
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
    const now = this.ensureFinite(ctx.currentTime, 0);
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
    const volEndTimeTmp = this.ensureFinite(
      instrument.volRelease * output.gain.value,
      0.1
    );
    const releaseMultiplier = this.ensureFinite(
      1 + release / (release < 0 ? SynthesizerNote.MIDI_CENTER_VALUE : 63),
      1
    );
    const volEndTime = this.ensureFinite(
      now + volEndTimeTmp * releaseMultiplier,
      now + 0.1
    );

    const baseFreq = this.ensurePositiveFinite(instrument.initialFilterFc, 350);
    const peekFreq = this.ensurePositiveFinite(
      baseFreq + instrument.modEnvToFilterFc,
      baseFreq
    );
    const modEndTimeMultiplier =
      baseFreq === peekFreq
        ? 1
        : (modulator.frequency.value - baseFreq) / (peekFreq - baseFreq);
    const modEndTime = this.ensureFinite(
      now + instrument.modRelease * this.ensureFinite(modEndTimeMultiplier, 1),
      now + 0.1
    );

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
    const now = this.ensureFinite(ctx.currentTime, 0);

    const SAMPLE_MODE = {
      NO_LOOP: 0,
      CONTINUOUS_LOOP: 1,
      UNUSED: 2,
      LOOP_UNTIL_NOTE_OFF: 3,
    };

    // Ensure times are valid before using
    const validVolEndTime = this.ensureFinite(volEndTime, now + 0.1);
    const validModEndTime = this.ensureFinite(modEndTime, now + 0.1);
    const validBaseFreq = this.ensurePositiveFinite(baseFreq, 350);

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
          validVolEndTime,
          validModEndTime,
          validBaseFreq
        );
        if (instrument.sampleModes === SAMPLE_MODE.LOOP_UNTIL_NOTE_OFF) {
          bufferSource.loop = false;
          bufferSource.buffer = null;
        } else {
          try {
            bufferSource.stop(validVolEndTime);
          } catch (error) {
            console.warn(
              '[SynthesizerNote] Failed to stop buffer source:',
              error
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
   *
   * @param {GainNode} output
   * @param {BiquadFilterNode} modulator
   * @param {AudioBufferSourceNode} bufferSource
   * @param {number} now
   * @param {number} volEndTime
   * @param {number} modEndTime
   * @param {number} baseFreq
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
    output.gain.setValueAtTime(
      this.ensureFinite(output.gain.value, 0),
      this.ensureFinite(now, 0)
    );
    output.gain.linearRampToValueAtTime(0, this.ensureFinite(volEndTime, 0));

    // Modulation release
    modulator.frequency.cancelScheduledValues(0);
    modulator.frequency.setValueAtTime(
      this.ensurePositiveFinite(modulator.frequency.value, 350),
      this.ensureFinite(now, 0)
    );
    modulator.frequency.exponentialRampToValueAtTime(
      this.ensurePositiveFinite(baseFreq, 350),
      this.ensureFinite(modEndTime, 0)
    );

    // Playback rate release
    bufferSource.playbackRate.cancelScheduledValues(0);
    bufferSource.playbackRate.setValueAtTime(
      this.ensurePositiveFinite(bufferSource.playbackRate.value, 1),
      this.ensureFinite(now, 0)
    );
    bufferSource.playbackRate.exponentialRampToValueAtTime(
      this.ensurePositiveFinite(this.computedPlaybackRate, 1),
      this.ensureFinite(modEndTime, 0)
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
    const modAttack = this.ensureFinite(
      startTime + instrument.modAttack,
      this.ctx.currentTime
    );
    const modDecay = this.ensureFinite(
      modAttack + instrument.modDecay,
      modAttack
    );

    const peekPitch = this.ensureFinite(
      computedPlaybackRate *
        SynthesizerNote.SEMITONE_RATIO **
          (modEnvToPitch * instrument.scaleTuning),
      computedPlaybackRate
    );

    const sustainPitch = this.ensureFinite(
      computedPlaybackRate +
        (peekPitch - computedPlaybackRate) * (1 - instrument.modSustain),
      computedPlaybackRate
    );

    playbackRate.cancelScheduledValues(0);
    playbackRate.setValueAtTime(
      this.ensureFinite(computedPlaybackRate, 1),
      this.ensureFinite(startTime, this.ctx.currentTime)
    );
    playbackRate.linearRampToValueAtTime(peekPitch, modAttack);
    playbackRate.linearRampToValueAtTime(sustainPitch, modDecay);
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

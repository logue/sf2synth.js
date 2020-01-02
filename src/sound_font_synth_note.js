/**
 * SynthesizerNote Class
 * @private
 */
export class SynthesizerNote {
  /**
   * @param {AudioContext} ctx
   * @param {AudioNode} destination
   * @param {{
   *   channel: number,
   *   key: number,
   *   sample: Uint8Array,
   *   basePlaybackRate: number,
   *   loopStart: number,
   *   loopEnd: number,
   *   volume: number,
   *   panpot: number
   * }} instrument
   */
  constructor(ctx, destination, instrument) {
    /** @type {AudioContext} */
    this.ctx = ctx;
    /** @type {AudioNode} */
    this.destination = destination;
    /** @type {{
     *   channel: number,
     *   key: number,
     *   sample: Uint8Array,
     *   basePlaybackRate: number,
     *   loopStart: number,
     *   loopEnd: number,
     *   volume: number,
     *   panpot: number
     * }}
     */
    this.instrument = instrument;
    /** @type {number} */
    this.channel = instrument['channel'];
    /** @type {number} */
    this.key = instrument['key'];
    /** @type {number} */
    this.velocity = instrument['velocity'];
    /** @type {Int16Array} */
    this.buffer = instrument['sample'];
    /** @type {number} */
    this.playbackRate = instrument['basePlaybackRate'];
    /** @type {number} */
    this.loopStart = instrument['loopStart'];
    /** @type {number} */
    this.loopEnd = instrument['loopEnd'];
    /** @type {number} */
    this.sampleRate = instrument['sampleRate'];
    /** @type {number} */
    this.volume = instrument['volume'];
    /** @type {number} */
    this.panpot = instrument['panpot'];
    /** @type {number} */
    this.pitchBend = instrument['pitchBend'];
    /** @type {number} */
    this.pitchBendSensitivity = instrument['pitchBendSensitivity'];
    /** @type {number} */
    this.modEnvToPitch = instrument['modEnvToPitch'];
    /** @type {number} */
    this.expression = instrument['expression'];
    /** @type {number} */
    this.cutOffFrequency = instrument['cutOffFrequency'];
    /** @type {number} */
    this.hermonicContent = instrument['hermonicContent'];

    /** @type {Reverb} */
    this.reverb = instrument['reverb'];

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
    this.audioBuffer;
    /** @type {AudioBufferSourceNode} */
    this.bufferSource = ctx.createBufferSource();
    /** @type {StereoPannerNode} */
    this.panner = ctx.createPanner();
    /** @type {GainNode} */
    this.outputGainNode = ctx.createGain();
    /** @type {GainNode} */
    this.expressionGainNode = ctx.createGain();
    /** @type {BiquadFilterNode} */
    this.filter = ctx.createBiquadFilter();
    /** @type {BiquadFilterNode} */
    this.modulator = ctx.createBiquadFilter();
  }

  /**
   */
  noteOn() {
    /** @type {AudioContext} */
    const ctx = this.ctx;
    /** @type {{
     *   channel: number,
     *   key: number,
     *   sample: Uint8Array,
     *   basePlaybackRate: number,
     *   loopStart: number,
     *   loopEnd: number,
     *   volume: number,
     *   panpot: number
     * }} */
    const instrument = this.instrument;
    // console.log(instrument);
    /** @type {number} */
    const now = this.ctx.currentTime || 0;
    /** @type {number} */
    const volDelay = now + instrument['volDelay'];
    /** @type {number} */
    const modDelay = now + instrument['modDelay'];
    /** @type {number} */
    const volAttack = volDelay + instrument['volAttack'];
    /** @type {number} */
    const modAttack = volDelay + instrument['modAttack'];
    /** @type {number} */
    const volHold = volAttack + instrument['volHold'];
    /** @type {number} */
    const modHold = modAttack + instrument['modHold'];
    /** @type {number} */
    const volDecay = volHold + instrument['volDecay'];
    /** @type {number} */
    const modDecay = modHold + instrument['modDecay'];
    /** @type {number} */
    const loopStart = instrument['loopStart'] / this.sampleRate;
    /** @type {number} */
    const loopEnd = instrument['loopEnd'] / this.sampleRate;
    /** @type {number} */
    const startTime = instrument['start'] / this.sampleRate;
    // TODO: ドラムパートのPanが変化した場合、その計算をしなければならない
    // http://cpansearch.perl.org/src/PJB/MIDI-SoundFont-1.08/doc/sfspec21.html#8.4.6
    /** @type {number} */
    const pan = instrument['pan'] !== void 0 ? instrument['pan'] : this.panpot;

    const sample = this.buffer.subarray(0, this.buffer.length + instrument['end']);
    /** @type {AudioBuffer} */
    const buffer = this.audioBuffer = ctx.createBuffer(1, sample.length, this.sampleRate);
    /** @type {Float32Array} */
    const channelData = buffer.getChannelData(0);
    channelData.set(sample);

    // buffer source
    /** @type {AudioBufferSourceNode} */
    const bufferSource = this.bufferSource;
    bufferSource.buffer = buffer;
    bufferSource.loop = instrument['sampleModes'] | 0 || 0;
    bufferSource.loopStart = loopStart;
    bufferSource.loopEnd = loopEnd;
    this.updatePitchBend(this.pitchBend);

    // Output
    /** @type {GainNode} */
    const output = this.outputGainNode;

    // expression
    this.expressionGainNode.gain.value = this.expression / 127;

    // panpot
    /** @type {StereoPannerNode} */
    const panner = this.panner;
    panner.panningModel = 'equalpower';
    // panner.distanceModel = 'inverse';
    panner.setPosition(
      Math.sin(pan * Math.PI / 2),
      0,
      Math.cos(pan * Math.PI / 2),
    );

    // ---------------------------------------------------------------------------
    // Delay, Attack, Hold, Decay, Sustain
    // ---------------------------------------------------------------------------

    /** @type {number} */
    let volume = this.volume * (this.velocity / 127) * (1 - instrument['initialAttenuation'] / 1000);
    if (volume < 0) {
      volume = 0;
    }

    // volume envelope
    /** @type {AudioNode} */
    const outputGain = output.gain;
    outputGain.setValueAtTime(0, now);
    outputGain.setValueAtTime(0, volDelay);
    outputGain.setTargetAtTime(volume, volDelay, instrument['volAttack']);
    outputGain.setValueAtTime(volume, volHold);
    outputGain.linearRampToValueAtTime(volume * (1 - instrument['volSustain']), volDecay);

    // modulation envelope
    /** @type {number} */
    const baseFreq = this.amountToFreq(instrument['initialFilterFc']);
    /** @type {number} */
    const peekFreq = this.amountToFreq(instrument['initialFilterFc'] + instrument['modEnvToFilterFc']);
    /** @type {number} */
    const sustainFreq = baseFreq + (peekFreq - baseFreq) * (1 - instrument['modSustain']);

    /** @type {BiquadFilterNode} */
    const modulator = this.modulator;
    modulator.Q.setValueAtTime(10 ** (instrument['initialFilterQ'] / 200), now);
    modulator.frequency.value = baseFreq;
    modulator.type = 'lowpass';
    modulator.frequency.setTargetAtTime(baseFreq / 127, this.ctx.currentTime, 0.5);
    modulator.frequency.setValueAtTime(baseFreq, now);
    modulator.frequency.setValueAtTime(baseFreq, modDelay);
    modulator.frequency.setTargetAtTime(peekFreq, modDelay, parseFloat(instrument['modAttack'] + 1)); // For FireFox fix
    modulator.frequency.setValueAtTime(peekFreq, modHold);
    modulator.frequency.linearRampToValueAtTime(sustainFreq, modDecay);

    // connect
    bufferSource.connect(modulator);
    modulator.connect(panner);
    panner.connect(this.expressionGainNode);

    this.expressionGainNode.connect(output);

    if (!instrument['mute']) {
      this.connect();
    }

    // fire
    bufferSource.start(0, startTime);
  }

  /**
   * @param {number} val
   * @return {number}
   */
  amountToFreq(val) {
    return 2 ** ((val - 6900) / 1200) * 440;
  }

  /**
   */
  noteOff() {
    this.noteOffState = true;
  }

  /**
   * @return {boolean}
   */
  isNoteOff() {
    return this.noteOffState;
  }

  /**
   * @return {void}
   */
  release() {
    /** @type {{
     *   channel: number,
     *   key: number,
     *   sample: Uint8Array,
     *   basePlaybackRate: number,
     *   loopStart: number,
     *   loopEnd: number,
     *   volume: number,
     *   panpot: number
     * }} */
    const instrument = this.instrument;
    /** @type {AudioBufferSourceNode} */
    const bufferSource = this.bufferSource;
    /** @type {GainNode} */
    const output = this.outputGainNode;
    /** @type {number} */
    const now = this.ctx.currentTime;
    const release = instrument['releaseTime'] - 64;

    // ---------------------------------------------------------------------------
    // volume release time
    // ---------------------------------------------------------------------------
    /** @type {number} */
    const volEndTimeTmp = instrument['volRelease'] * output.gain.value;
    /** @type {number} */
    const volEndTime = now + (volEndTimeTmp * (1 + release / (release < 0 ? 64 : 63)));
    // var volEndTime = now + instrument['volRelease'] * (1 - instrument['volSustain']);

    // ---------------------------------------------------------------------------
    // modulation release time
    // ---------------------------------------------------------------------------
    /** @type {BiquadFilterNode} */
    const modulator = this.modulator;
    /** @type {number} */
    const baseFreq = this.amountToFreq(instrument['initialFilterFc']);
    /** @type {number} */
    const peekFreq = this.amountToFreq(instrument['initialFilterFc'] + instrument['modEnvToFilterFc']);
    /** @type {number} */
    const modEndTime = now + instrument['modRelease'] *
      (
        baseFreq === peekFreq ?
          1 :
          (modulator.frequency.value - baseFreq) / (peekFreq - baseFreq)
      );
    // var modEndTime = now + instrument['modRelease'] * (1 - instrument['modSustain']);

    if (!this.audioBuffer) {
      return;
    }

    // ---------------------------------------------------------------------------
    // Release
    // ---------------------------------------------------------------------------

    switch (instrument['sampleModes']) {
      case 0:
        // ループしない
        bufferSource.loop = false;
        bufferSource.disconnect();
        bufferSource.buffer = null;
        break;
      case 1:
        // ループさせる
        output.gain.cancelScheduledValues(0);
        output.gain.setValueAtTime(output.gain.value, now);
        output.gain.linearRampToValueAtTime(0, volEndTime);

        modulator.frequency.cancelScheduledValues(0);
        modulator.frequency.setValueAtTime(modulator.frequency.value, now);
        modulator.frequency.linearRampToValueAtTime(baseFreq, modEndTime);

        bufferSource.playbackRate.cancelScheduledValues(0);
        bufferSource.playbackRate.setValueAtTime(bufferSource.playbackRate.value, now);
        bufferSource.playbackRate.linearRampToValueAtTime(this.computedPlaybackRate, modEndTime);

        bufferSource.stop(volEndTime);
        break;
      case 2:
        // 未定義
        console.error('detect unused sampleModes');
        break;
      case 3:
        // ノートオフまでループさせる
        output.gain.cancelScheduledValues(0);
        output.gain.setValueAtTime(output.gain.value, now);
        output.gain.linearRampToValueAtTime(0, volEndTime);

        modulator.frequency.cancelScheduledValues(0);
        modulator.frequency.setValueAtTime(modulator.frequency.value, now);
        modulator.frequency.linearRampToValueAtTime(baseFreq, modEndTime);

        bufferSource.playbackRate.cancelScheduledValues(0);
        bufferSource.playbackRate.setValueAtTime(bufferSource.playbackRate.value, now);
        bufferSource.playbackRate.linearRampToValueAtTime(this.computedPlaybackRate, modEndTime);
      default:
        bufferSource.loop = false;
        break;
    }
  }

  /**
   */
  connect() {
    this.reverb.connect(this.outputGainNode).connect(this.destination);
  }

  /**
   */
  disconnect() {
    this.outputGainNode.disconnect(0);
  }
  /**
   */
  schedulePlaybackRate() {
    const playbackRate = this.bufferSource.playbackRate;
    /** @type {number} */
    const computed = this.computedPlaybackRate;
    /** @type {number} */
    const start = this.startTime;
    /** @type {Object} */
    const instrument = this.instrument;
    /** @type {number} */
    const modAttack = start + instrument['modAttack'];
    /** @type {number} */
    const modDecay = modAttack + instrument['modDecay'];
    /** @type {number} */
    const peekPitch = computed *
      1.0594630943592953 // Math.pow(2, 1 / 12)
      **
      (this.modEnvToPitch * this.instrument['scaleTuning']);

    playbackRate.cancelScheduledValues(0);
    playbackRate.setValueAtTime(computed, start);
    playbackRate.linearRampToValueAtTime(peekPitch, modAttack);
    playbackRate.linearRampToValueAtTime(computed + (peekPitch - computed) * (1 - instrument['modSustain']), modDecay);
  }

  /**
   * @param {number} expression
   */
  updateExpression(expression) {
    this.expressionGainNode.gain.value = (this.expression = expression) / 127;
  }

  /**
   * @param {number} pitchBend
   */
  updatePitchBend(pitchBend) {
    this.computedPlaybackRate = this.playbackRate * (
      1.0594630943592953 // Math.pow(2, 1 / 12)
      **
      ((pitchBend / (pitchBend < 0 ? 8192 : 8191)) *
        this.pitchBendSensitivity *
        this.instrument['scaleTuning']));
    this.schedulePlaybackRate();
  }
}

export default SynthesizerNote;

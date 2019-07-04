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
    this.bufferSource;
    /** @type {StereoPannerNode} */
    this.panner;
    /** @type {GainNode} */
    this.gainOutput;
    /** @type {GainNode} */
    this.expressionGain;
    /** @type {BiquadFilterNode} */
    this.filter;
    /** @type {BiquadFilterNode} */
    this.modulator;
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
    /** @type {number} */
    const now = this.ctx.currentTime;
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
    /** @type {number} */
    // const cutOffFrequency = instrument['cutOffFrequency']; // (Brightness)
    /** @type {number} */
    // const harmonicContent = instrument['harmonicContent']; // (Resonance)

    const sample = this.buffer.subarray(0, this.buffer.length + instrument['end']);
    /** @type {AudioBuffer} */
    const buffer = this.audioBuffer = ctx.createBuffer(1, sample.length, this.sampleRate);
    /** @type {Float32Array} */
    const channelData = buffer.getChannelData(0);
    channelData.set(sample);

    // buffer source
    /** @type {AudioBufferSourceNode} */
    const bufferSource = this.bufferSource = ctx.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.loop = instrument['sampleModes'];
    bufferSource.loopStart = loopStart;
    bufferSource.loopEnd = loopEnd;
    this.updatePitchBend(this.pitchBend);

    // audio node
    /** @type {GainNode} */
    const output = this.gainOutput = ctx.createGain();
    /** @type {AudioGain} */
    const outputGain = output.gain;

    // expression
    this.expressionGain = ctx.createGain();
    // this.expressionGain.gain.value = this.expression / 127;
    this.expressionGain.gain.setTargetAtTime(this.expression / 127, this.ctx.currentTime, 0.015);

    // panpot
    /** @type {StereoPannerNode} */
    const panner = this.panner = ctx.createPanner();
    panner.panningModel = 'equalpower';
    // panner.distanceModel = 'inverse';
    panner.setPosition(
      Math.sin(pan * Math.PI / 2),
      0,
      Math.cos(pan * Math.PI / 2)
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
    outputGain.setValueAtTime(0, now)
      .setValueAtTime(0, volDelay)
      .setTargetAtTime(volume, volDelay, instrument['volAttack'])
      .setValueAtTime(volume, volHold)
      .linearRampToValueAtTime(volume * (1 - instrument['volSustain']), volDecay);

    // modulation envelope
    /** @type {number} */
    const baseFreq = this.amountToFreq(instrument['initialFilterFc']);
    /** @type {number} */
    const peekFreq = this.amountToFreq(instrument['initialFilterFc'] + instrument['modEnvToFilterFc']);
    /** @type {number} */
    const sustainFreq = baseFreq + (peekFreq - baseFreq) * (1 - instrument['modSustain']);

    /** @type {BiquadFilterNode} */
    const modulator = this.modulator = ctx.createBiquadFilter();
    modulator.Q.setValueAtTime(Math.pow(10, instrument['initialFilterQ'] / 200), now);
    // modulator.frequency.value = baseFreq;
    modulator.frequency.setTargetAtTime(baseFreq / 127, this.ctx.currentTime, 0.5);
    modulator.type = 'lowpass';
    modulator.frequency.setValueAtTime(baseFreq, now)
      .setValueAtTime(baseFreq, modDelay)
      .setTargetAtTime(peekFreq, modDelay, parseFloat(instrument['modAttack'] + 1)) // For FireFox fix
      .setValueAtTime(peekFreq, modHold)
      .linearRampToValueAtTime(sustainFreq, modDecay);

    // filter
    /*
    const filter = this.filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = this.ctx.sampleRate / 2;
    filter.gain.value = 0;
    filter.Q.value = 0;
    // console.log(this.sampleRate, 'Hz');
    filter.frequency.value = (cutOffFrequency / this.sampleRate) * 100000; // Brightness = 0 ~ 127  64 = 350 / LPF 100~20000
    // console.log('Brightness:', cutOffFrequency, ' = ', filter.frequency.value, 'Hz');
    filter.Q.value = harmonicContent < 0 ? 0 : harmonicContent - 64; // Resonance 0 ~ 127 / Q = 0~50
    // console.log('Resonance:', harmonicContent, ' = ', filter.Q.value);
    */

    // connect
    bufferSource.connect(modulator);
    modulator.connect(panner);
    panner.connect(this.expressionGain);

    /*
    this.expressionGain.connect(filter);
    filter.connect(output);
    */
    this.expressionGain.connect(output);

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
    return Math.pow(2, (val - 6900) / 1200) * 440;
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
    const output = this.gainOutput;
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
        break;
      case 1:
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
        console.log('detect unused sampleModes');
        break;
      case 3:
        bufferSource.loop = false;
        bufferSource.disconnect();
        bufferSource.buffer = null;
        break;
    }
  }

  /**
   */
  connect() {
    this.gainOutput.connect(this.destination);
  }

  /**
   */
  disconnect() {
    this.gainOutput.disconnect(0);
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
    const peekPitch = computed * Math.pow(
      Math.pow(2, 1 / 12),
      this.modEnvToPitch * this.instrument['scaleTuning']
    );

    playbackRate.cancelScheduledValues(0);
    playbackRate.setValueAtTime(computed, start);
    playbackRate.linearRampToValueAtTime(peekPitch, modAttack);
    playbackRate.linearRampToValueAtTime(computed + (peekPitch - computed) * (1 - instrument['modSustain']), modDecay);
  }

  /**
   * @param {number} expression
   */
  updateExpression(expression) {
    // this.expressionGain.gain.value = (this.expression = expression) / 127;
    this.expressionGain.gain.setTargetAtTime((this.expression = expression) / 127, this.ctx.currentTime, 0.015);
  }

  /**
   * @param {number} pitchBend
   */
  updatePitchBend(pitchBend) {
    this.computedPlaybackRate = this.playbackRate * Math.pow(
      Math.pow(2, 1 / 12),
      (pitchBend / (pitchBend < 0 ? 8192 : 8191)) *
      this.pitchBendSensitivity *
      this.instrument['scaleTuning']
    );
    this.schedulePlaybackRate();
  }
}

export default SynthesizerNote;

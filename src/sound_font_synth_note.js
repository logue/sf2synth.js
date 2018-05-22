goog.provide('SoundFont.SynthesizerNote');

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
 * @constructor
 */
SoundFont.SynthesizerNote = function (ctx, destination, instrument) {
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

    //---------------------------------------------------------------------------
    // audio node
    //---------------------------------------------------------------------------

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
};

SoundFont.SynthesizerNote.prototype.noteOn = function () {
    /** @type {AudioContext} */
    var ctx = this.ctx;
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
    var instrument = this.instrument;
    /** @type {Int16Array} */
    var sample = this.buffer;
    /** @type {AudioBuffer} */
    var buffer;
    /** @type {Float32Array} */
    var channelData;
    /** @type {AudioBufferSourceNode} */
    var bufferSource;
    /** @type {BiquadFilterNode} */
    var filter;
    /** @type {BiquadFilterNode} */
    var modulator;
    /** @type {StereoPannerNode} */
    var panner;
    /** @type {GainNode} */
    var output;
    /** @type {AudioGain} */
    var outputGain;
    /** @type {number} */
    var now = this.ctx.currentTime;
    /** @type {number} */
    var volDelay = now + instrument['volDelay'];
    /** @type {number} */
    var modDelay = now + instrument['modDelay'];
    /** @type {number} */
    var volAttack = volDelay + instrument['volAttack'];
    /** @type {number} */
    var modAttack = volDelay + instrument['modAttack'];
    /** @type {number} */
    var volHold = volAttack + instrument['volHold'];
    /** @type {number} */
    var modHold = modAttack + instrument['modHold'];
    /** @type {number} */
    var volDecay = volHold + instrument['volDecay'];
    /** @type {number} */
    var modDecay = modHold + instrument['modDecay'];
    /** @type {number} */
    var loopStart = instrument['loopStart'] / this.sampleRate;
    /** @type {number} */
    var loopEnd = instrument['loopEnd'] / this.sampleRate;
    /** @type {number} */
    var startTime = instrument['start'] / this.sampleRate;
    /** @type {number} */
    var baseFreq;
    /** @type {number} */
    var peekFreq;
    /** @type {number} */
    var sustainFreq;
    /** @type {number} */
    var volume;
    // TODO: ドラムパートのPanが変化した場合、その計算をしなければならない
    // http://cpansearch.perl.org/src/PJB/MIDI-SoundFont-1.08/doc/sfspec21.html#8.4.6
    /** @type {number} */
    var pan = instrument['pan'] !== void 0 ? instrument['pan'] : this.panpot;
    /** @type {number} */
    var cutOffFrequency = instrument['cutOffFrequency']; // (Brightness)
    /** @type {number} */
    var harmonicContent = instrument['harmonicContent']; // (Resonance)

    sample = sample.subarray(0, sample.length + instrument['end']);
    buffer = this.audioBuffer = ctx.createBuffer(1, sample.length, this.sampleRate);
    channelData = buffer.getChannelData(0);
    channelData.set(sample);

    // buffer source
    bufferSource = this.bufferSource = ctx.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.loop = instrument['sampleModes'];
    bufferSource.loopStart = loopStart;
    bufferSource.loopEnd = loopEnd;
    this.updatePitchBend(this.pitchBend);

    // audio node
    output = this.gainOutput = ctx.createGain();
    outputGain = output.gain;

    // expression
    this.expressionGain = ctx.createGain();
    //this.expressionGain.gain.value = this.expression / 127;
    this.expressionGain.gain.setTargetAtTime(this.expression / 127, this.ctx.currentTime, 0.015);

    // panpot
    panner = this.panner = ctx.createPanner();
    panner.panningModel = 'equalpower';
    //panner.distanceModel = 'inverse';
    panner.setPosition(
        Math.sin(pan * Math.PI / 2),
        0,
        Math.cos(pan * Math.PI / 2)
    );

    //---------------------------------------------------------------------------
    // Delay, Attack, Hold, Decay, Sustain
    //---------------------------------------------------------------------------

    volume = this.volume * (this.velocity / 127) * (1 - instrument['initialAttenuation'] / 1000);
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
    baseFreq = this.amountToFreq(instrument['initialFilterFc']);
    peekFreq = this.amountToFreq(instrument['initialFilterFc'] + instrument['modEnvToFilterFc']);
    sustainFreq = baseFreq + (peekFreq - baseFreq) * (1 - instrument['modSustain']);

    modulator = this.modulator = ctx.createBiquadFilter();
    modulator.Q.setValueAtTime(Math.pow(10, instrument['initialFilterQ'] / 200), now);
    //modulator.frequency.value = baseFreq;
    modulator.frequency.setTargetAtTime(baseFreq / 127, this.ctx.currentTime, 0.5);
    modulator.type = 'lowpass';
    modulator.frequency.setValueAtTime(baseFreq, now)
        .setValueAtTime(baseFreq, modDelay)
        .setTargetAtTime(peekFreq, modDelay, parseFloat(instrument['modAttack'] + 1)) // For FireFox fix
        .setValueAtTime(peekFreq, modHold)
        .linearRampToValueAtTime(sustainFreq, modDecay);

    // filter
    //filter = this.filter = ctx.createBiquadFilter();
    //filter.type = 'lowpass';
    //filter.frequency.value = this.ctx.sampleRate / 2;
    //filter.gain.value = 0;
    //filter.Q.value = 0;
    //  goog.global.console.log(this.sampleRate, 'Hz');
    //  filter.frequency.value = (cutOffFrequency / this.sampleRate) * 100000;	// Brightness = 0 ~ 127  64 = 350 / LPF 100~20000
    //  goog.global.console.log('Brightness:', cutOffFrequency, ' = ', filter.frequency.value, 'Hz');
    //  filter.Q.value = harmonicContent < 0 ? 0 : harmonicContent - 64 ;	// Resonance 0 ~ 127 / Q = 0~50
    //  goog.global.console.log('Resonance:', harmonicContent, ' = ', filter.Q.value);

    // connect
    bufferSource.connect(modulator);
    modulator.connect(panner);
    panner.connect(this.expressionGain);

    //  this.expressionGain.connect(filter);
    //  filter.connect(output);
    this.expressionGain.connect(output);

    if (!instrument['mute']) {
        this.connect();
    }

    // fire
    bufferSource.start(0, startTime);
};

/**
 * @param {number} val
 * @returns {number}
 */
SoundFont.SynthesizerNote.prototype.amountToFreq = function (val) {
    return Math.pow(2, (val - 6900) / 1200) * 440;
};

SoundFont.SynthesizerNote.prototype.noteOff = function () {
    this.noteOffState = true;
};

SoundFont.SynthesizerNote.prototype.isNoteOff = function () {
    return this.noteOffState;
};

SoundFont.SynthesizerNote.prototype.release = function () {
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
    var instrument = this.instrument;
    /** @type {AudioBufferSourceNode} */
    var bufferSource = this.bufferSource;
    /** @type {GainNode} */
    var output = this.gainOutput;
    /** @type {number} */
    var now = this.ctx.currentTime;
    var release = instrument['releaseTime'] - 64;

    //---------------------------------------------------------------------------
    // volume release time
    //---------------------------------------------------------------------------
    /** @type {number} */
    var volEndTimeTmp = instrument['volRelease'] * output.gain.value;
    /** @type {number} */
    var volEndTime = now + (volEndTimeTmp * (1 + release / (release < 0 ? 64 : 63)));
    //var volEndTime = now + instrument['volRelease'] * (1 - instrument['volSustain']);

    //---------------------------------------------------------------------------
    // modulation release time
    //---------------------------------------------------------------------------
    /** @type {BiquadFilterNode} */
    var modulator = this.modulator;
    /** @type {number} */
    var baseFreq = this.amountToFreq(instrument['initialFilterFc']);
    /** @type {number} */
    var peekFreq = this.amountToFreq(instrument['initialFilterFc'] + instrument['modEnvToFilterFc']);
    /** @type {number} */
    var modEndTime = now + instrument['modRelease'] *
        (
            baseFreq === peekFreq ?
            1 :
            (modulator.frequency.value - baseFreq) / (peekFreq - baseFreq)
        );
    //var modEndTime = now + instrument['modRelease'] * (1 - instrument['modSustain']);

    if (!this.audioBuffer) {
        return;
    }

    //---------------------------------------------------------------------------
    // Release
    //---------------------------------------------------------------------------

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
            goog.global.console.log('detect unused sampleModes');
            break;
        case 3:
            bufferSource.loop = false;
            break;
    }
};

SoundFont.SynthesizerNote.prototype.connect = function () {
    this.gainOutput.connect(this.destination);
};

SoundFont.SynthesizerNote.prototype.disconnect = function () {
    this.gainOutput.disconnect(0);
};

SoundFont.SynthesizerNote.prototype.schedulePlaybackRate = function () {
    var playbackRate = this.bufferSource.playbackRate;
    /** @type {number} */
    var computed = this.computedPlaybackRate;
    /** @type {number} */
    var start = this.startTime;
    /** @type {Object} */
    var instrument = this.instrument;
    /** @type {number} */
    var modAttack = start + instrument['modAttack'];
    /** @type {number} */
    var modDecay = modAttack + instrument['modDecay'];
    /** @type {number} */
    var peekPitch = computed * Math.pow(
        Math.pow(2, 1 / 12),
        this.modEnvToPitch * this.instrument['scaleTuning']
    );

    playbackRate.cancelScheduledValues(0);
    playbackRate.setValueAtTime(computed, start);
    playbackRate.linearRampToValueAtTime(peekPitch, modAttack);
    playbackRate.linearRampToValueAtTime(computed + (peekPitch - computed) * (1 - instrument['modSustain']), modDecay);
};

SoundFont.SynthesizerNote.prototype.updateExpression = function (expression) {
    //this.expressionGain.gain.value = (this.expression = expression) / 127;
    this.expressionGain.gain.setTargetAtTime((this.expression = expression) / 127, this.ctx.currentTime, 0.015);
};

/**
 * @param {number} pitchBend
 */
SoundFont.SynthesizerNote.prototype.updatePitchBend = function (pitchBend) {
    this.computedPlaybackRate = this.playbackRate * Math.pow(
        Math.pow(2, 1 / 12),
        (pitchBend / (pitchBend < 0 ? 8192 : 8191)) *
        this.pitchBendSensitivity *
        this.instrument['scaleTuning']
    );
    this.schedulePlaybackRate();
};
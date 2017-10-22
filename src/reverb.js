/**
 * Adapted from https://github.com/web-audio-components/simple-reverb
 */
goog.provide('SoundFont.Reverb');

/** Add reverb effect.
 * @param {AudioContext} ctx
 * @param {{
 *   cutOff: (number|undefined),
 *   decay: (number|undefined),
 *   delay: (number|undefined),
 *   filterType: (string|undefined),
 *   mix: (number|undefined),
 *   reverse: (boolean|undefined),
 *   time: (number|undefined)
 * }} options
 * @constructor
 * @return {GainNode}
 */
var Reverb = function(ctx, options) {
    /** @type {AudioContext} */
    this.ctx = ctx;
    /** @type {Object} */
    this.options = options || {};
    /** @type {GainNode} */
    this.node = this.ctx.createGain();
    /** @type {GainNode} */
    this.outputNode = this.node.output = this.ctx.createGain();
    /** @type {GainNode} */
    this.wetGainNode = this.ctx.createGain();
    /** @type {GainNode} */
    this.dryGainNode = this.ctx.createGain();
    /** @type {ConvolverNode} */
    this.convolverNode = this.ctx.createConvolver();
    /** @type {BiquadFilterNode} */
    this.filterNode = this.ctx.createBiquadFilter();

    // エフェクトのかかり方の接続
    this.node.connect(this.dryGainNode);
    this.node.connect(this.wetGainNode);

    // エフェクトを接続
    this.convolverNode.connect(this.filterNode);
    this.dryGainNode.connect(this.outputNode);
    this.wetGainNode.connect(this.outputNode);

    // フィルタを接続
    this.filterNode.connect(this.node);

    // 入力値と初期値をマージする
    for (var key in Reverb.defaults) {
        this.options[key] = (this.options[key] === void 0) ?
            Reverb.defaults[key] : this.options[key];
    }

    // エフェクタに反映
    this.dryGainNode.gain.value = Reverb.getDryLevel(this.options.mix);
    this.wetGainNode.gain.value = Reverb.getWetLevel(this.options.mix);
    this.filterNode.filterType = this.options.filterType;
    this.filterNode.frequency = this.options.cutOff;

    this.convolverNode.gain = 1;

    // インパルス応答を生成
    this.BuildImpulse();

    return this.node;
};

/** Reverb Preference
 * @const {{
 *   cutOff: number,
 *   decay: number,
 *   delay: number,
 *   filterType: string,
 *   mix: number,
 *   reverse: boolean,
 *   time: number
 * }} */
Reverb.defaults = {
    cutOff: 350,
    decay: 2,
    delay: 0,
    filterType: 'lowpass',
    mix: 0.5,
    reverse: false,
    time: 3
};

/**
 * Utility function for building an impulse response
 * from the module parameters.
 * @return {AudioBuffer}
 */
Reverb.prototype.BuildImpulse = function() {
    /** @type {number} */
    var rate = this.ctx.sampleRate;
    /** @type {number} */
    var length = Math.max(rate * this.options.time, 1);
    //var length = rate * this.options.time;
    /** @type {number} */
    var delayDuration = rate * this.options.delay;
    /** @type {AudioBuffer} */
    var impulse = this.ctx.createBuffer(2, length, rate);
    /** @type {ArrayBufferView} */
    var impulseL = new Float32Array(length);
    /** @type {ArrayBufferView} */
    var impulseR = new Float32Array(length);

    var n, i, pow;

    for (i = 0; i < length; i++) {
        /*
                if (i < delayDuration) {
                    // Delay Effect
                    impulseL[i] = 0;
                    impulseR[i] = 0;
                } else {
                    n = this.options.reverse ? length - (i - delayDuration) : i - delayDuration;
                    n = this.reverse ? length - i : i;
                    pow = Math.pow(1 - n / length, this.options.decay);
                    impulseL[i] = (Math.random() * 2 - 1) * pow;
                    impulseR[i] = (Math.random() * 2 - 1) * pow;
                }
        */
        n = this.options.reverse ? length - (i - delayDuration) : i - delayDuration;
        pow = Math.pow(1 - n / length, this.options.decay);
        impulseL[i] = (Math.random() * 2 - 1) * pow;
        impulseR[i] = (Math.random() * 2 - 1) * pow;
    }

    //goog.global.console.log(impulseL);

    impulse.getChannelData(0).set(impulseL);
    impulse.getChannelData(1).set(impulseR);

    console.info('Update impulse responce.');
    this.convolverNode.buffer = impulse;
};

/** @param {AudioNode} dest */
Reverb.prototype.connect = function(dest) {
    goog.global.console.info('Connect Reverb.');
    this.outputNode.connect(dest.input ? dest.input : dest);
};

/** @param {number} no */
Reverb.prototype.disconnect = function(no) {
    goog.global.console.info('Disconnect Reverb.');
    this.outputNode.disconnect(no);
};

/** @param {number} mix */
Reverb.prototype.mix = function(mix) {
    this.options.mix = mix;
    this.dryGainNode.gain.value = Reverb.getDryLevel(mix);
    this.wetGainNode.gain.value = Reverb.getWetLevel(mix);
};

/** @param {number} time */
Reverb.prototype.time = function(time) {
    this.options.time = time;
    this.BuildImpulse();
};

/** 
 * Impulse response decay rate.
 * @param {number} decay
 */
Reverb.prototype.decay = function(decay) {
    this.options.decay = decay;
    this.BuildImpulse();
};

/** 
 * Impulse response decay rate.
 * @param {number} delay
 */
Reverb.prototype.delay = function(delay) {
    this.options.delay = delay;
    this.BuildImpulse();
};

/**
 * Reverse the impulse response.
 * @param {boolean} reverse
 */
Reverb.prototype.reverse = function(reverse) {
    if (!Boolean(reverse)) {
        //goog.global.console.warn('reverse value must be boolean');
        return;
    }

    this.options.reverse = reverse;
    this.BuildImpulse();
};

/**
 * Cut off frequency.
 * @param {number} freq
 */
Reverb.prototype.cutOff = function(freq) {
    this.filterNode.frequency = this.options.filter.frequency = freq;
};

/**
 * Filter Type.
 * @param {string} type
 */
Reverb.prototype.filterType = function(type) {
    this.filterNode.filterType = this.options.filter.type = type;
};

/**
 * @param {number} value
 * @return {number}
 */
Reverb.getDryLevel = function(value) {
    if (value > 1 || value < 0) {
        return 0;
    }

    if (value <= 0.5)
        return 1;

    return 1 - ((value - 0.5) * 2);
};

/**
 * @param {number} value
 * @return {number}
 */
Reverb.getWetLevel = function(value) {
    if (value > 1 || value < 0) {
        return 0;
    }

    if (value >= 0.5)
        return 1;

    return 1 - ((value - 0.5) * 2);
};

SoundFont.Reverb = Reverb;
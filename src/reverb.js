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
var Reverb = function (ctx, options) {
    /** @type {AudioContext} */
    this.ctx = ctx;
    /** @type {GainNode} */
    this.wetGainNode = this.ctx.createGain();
    /** @type {GainNode} */
    this.dryGainNode = this.ctx.createGain();
    /** @type {ConvolverNode} */
    this.node = this.ctx.createConvolver();
    /** @type {BiquadFilterNode} */
    this.filterNode = this.ctx.createBiquadFilter();

    // デフォルト値

    /** @type {number} */
    this._cutOff = 350;
    /** @type {number} */
    this._decay = 2;
    /** @type {number} */
    this._delay = 0;
    /** @type {BiquadFilterType} */
    this._filterType = 'lowpass';
    /** @type {number} */
    this._mix = 1;
    /** @type {boolean} */
    this._reverse = false;
    /** @type {number} */
    this._time = 3;

    // 入力値と初期値をマージする
    for (var key in options) {
        if (options[key] !== undefined) {
            this['_' + key] = options[key];
        }
    }

    // エフェクタに反映
    this.mix(this._mix);
    this.filterType(this._filterType);
    this.cutOff(this._cutOff);
    // インパルス応答を生成
    this.BuildImpulse();

    // エフェクトのかかり方の接続
    this.node.connect(this.dryGainNode);
    this.node.connect(this.wetGainNode);
    // エフェクトを接続
    this.node.connect(this.filterNode);
    this.dryGainNode.connect(this.node);
    this.wetGainNode.connect(this.node);
    // フィルタを接続
    this.filterNode.connect(this.node);
};

/**
 * Utility function for building an impulse response
 * from the module parameters.
 * @return {AudioBuffer}
 */
Reverb.prototype.BuildImpulse = function () {
    /** @type {number} */
    var rate = this.ctx.sampleRate;
    /** @type {number} */
    var length = Math.max(rate * this._time, 1);
    /** @type {number} */
    var delayDuration = rate * this._delay;
    /** @type {AudioBuffer} */
    var impulse = this.ctx.createBuffer(2, length, rate);
    /** @type {ArrayBufferView} */
    var impulseL = new Float32Array(length);
    /** @type {ArrayBufferView} */
    var impulseR = new Float32Array(length);

    for (var i = 0; i < length; i++) {
        var n = void 0,
            pow = void 0;
        if (i < delayDuration) {
            // Delay Effect
            impulseL[i] = 0;
            impulseR[i] = 0;
        } else {
            n = this._reverse ? length - (i - delayDuration) : i - delayDuration;
            n = this._reverse ? length - i : i;
            pow = Math.pow(1 - n / length, this._decay);
            impulseL[i] = (Math.random() * 2 - 1) * pow;
            impulseR[i] = (Math.random() * 2 - 1) * pow;
        }
        n = this._reverse ? length - (i - delayDuration) : i - delayDuration;
        pow = Math.pow(1 - n / length, this._decay);
        impulseL[i] = (Math.random() * 2 - 1) * pow;
        impulseR[i] = (Math.random() * 2 - 1) * pow;
    }

    impulse.getChannelData(0).set(impulseL);
    impulse.getChannelData(1).set(impulseR);

    goog.global.console.info('Update impulse responce.');
    //goog.global.console.log(impulseL);
    this.node.buffer = impulse;
};

/** @param {number} mix */
Reverb.prototype.mix = function (mix) {
    this._mix = mix;
    this.dryGainNode.gain.setTargetAtTime(this.getDryLevel(mix) / 127, this.ctx.currentTime, 0.015);
    this.wetGainNode.gain.setTargetAtTime(this.getWetLevel(mix) / 127, this.ctx.currentTime, 0.015);
};

/** @param {number} time */
Reverb.prototype.time = function (time) {
    this._time = time;
    this.BuildImpulse();
};

/** 
 * Impulse response decay rate.
 * @param {number} decay
 */
Reverb.prototype.decay = function (decay) {
    this._decay = decay;
    this.BuildImpulse();
};

/** 
 * Impulse response decay rate.
 * @param {number} delay
 */
Reverb.prototype.delay = function (delay) {
    this._delay = delay;
    this.BuildImpulse();
};

/**
 * Reverse the impulse response.
 * @param {boolean} reverse
 */
Reverb.prototype.reverse = function (reverse) {
    this._reverse = reverse;
    this.BuildImpulse();
};

/**
 * Cut off frequency.
 * @param {number} freq
 */
Reverb.prototype.cutOff = function (freq) {
    this._cutOff = freq;
    this.filterNode.frequency.setTargetAtTime(this._cutOff, this.ctx.currentTime, 0.015);
};

/**
 * Filter Type.
 * @param {BiquadFilterType} type
 */
Reverb.prototype.filterType = function (type) {
    this.filterNode.type = this._filterType = type;
};

/**
 * @param {number} value
 * @return {number}
 */
Reverb.prototype.getDryLevel = function (value) {
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
Reverb.prototype.getWetLevel = function (value) {
    if (value > 1 || value < 0) {
        return 0;
    }

    if (value >= 0.5)
        return 1;

    return 1 - ((value - 0.5) * 2);
};

SoundFont.Reverb = Reverb;
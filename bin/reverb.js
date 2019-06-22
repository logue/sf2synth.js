/*! sf2synth.js v0.3.1 | imaya / GREE Inc. / Logue | license: MIT */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("SoundFont", [], factory);
	else if(typeof exports === 'object')
		exports["SoundFont"] = factory();
	else
		root["SoundFont"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/reverb.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/reverb.js":
/*!***********************!*\
  !*** ./src/reverb.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * @author Logue
 * Adapted from https://github.com/web-audio-components/simple-reverb
 */
class Reverb {
  /** Add reverb effect.
   * @param {AudioContext} ctx
   * @param {{
   *   freq: (number|undefined),
   *   decay: (number|undefined),
   *   delay: (number|undefined),
   *   filterType: (string|undefined),
   *   mix: (number|undefined),
   *   reverse: (boolean|undefined),
   *   time: (number|undefined)
   * }} options
   */
  constructor(ctx, options = {}) {
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
    this._freq = options.freq || 440;
    /** @type {number} */
    this._decay = options.decay || 1;
    /** @type {number} */
    this._delay = options.delay || 0.5;
    /** @type {BiquadFilterNode|null} */
    this._filterType = options.filterType || 'bandpass';
    /** @type {number} */
    this._mix = options.mix || 0.5;
    /** @type {boolean} */
    this._reverse = options.reverse || false;
    /** @type {number} */
    this._time = options.time || 1;

    // エフェクタに反映
    this.mix(this._mix);
    this.filterType(this._filterType);
    this.freq(this._freq);
    // インパルス応答を生成
    this.buildImpulse();

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
   */
  buildImpulse() {
    /** @type {number} */
    const rate = this.ctx.sampleRate;
    /** @type {number} */
    const length = Math.max(rate * this._time, 1);
    /** @type {number} */
    const delayDuration = rate * this._delay;
    /** @type {AudioBuffer} */
    const impulse = this.ctx.createBuffer(2, length, rate);
    /** @type {Array<number>|ArrayBufferView} */
    const impulseL = new Float32Array(length);
    /** @type {Array<number>|ArrayBufferView} */
    const impulseR = new Float32Array(length);

    for (let i = 0; i < length; i++) {
      let n = void 0;
      let pow = void 0;
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

    this.node.buffer = impulse;
  }

  /** @param {number} mix */
  mix(mix) {
    this._mix = mix;
    this.dryGainNode.gain.setTargetAtTime(this.getDryLevel(mix) / 127, this.ctx.currentTime, 0.015);
    this.wetGainNode.gain.setTargetAtTime(this.getWetLevel(mix) / 127, this.ctx.currentTime, 0.015);
  }

  /** @param {number} time */
  time(time) {
    this._time = time;
    this.buildImpulse();
  }

  /**
   * Impulse response decay rate.
   * @param {number} decay
   */
  decay(decay) {
    this._decay = decay;
    this.buildImpulse();
  }

  /**
   * Impulse response decay rate.
   * @param {number} delay
   */
  delay(delay) {
    this._delay = delay;
    this.buildImpulse();
  }

  /**
   * Reverse the impulse response.
   * @param {boolean} reverse
   */
  reverse(reverse) {
    this._reverse = reverse;
    this.buildImpulse();
  }

  /**
   * Cut off frequency.
   * @param {number} freq
   */
  freq(freq) {
    this._freq = freq;
    this.filterNode.frequency.setTargetAtTime(this._freq, this.ctx.currentTime, 0.015);
  }

  /**
   * Filter Type.
   * @param {BiquadFilterNode|null} type
   */
  filterType(type) {
    this.filterNode.type = this._filterType = type;
  }

  /**
   * @param {number} value
   * @return {number}
   */
  getDryLevel(value) {
    if (value > 1 || value < 0) {
      return 0;
    }

    if (value <= 0.5) {
      return 1;
    }

    return 1 - ((value - 0.5) * 2);
  }

  /**
   * @param {number} value
   * @return {number}
   */
  getWetLevel(value) {
    if (value > 1 || value < 0) {
      return 0;
    }

    if (value >= 0.5) {
      return 1;
    }

    return 1 - ((value - 0.5) * 2);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Reverb);


/***/ })

/******/ });
});
//# sourceMappingURL=reverb.js.map
/*! @logue/sf2synth v0.3.4 | imaya / GREE Inc. / Logue | license: MIT | build: 2019-12-26T16:24:37.934Z */
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/wml.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@logue/reverb/bin/reverb.js":
/*!**************************************************!*\
  !*** ./node_modules/@logue/reverb/bin/reverb.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*! @logue/reverb v0.2.1 | Logue | license: MIT | build: 2019-12-26T15:48:03.337Z */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
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

/***/ "./src/meta.js":
/*!*********************!*\
  !*** ./src/meta.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// This file is auto-generated by the build system.
var Meta = {
  version: '0.2.1',
  date: '2019-12-26T15:48:03.337Z'
};
/* harmony default export */ __webpack_exports__["default"] = (Meta);

/***/ }),

/***/ "./src/reverb.js":
/*!***********************!*\
  !*** ./src/reverb.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Reverb; });
/* harmony import */ var _meta__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./meta */ "./src/meta.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


/**
 * JS reverb effect class
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 * @see       {@link https://github.com/logue/Reverb.js}
 *            {@link https://github.com/web-audio-components/simple-reverb}
 */

var Reverb =
/*#__PURE__*/
function () {
  /**
   * constructor
   * @param {AudioContext} ctx
   * @param {{
   *   decay: (number|undefined),
   *   delay: (number|undefined),
   *   filterFreq: (number|undefined),
   *   filterQ: (number|undefined),
   *   filterType: (string|undefined),
   *   mix: (number|undefined),
   *   reverse: (boolean|undefined),
   *   time: (number|undefined)
   * }} options
   */
  function Reverb(ctx) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Reverb);

    /** @type {number} バージョン */
    this.version = _meta__WEBPACK_IMPORTED_MODULE_0__["default"].version;
    /** @type {Date} ビルド日時 */

    this.build = _meta__WEBPACK_IMPORTED_MODULE_0__["default"].date;
    /** @type {AudioContext} */

    this.ctx = ctx;
    /** @type {GainNode} ウェットレベル */

    this.wetGainNode = this.ctx.createGain();
    /** @type {GainNode} ドライレベル */

    this.dryGainNode = this.ctx.createGain();
    /** @type {BiquadFilterNode} インパルス応答用フィルタ */

    this.filterNode = this.ctx.createBiquadFilter();
    /** @type {ConvolverNode} 畳み込みノード */

    this.convolverNode = this.ctx.createConvolver();
    /** @type {GainNode} 出力ノード */

    this.outputNode = this.ctx.createGain(); // デフォルト値

    /** @type {number} ディケイ */

    this._decay = options.decay | 0 || 5;
    /** @type {number} ディレイ */

    this._delay = options.delay | 0 || 0;
    /** @type {boolean} レスポンス応答を反転 */

    this._reverse = options.reverse || false;
    /** @type {number} レスポンス応答の時間（秒） */

    this._time = options.time | 0 || 3;
    /** @type {BiquadFilterNode|null} フィルタの種類 */

    this._filterType = options.filterType || 'lowpass';
    /** @type {number} フィルタ周波数(Hz) */

    this._freq = options.filterFreq | 0 || 2200;
    /** @type {number} フィルタ品質 */

    this._q = options.filterQ | 0 || 1;
    /** @type {number} ドライ／ウェット比 */

    this._mix = options.mix || 0.5; // 値をセット

    this.time(this._time);
    this.delay(this._delay);
    this.decay(this._decay);
    this.reverse(this._reverse); // エフェクタに反映

    this.filterType(this._filterType);
    this.filterFreq(this._freq);
    this.filterQ(this._q);
    this.mix(this._mix);
    /** @type {bool} 接続済みフラグ */

    this.isConnected = false;
    this.buildImpulse();
  }
  /**
   * connect
   * @param {GainNode} sourceNode
   * @return {GainNode}
   */


  _createClass(Reverb, [{
    key: "connect",
    value: function connect(sourceNode) {
      this.isConnected = true; // 畳み込みノードをウェットレベルに接続

      this.convolverNode.connect(this.filterNode); // フィルタノードをウェットレベルに接続

      this.filterNode.connect(this.wetGainNode); // 入力ノードを畳み込みノードに接続

      sourceNode.connect(this.convolverNode); // ドライレベルを出力ノードに接続

      sourceNode.connect(this.dryGainNode).connect(this.outputNode); // ウェットレベルを出力ノードに接続

      sourceNode.connect(this.wetGainNode).connect(this.outputNode);
      return this.outputNode;
    }
    /**
     * disconnect
     * @param {GainNode} sourceNode
     * @return {GainNode}
     */

  }, {
    key: "disconnect",
    value: function disconnect(sourceNode) {
      // 初期状態で接続されていない可能性があるためエラーを消す
      try {
        // 畳み込みノードをウェットレベルから切断
        this.convolverNode.disconnect(this.filterNode); // フィルタノードをウェットレベルから切断

        this.filterNode.disconnect(this.wetGainNode); // 入力ノードを畳み込みノードから切断

        sourceNode.disconnect(this.convolverNode); // ドライレベルを出力ノードから切断

        sourceNode.disconnect(this.dryGainNode).disconnect(this.outputNode); // ウェットレベルを出力ノードから切断

        sourceNode.disconnect(this.wetGainNode).disconnect(this.outputNode);
      } catch (e) {}

      this.isConnected = false;
      return sourceNode;
    }
    /**
     * Mixing Dry and Wet Level.
     * @param {number} mix
     */

  }, {
    key: "mix",
    value: function mix(_mix) {
      if (!this.inRange(_mix, 0, 1)) {
        console.warn('Dry/Wet level must be between 0 to 1.');
        return;
      }

      this._mix = _mix;
      this.dryGainNode.gain.value = 1 - this._mix;
      this.wetGainNode.gain.value = this._mix;
      console.info("Set dry/wet level to ".concat(_mix * 100, "%"));
    }
    /**
     * Set Impulse Response time length (second)
     * @param {number} value
     */

  }, {
    key: "time",
    value: function time(value) {
      if (!this.inRange(value, 1, 50)) {
        console.warn('Time length of inpulse response must be less than 50sec.');
        return;
      }

      this._time = value;
      this.buildImpulse();
      console.info("Set inpulse response time length to ".concat(value, "sec."));
    }
    /**
     * Impulse response decay rate.
     * @param {number} value
     */

  }, {
    key: "decay",
    value: function decay(value) {
      if (!this.inRange(value, 0, 100)) {
        console.warn('Inpulse Response decay level must be less than 100.');
        return;
      }

      this._decay = value;
      this.buildImpulse();
      console.info("Set inpulse response decay level to ".concat(value, "."));
    }
    /**
     * Impulse response delay time. (NOT deley effect)
     * @param {number} value
     */

  }, {
    key: "delay",
    value: function delay(value) {
      if (!this.inRange(value, 0, 100)) {
        console.warn('Inpulse Response delay time must be less than 100.');
        return;
      }

      this._delay = value;
      this.buildImpulse();
      console.info("Set inpulse response delay time to ".concat(value, "sec."));
    }
    /**
     * Reverse the impulse response.
     * @param {boolean} reverse
     */

  }, {
    key: "reverse",
    value: function reverse(_reverse) {
      this._reverse = _reverse;
      this.buildImpulse();
      console.info("Inpulse response is ".concat(_reverse ? '' : 'not ', "reversed."));
    }
    /**
     * Filter type.
     * @param {BiquadFilterNode|null} type
     */

  }, {
    key: "filterType",
    value: function filterType(type) {
      this.filterNode.type = this._filterType = type;
      console.info("Set filter type to ".concat(type));
    }
    /**
     * Filter frequency.
     * @param {number} freq
     */

  }, {
    key: "filterFreq",
    value: function filterFreq(freq) {
      if (!this.inRange(freq, 20, 5000)) {
        console.warn('Filter frequrncy must be between 20 and 5000.');
        return;
      }

      this._freq = freq;
      this.filterNode.frequency.value = this._freq;
      console.info("Set filter frequency to ".concat(freq, "Hz."));
    }
    /**
     * Filter quality.
     * @param {number} q
     */

  }, {
    key: "filterQ",
    value: function filterQ(q) {
      if (!this.inRange(q, 0, 10)) {
        console.warn('Filter quality value must be between 0 and 1.');
        return;
      }

      this._q = q;
      this.filterNode.Q.value = this._q;
      console.info("Set filter quality to ".concat(q, "."));
    }
    /**
     * return true if in range, otherwise false
     * @private
     * @param {number} x Target value
     * @param {number} min Minimum value
     * @param {number} max Maximum value
     * @return {bool}
     */

  }, {
    key: "inRange",
    value: function inRange(x, min, max) {
      return (x - min) * (x - max) <= 0;
    }
    /**
     * Utility function for building an impulse response
     * from the module parameters.
     * @private
     */

  }, {
    key: "buildImpulse",
    value: function buildImpulse() {
      // インパルス応答生成ロジック

      /** @type {number} サンプリングレート */
      var rate = this.ctx.sampleRate;
      /** @type {number} インパルス応答の演奏時間 */

      var length = Math.max(rate * this._time, 1);
      /** @type {number} インパルス応答が始まるまでの遅延時間 */

      var delayDuration = rate * this._delay;
      /** @type {AudioBuffer} インパルス応答バッファ（今の所ステレオのみ） */

      var impulse = this.ctx.createBuffer(2, length, rate);
      /** @type {Array<number>|ArrayBufferView} 左チャンネル */

      var impulseL = new Float32Array(length);
      /** @type {Array<number>|ArrayBufferView} 右チャンネル*/

      var impulseR = new Float32Array(length);

      for (var i = 0; i < length; i++) {
        /** @type {number} */
        var n = 0;

        if (i < delayDuration) {
          // Delay Effect
          impulseL[i] = 0;
          impulseR[i] = 0;
          n = this._reverse ? length - (i - delayDuration) : i - delayDuration;
        } else {
          n = this._reverse ? length - i : i;
        }
        /** @type {number} 平方根を利用した減衰曲線 */


        var pow = Math.pow(1 - n / length, this._decay);
        impulseL[i] = this.getNoise(pow);
        impulseR[i] = this.getNoise(pow);
      } // インパルス応答のバッファに生成したWaveTableを代入


      impulse.getChannelData(0).set(impulseL);
      impulse.getChannelData(1).set(impulseR);
      this.convolverNode.buffer = impulse;
    }
    /**
     * Generate white noise
     * @param {number} rate Attenuation rate
     * @return {number}
     * @private
     */

  }, {
    key: "getNoise",
    value: function getNoise(rate) {
      // TODO: 他のカラードノイズを指定できるように
      return (Math.random() * 2 - 1) * rate;
    }
  }]);

  return Reverb;
}();


;

/***/ })

/******/ });
});
//# sourceMappingURL=reverb.js.map

/***/ }),

/***/ "./src/meta.js":
/*!*********************!*\
  !*** ./src/meta.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// This file is auto-generated by the build system.
const Meta = {
  version: '0.3.4',
  date: '2019-12-26T16:24:37.934Z'
};
/* harmony default export */ __webpack_exports__["default"] = (Meta);

/***/ }),

/***/ "./src/riff.js":
/*!*********************!*\
  !*** ./src/riff.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Riff; });
/**
 * Riff Parser class
 * @private
 */
class Riff {
  /**
   * @param {ByteArray} input input buffer.
   * @param {Object=} optParams option parameters.
   */
  constructor(input, optParams = {}) {
    /** @type {ByteArray} */
    this.input = input;
    /** @type {number} */

    this.ip = optParams.index || 0;
    /** @type {number} */

    this.length = optParams.length || input.length - this.ip;
    /** @type {Array.<RiffChunk>} */

    this.chunkList;
    /** @type {number} */

    this.offset = this.ip;
    /** @type {boolean} */

    this.padding = optParams.padding !== void 0 ? optParams.padding : true;
    /** @type {boolean} */

    this.bigEndian = optParams.bigEndian !== void 0 ? optParams.bigEndian : false;
  }
  /**
   */


  parse() {
    /** @type {number} */
    const length = this.length + this.offset;
    this.chunkList = [];

    while (this.ip < length) {
      this.parseChunk();
    }
  }
  /**
   */


  parseChunk() {
    /** @type {ByteArray} */
    const input = this.input;
    /** @type {number} */

    let ip = this.ip;
    /** @type {number} */

    let size;
    this.chunkList.push(new RiffChunk(String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]), size = this.bigEndian ? (input[ip++] << 24 | input[ip++] << 16 | input[ip++] << 8 | input[ip++]) >>> 0 : (input[ip++] | input[ip++] << 8 | input[ip++] << 16 | input[ip++] << 24) >>> 0, ip));
    ip += size; // padding

    if (this.padding && (ip - this.offset & 1) === 1) {
      ip++;
    }

    this.ip = ip;
  }
  /**
   * @param {number} index chunk index.
   * @return {?RiffChunk}
   */


  getChunk(index) {
    /** @type {RiffChunk} */
    const chunk = this.chunkList[index];

    if (chunk === void 0) {
      return null;
    }

    return chunk;
  }
  /**
   * @return {number}
   */


  getNumberOfChunks() {
    return this.chunkList.length;
  }

}
/**
 * Riff Chunk Structure
 * @interface
 */

class RiffChunk {
  /**
   * @param {string} type
   * @param {number} size
   * @param {number} offset
   */
  constructor(type, size, offset) {
    /** @type {string} */
    this.type = type;
    /** @type {number} */

    this.size = size;
    /** @type {number} */

    this.offset = offset;
  }

}

/***/ }),

/***/ "./src/sf2.js":
/*!********************!*\
  !*** ./src/sf2.js ***!
  \********************/
/*! exports provided: Parser, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Parser", function() { return Parser; });
/* harmony import */ var _riff_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./riff.js */ "./src/riff.js");

/**
 * SoundFont Parser Class
 */

class Parser {
  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  constructor(input, optParams = {}) {
    /** @type {ByteArray} */
    this.input = input;
    /** @type {(Object|undefined)} */

    this.parserOption = optParams.parserOption || {};
    /** @type {(Number|undefined)} */

    this.sampleRate = optParams.sampleRate || 22050; // よくわからんが、OSで指定されているサンプルレートを入れないと音が切れ切れになる。

    /** @type {Array.<Object>} */

    this.presetHeader;
    /** @type {Array.<Object>} */

    this.presetZone;
    /** @type {Array.<Object>} */

    this.presetZoneModulator;
    /** @type {Array.<Object>} */

    this.presetZoneGenerator;
    /** @type {Array.<Object>} */

    this.instrument;
    /** @type {Array.<Object>} */

    this.instrumentZone;
    /** @type {Array.<Object>} */

    this.instrumentZoneModulator;
    /** @type {Array.<Object>} */

    this.instrumentZoneGenerator;
    /** @type {Array.<Object>} */

    this.sampleHeader;
    /**
     * @type {Array.<string>}
     * @const
     */

    this.GeneratorEnumeratorTable = ['startAddrsOffset', 'endAddrsOffset', 'startloopAddrsOffset', 'endloopAddrsOffset', 'startAddrsCoarseOffset', 'modLfoToPitch', 'vibLfoToPitch', 'modEnvToPitch', 'initialFilterFc', 'initialFilterQ', 'modLfoToFilterFc', 'modEnvToFilterFc', 'endAddrsCoarseOffset', 'modLfoToVolume',, // 14
    'chorusEffectsSend', 'reverbEffectsSend', 'pan',,,, // 18,19,20
    'delayModLFO', 'freqModLFO', 'delayVibLFO', 'freqVibLFO', 'delayModEnv', 'attackModEnv', 'holdModEnv', 'decayModEnv', 'sustainModEnv', 'releaseModEnv', 'keynumToModEnvHold', 'keynumToModEnvDecay', 'delayVolEnv', 'attackVolEnv', 'holdVolEnv', 'decayVolEnv', 'sustainVolEnv', 'releaseVolEnv', 'keynumToVolEnvHold', 'keynumToVolEnvDecay', 'instrument',, // 42
    'keyRange', 'velRange', 'startloopAddrsCoarseOffset', 'keynum', 'velocity', 'initialAttenuation',, // 49
    'endloopAddrsCoarseOffset', 'coarseTune', 'fineTune', 'sampleID', 'sampleModes',, // 55
    'scaleTuning', 'exclusiveClass', 'overridingRootKey', // 59
    'endOper'];
  }
  /** @export */


  parse() {
    /** @type {Riff} */
    const parser = new _riff_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.input, this.parserOption); // parse RIFF chunk

    parser.parse();

    if (parser.chunkList.length !== 1) {
      throw new Error('wrong chunk length');
    }
    /** @type {?RiffChunk} */


    const chunk = parser.getChunk(0);

    if (chunk === null) {
      throw new Error('chunk not found');
    }

    this.parseRiffChunk(chunk); // console.log(this.sampleHeader);

    this.input = null;
  }
  /**
   * @param {RiffChunk} chunk
   */


  parseRiffChunk(chunk) {
    /** @type {ByteArray} */
    const data = this.input;
    /** @type {number} */

    let ip = chunk.offset; // check parse target

    if (chunk.type !== 'RIFF') {
      throw new Error('invalid chunk type:' + chunk.type);
    } // check signature

    /** @type {string} */


    const signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);

    if (signature !== 'sfbk') {
      throw new Error('invalid signature:' + signature);
    } // read structure

    /** @type {Riff} */


    const parser = new _riff_js__WEBPACK_IMPORTED_MODULE_0__["default"](data, {
      'index': ip,
      'length': chunk.size - 4
    });
    parser.parse();

    if (parser.getNumberOfChunks() !== 3) {
      throw new Error('invalid sfbk structure');
    } // INFO-list


    this.parseInfoList(
    /** @type {!RiffChunk} */
    parser.getChunk(0)); // sdta-list

    this.parseSdtaList(
    /** @type {!RiffChunk} */
    parser.getChunk(1)); // pdta-list

    this.parsePdtaList(
    /** @type {!RiffChunk} */
    parser.getChunk(2));
  }

  /**
   * @param {RiffChunk} chunk
   */
  parseInfoList(chunk) {
    /** @type {ByteArray} */
    const data = this.input;
    /** @type {number} */

    let ip = chunk.offset; // check parse target

    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type);
    } // check signature

    /** @type {string} */


    const signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);

    if (signature !== 'INFO') {
      throw new Error('invalid signature:' + signature);
    } // read structure

    /** @type {Riff} */


    const parser = new _riff_js__WEBPACK_IMPORTED_MODULE_0__["default"](data, {
      'index': ip,
      'length': chunk.size - 4
    });
    parser.parse();
  }

  /**
   * @param {RiffChunk} chunk
   */
  parseSdtaList(chunk) {
    /** @type {ByteArray} */
    const data = this.input;
    /** @type {number} */

    let ip = chunk.offset; // check parse target

    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type);
    } // check signature

    /** @type {string} */


    const signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);

    if (signature !== 'sdta') {
      throw new Error('invalid signature:' + signature);
    } // read structure

    /** @type {Riff} */


    const parser = new _riff_js__WEBPACK_IMPORTED_MODULE_0__["default"](data, {
      'index': ip,
      'length': chunk.size - 4
    });
    parser.parse();

    if (parser.chunkList.length !== 1) {
      throw new Error('TODO');
    }

    this.samplingData =
    /** @type {{type: string, size: number, offset: number}} */
    parser.getChunk(0);
  }

  /**
   * @param {RiffChunk} chunk
   */
  parsePdtaList(chunk) {
    /** @type {ByteArray} */
    const data = this.input;
    /** @type {number} */

    let ip = chunk.offset; // check parse target

    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type);
    } // check signature

    /** @type {string} */


    const signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);

    if (signature !== 'pdta') {
      throw new Error('invalid signature:' + signature);
    } // read structure

    /** @type {Riff} */


    const parser = new _riff_js__WEBPACK_IMPORTED_MODULE_0__["default"](data, {
      'index': ip,
      'length': chunk.size - 4
    });
    parser.parse(); // check number of chunks

    if (parser.getNumberOfChunks() !== 9) {
      throw new Error('invalid pdta chunk');
    }

    this.parsePhdr(
    /** @type {RiffChunk} */
    parser.getChunk(0));
    this.parsePbag(
    /** @type {RiffChunk} */
    parser.getChunk(1));
    this.parsePmod(
    /** @type {RiffChunk} */
    parser.getChunk(2));
    this.parsePgen(
    /** @type {RiffChunk} */
    parser.getChunk(3));
    this.parseInst(
    /** @type {RiffChunk} */
    parser.getChunk(4));
    this.parseIbag(
    /** @type {RiffChunk} */
    parser.getChunk(5));
    this.parseImod(
    /** @type {RiffChunk} */
    parser.getChunk(6));
    this.parseIgen(
    /** @type {RiffChunk} */
    parser.getChunk(7));
    this.parseShdr(
    /** @type {RiffChunk} */
    parser.getChunk(8));
  }

  /**
   * @param {RiffChunk} chunk
   */
  parsePhdr(chunk) {
    /** @type {ByteArray} */
    const data = this.input;
    /** @type {number} */

    let ip = chunk.offset;
    /** @type {Array.<Object>} */

    const presetHeader = this.presetHeader = [];
    /** @type {number} */

    const size = chunk.offset + chunk.size; // check parse target

    if (chunk.type !== 'phdr') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      presetHeader.push({
        presetName: String.fromCharCode.apply(null, data.subarray(ip, ip += 20)),
        preset: data[ip++] | data[ip++] << 8,
        bank: data[ip++] | data[ip++] << 8,
        presetBagIndex: data[ip++] | data[ip++] << 8,
        library: (data[ip++] | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0,
        genre: (data[ip++] | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0,
        morphology: (data[ip++] | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0
      });
    }
  }

  /**
   * @param {RiffChunk} chunk
   */
  parsePbag(chunk) {
    /** @type {ByteArray} */
    const data = this.input;
    /** @type {number} */

    let ip = chunk.offset;
    /** @type {Array.<Object>} */

    const presetZone = this.presetZone = [];
    /** @type {number} */

    const size = chunk.offset + chunk.size; // check parse target

    if (chunk.type !== 'pbag') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      presetZone.push({
        presetGeneratorIndex: data[ip++] | data[ip++] << 8,
        presetModulatorIndex: data[ip++] | data[ip++] << 8
      });
    }
  }

  /**
   * @param {RiffChunk} chunk
   */
  parsePmod(chunk) {
    // check parse target
    if (chunk.type !== 'pmod') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    this.presetZoneModulator = this.parseModulator(chunk);
  }

  /**
   * @param {RiffChunk} chunk
   */
  parsePgen(chunk) {
    // check parse target
    if (chunk.type !== 'pgen') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    this.presetZoneGenerator = this.parseGenerator(chunk);
  }

  /**
   * @param {RiffChunk} chunk
   */
  parseInst(chunk) {
    /** @type {ByteArray} */
    const data = this.input;
    /** @type {number} */

    let ip = chunk.offset;
    /** @type {Array.<Object>} */

    const instrument = this.instrument = [];
    /** @type {number} */

    const size = chunk.offset + chunk.size; // check parse target

    if (chunk.type !== 'inst') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      instrument.push({
        instrumentName: String.fromCharCode.apply(null, data.subarray(ip, ip += 20)),
        instrumentBagIndex: data[ip++] | data[ip++] << 8
      });
    }
  }

  /**
   * @param {RiffChunk} chunk
   */
  parseIbag(chunk) {
    /** @type {ByteArray} */
    const data = this.input;
    /** @type {number} */

    let ip = chunk.offset;
    /** @type {Array.<Object>} */

    const instrumentZone = this.instrumentZone = [];
    /** @type {number} */

    const size = chunk.offset + chunk.size; // check parse target

    if (chunk.type !== 'ibag') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      instrumentZone.push({
        instrumentGeneratorIndex: data[ip++] | data[ip++] << 8,
        instrumentModulatorIndex: data[ip++] | data[ip++] << 8
      });
    }
  }

  /**
   * @param {RiffChunk} chunk
   */
  parseImod(chunk) {
    // check parse target
    if (chunk.type !== 'imod') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    this.instrumentZoneModulator = this.parseModulator(chunk);
  }

  /**
   * @param {RiffChunk} chunk
   */
  parseIgen(chunk) {
    // check parse target
    if (chunk.type !== 'igen') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    this.instrumentZoneGenerator = this.parseGenerator(chunk);
  }

  /**
   * @param {RiffChunk} chunk
   */
  parseShdr(chunk) {
    /** @type {ByteArray} */
    const data = this.input;
    /** @type {number} */

    let ip = chunk.offset;
    /** @type {Array.<Object>} */

    const samples = this.sample = [];
    /** @type {Array.<Object>} */

    const sampleHeader = this.sampleHeader = [];
    /** @type {number} */

    const size = chunk.offset + chunk.size;
    /** @type {string} */

    let sampleName;
    /** @type {number} */

    let start;
    /** @type {number} */

    let end;
    /** @type {number} */

    let startLoop;
    /** @type {number} */

    let endLoop;
    /** @type {number} */

    let sampleRate;
    /** @type {number} */

    let originalPitch;
    /** @type {number} */

    let pitchCorrection;
    /** @type {number} */

    let sampleLink;
    /** @type {number} */

    let sampleType; // check parse target

    if (chunk.type !== 'shdr') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      sampleName = String.fromCharCode.apply(null, data.subarray(ip, ip += 20));
      start = (data[ip++] << 0 | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0;
      end = (data[ip++] << 0 | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0;
      startLoop = (data[ip++] << 0 | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0;
      endLoop = (data[ip++] << 0 | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0;
      sampleRate = (data[ip++] << 0 | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0;
      originalPitch = data[ip++];
      pitchCorrection = data[ip++] << 24 >> 24;
      sampleLink = data[ip++] | data[ip++] << 8;
      sampleType = data[ip++] | data[ip++] << 8;
      let sample = new Int16Array(new Uint8Array(data.subarray(this.samplingData.offset + start * 2, this.samplingData.offset + end * 2)).buffer);
      startLoop -= start;
      endLoop -= start;

      if (sampleRate > 0) {
        const adjust = this.adjustSampleData(sample, sampleRate);
        sample = adjust.sample;
        sampleRate *= adjust.multiply;
        startLoop *= adjust.multiply;
        endLoop *= adjust.multiply;
      }

      samples.push(sample);
      sampleHeader.push({
        sampleName: sampleName,
        start: start,
        end: end,
        startLoop: startLoop,
        endLoop: endLoop,
        sampleRate: sampleRate,
        originalPitch: originalPitch,
        pitchCorrection: pitchCorrection,
        sampleLink: sampleLink,
        sampleType: sampleType
      });
    }
  }

  /**
   * @param {Array} sample
   * @param {number} sampleRate
   * @return {object}
   */
  adjustSampleData(sample, sampleRate) {
    /** @type {Int16Array} */
    let newSample;
    /** @type {number} */

    let i;
    /** @type {number} */

    let il;
    /** @type {number} */

    let j;
    /** @type {number} */

    let multiply = 1; // buffer

    while (sampleRate < this.sampleRate) {
      // AudioContextのサンプルレートに変更
      newSample = new Int16Array(sample.length * 2);

      for (i = j = 0, il = sample.length; i < il; ++i) {
        newSample[j++] = sample[i];
        newSample[j++] = sample[i];
      }

      sample = newSample;
      multiply *= 2;
      sampleRate *= 2;
    }

    return {
      sample: sample,
      multiply: multiply
    };
  }

  /**
   * @param {RiffChunk} chunk
   * @return {Array.<Object>}
   */
  parseModulator(chunk) {
    /** @type {ByteArray} */
    const data = this.input;
    /** @type {number} */

    let ip = chunk.offset;
    /** @type {number} */

    const size = chunk.offset + chunk.size;
    /** @type {number} */

    let code;
    /** @type {string} */

    let key;
    /** @type {Array.<Object>} */

    const output = [];

    while (ip < size) {
      // Src  Oper
      // TODO
      ip += 2; // Dest Oper

      code = data[ip++] | data[ip++] << 8;
      key = this.GeneratorEnumeratorTable[code];

      if (key === void 0) {
        // Amount
        output.push({
          type: key,
          value: {
            code: code,
            amount: data[ip] | data[ip + 1] << 8 << 16 >> 16,
            lo: data[ip++],
            hi: data[ip++]
          }
        });
      } else {
        // Amount
        switch (key) {
          case 'keyRange':
          /* FALLTHROUGH */

          case 'velRange':
          /* FALLTHROUGH */

          case 'keynum':
          /* FALLTHROUGH */

          case 'velocity':
            output.push({
              type: key,
              value: {
                lo: data[ip++],
                hi: data[ip++]
              }
            });
            break;

          default:
            output.push({
              type: key,
              value: {
                amount: data[ip++] | data[ip++] << 8 << 16 >> 16
              }
            });
            break;
        }
      } // AmtSrcOper
      // TODO


      ip += 2; // Trans Oper
      // TODO

      ip += 2;
    }

    return output;
  }

  /**
   * @param {RiffChunk} chunk
   * @return {Array.<Object>}
   */
  parseGenerator(chunk) {
    /** @type {ByteArray} */
    const data = this.input;
    /** @type {number} */

    let ip = chunk.offset;
    /** @type {number} */

    const size = chunk.offset + chunk.size;
    /** @type {number} */

    let code;
    /** @type {string} */

    let key;
    /** @type {Array.<Object>} */

    const output = [];

    while (ip < size) {
      code = data[ip++] | data[ip++] << 8;
      key = this.GeneratorEnumeratorTable[code];

      if (key === void 0) {
        output.push({
          type: key,
          value: {
            code: code,
            amount: data[ip] | data[ip + 1] << 8 << 16 >> 16,
            lo: data[ip++],
            hi: data[ip++]
          }
        });
        continue;
      }

      switch (key) {
        case 'keynum':
        /* FALLTHROUGH */

        case 'keyRange':
        /* FALLTHROUGH */

        case 'velRange':
        /* FALLTHROUGH */

        case 'velocity':
          output.push({
            type: key,
            value: {
              lo: data[ip++],
              hi: data[ip++]
            }
          });
          break;

        default:
          output.push({
            type: key,
            value: {
              amount: data[ip++] | data[ip++] << 8 << 16 >> 16
            }
          });
          break;
      }
    }

    return output;
  }

  /**
   * @return {Array.<object>}
   */
  createInstrument() {
    /** @type {Array.<Object>} */
    const instrument = this.instrument;
    /** @type {Array.<Object>} */

    const zone = this.instrumentZone;
    /** @type {Array.<Object>} */

    const output = [];
    /** @type {number} */

    let bagIndex;
    /** @type {number} */

    let bagIndexEnd;
    /** @type {Array.<Object>} */

    let zoneInfo;
    /** @type {{generator: Object, generatorInfo: Array.<Object>}} */

    let instrumentGenerator;
    /** @type {{modulator: Object, modulatorInfo: Array.<Object>}} */

    let instrumentModulator;
    /** @type {number} */

    let i;
    /** @type {number} */

    let il;
    /** @type {number} */

    let j;
    /** @type {number} */

    let jl; // instrument -> instrument bag -> generator / modulator

    for (i = 0, il = instrument.length; i < il; ++i) {
      bagIndex = instrument[i].instrumentBagIndex;
      bagIndexEnd = instrument[i + 1] ? instrument[i + 1].instrumentBagIndex : zone.length;
      zoneInfo = []; // instrument bag

      for (j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
        instrumentGenerator = this.createInstrumentGenerator_(zone, j);
        instrumentModulator = this.createInstrumentModulator_(zone, j);
        zoneInfo.push({
          generator: instrumentGenerator.generator,
          generatorSequence: instrumentGenerator.generatorInfo,
          modulator: instrumentModulator.modulator,
          modulatorSequence: instrumentModulator.modulatorInfo
        });
      }

      output.push({
        name: instrument[i].instrumentName,
        info: zoneInfo
      });
    }

    return output;
  }

  /**
   * @return {Array.<object>}
   */
  createPreset() {
    /** @type {Array.<Object>} */
    const preset = this.presetHeader;
    /** @type {Array.<Object>} */

    const zone = this.presetZone;
    /** @type {Array.<Object>} */

    const output = [];
    /** @type {number} */

    let bagIndex;
    /** @type {number} */

    let bagIndexEnd;
    /** @type {Array.<Object>} */

    let zoneInfo;
    /** @type {number} */

    let instrument;
    /** @type {{generator: Object, generatorInfo: Array.<Object>}} */

    let presetGenerator;
    /** @type {{modulator: Object, modulatorInfo: Array.<Object>}} */

    let presetModulator;
    /** @type {number} */

    let i;
    /** @type {number} */

    let il;
    /** @type {number} */

    let j;
    /** @type {number} */

    let jl; // preset -> preset bag -> generator / modulator

    for (i = 0, il = preset.length; i < il; ++i) {
      bagIndex = preset[i].presetBagIndex;
      bagIndexEnd = preset[i + 1] ? preset[i + 1].presetBagIndex : zone.length;
      zoneInfo = []; // preset bag

      for (j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
        presetGenerator = this.createPresetGenerator_(zone, j);
        presetModulator = this.createPresetModulator_(zone, j);
        zoneInfo.push({
          generator: presetGenerator.generator,
          generatorSequence: presetGenerator.generatorInfo,
          modulator: presetModulator.modulator,
          modulatorSequence: presetModulator.modulatorInfo
        });
        instrument = presetGenerator.generator['instrument'] !== void 0 ? presetGenerator.generator['instrument'].amount : presetModulator.modulator['instrument'] !== void 0 ? presetModulator.modulator['instrument'].amount : null;
      }

      output.push({
        name: preset[i].presetName,
        info: zoneInfo,
        header: preset[i],
        instrument: instrument
      });
    }

    return output;
  }

  /**
   * @param {Array.<Object>} zone
   * @param {number} index
   * @return {{generator: Object, generatorInfo: Array.<Object>}}
   * @private
   */
  createInstrumentGenerator_(zone, index) {
    const modgen = this.createBagModGen_(zone, zone[index].instrumentGeneratorIndex, zone[index + 1] ? zone[index + 1].instrumentGeneratorIndex : this.instrumentZoneGenerator.length, this.instrumentZoneGenerator);
    return {
      generator: modgen.modgen,
      generatorInfo: modgen.modgenInfo
    };
  }

  /**
   * @param {Array.<Object>} zone
   * @param {number} index
   * @return {{modulator: Object, modulatorInfo: Array.<Object>}}
   * @private
   */
  createInstrumentModulator_(zone, index) {
    const modgen = this.createBagModGen_(zone, zone[index].presetModulatorIndex, zone[index + 1] ? zone[index + 1].instrumentModulatorIndex : this.instrumentZoneModulator.length, this.instrumentZoneModulator);
    return {
      modulator: modgen.modgen,
      modulatorInfo: modgen.modgenInfo
    };
  }

  /**
   * @param {Array.<Object>} zone
   * @param {number} index
   * @return {{generator: Object, generatorInfo: Array.<Object>}}
   * @private
   */
  createPresetGenerator_(zone, index) {
    const modgen = this.createBagModGen_(zone, zone[index].presetGeneratorIndex, zone[index + 1] ? zone[index + 1].presetGeneratorIndex : this.presetZoneGenerator.length, this.presetZoneGenerator);
    return {
      generator: modgen.modgen,
      generatorInfo: modgen.modgenInfo
    };
  }

  /**
   * @param {Array.<Object>} zone
   * @param {number} index
   * @return {{modulator: Object, modulatorInfo: Array.<Object>}}
   * @private
   */
  createPresetModulator_(zone, index) {
    /** @type {{modgen: Object, modgenInfo: Array.<Object>}} */
    const modgen = this.createBagModGen_(zone, zone[index].presetModulatorIndex, zone[index + 1] ? zone[index + 1].presetModulatorIndex : this.presetZoneModulator.length, this.presetZoneModulator);
    return {
      modulator: modgen.modgen,
      modulatorInfo: modgen.modgenInfo
    };
  }

  /**
   * @param {Array.<Object>} zone
   * @param {number} indexStart
   * @param {number} indexEnd
   * @param {Array} zoneModGen
   * @return {{modgen: Object, modgenInfo: Array.<Object>}}
   * @private
   */
  createBagModGen_(zone, indexStart, indexEnd, zoneModGen) {
    /** @type {Array.<Object>} */
    const modgenInfo = [];
    /** @type {Object} */

    const modgen = {
      'unknown': [],
      'keyRange': {
        hi: 127,
        lo: 0
      }
    }; // TODO

    /** @type {Object} */

    let info;
    /** @type {number} */

    let i;
    /** @type {number} */

    let il;

    for (i = indexStart, il = indexEnd; i < il; ++i) {
      info = zoneModGen[i];
      modgenInfo.push(info);

      if (info.type === 'unknown') {
        modgen.unknown.push(info.value);
      } else {
        modgen[info.type] = info.value;
      }
    }

    return {
      modgen: modgen,
      modgenInfo: modgenInfo
    };
  }

}
/* harmony default export */ __webpack_exports__["default"] = (Parser);

/***/ }),

/***/ "./src/sound_font_synth.js":
/*!*********************************!*\
  !*** ./src/sound_font_synth.js ***!
  \*********************************/
/*! exports provided: Synthesizer, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Synthesizer", function() { return Synthesizer; });
/* harmony import */ var _sound_font_synth_note__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sound_font_synth_note */ "./src/sound_font_synth_note.js");
/* harmony import */ var _sf2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sf2 */ "./src/sf2.js");
/* harmony import */ var _logue_reverb_bin_reverb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @logue/reverb/bin/reverb */ "./node_modules/@logue/reverb/bin/reverb.js");
/* harmony import */ var _logue_reverb_bin_reverb__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_logue_reverb_bin_reverb__WEBPACK_IMPORTED_MODULE_2__);



/**
 * Synthesizer Class
 * @private
 */

class Synthesizer {
  /**
   * @param {Uint8Array} input
   */
  constructor(input) {
    /** @type {number} */
    let i;
    /** @type {number} */

    let il;
    /** @type {Uint8Array} */

    this.input = input;
    /** @type {SoundFont.Parser} */

    this.parser = {};
    /** @type {number} */

    this.bank = 0;
    /** @type {Array.<Array.<Object>>} */

    this.bankSet = {};
    /** @type {number} */

    this.bufferSize = 2048;
    /** @type {AudioContext} */

    this.ctx = this.getAudioContext();
    /** @type {GainNode} */

    this.gainMaster = this.ctx.createGain();
    /** @type {AudioBufferSourceNode} */

    this.bufSrc = this.ctx.createBufferSource();
    /** @type {Array.<number>} */

    this.channelInstrument = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {Array.<number>} */

    this.channelBank = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0];
    /** @type {Array.<number>} */

    this.channelVolume = [127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127];
    /** @type {Array.<number>} */

    this.channelPanpot = [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64];
    /** @type {Array.<number>} */

    this.channelPitchBend = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {Array.<number>} */

    this.channelPitchBendSensitivity = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    /** @type {Array.<number>} */

    this.channelExpression = [127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127];
    /** @type {Array.<number>} */

    this.channelAttack = [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64];
    /** @type {Array.<number>} */

    this.channelDecay = [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64];
    /** @type {Array.<number>} */

    this.channelSustin = [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64];
    /** @type {Array.<number>} */

    this.channelRelease = [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64];
    /** @type {Array.<boolean>} */

    this.channelHold = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    /** @type {Array.<number>} */

    this.channelHarmonicContent = [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64];
    /** @type {Array.<number>} */

    this.channelCutOffFrequency = [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64];
    /** @type {boolean} */

    this.isGS = false;
    /** @type {boolean} */

    this.isXG = false;
    /** @type {Array.<Array.<string>>} */

    this.programSet = [];
    /** @type {Array.<boolean>} */

    this.channelMute = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    /** @type {Array.<Array.<SoundFont.SynthesizerNote>>} */

    this.currentNoteOn = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
    /** @type {number} @const */

    this.baseVolume = 1 / 0xffff;
    /** @type {number} */

    this.masterVolume = 16384;
    /** @type {Array.<boolean>} */

    this.percussionPart = [false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false];
    /** @type {Array.<number>} */

    this.percussionVolume = new Array(128);

    for (i = 0, il = this.percussionVolume.length; i < il; ++i) {
      this.percussionVolume[i] = 127;
    }

    this.programSet = {};
    /** @type {Array.<Reverb>}リバーブエフェクト（チャンネル毎に用意する） */

    this.reverb = [];

    for (i = 0; i < 16; ++i) {
      this.reverb[i] = new _logue_reverb_bin_reverb__WEBPACK_IMPORTED_MODULE_2___default.a(this.ctx, {
        mix: 0.315
      }); // リバーブエフェクトのデフォルト値は40なので40/127の値がドライ／ウェット値となる
    }

    this.observer = new IntersectionObserver((entries, object) => {
      entries.forEach((entry, i) => {
        // 交差していない
        entry.target.dataset.isIntersecting = entry.isIntersecting;
      });
    }, {});
  }
  /**
   * @return {AudioContext}
   */


  getAudioContext() {
    /** @type {AudioContext} */
    const ctx = new (window.AudioContext || window.webkitAudioContext)(); // for legacy browsers

    ctx.createGain = ctx.createGain || ctx.createGainNode; // Defreeze AudioContext for iOS.

    const initAudioContext = () => {
      document.removeEventListener('touchstart', initAudioContext); // wake up AudioContext

      const emptySource = ctx.createBufferSource();
      emptySource.start();
      emptySource.stop();
    };

    document.addEventListener('touchstart', initAudioContext);
    return ctx;
  }
  /**
   * System Reset
   * @param {string} mode
   */


  init(mode = 'GM') {
    this.gainMaster.disconnect();
    /** @type {number} */

    let i;
    this.parser = new _sf2__WEBPACK_IMPORTED_MODULE_1__["default"](this.input, {
      sampleRate: this.ctx.sampleRate
    });
    this.bankSet = this.createAllInstruments();
    this.isXG = false;
    this.isGS = false;

    if (mode == 'XG') {
      this.isXG = true;
    } else if (mode == 'GS') {
      this.isGS = true;
    }

    for (i = 0; i < 16; ++i) {
      this.programChange(i, 0x00);
      this.volumeChange(i, 0x64);
      this.panpotChange(i, 0x40);
      this.pitchBend(i, 0x00, 0x40); // 8192

      this.pitchBendSensitivity(i, 2);
      this.channelHold[i] = false;
      this.channelExpression[i] = 127;
      this.channelBank[i] = i === 9 ? 127 : 0;
      this.attackTime(i, 64);
      this.decayTime(i, 64);
      this.sustinTime(i, 64);
      this.releaseTime(i, 64);
      this.harmonicContent(i, 64);
      this.cutOffFrequency(i, 64);
      this.reverbDepth(i, 40);
      this.updateBankSelect(i);
      this.updateProgramSelect(i);
    }

    this.setPercussionPart(9, true);

    for (i = 0; i < 128; ++i) {
      this.percussionVolume[i] = 127;
    }

    this.gainMaster.connect(this.ctx.destination);
    /*
    if (this.element) {
      this.element.querySelector('.header div:before').innerText = mode + ' Mode';
    }
    */

    this.element.dataset.mode = mode;
  }
  /**
   */


  close() {
    this.ctx.close();
  }
  /**
   * @param {Uint8Array} input
   */


  refreshInstruments(input) {
    this.input = input;
    this.parser = new _sf2__WEBPACK_IMPORTED_MODULE_1__["default"](input);
    this.bankSet = this.createAllInstruments();
  }
  /** @return {Array.<Array.<Object>>} */


  createAllInstruments() {
    /** @type {SoundFont.Parser} */
    const parser = this.parser;
    parser.parse();
    /** @type {Array} TODO */

    const presets = parser.createPreset();
    /** @type {Array} TODO */

    const instruments = parser.createInstrument();
    /** @type {Array} */

    const banks = [];
    /** @type {Array.<Array.<Object>>} */

    let bank;
    /** @type {number} */

    let bankNumber;
    /** @type {Object} TODO */

    let preset;
    /** @type {Object} */

    let instrument;
    /** @type {number} */

    let presetNumber;
    /** @type {number} */

    let i;
    /** @type {number} */

    let il;
    /** @type {number} */

    let j;
    /** @type {number} */

    let jl;
    /** @type {string} */

    let presetName;
    const programSet = [];

    for (i = 0, il = presets.length; i < il; ++i) {
      preset = presets[i];
      presetNumber = preset.header.preset;
      bankNumber = preset.header.bank;
      presetName = preset.name.replace(/\0*$/, '');

      if (typeof preset.instrument !== 'number') {
        continue;
      }

      instrument = instruments[preset.instrument];

      if (instrument.name.replace(/\0*$/, '') === 'EOI') {
        continue;
      } // select bank


      if (banks[bankNumber] === void 0) {
        banks[bankNumber] = [];
      }

      bank = banks[bankNumber];
      bank[presetNumber] = {};
      bank[presetNumber].name = presetName;

      for (j = 0, jl = instrument.info.length; j < jl; ++j) {
        this.createNoteInfo(parser, instrument.info[j], bank[presetNumber]);
      }

      if (!programSet[bankNumber]) {
        programSet[bankNumber] = {};
      }

      programSet[bankNumber][presetNumber] = presetName;
    }

    this.programSet = programSet;
    return banks;
  }
  /**
   * @param {Parser} parser
   * @param {*} info
   * @param {*} preset
   */


  createNoteInfo(parser, info, preset) {
    /** @type {Generator} */
    const generator = info.generator;

    if (generator['keyRange'] === void 0 || generator['sampleID'] === void 0) {
      return;
    }
    /** @type {number} */


    const volDelay = this.getModGenAmount(generator, 'delayVolEnv', -12000);
    /** @type {number} */

    const volAttack = this.getModGenAmount(generator, 'attackVolEnv', -12000);
    /** @type {number} */

    const volHold = this.getModGenAmount(generator, 'holdVolEnv', -12000);
    /** @type {number} */

    const volDecay = this.getModGenAmount(generator, 'decayVolEnv', -12000);
    /** @type {number} */

    const volSustain = this.getModGenAmount(generator, 'sustainVolEnv');
    /** @type {number} */

    const volRelease = this.getModGenAmount(generator, 'releaseVolEnv', -12000);
    /** @type {number} */

    const modDelay = this.getModGenAmount(generator, 'delayModEnv', -12000);
    /** @type {number} */

    const modAttack = this.getModGenAmount(generator, 'attackModEnv', -12000);
    /** @type {number} */

    const modHold = this.getModGenAmount(generator, 'holdModEnv', -12000);
    /** @type {number} */

    const modDecay = this.getModGenAmount(generator, 'decayModEnv', -12000);
    /** @type {number} */

    const modSustain = this.getModGenAmount(generator, 'sustainModEnv');
    /** @type {number} */

    const modRelease = this.getModGenAmount(generator, 'releaseModEnv', -12000);
    /** @type {number} */

    const scale = this.getModGenAmount(generator, 'scaleTuning', 100) / 100;
    /** @type {number} */

    const freqVibLFO = this.getModGenAmount(generator, 'freqVibLFO');
    /** @type {number} */

    const pan = this.getModGenAmount(generator, 'pan');
    /** @type {number} */

    const tune = this.getModGenAmount(generator, 'coarseTune') + this.getModGenAmount(generator, 'fineTune') / 100;

    for (let i = generator['keyRange'].lo, il = generator['keyRange'].hi; i <= il; ++i) {
      if (preset[i]) {
        continue;
      }
      /** @type {number} */


      const sampleId = this.getModGenAmount(generator, 'sampleID');
      /** @type {object} */

      const sampleHeader = parser.sampleHeader[sampleId];
      preset[i] = {
        'sample': parser.sample[sampleId],
        'sampleRate': sampleHeader.sampleRate,
        'sampleModes': this.getModGenAmount(generator, 'sampleModes'),
        'basePlaybackRate': 1.0594630943592953 // Math.pow(2, 1 / 12)
        ** ((i - this.getModGenAmount(generator, 'overridingRootKey', sampleHeader.originalPitch) + tune + sampleHeader.pitchCorrection / 100) * scale),
        'modEnvToPitch': this.getModGenAmount(generator, 'modEnvToPitch') / 100,
        'scaleTuning': scale,
        'start': this.getModGenAmount(generator, 'startAddrsCoarseOffset') * 32768 + this.getModGenAmount(generator, 'startAddrsOffset'),
        'end': this.getModGenAmount(generator, 'endAddrsCoarseOffset') * 32768 + this.getModGenAmount(generator, 'endAddrsOffset'),
        'loopStart': // (sampleHeader.startLoop - sampleHeader.start) +
        sampleHeader.startLoop + this.getModGenAmount(generator, 'startloopAddrsCoarseOffset') * 32768 + this.getModGenAmount(generator, 'startloopAddrsOffset'),
        'loopEnd': // (sampleHeader.endLoop - sampleHeader.start) +
        sampleHeader.endLoop + this.getModGenAmount(generator, 'endloopAddrsCoarseOffset') * 32768 + this.getModGenAmount(generator, 'endloopAddrsOffset'),
        'volDelay': 2 ** (volDelay / 1200),
        'volAttack': 2 ** (volAttack / 1200),
        'volHold': 2 ** (volHold / 1200) * 2 ** ((60 - i) * this.getModGenAmount(generator, 'keynumToVolEnvHold') / 1200),
        'volDecay': 2 ** (volDecay / 1200) * 2 ** ((60 - i) * this.getModGenAmount(generator, 'keynumToVolEnvDecay') / 1200),
        'volSustain': volSustain / 1000,
        'volRelease': 2 ** (volRelease / 1200),
        'modDelay': 2 ** (modDelay / 1200),
        'modAttack': 2 ** (modAttack / 1200),
        'modHold': 2 ** (modHold / 1200) * 2 ** ((60 - i) * this.getModGenAmount(generator, 'keynumToModEnvHold') / 1200),
        'modDecay': 2 ** (modDecay / 1200) * 2 ** ((60 - i) * this.getModGenAmount(generator, 'keynumToModEnvDecay') / 1200),
        'modSustain': modSustain / 1000,
        'modRelease': 2 ** (modRelease / 1200),
        'initialFilterFc': this.getModGenAmount(generator, 'initialFilterFc', 13500),
        'modEnvToFilterFc': this.getModGenAmount(generator, 'modEnvToFilterFc'),
        'initialFilterQ': this.getModGenAmount(generator, 'initialFilterQ'),
        'reverbEffectSend': this.getModGenAmount(generator, 'reverbEffectSend'),
        'initialAttenuation': this.getModGenAmount(generator, 'initialAttenuation'),
        'freqVibLFO': freqVibLFO ? 2 ** (freqVibLFO / 1200) * 8.176 : void 0,
        'pan': pan ? pan / 1200 : void 0
      };
    }
  }

  /**
   * @param {Object} generator
   * @param {string} enumeratorType
   * @param {number=} optDefault
   * @return {number}
   */
  getModGenAmount(generator, enumeratorType, optDefault = 0) {
    return generator[enumeratorType] ? generator[enumeratorType].amount : optDefault;
  }
  /**
   */


  start() {
    this.connect();
    this.bufSrc.start(0);
    this.setMasterVolume(16383);
  }
  /**
   * @param {number} volume
   */


  setMasterVolume(volume) {
    this.masterVolume = volume;
    this.gainMaster.gain.value = this.baseVolume * (volume / 16384);
  }
  /**
   */


  connect() {
    this.bufSrc.connect(this.gainMaster);
  }
  /**
   */


  disconnect() {
    this.bufSrc.disconnect(this.gainMaster);
    this.bufSrc.buffer = null;
  }
  /**
   * @return {HTMLDivElement}
   */


  drawSynth() {
    /** @type {Document} */
    const doc = window.document;
    /** @type {HTMLDivElement} */

    const wrapper = this.element = doc.createElement('div');
    /** @type {HTMLDivElement} */

    const instElem = doc.createElement('div');
    instElem.className = 'instrument';
    /** @type {Array} */

    const items = ['mute', 'bank', 'program', 'volume', 'panpot', 'pitchBend', 'pitchBendSensitivity', 'keys'];
    /** @type {string} */

    const eventStart = 'ontouchstart' in window ? 'touchstart' : 'mousedown';
    /** @type {string} */

    const eventEnd = 'ontouchend' in window ? 'touchend' : 'mouseup';

    for (let channel = 0; channel < 16; channel++) {
      /** @type {HTMLDivElement} */
      const channelElem = doc.createElement('div');
      channelElem.className = 'channel';

      for (const item in items) {
        if ({}.hasOwnProperty.call(items, item)) {
          /** @type {HTMLDivElement} */
          const itemElem = doc.createElement('div');
          itemElem.className = items[item];

          switch (items[item]) {
            case 'mute':
              /** @type {HTMLDivElement|null} */
              const checkboxElement = doc.createElement('div');
              checkboxElement.className = 'custom-control custom-checkbox custom-control-inline';
              /** @type {HTMLInputElement|null} */

              const checkbox = doc.createElement('input');
              checkbox.setAttribute('type', 'checkbox');
              checkbox.className = 'custom-control-input';
              checkbox.id = 'mute' + channel + 'ch';
              checkbox.addEventListener('change', ((synth, channelElem) => {
                return () => {
                  synth.mute(channelElem, this.checked);
                };
              })(this, channel), false);
              checkboxElement.appendChild(checkbox);
              /** @type {HTMLLabelElement} */

              const labelElem = doc.createElement('label');
              labelElem.className = 'custom-control-label';
              labelElem.textContent = channel + 1;
              labelElem.setAttribute('for', 'mute' + channel + 'ch');
              checkboxElement.appendChild(labelElem);
              itemElem.appendChild(checkboxElement);
              break;

            case 'bank':
              // Bank select

              /** @type {HTMLSelectElement} */
              const bankSelect = doc.createElement('select');
              bankSelect.className = 'form-control form-control-sm';
              itemElem.appendChild(bankSelect);
              /** @type {HTMLOptionElement} */

              const option = doc.createElement('option');
              bankSelect.appendChild(option);
              bankSelect.addEventListener('change', ((synth, channelElem) => {
                return event => {
                  synth.bankChange(channelElem, event.target.value);
                  synth.programChange(channelElem, synth.channelElemInstrument[channelElem]);
                };
              })(this, channel), false);
              bankSelect.selectedIndex = this.channelBank[item];
              break;

            case 'program':
              // Program change

              /** @type {HTMLSelectElement|null} */
              const select = doc.createElement('select');
              select.className = 'form-control form-control-sm';
              itemElem.appendChild(select);
              select.addEventListener('change', ((synth, channelElem) => {
                return event => {
                  synth.programChange(channelElem, event.target.value);
                };
              })(this, channel), false);
              select.selectedIndex = this.channelInstrument[item];
              break;

            case 'volume':
              itemElem.innerText = 100;

            case 'pitchBendSensitivity':
              itemElem.innerText = 2;
              break;

            case 'panpot':
              /** @type {HTMLMeterElement|null} */
              const panpot = doc.createElement('meter');
              panpot.min = 0;
              panpot.max = 127;
              panpot.value = 64;
              itemElem.appendChild(panpot);
              break;

            case 'pitchBend':
              /** @type {HTMLMeterElement|null} */
              const pitch = doc.createElement('meter');
              pitch.min = -8192;
              pitch.max = 8192;
              pitch.value = 0;
              itemElem.appendChild(pitch);
              break;

            case 'keys':
              for (let key = 0; key < 127; key++) {
                /** @type {HTMLDivElement|null} */
                const keyElem = doc.createElement('div');
                /** @type {number} */

                const n = key % 12; // 白鍵と黒鍵の色分け

                keyElem.className = 'key ' + ([1, 3, 6, 8, 10].includes(n) ? 'semitone' : 'tone');
                itemElem.appendChild(keyElem); // イベント割当

                keyElem.addEventListener(eventStart, ((synth, channelElem, k) => {
                  return event => {
                    event.preventDefault();
                    synth.drag = true;
                    synth.noteOn(channelElem, k, 127);
                  };
                })(this, channel, key));
                keyElem.addEventListener('mouseover', ((synth, channelElem, k) => {
                  return event => {
                    event.preventDefault();

                    if (synth.drag) {
                      synth.noteOn(channelElem, k, 127);
                    }
                  };
                })(this, channel, key));
                keyElem.addEventListener('mouseout', ((synth, channelElem, k) => {
                  return event => {
                    event.preventDefault();
                    synth.noteOff(channelElem, k, 0);
                  };
                })(this, channel, key));
                keyElem.addEventListener(eventEnd, ((synth, channelElem, k) => {
                  return event => {
                    event.preventDefault();
                    synth.drag = false;
                    synth.noteOff(channelElem, k, 0);
                  };
                })(this, channel, key));
              }

              break;
          }

          channelElem.appendChild(itemElem);
        }
      }

      instElem.appendChild(channelElem);
      this.observer.observe(channelElem);
    }

    wrapper.appendChild(instElem);
    return wrapper;
  }
  /**
   * @param {number} channel
   * @param {number} key
   * @param {number} velocity
   */


  updateSynthElement(channel, key, velocity) {
    if (!this.element) {
      return;
    }
    /** @type {HTMLDivElement} */


    const channelElem = this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ')');

    if (channelElem.dataset.isIntersecting) {
      /** @type {HTMLDivElement} */
      const keyElem = channelElem.querySelector('.key:nth-child(' + (key + 1) + ')');

      if (velocity === 0) {
        if (keyElem.classList.contains('note-on')) {
          keyElem.classList.remove('note-on');
        }

        keyElem.style.opacity = 1;
      } else {
        keyElem.classList.add('note-on');
        keyElem.style.opacity = (velocity / 127).toFixed(2);
      }
    }
  }
  /**
   * バンクセレクタの選択ボックスの処理
   * @param {number} channel
   */


  updateBankSelect(channel) {
    if (!this.element) {
      return;
    }
    /** @type {HTMLElement} */


    const bankElement = this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') .bank > select');

    while (bankElement.firstChild) bankElement.removeChild(bankElement.firstChild);

    for (const bankNo in this.programSet) {
      if ({}.hasOwnProperty.call(this.programSet, bankNo)) {
        const option = document.createElement('option');
        option.value = bankNo;
        option.textContent = ('000' + parseInt(bankNo)).slice(-3);
        bankElement.appendChild(option);
      }
    }
  }
  /**
   * プログラムチェンジの選択ボックスの処理
   * @param {number} channel
   */


  updateProgramSelect(channel) {
    if (!this.element) {
      return;
    }
    /** @type {number} */


    const bankIndex = this.channelBank[channel];
    /** @type {HTMLElement} */

    const bankElement = this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') .bank > select');
    /** @type {HTMLElement} */

    const programElement = this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') .program > select');
    bankElement.value = this.channelBank[channel];

    while (programElement.firstChild) programElement.removeChild(programElement.firstChild);

    for (const programNo in this.programSet[bankIndex]) {
      if ({}.hasOwnProperty.call(this.programSet[bankIndex], programNo)) {
        // TODO: 存在しないプログラムの場合、現状では空白になってしまう
        const option = document.createElement('option');
        option.value = programNo;
        option.textContent = ('000' + (parseInt(programNo) + 1)).slice(-3) + ':' + this.programSet[bankIndex][programNo];

        if (programNo === this.channelInstrument[channel]) {
          option.selected = 'selected';
        }

        programElement.appendChild(option);
      }
    }
  }
  /**
   * @param {number} channel NoteOn するチャンネル.
   * @param {number} key NoteOn するキー.
   * @param {number} velocity 強さ.
   */


  noteOn(channel, key, velocity) {
    /** @type {number} */
    const bankIndex = this.channelBank[channel];
    /** @type {Object} */

    const bank = typeof this.bankSet[bankIndex] === 'object' ? this.bankSet[bankIndex] : this.bankSet[0];
    /** @type {Object} */

    let instrument;

    if (typeof bank[this.channelInstrument[channel]] === 'object') {
      // 音色が存在する場合
      instrument = bank[this.channelInstrument[channel]];
    } else if (this.percussionPart[channel] == true) {
      // パーカッションバンクが選択されている場合で音色が存在しない場合Standard Kitを選択
      instrument = this.bankSet[this.isXG ? 127 : 128][0];
    } else {
      // 通常バンクが選択されている状態で音色が存在しない場合バンク0を選択
      instrument = this.bankSet[0][this.channelInstrument[channel]];
    }

    if (instrument[key] === void 0) {
      // TODO
      console.warn('instrument not found: bank=%s instrument=%s channel=%s key=%s', bankIndex, this.channelInstrument[channel], channel, key);
      return;
    }
    /** @type {Object} */


    const instrumentKey = instrument[key];
    /** @type {number} */

    let panpot = this.channelPanpot[channel] - 64;
    panpot /= panpot < 0 ? 64 : 63; // create note information

    instrumentKey['channel'] = channel;
    instrumentKey['key'] = key;
    instrumentKey['velocity'] = velocity;
    instrumentKey['panpot'] = panpot;
    instrumentKey['volume'] = this.channelVolume[channel] / 127;
    instrumentKey['pitchBend'] = this.channelPitchBend[channel] - 8192;
    instrumentKey['expression'] = this.channelExpression[channel];
    instrumentKey['pitchBendSensitivity'] = Math.round(this.channelPitchBendSensitivity[channel]);
    instrumentKey['mute'] = this.channelMute[channel];
    instrumentKey['releaseTime'] = this.channelRelease[channel];
    instrumentKey['cutOffFrequency'] = this.cutOffFrequency[channel];
    instrumentKey['harmonicContent'] = this.harmonicContent[channel];
    instrumentKey['reverb'] = this.reverb[channel]; // percussion

    if (bankIndex > 125) {
      if (key === 42 || key === 44) {
        // 42: Closed Hi-Hat
        // 44: Pedal Hi-Hat
        // 46: Open Hi-Hat
        this.noteOff(channel, 46, 0);
      }

      if (key === 80) {
        // 80: Mute Triangle
        // 81: Open Triangle
        this.noteOff(channel, 81, 0);
      }

      instrument['volume'] *= this.percussionVolume[key] / 127;
    } // note on

    /** @type {SynthesizerNote} */


    const note = new _sound_font_synth_note__WEBPACK_IMPORTED_MODULE_0__["default"](this.ctx, this.gainMaster, instrumentKey);
    note.noteOn();
    this.currentNoteOn[channel].push(note);
    this.updateSynthElement(channel, key, velocity);
  }
  /**
   * @param {number} channel NoteOff するチャンネル.
   * @param {number} key NoteOff するキー.
   * @param {number} velocity 強さ.
   */


  noteOff(channel, key, velocity) {
    /** @type {number} */
    let i;
    /** @type {number} */

    let il;
    /** @type {Array.<SynthesizerNote>} */

    const currentNoteOn = this.currentNoteOn[channel];
    /** @type {SynthesizerNote} */

    let note;
    /** @type {boolean} */

    const hold = this.channelHold[channel];

    for (i = 0, il = currentNoteOn.length; i < il; ++i) {
      note = currentNoteOn[i];

      if (note.key === key) {
        note.noteOff(); // hold している時は NoteOff にはするがリリースはしない

        if (!hold) {
          note.release();
          currentNoteOn.splice(i, 1);
          --i;
          --il;
        }
      }
    }

    this.updateSynthElement(channel, key, 0);
  }
  /**
   * @param {number} channel ホールドするチャンネル
   * @param {number} value 値
   */


  hold(channel, value) {
    /** @type {Array.<SynthesizerNote>} */
    const currentNoteOn = this.currentNoteOn[channel];
    /** @type {boolean} */

    const hold = this.channelHold[channel] = !(value < 64);
    /** @type {SynthesizerNote} */

    let note;
    /** @type {number} */

    let i;
    /** @type {number} */

    let il;

    if (!hold) {
      for (i = 0, il = currentNoteOn.length; i < il; ++i) {
        note = currentNoteOn[i];

        if (note.isNoteOff()) {
          note.release();
          currentNoteOn.splice(i, 1);
          --i;
          --il;
        }
      }
    }

    if (this.element) {
      /** @type {HTMLDivElement} */
      const channelElement = this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ')');

      if (this.channelHold[channel]) {
        channelElement.classList.add('hold');
      } else {
        channelElement.classList.remove('hold');
      }
    }
  }
  /**
   * @param {number} channel チャンネルのバンクセレクトMSB
   * @param {number} value 値
   */


  bankSelectMsb(channel, value) {
    if (this.isXG) {
      // 念の為バンクを0にリセット
      this.channelBank[channel] = 0; // XG音源は、MSB→LSBの優先順でバンクセレクトをする。

      if (value === 64) {
        // Bank Select MSB #64 (Voice Type: SFX)
        this.channelBank[channel] = 125;
        this.percussionPart[channel] = true;
      } else if (value === 126 || value === 127) {
        // Bank Select MSB #126 (Voice Type: Drum)
        // Bank Select MSB #127 (Voice Type: Drum)
        this.channelBank[channel] = value;
        this.percussionPart[channel] = true;
      }
    } else if (this.isGS) {
      // GS音源
      // ※チャンネル10のバンク・セレクト命令は無視する。
      this.channelBank[channel] = channel === 9 ? 128 : value;
      this.percussionPart[channel] = value === 128;
    } else {
      // GM音源モードのときはバンク・セレクトを無視
      return;
    }

    this.updateBankSelect(channel);
  }
  /**
   * @param {number} channel チャンネルのバンクセレクトLSB
   * @param {number} value 値
   */


  bankSelectLsb(channel, value) {
    // XG音源以外は処理しない
    if (!this.isXG || this.percussionPart[channel] === true) {
      return;
    } // 125より値が大きい場合、パーカッションとして処理


    this.percussionPart[channel] = value >= 125;
    this.channelBank[channel] = value;
    this.updateBankSelect(channel);
  }
  /**
   * @param {number} channel 音色を変更するチャンネル.
   * @param {number} instrument 音色番号.
   */


  programChange(channel, instrument) {
    this.channelInstrument[channel] = instrument;
    this.bankChange(channel, this.channelBank[channel]);

    if (this.element) {
      this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') .program > select').value = instrument;
    }
  }
  /**
   * @param {number} channel 音色を変更するチャンネル.
   * @param {number} bank バンク・セレクト.
   */


  bankChange(channel, bank) {
    if (typeof this.bankSet[bank] === 'object') {
      // バンクが存在するとき
      this.channelBank[channel] = bank;
    } else {
      // バンクが存在しないとき
      if (this.percussionPart[channel]) {
        // パーカッション
        this.channelBank[channel] = !this.isXG ? 128 : 127;
      } else {
        // 存在しない場合0を選択
        this.channelBank[channel] = 0;
      }
    } // TODO: 厳密にはMIDI音源はプログラムチェンジがあったときにバンク・セレクトが反映される。


    this.updateProgramSelect(channel);

    if (this.element) {
      this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') > .bank > select').value = bank;
    }
  }
  /**
   * @param {number} channel 音量を変更するチャンネル.
   * @param {number} volume 音量(0-127).
   */


  volumeChange(channel, volume) {
    if (this.element) {
      this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') > .volume').innerText = volume;
    }

    this.channelVolume[channel] = volume;
  }
  /**
   * @param {number} channel 音量を変更するチャンネル.
   * @param {number} expression 音量(0-127).
   */


  expression(channel, expression) {
    /** @type {number} */
    let i;
    /** @type {number} */

    let il;
    /** @type {Array.<SynthesizerNote>} */

    const currentNoteOn = this.currentNoteOn[channel];

    for (i = 0, il = currentNoteOn.length; i < il; ++i) {
      currentNoteOn[i].updateExpression(expression);
    }

    this.channelExpression[channel] = expression;
  }
  /**
   * @param {number} channel panpot を変更するチャンネル.
   * @param {number} panpot panpot(0-127).
   */


  panpotChange(channel, panpot) {
    if (this.element) {
      this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') > .panpot > meter').value = panpot;
    }

    this.channelPanpot[channel] = panpot;
  }
  /**
   * @param {number} channel panpot を変更するチャンネル.
   * @param {number} lowerByte
   * @param {number} higherByte
   */


  pitchBend(channel, lowerByte, higherByte) {
    /** @type {number} */
    const bend = lowerByte & 0x7f | (higherByte & 0x7f) << 7;
    /** @type {number} */

    let i;
    /** @type {number} */

    let il;
    /** @type {Array.<SoundFont.SynthesizerNote>} */

    const currentNoteOn = this.currentNoteOn[channel];
    /** @type {number} */

    const calculated = bend - 8192;

    if (this.element) {
      this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') > .pitchBend > meter').value = calculated;
    }

    for (i = 0, il = currentNoteOn.length; i < il; ++i) {
      currentNoteOn[i].updatePitchBend(calculated);
    }

    this.channelPitchBend[channel] = bend;
  }
  /**
   * @param {number} channel pitch bend sensitivity を変更するチャンネル.
   * @param {number} sensitivity
   */


  pitchBendSensitivity(channel, sensitivity) {
    if (this.element) {
      document.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') > .pitchBendSensitivity').innerText = sensitivity;
    }

    this.channelPitchBendSensitivity[channel] = sensitivity;
  }
  /**
   * @param {number} channel
   * @param {number} attackTime
   */


  attackTime(channel, attackTime) {
    this.channelAttack[channel] = attackTime;
  }
  /**
   * @param {number} channel
   * @param {number} decayTime
   */


  decayTime(channel, decayTime) {
    this.channelDecay[channel] = decayTime;
  }
  /**
   * @param {number} channel
   * @param {number} sustinTime
   */


  sustinTime(channel, sustinTime) {
    this.channelSustin[channel] = sustinTime;
  }
  /**
   * @param {number} channel
   * @param {number} releaseTime
   */


  releaseTime(channel, releaseTime) {
    this.channelRelease[channel] = releaseTime;
  }
  /**
   * @param {number} channel
   * @param {number} value
   */


  harmonicContent(channel, value) {
    this.channelHarmonicContent[channel] = value;
  }
  /**
   * @param {number} channel
   * @param {number} value
   */


  cutOffFrequency(channel, value) {
    this.channelCutOffFrequency[channel] = value;
  }
  /**
   * @param {number} channel
   * @param {number} depth
   */


  reverbDepth(channel, depth) {
    // リバーブ深度は、ドライ／ウェット比とする。
    this.reverb[channel].mix(depth / 127);
  }
  /**
   * @param {number} channel pitch bend sensitivity を取得するチャンネル.
   * @return {number}
   */


  getPitchBendSensitivity(channel) {
    return this.channelPitchBendSensitivity[channel];
  }
  /**
   * @param {number} key
   * @param {number} volume
   */


  drumInstrumentLevel(key, volume) {
    this.percussionVolume[key] = volume;
  }
  /**
   * @param {number} channel NoteOff するチャンネル.
   */


  allNoteOff(channel) {
    /** @type {Array.<SynthesizerNote>} */
    const currentNoteOn = this.currentNoteOn[channel]; // ホールドを解除

    this.hold(channel, 0); // 再生中の音をすべて止める

    while (currentNoteOn.length > 0) {
      this.noteOff(channel, currentNoteOn[0].key, 0);
    }
  }
  /**
   * @param {number} channel 音を消すチャンネル.
   */


  allSoundOff(channel) {
    /** @type {Array.<SynthesizerNote>} */
    const currentNoteOn = this.currentNoteOn[channel];
    /** @type {SynthesizerNote} */

    let note;

    while (currentNoteOn.length > 0) {
      note = currentNoteOn.shift();
      this.noteOff(channel, note.key, 0);
      note.release();
      note.disconnect();
    } // ホールドを解除


    this.hold(channel, 0);
  }
  /**
   * @param {number} channel リセットするチャンネル
   */


  resetAllControl(channel) {
    this.allNoteOff(channel);
    this.expression(channel, 127);
    this.pitchBend(channel, 0x00, 0x40);
  }
  /**
   * @param {number} channel ミュートの設定を変更するチャンネル.
   * @param {boolean} mute ミュートにするなら true.
   */


  mute(channel, mute) {
    /** @type {Array.<SynthesizerNote>} */
    const currentNoteOn = this.currentNoteOn[channel];
    /** @type {number} */

    let i;
    /** @type {number} */

    let il;
    this.channelMute[channel] = mute;

    if (mute) {
      for (i = 0, il = currentNoteOn.length; i < il; ++i) {
        currentNoteOn[i].disconnect();
      }
    } else {
      for (i = 0, il = currentNoteOn.length; i < il; ++i) {
        currentNoteOn[i].connect();
      }
    }
  }
  /**
   * @param {number} channel TODO:ドラムパートとしてセットするチャンネル
   * @param {boolean} sw ドラムか通常かのスイッチ
   */


  setPercussionPart(channel, sw) {
    if (!this.isXG) {
      this.channelBank[channel] = 128;
    } else {
      this.channelBank[channel] = 127;
    }

    this.percussionPart[channel] = sw;
  }

}
/* harmony default export */ __webpack_exports__["default"] = (Synthesizer);

/***/ }),

/***/ "./src/sound_font_synth_note.js":
/*!**************************************!*\
  !*** ./src/sound_font_synth_note.js ***!
  \**************************************/
/*! exports provided: SynthesizerNote, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SynthesizerNote", function() { return SynthesizerNote; });
/**
 * SynthesizerNote Class
 * @private
 */
class SynthesizerNote {
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

    this.reverb = instrument['reverb']; // state

    /** @type {number} */

    this.startTime = ctx.currentTime;
    /** @type {number} */

    this.computedPlaybackRate = this.playbackRate | 0;
    /** @type {boolean} */

    this.noteOffState = false; // ---------------------------------------------------------------------------
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

    const startTime = instrument['start'] / this.sampleRate; // TODO: ドラムパートのPanが変化した場合、その計算をしなければならない
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
    channelData.set(sample); // buffer source

    /** @type {AudioBufferSourceNode} */

    const bufferSource = this.bufferSource;
    bufferSource.buffer = buffer;
    bufferSource.loop = instrument['sampleModes'] | 0 || 0;
    bufferSource.loopStart = loopStart;
    bufferSource.loopEnd = loopEnd;
    this.updatePitchBend(this.pitchBend); // Output

    /** @type {GainNode} */

    const output = this.outputGainNode; // expression

    this.expressionGainNode.gain.value = this.expression / 127; // panpot

    /** @type {StereoPannerNode} */

    const panner = this.panner;
    panner.panningModel = 'equalpower'; // panner.distanceModel = 'inverse';

    panner.setPosition(Math.sin(pan * Math.PI / 2), 0, Math.cos(pan * Math.PI / 2)); // ---------------------------------------------------------------------------
    // Delay, Attack, Hold, Decay, Sustain
    // ---------------------------------------------------------------------------

    /** @type {number} */

    let volume = this.volume * (this.velocity / 127) * (1 - instrument['initialAttenuation'] / 1000);

    if (volume < 0) {
      volume = 0;
    } // volume envelope

    /** @type {AudioNode} */


    const outputGain = output.gain;
    outputGain.setValueAtTime(0, now);
    outputGain.setValueAtTime(0, volDelay);
    outputGain.setTargetAtTime(volume, volDelay, instrument['volAttack']);
    outputGain.setValueAtTime(volume, volHold);
    outputGain.linearRampToValueAtTime(volume * (1 - instrument['volSustain']), volDecay); // modulation envelope

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
    modulator.frequency.linearRampToValueAtTime(sustainFreq, modDecay); // filter

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
    panner.connect(this.expressionGainNode);
    /*
    this.expressionGainNode.connect(filter);
    filter.connect(output);
    */

    this.expressionGainNode.connect(output);

    if (!instrument['mute']) {
      this.connect();
    } // fire


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
    const release = instrument['releaseTime'] - 64; // ---------------------------------------------------------------------------
    // volume release time
    // ---------------------------------------------------------------------------

    /** @type {number} */

    const volEndTimeTmp = instrument['volRelease'] * output.gain.value;
    /** @type {number} */

    const volEndTime = now + volEndTimeTmp * (1 + release / (release < 0 ? 64 : 63)); // var volEndTime = now + instrument['volRelease'] * (1 - instrument['volSustain']);
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

    const modEndTime = now + instrument['modRelease'] * (baseFreq === peekFreq ? 1 : (modulator.frequency.value - baseFreq) / (peekFreq - baseFreq)); // var modEndTime = now + instrument['modRelease'] * (1 - instrument['modSustain']);

    if (!this.audioBuffer) {
      return;
    } // ---------------------------------------------------------------------------
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

    const peekPitch = computed * 1.0594630943592953 // Math.pow(2, 1 / 12)
    ** (this.modEnvToPitch * this.instrument['scaleTuning']);
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
    this.computedPlaybackRate = this.playbackRate * 1.0594630943592953 // Math.pow(2, 1 / 12)
    ** (pitchBend / (pitchBend < 0 ? 8192 : 8191) * this.pitchBendSensitivity * this.instrument['scaleTuning']);
    this.schedulePlaybackRate();
  }

}
/* harmony default export */ __webpack_exports__["default"] = (SynthesizerNote);

/***/ }),

/***/ "./src/wml.js":
/*!********************!*\
  !*** ./src/wml.js ***!
  \********************/
/*! exports provided: WebMidiLink, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebMidiLink", function() { return WebMidiLink; });
/* harmony import */ var _meta_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./meta.js */ "./src/meta.js");
/* harmony import */ var _sound_font_synth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sound_font_synth */ "./src/sound_font_synth.js");


/**
 * WebMidiLink Class
 */

class WebMidiLink {
  /**
   * @param {object} option
   */
  constructor(option = {}) {
    /** @type {Array.<number>} */
    this.NrpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {Array.<number>} */

    this.NrpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {Array.<number>} */

    this.RpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {Array.<number>} */

    this.RpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {boolean} */

    this.ready = false;
    /** @type {Synthesizer} */

    this.synth;
    /** @type {function(ArrayBuffer)} */

    this.loadCallback = () => {};
    /** @type {Function} */


    this.messageHandler = this.onmessage.bind(this);
    /** @type {XMLHttpRequest} */

    this.xhr;
    /** @type {boolean} */

    this.rpnMode = true;
    /** @type {object} */

    this.option = option;
    /** @type {boolean} */

    this.option.drawSynth = option.drawSynth !== void 0 ? option.drawSynth : true;
    /** @type {boolean} */

    this.option.cache = option.cache !== void 0 ? option.cache : true;
    /** @type {HTMLElement} */

    this.placeholder = option.placeholder !== void 0 ? document.getElementById(option.placeholder) : window.document.body;
    /** @type {Window} */

    this.opener;
    /** @type {number} */

    this.version = _meta_js__WEBPACK_IMPORTED_MODULE_0__["default"].version;
    /** @type {string} */

    this.build = _meta_js__WEBPACK_IMPORTED_MODULE_0__["default"].date; // eslint-disable-next-line space-before-function-paren

    window.addEventListener('DOMContentLoaded', function () {
      this.ready = true;
    }.bind(this), false);
  }

  /**
   * @param {string} url
   * @export
   */
  setup(url) {
    /** @type {Window} */
    const w = window;

    if (!this.ready) {
      w.addEventListener('DOMContentLoaded', function onload() {
        w.removeEventListener('DOMContentLoaded', onload, false);
        this.load(url);
      }.bind(this), false);
    } else {
      this.load(url);
    }

    if (w.opener) {
      this.opener = w.opener;
    } else if (w.parent !== w) {
      this.opener = w.parent;
    }
  }
  /**
   * @param {string} url
   * @export
   */


  load(url) {
    /** @type {Window} */
    const opener = window.opener ? window.opener : window.parent;
    /** @type {HtmlDIVElement} */

    const loading = this.placeholder.appendChild(document.createElement('div'));
    /** @type {HTMLStrongElement} */

    const loadingText = loading.appendChild(document.createElement('strong'));
    /** @type {WebMidiLink} */

    const self = this;
    opener.postMessage('link,progress', '*');
    loadingText.innerText = 'Now Loading...';

    const ready = stream => {
      console.info('ready');
      loadingText.innerText = 'Parsing SoundFont...';
      self.onload(stream);

      if (typeof self.loadCallback === 'function') {
        self.loadCallback(stream);
      }

      self.placeholder.removeChild(loading);
      opener.postMessage('link,ready', '*');
    };

    if (this.option.cache && window.caches) {
      // キャッシュが利用可能な場合
      loadingText.className = 'ml-1';
      loading.className = 'd-flex';
      /** @type {HTMLDivElement} */

      const spiner = loading.appendChild(document.createElement('div'));
      spiner.className = 'spinner-border text-primary';
      spiner.role = 'status';
      spiner.ariaHidden = true;
      window.caches.open('wml').then(cache => {
        cache.match(url).then(response => response.arrayBuffer()).then(stream => ready(stream)).catch(() => {
          console.info('Fetch from server.');
          fetch(url).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }

            const total = response.headers.get('content-length');
            loadingText.innerText += ' (' + total + 'byte)';
            const copy = response.clone();
            cache.put(url, response);
            return copy.arrayBuffer();
          }).then(stream => ready(stream)).catch(e => {
            console.error(e);
            alert('There has been a problem with your fetch operation: ' + e.message);
          });
        });
      });
    } else {
      // キャッシュが使えない場合
      console.info('This server/client does not cache function.'); // プログレスバーを表示（こっちの処理系はCacheStorageが使えないときのみ使われる。）

      /** @type {HTMLDivElement} */

      const progress = loading.appendChild(document.createElement('div'));
      progress.className = 'progress';
      /** @type {HTMLDivElement} */

      const progressBar = progress.appendChild(document.createElement('div'));
      progressBar.className = 'progress-bar';
      progressBar.role = 'progressbar';
      progressBar.innerText = '0%'; // 結合処理

      const concatenation = segments => {
        let sumLength = 0;

        for (let i = 0; i < segments.length; ++i) {
          sumLength += segments[i].byteLength;
        }

        const whole = new Uint8Array(sumLength);
        let pos = 0;

        for (let i = 0; i < segments.length; ++i) {
          whole.set(new Uint8Array(segments[i]), pos);
          pos += segments[i].byteLength;
        }

        return whole.buffer;
      };

      fetch(url).then(res => {
        // 全体サイズ
        const total = res.headers.get('content-length');
        progress.max = total; // body の reader を取得する

        const reader = res.body.getReader();
        let chunk = 0;
        const buffer = [];

        const processResult = result => {
          // done が true なら最後の chunk
          if (result.done) {
            const stream = concatenation(buffer);
            ready(stream);
            return;
          } // chunk の長さの蓄積を total で割れば進捗が分かる


          chunk += result.value.length;
          buffer.push(result.value); // 進捗を更新

          const percentage = Math.round(chunk / total * 100);
          progressBar.style.width = percentage + '%';
          progressBar.innerText = percentage + ' %';
          opener.postMessage('link,progress,' + chunk + ',' + total, '*'); // 再帰する

          return reader.read().then(processResult);
        };

        reader.read().then(processResult);
      }).catch(e => alert('There has been a problem with your fetch operation: ' + e.message));
    }
  }
  /**
   * @param {boolean} sw
   * @export
   */


  setReverb(sw) {
    this.synth.setReverb(sw);
  }
  /**
   * @param {ArrayBuffer} response
   */


  onload(response) {
    /** @type {Uint8Array} */
    const input = new Uint8Array(response);
    this.loadSoundFont(input);
  }
  /**
   * @param {Uint8Array} input
   */


  loadSoundFont(input) {
    /** @type {Synthesizer} */
    let synth;
    /** @type {Window} */

    const w = window;

    if (!this.synth) {
      synth = this.synth = new _sound_font_synth__WEBPACK_IMPORTED_MODULE_1__["default"](input);

      if (this.option.drawSynth) {
        this.placeholder.appendChild(synth.drawSynth());
      }

      synth.init();
      synth.start();
      w.addEventListener('message', this.messageHandler, false);
    } else {
      synth = this.synth;
      synth.refreshInstruments(input);
    } // link ready


    w.postMessage('link,ready', '*');
  }

  /**
   * @param {Event} ev
   */
  onmessage(ev) {
    /** @type {Array} */
    const msg = typeof ev.data.split === 'function' ? ev.data.split(',') : [];
    /** @type {string} */

    const type = msg !== [] ? msg.shift() : '';
    /** @type {Window} */

    const opener = window.opener ? window.opener : window.parent;
    /** @type {string} */

    let command;

    switch (type) {
      case 'midi':
        this.processMidiMessage(msg.map(hex => {
          return parseInt(hex, 16);
        }));
        break;

      case 'link':
        if (opener === void 0) {
          return;
        }

        command = msg.shift();

        switch (command) {
          case 'reqpatch':
            // TODO: dummy data
            opener.postMessage('link,patch', '*');
            break;

          case 'setpatch':
          case 'ready':
            opener.postMessage('link,ready', '*'); // TODO: NOP

            break;

          case 'progress':
            opener.postMessage('link,progress', '*');
            break;

          default:
            console.error('unknown link message:', command);
            break;
        }

        break;

      default: // console.error('unknown message type');

    }
  }

  /**
   * @param {function(ArrayBuffer)} callback
   * @export
   */
  setLoadCallback(callback) {
    this.loadCallback = callback;
  }

  /**
   * @param {Array.<number>} message
   */
  processMidiMessage(message) {
    /** @type {number} */
    const channel = message[0] & 0x0f;
    /** @type {Synthesizer} */

    const synth = this.synth;

    switch (message[0] & 0xf0) {
      case 0x80:
        // NoteOff: 8n kk vv
        synth.noteOff(channel, message[1], message[2]);
        break;

      case 0x90:
        // NoteOn: 9n kk vv
        if (message[2] > 0) {
          synth.noteOn(channel, message[1], message[2]);
        } else {
          synth.noteOff(channel, message[1], 0);
        }

        break;

      case 0xB0:
        // Control Change: Bn cc dd

        /** @type {number} */
        const value = message[2];

        switch (message[1]) {
          case 0x00:
            // Bank Select MSB: Bn 00 dd
            synth.bankSelectMsb(channel, value);
            break;

          case 0x01:
            // Modulation
            break;

          case 0x06:
            // Data Entry(MSB): Bn 06 dd
            if (this.rpnMode) {
              // RPN
              switch (this.RpnMsb[channel]) {
                case 0:
                  switch (this.RpnLsb[channel]) {
                    case 0:
                      // Pitch Bend Sensitivity
                      synth.pitchBendSensitivity(channel, value);
                      break;

                    case 1:
                      // console.log("fine");
                      break;

                    case 2:
                      // console.log("coarse");
                      break;

                    default:
                      // console.log("default");
                      break;
                  }

                  break;

                default:
                  // console.log("default:", this.RpnMsb[channel], this.RpnLsb[channel]);
                  break;
              }
            } else {
              // NRPN
              switch (this.NrpnMsb[channel]) {
                case 26:
                  // Drum Instrument Level
                  synth.drumInstrumentLevel(this.NrpnLsb[channel], value);
                  break;

                default:
                  // console.log("default:", this.RpnMsb[channel], this.RpnLsb[channel]);
                  break;
              }
            }

            break;

          case 0x26:
            // Data Entry(LSB): Bn 26 dd
            if (this.rpnMode) {
              // RPN
              switch (this.RpnMsb[channel]) {
                case 0:
                  switch (this.RpnLsb[channel]) {
                    case 0:
                      // Pitch Bend Sensitivity
                      synth.pitchBendSensitivity(channel, synth.getPitchBendSensitivity(channel) + value / 100);
                      break;

                    case 1:
                      // console.log("fine");
                      break;

                    case 2:
                      // console.log("coarse");
                      break;
                  }

                  break;
              }
            } // NRPN で LSB が必要なものは今のところない


            break;

          case 0x07:
            // Volume Change: Bn 07 dd
            synth.volumeChange(channel, value);
            break;

          case 0x0A:
            // Panpot Change: Bn 0A dd
            synth.panpotChange(channel, value);
            break;

          case 0x78:
            // All Sound Off: Bn 78 00
            synth.allSoundOff(channel);
            break;

          case 0x79:
            // Reset All Control: Bn 79 00
            synth.resetAllControl(channel);
            break;

          case 0x20:
            // BankSelect LSB: Bn 00 dd
            synth.bankSelectLsb(channel, value);
            break;

          case 0x47:
            // Harmonic Content
            synth.harmonicContent(channel, value);
            break;

          case 0x60:
            //
            // console.log(60);
            break;

          case 0x61:
            //
            // console.log(61);
            break;

          case 0x62:
            // NRPN LSB
            this.rpnMode = false;
            this.NrpnLsb[channel] = value;
            break;

          case 0x63:
            // NRPN MSB
            this.rpnMode = false;
            this.NrpnMsb[channel] = value;
            break;

          case 0x64:
            // RPN LSB
            this.rpnMode = true;
            this.RpnLsb[channel] = value;
            break;

          case 0x65:
            // RPN MSB
            this.rpnMode = true;
            this.RpnMsb[channel] = value;
            break;

          case 0x40:
            // Hold
            synth.hold(channel, value);
            break;

          case 0x0b:
            // Expression
            synth.expression(channel, value);
            break;

          case 0x48:
            // DecayTyme
            synth.decayTime(channel, value);
            break;

          case 0x49:
            // ReleaseTime
            synth.releaseTime(channel, value);
            break;

          case 0x4A:
            // Attack time
            synth.attackTime(channel, value);
            break;

          case 0x4B:
            // Brightness
            synth.cutOffFrequency(channel, value);
            break;

          case 0x5B:
            // Effect1 Depth（Reverb Send Level）
            synth.reverbDepth(channel, value);
            break;

          default:
            // not supported
            break;
        }

        break;

      case 0xC0:
        // Program Change: Cn pp
        synth.programChange(channel, message[1]);
        break;

      case 0xE0:
        // Pitch Bend
        synth.pitchBend(channel, message[1], message[2]);
        break;

      case 0xf0:
        // System Exclusive Message
        // ID number
        switch (message[1]) {
          case 0x7e:
            // non-realtime
            // TODO
            // GM Reset: F0 7E 7F 09 01 F7
            if (message[2] === 0x7f && message[3] === 0x09 && message[4] === 0x01) {
              synth.init('GM');
            }

            break;

          case 0x7f:
            // realtime
            // sub ID 1
            switch (message[3]) {
              case 0x04:
                // device control
                // sub ID 2
                switch (message[4]) {
                  case 0x01:
                    // master volume: F0 7F 7F 04 01 [value] [value] F7
                    synth.setMasterVolume(message[5] + (message[6] << 7));
                    break;
                }

                break;
            }

            break;
        } // Vendor


        switch (message[2]) {
          case 0x43:
            // Yamaha XG
            if (message[5] === 0x08) {
              // XG Dram Part: F0 43 [dev] 4C 08 [partNum] 07 [map] F7
              // but there is no file to use much this parameter...
              if (message[7] !== 0x00) {
                // [map]
                synth.setPercussionPart(message[6], true);
              } else {
                synth.setPercussionPart(message[6], false);
              } // console.log(message);

            }

            switch (message[7]) {
              case 0x04:
                // XG Master Volume: F0 43 [dev] 4C 00 00 04 [value] F7
                synth.setMasterVolume((message[8] << 7) * 2); // console.log(message[8] << 7);

                break;

              case 0x7E:
                // XG Reset: F0 43 [dev] 4C 00 00 7E 00 F7
                synth.init('XG');
                console.log('XG Reset');
                break;
            }

            break;

          case 0x41:
            // Roland GS / TG300B Mode
            // TODO
            switch (message[8]) {
              case 0x04:
                // GS Master Volume: F0 41 [dev] 42 12 40 00 04 [value] 58 F7
                synth.setMasterVolume(message[9] << 7);
                break;

              case 0x7F:
                // GS Reset: F0 41 [dev] 42 12 40 00 7F 00 41 F7
                synth.init('GS');
                console.log('GS Reset');
                break;

              case 0x15:
                // GS Dram part: F0 41 [dev] 42 12 40 1[part no] [Map] [sum] F7
                // Notice: [sum] is ignroe in this program.
                // http://www.ssw.co.jp/dtm/drums/drsetup.htm
                // http://www.roland.co.jp/support/by_product/sd-20/knowledge_base/1826700/
                const part = message[7] - 0x0F;
                const map = message[8];

                if (part === 0) {
                  // 10 Ch.
                  if (map !== 0x00) {
                    synth.setPercussionPart(9, true);
                  } else {
                    synth.setPercussionPart(9, false);
                  }
                } else if (part >= 10) {
                  // 1~9 Ch.
                  if (map !== 0x00) {
                    synth.setPercussionPart(part - 1, true);
                  } else {
                    synth.setPercussionPart(part - 1, false);
                  }
                } else {
                  // 11~16 Ch.
                  if (map !== 0x00) {
                    synth.setPercussionPart(part, true);
                  } else {
                    synth.setPercussionPart(part, false);
                  }
                }

                break;
            }

            break;
        }

        break;

      default:
        // not supported
        synth.setPercussionPart(9, true);
        break;
    }
  }

}
/* harmony default export */ __webpack_exports__["default"] = (WebMidiLink);

/***/ })

/******/ });
});
//# sourceMappingURL=sf2.synth.js.map
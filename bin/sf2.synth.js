/*! sf2synth.js | imaya / GREE Inc. / Logue | license: MIT */
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

/***/ "./src/reverb.js":
/*!***********************!*\
  !*** ./src/reverb.js ***!
  \***********************/
/*! exports provided: Reverb, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Reverb", function() { return Reverb; });
/**
 * Adapted from https://github.com/web-audio-components/simple-reverb
 */
class Reverb {
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
  constructor(ctx, options) {
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
    this._cutOff = 440;
    /** @type {number} */
    this._decay = 1;
    /** @type {number} */
    this._delay = 0.5;
    /** @type {BiquadFilterType} */
    this._filterType = 'bandpass';
    /** @type {number} */
    this._mix = 0.5;
    /** @type {boolean} */
    this._reverse = false;
    /** @type {number} */
    this._time = 1;

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
  BuildImpulse() {
    /** @type {number} */
    const rate = this.ctx.sampleRate;
    /** @type {number} */
    const length = Math.max(rate * this._time, 1);
    /** @type {number} */
    const delayDuration = rate * this._delay;
    /** @type {AudioBuffer} */
    let impulse = this.ctx.createBuffer(2, length, rate);
    /** @type {ArrayBufferView} */
    let impulseL = new Float32Array(length);
    /** @type {ArrayBufferView} */
    let impulseR = new Float32Array(length);

    for (var i = 0; i < length; i++) {
      let n = void 0,
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
    this.BuildImpulse();
  }

  /** 
   * Impulse response decay rate.
   * @param {number} decay
   */
  decay(decay) {
    this._decay = decay;
    this.BuildImpulse();
  }

  /** 
   * Impulse response decay rate.
   * @param {number} delay
   */
  delay(delay) {
    this._delay = delay;
    this.BuildImpulse();
  }

  /**
   * Reverse the impulse response.
   * @param {boolean} reverse
   */
  reverse(reverse) {
    this._reverse = reverse;
    this.BuildImpulse();
  }

  /**
   * Cut off frequency.
   * @param {number} freq
   */
  cutOff(freq) {
    this._cutOff = freq;
    this.filterNode.frequency.setTargetAtTime(this._cutOff, this.ctx.currentTime, 0.015);
  }

  /**
   * Filter Type.
   * @param {BiquadFilterType} type
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

    if (value <= 0.5)
      return 1;

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

    if (value >= 0.5)
      return 1;

    return 1 - ((value - 0.5) * 2);
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Reverb);

/***/ }),

/***/ "./src/riff.js":
/*!*********************!*\
  !*** ./src/riff.js ***!
  \*********************/
/*! exports provided: Riff, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Riff", function() { return Riff; });
class Riff {
  /**
   * @param {ByteArray} input input buffer.
   * @param {Object=} opt_params option parameters.
   * @constructor
   */
  constructor(input, opt_params = {}) {
    /** @type {ByteArray} */
    this.input = input;
    /** @type {number} */
    this.ip = opt_params['index'] || 0;
    /** @type {number} */
    this.length = opt_params['length'] || input.length - this.ip;
    /** @type {Array.<Riff.Chunk>} */
    this.chunkList;
    /** @type {number} */
    this.offset = this.ip;
    /** @type {boolean} */
    this.padding =
      opt_params['padding'] !== void 0 ? opt_params['padding'] : true;
    /** @type {boolean} */
    this.bigEndian =
      opt_params['bigEndian'] !== void 0 ? opt_params['bigEndian'] : false;
  }

  parse() {
    /** @type {number} */
    let length = this.length + this.offset;

    this.chunkList = [];

    while (this.ip < length) {
      this.parseChunk();
    }
  }

  parseChunk() {
    /** @type {ByteArray} */
    let input = this.input;
    /** @type {number} */
    let ip = this.ip;
    /** @type {number} */
    let size;

    this.chunkList.push(new RiffChunk(
      String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]),
      (size = this.bigEndian ?
        ((input[ip++] << 24) | (input[ip++] << 16) |
          (input[ip++] << 8) | (input[ip++])) >>> 0 :
        ((input[ip++]) | (input[ip++] << 8) |
          (input[ip++] << 16) | (input[ip++] << 24)) >>> 0
      ),
      ip
    ));

    ip += size;

    // padding
    if (this.padding && ((ip - this.offset) & 1) === 1) {
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
    let chunk = this.chunkList[index];

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

class RiffChunk {
  /**
   * @param {string} type
   * @param {number} size
   * @param {number} offset
   * @constructor
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

/* harmony default export */ __webpack_exports__["default"] = ({
  Riff,
  RiffChunk
});

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
/* harmony import */ var _riff__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./riff */ "./src/riff.js");


class Parser {
  /**
   * @param {ByteArray} input
   * @param {Object=} opt_params
   * @constructor
   */
  constructor(input, opt_params = {}) {
    /** @type {ByteArray} */
    this.input = input;
    /** @type {(Object|undefined)} */
    this.parserOption = opt_params['parserOption'];
    /** @type {(Number|undefined)} */
    this.sampleRate = opt_params['sampleRate'] || 22050; // よくわからんが、OSで指定されているサンプルレートを入れないと音が切れ切れになる。

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
    this.GeneratorEnumeratorTable = [
      'startAddrsOffset',
      'endAddrsOffset',
      'startloopAddrsOffset',
      'endloopAddrsOffset',
      'startAddrsCoarseOffset',
      'modLfoToPitch',
      'vibLfoToPitch',
      'modEnvToPitch',
      'initialFilterFc',
      'initialFilterQ',
      'modLfoToFilterFc',
      'modEnvToFilterFc',
      'endAddrsCoarseOffset',
      'modLfoToVolume', , // 14
      'chorusEffectsSend',
      'reverbEffectsSend',
      'pan', , , , // 18,19,20
      'delayModLFO',
      'freqModLFO',
      'delayVibLFO',
      'freqVibLFO',
      'delayModEnv',
      'attackModEnv',
      'holdModEnv',
      'decayModEnv',
      'sustainModEnv',
      'releaseModEnv',
      'keynumToModEnvHold',
      'keynumToModEnvDecay',
      'delayVolEnv',
      'attackVolEnv',
      'holdVolEnv',
      'decayVolEnv',
      'sustainVolEnv',
      'releaseVolEnv',
      'keynumToVolEnvHold',
      'keynumToVolEnvDecay',
      'instrument', , // 42
      'keyRange',
      'velRange',
      'startloopAddrsCoarseOffset',
      'keynum',
      'velocity',
      'initialAttenuation', , // 49
      'endloopAddrsCoarseOffset',
      'coarseTune',
      'fineTune',
      'sampleID',
      'sampleModes', , // 55
      'scaleTuning',
      'exclusiveClass',
      'overridingRootKey', // 59
      'endOper'
    ];
  }

  parse() {
    /** @type {Riff} */
    let parser = new _riff__WEBPACK_IMPORTED_MODULE_0__["Riff"](this.input, this.parserOption);
    /** @type {?RiffChunk} */
    let chunk;

    // parse RIFF chunk
    parser.parse();
    if (parser.chunkList.length !== 1) {
      throw new Error('wrong chunk length');
    }

    chunk = parser.getChunk(0);
    if (chunk === null) {
      throw new Error('chunk not found');
    }

    this.parseRiffChunk(chunk);
    //console.log(this.sampleHeader);
    this.input = null;
  }

  /**
   * @param {RiffChunk} chunk
   */
  parseRiffChunk(chunk) {
    /** @type {Riff} */
    let parser;
    /** @type {ByteArray} */
    let data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {string} */
    let signature;

    // check parse target
    if (chunk.type !== 'RIFF') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    // check signature
    signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);
    if (signature !== 'sfbk') {
      throw new Error('invalid signature:' + signature);
    }

    // read structure
    parser = new _riff__WEBPACK_IMPORTED_MODULE_0__["Riff"](data, { 'index': ip, 'length': chunk.size - 4 });
    parser.parse();
    if (parser.getNumberOfChunks() !== 3) {
      throw new Error('invalid sfbk structure');
    }

    // INFO-list
    this.parseInfoList( /** @type {!RiffChunk} */(parser.getChunk(0)));

    // sdta-list
    this.parseSdtaList( /** @type {!RiffChunk} */(parser.getChunk(1)));

    // pdta-list
    this.parsePdtaList( /** @type {!RiffChunk} */(parser.getChunk(2)));
  };

  /**
   * @param {RiffChunk} chunk
   */
  parseInfoList(chunk) {
    /** @type {Riff} */
    let parser;
    /** @type {ByteArray} */
    let data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {string} */
    let signature;

    // check parse target
    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    // check signature
    signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);
    if (signature !== 'INFO') {
      throw new Error('invalid signature:' + signature);
    }

    // read structure
    parser = new _riff__WEBPACK_IMPORTED_MODULE_0__["Riff"](data, { 'index': ip, 'length': chunk.size - 4 });
    parser.parse();
  };

  /**
   * @param {RiffChunk} chunk
   */
  parseSdtaList(chunk) {
    /** @type {Riff} */
    let parser;
    /** @type {ByteArray} */
    let data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {string} */
    let signature;

    // check parse target
    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    // check signature
    signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);
    if (signature !== 'sdta') {
      throw new Error('invalid signature:' + signature);
    }

    // read structure
    parser = new _riff__WEBPACK_IMPORTED_MODULE_0__["Riff"](data, { 'index': ip, 'length': chunk.size - 4 });
    parser.parse();
    if (parser.chunkList.length !== 1) {
      throw new Error('TODO');
    }
    this.samplingData =
      /** @type {{type: string, size: number, offset: number}} */
      (parser.getChunk(0));
  };

  /**
   * @param {RiffChunk} chunk
   */
  parsePdtaList(chunk) {
    /** @type {Riff} */
    let parser;
    /** @type {ByteArray} */
    let data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {string} */
    let signature;

    // check parse target
    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    // check signature
    signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);
    if (signature !== 'pdta') {
      throw new Error('invalid signature:' + signature);
    }

    // read structure
    parser = new _riff__WEBPACK_IMPORTED_MODULE_0__["Riff"](data, { 'index': ip, 'length': chunk.size - 4 });
    parser.parse();

    // check number of chunks
    if (parser.getNumberOfChunks() !== 9) {
      throw new Error('invalid pdta chunk');
    }

    this.parsePhdr( /** @type {RiffChunk} */(parser.getChunk(0)));
    this.parsePbag( /** @type {RiffChunk} */(parser.getChunk(1)));
    this.parsePmod( /** @type {RiffChunk} */(parser.getChunk(2)));
    this.parsePgen( /** @type {RiffChunk} */(parser.getChunk(3)));
    this.parseInst( /** @type {RiffChunk} */(parser.getChunk(4)));
    this.parseIbag( /** @type {RiffChunk} */(parser.getChunk(5)));
    this.parseImod( /** @type {RiffChunk} */(parser.getChunk(6)));
    this.parseIgen( /** @type {RiffChunk} */(parser.getChunk(7)));
    this.parseShdr( /** @type {RiffChunk} */(parser.getChunk(8)));
  };

  /**
   * @param {RiffChunk} chunk
   */
  parsePhdr(chunk) {
    /** @type {ByteArray} */
    let data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {Array.<Object>} */
    let presetHeader = this.presetHeader = [];
    /** @type {number} */
    let size = chunk.offset + chunk.size;

    // check parse target
    if (chunk.type !== 'phdr') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      presetHeader.push({
        presetName: String.fromCharCode.apply(null, data.subarray(ip, ip += 20)),
        preset: data[ip++] | (data[ip++] << 8),
        bank: data[ip++] | (data[ip++] << 8),
        presetBagIndex: data[ip++] | (data[ip++] << 8),
        library: (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0,
        genre: (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0,
        morphology: (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0
      });
    }
  };

  /**
   * @param {RiffChunk} chunk
   */
  parsePbag(chunk) {
    /** @type {ByteArray} */
    let data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {Array.<Object>} */
    let presetZone = this.presetZone = [];
    /** @type {number} */
    let size = chunk.offset + chunk.size;

    // check parse target
    if (chunk.type !== 'pbag') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      presetZone.push({
        presetGeneratorIndex: data[ip++] | (data[ip++] << 8),
        presetModulatorIndex: data[ip++] | (data[ip++] << 8)
      });
    }
  };

  /**
   * @param {RiffChunk} chunk
   */
  parsePmod(chunk) {
    // check parse target
    if (chunk.type !== 'pmod') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    this.presetZoneModulator = this.parseModulator(chunk);
  };

  /**
   * @param {RiffChunk} chunk
   */
  parsePgen(chunk) {
    // check parse target
    if (chunk.type !== 'pgen') {
      throw new Error('invalid chunk type:' + chunk.type);
    }
    this.presetZoneGenerator = this.parseGenerator(chunk);
  };

  /**
   * @param {RiffChunk} chunk
   */
  parseInst(chunk) {
    /** @type {ByteArray} */
    let data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {Array.<Object>} */
    let instrument = this.instrument = [];
    /** @type {number} */
    let size = chunk.offset + chunk.size;

    // check parse target
    if (chunk.type !== 'inst') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      instrument.push({
        instrumentName: String.fromCharCode.apply(null, data.subarray(ip, ip += 20)),
        instrumentBagIndex: data[ip++] | (data[ip++] << 8)
      });
    }
  };

  /**
   * @param {RiffChunk} chunk
   */
  parseIbag(chunk) {
    /** @type {ByteArray} */
    let data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {Array.<Object>} */
    let instrumentZone = this.instrumentZone = [];
    /** @type {number} */
    let size = chunk.offset + chunk.size;

    // check parse target
    if (chunk.type !== 'ibag') {
      throw new Error('invalid chunk type:' + chunk.type);
    }


    while (ip < size) {
      instrumentZone.push({
        instrumentGeneratorIndex: data[ip++] | (data[ip++] << 8),
        instrumentModulatorIndex: data[ip++] | (data[ip++] << 8)
      });
    }
  };

  /**
   * @param {RiffChunk} chunk
   */
  parseImod(chunk) {
    // check parse target
    if (chunk.type !== 'imod') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    this.instrumentZoneModulator = this.parseModulator(chunk);
  };


  /**
   * @param {RiffChunk} chunk
   */
  parseIgen(chunk) {
    // check parse target
    if (chunk.type !== 'igen') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    this.instrumentZoneGenerator = this.parseGenerator(chunk);
  };

  /**
   * @param {RiffChunk} chunk
   */
  parseShdr(chunk) {
    /** @type {ByteArray} */
    let data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {Array.<Object>} */
    let samples = this.sample = [];
    /** @type {Array.<Object>} */
    let sampleHeader = this.sampleHeader = [];
    /** @type {number} */
    let size = chunk.offset + chunk.size;
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
    let sampleType;

    // check parse target
    if (chunk.type !== 'shdr') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      sampleName = String.fromCharCode.apply(null, data.subarray(ip, ip += 20));
      start = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0;
      end = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0;
      startLoop = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0;
      endLoop = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0;
      sampleRate = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0;
      originalPitch = data[ip++];
      pitchCorrection = (data[ip++] << 24) >> 24;
      sampleLink = data[ip++] | (data[ip++] << 8);
      sampleType = data[ip++] | (data[ip++] << 8);

      let sample = new Int16Array(new Uint8Array(data.subarray(
        this.samplingData.offset + start * 2,
        this.samplingData.offset + end * 2
      )).buffer);

      startLoop -= start;
      endLoop -= start;

      if (sampleRate > 0) {
        let adjust = this.adjustSampleData(sample, sampleRate);
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
  };

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
    let multiply = 1;

    // buffer
    while (sampleRate < (this.sampleRate)) { // AudioContextのサンプルレートに変更
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
  };

  /**
   * @param {RiffChunk} chunk
   * @return {Array.<Object>}
   */
  parseModulator(chunk) {
    /** @type {ByteArray} */
    let data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {number} */
    let size = chunk.offset + chunk.size;
    /** @type {number} */
    let code;
    /** @type {string} */
    let key;
    /** @type {Array.<Object>} */
    let output = [];

    while (ip < size) {
      // Src  Oper
      // TODO
      ip += 2;

      // Dest Oper
      code = data[ip++] | (data[ip++] << 8);
      key = this.GeneratorEnumeratorTable[code];
      if (key === void 0) {
        // Amount
        output.push({
          type: key,
          value: {
            code: code,
            amount: data[ip] | (data[ip + 1] << 8) << 16 >> 16,
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
                amount: data[ip++] | (data[ip++] << 8) << 16 >> 16
              }
            });
            break;
        }
      }

      // AmtSrcOper
      // TODO
      ip += 2;

      // Trans Oper
      // TODO
      ip += 2;
    }

    return output;
  };

  /**
   * @param {RiffChunk} chunk
   * @return {Array.<Object>}
   */
  parseGenerator(chunk) {
    /** @type {ByteArray} */
    let data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {number} */
    let size = chunk.offset + chunk.size;
    /** @type {number} */
    let code;
    /** @type {string} */
    let key;
    /** @type {Array.<Object>} */
    let output = [];

    while (ip < size) {
      code = data[ip++] | (data[ip++] << 8);
      key = this.GeneratorEnumeratorTable[code];
      if (key === void 0) {
        output.push({
          type: key,
          value: {
            code: code,
            amount: data[ip] | (data[ip + 1] << 8) << 16 >> 16,
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
              amount: data[ip++] | (data[ip++] << 8) << 16 >> 16
            }
          });
          break;
      }
    }

    return output;
  };

  createInstrument() {
    /** @type {Array.<Object>} */
    let instrument = this.instrument;
    /** @type {Array.<Object>} */
    let zone = this.instrumentZone;
    /** @type {Array.<Object>} */
    let output = [];
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
    let jl;

    // instrument -> instrument bag -> generator / modulator
    for (i = 0, il = instrument.length; i < il; ++i) {
      bagIndex = instrument[i].instrumentBagIndex;
      bagIndexEnd = instrument[i + 1] ? instrument[i + 1].instrumentBagIndex : zone.length;
      zoneInfo = [];

      // instrument bag
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
  };

  createPreset() {
    /** @type {Array.<Object>} */
    let preset = this.presetHeader;
    /** @type {Array.<Object>} */
    let zone = this.presetZone;
    /** @type {Array.<Object>} */
    let output = [];
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
    let jl;

    // preset -> preset bag -> generator / modulator
    for (i = 0, il = preset.length; i < il; ++i) {
      bagIndex = preset[i].presetBagIndex;
      bagIndexEnd = preset[i + 1] ? preset[i + 1].presetBagIndex : zone.length;
      zoneInfo = [];

      // preset bag
      for (j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
        presetGenerator = this.createPresetGenerator_(zone, j);
        presetModulator = this.createPresetModulator_(zone, j);

        zoneInfo.push({
          generator: presetGenerator.generator,
          generatorSequence: presetGenerator.generatorInfo,
          modulator: presetModulator.modulator,
          modulatorSequence: presetModulator.modulatorInfo
        });

        instrument =
          presetGenerator.generator['instrument'] !== void 0 ?
            presetGenerator.generator['instrument'].amount :
            presetModulator.modulator['instrument'] !== void 0 ?
              presetModulator.modulator['instrument'].amount :
              null;
      }

      output.push({
        name: preset[i].presetName,
        info: zoneInfo,
        header: preset[i],
        instrument: instrument
      });
    }

    return output;
  };

  /**
   * @param {Array.<Object>} zone
   * @param {number} index
   * @returns {{generator: Object, generatorInfo: Array.<Object>}}
   * @private
   */
  createInstrumentGenerator_(zone, index) {
    let modgen = this.createBagModGen_(
      zone,
      zone[index].instrumentGeneratorIndex,
      zone[index + 1] ? zone[index + 1].instrumentGeneratorIndex : this.instrumentZoneGenerator.length,
      this.instrumentZoneGenerator
    );

    return {
      generator: modgen.modgen,
      generatorInfo: modgen.modgenInfo
    };
  };

  /**
   * @param {Array.<Object>} zone
   * @param {number} index
   * @returns {{modulator: Object, modulatorInfo: Array.<Object>}}
   * @private
   */
  createInstrumentModulator_(zone, index) {
    let modgen = this.createBagModGen_(
      zone,
      zone[index].presetModulatorIndex,
      zone[index + 1] ? zone[index + 1].instrumentModulatorIndex : this.instrumentZoneModulator.length,
      this.instrumentZoneModulator
    );

    return {
      modulator: modgen.modgen,
      modulatorInfo: modgen.modgenInfo
    };
  };

  /**
   * @param {Array.<Object>} zone
   * @param {number} index
   * @returns {{generator: Object, generatorInfo: Array.<Object>}}
   * @private
   */
  createPresetGenerator_(zone, index) {
    let modgen = this.createBagModGen_(
      zone,
      zone[index].presetGeneratorIndex,
      zone[index + 1] ? zone[index + 1].presetGeneratorIndex : this.presetZoneGenerator.length,
      this.presetZoneGenerator
    );

    return {
      generator: modgen.modgen,
      generatorInfo: modgen.modgenInfo
    };
  };

  /**
   * @param {Array.<Object>} zone
   * @param {number} index
   * @returns {{modulator: Object, modulatorInfo: Array.<Object>}}
   * @private
   */
  createPresetModulator_(zone, index) {
    /** @type {{modgen: Object, modgenInfo: Array.<Object>}} */
    let modgen = this.createBagModGen_(
      zone,
      zone[index].presetModulatorIndex,
      zone[index + 1] ? zone[index + 1].presetModulatorIndex : this.presetZoneModulator.length,
      this.presetZoneModulator
    );

    return {
      modulator: modgen.modgen,
      modulatorInfo: modgen.modgenInfo
    };
  };

  /**
   * @param {Array.<Object>} zone
   * @param {number} indexStart
   * @param {number} indexEnd
   * @param zoneModGen
   * @returns {{modgen: Object, modgenInfo: Array.<Object>}}
   * @private
   */
  createBagModGen_(zone, indexStart, indexEnd, zoneModGen) {
    /** @type {Array.<Object>} */
    let modgenInfo = [];
    /** @type {Object} */
    let modgen = {
      unknown: [],
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
/* harmony import */ var _reverb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reverb */ "./src/reverb.js");



/**
 * @constructor
 */
class Synthesizer {
  constructor(input) {
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;

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
    this.channelHold = [
      false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false
    ];
    /** @type {Array.<number>} */
    this.channelReverbDepth = [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40];
    /** @type {Array.<number>} */
    this.channelHarmonicContent = [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64];
    /** @type {Array.<number>} */
    this.channelCutOffFrequency = [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64];

    /** @type {boolean} */
    this.isGS = false;
    /** @type {boolean} */
    this.isXG = false;

    /** @type {Array.<boolean>} */
    this.channelMute = [
      false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false
    ];
    /** @type {Array.<Array.<SoundFont.SynthesizerNote>>} */
    this.currentNoteOn = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ];
    /** @type {number} @const */
    this.baseVolume = 1 / 0xffff;
    /** @type {number} */
    this.masterVolume = 16384;

    /** @type {Array.<boolean>} */
    this.percussionPart = [
      false, false, false, false, false, false, false, false,
      false, true, false, false, false, false, false, false
    ];

    /** @type {Array.<number>} */
    this.percussionVolume = new Array(128);
    for (i = 0, il = this.percussionVolume.length; i < il; ++i) {
      this.percussionVolume[i] = 127;
    }

    this.programSet = {};

    /** @type {boolean} */
    this.useReverb = true;

    /** @type {Reverb} */
    this.reverb = new _reverb__WEBPACK_IMPORTED_MODULE_2__["default"](this.ctx);

  };

  /**
   * @returns {AudioContext}
   */
  getAudioContext() {
    /** @type string **/
    const eventName = typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
    /** @type {AudioContext} */
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    /** @type {AudioContext} */
    const ctx = new AudioContext();

    document.addEventListener(eventName, () => {
      ctx.resume();
    });

    if (ctx.createGainNode === void 0) {
      ctx.createGainNode = ctx.createGain;
    }

    return ctx;
  }

  /**
   * 
   * @param {string} mode 
   */
  init(mode = 'GM') {
    /** @type {number} */
    var i;

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

    if (this.useReverb) {
      // エフェクターをリセット
      this.reverb.node.disconnect(0);
      this.gainMaster.connect(this.reverb.node);
      this.reverb.node.connect(this.ctx.destination);
    }

    if (this.element) {
      //this.element.querySelector('.header div:before').innerText = mode + ' Mode';
    }
  };
  close() {
    this.ctx.close();
  };

  /**
   * @param {Uint8Array} input
   */
  refreshInstruments(input) {
    this.input = input;
    this.parser = new _sf2__WEBPACK_IMPORTED_MODULE_1__["default"](input);
    this.bankSet = this.createAllInstruments();
  };

  /** @return {Array.<Array.<Object>>} */
  createAllInstruments() {
    /** @type {SoundFont.Parser} */
    var parser = this.parser;
    parser.parse();
    /** @type {Array} TODO */
    var presets = parser.createPreset();
    /** @type {Array} TODO */
    var instruments = parser.createInstrument();
    /** @type {Array} */
    var banks = [];
    /** @type {Array.<Array.<Object>>} */
    var bank;
    /** @type {number} */
    var bankNumber;
    /** @type {Object} TODO */
    var preset;
    /** @type {Object} */
    var instrument;
    /** @type {number} */
    var presetNumber;
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;
    /** @type {number} */
    var j;
    /** @type {number} */
    var jl;
    /** @type {string} */
    var presetName;

    var programSet = [];

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
      }

      // select bank
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
  };

  createNoteInfo(parser, info, preset) {
    var generator = info.generator;
    /** @type {number} */
    var sampleId;
    /** @type {Object} */
    var sampleHeader;
    /** @type {number} */
    var volDelay;
    /** @type {number} */
    var volAttack;
    /** @type {number} */
    var volHold;
    /** @type {number} */
    var volDecay;
    /** @type {number} */
    var volSustain;
    /** @type {number} */
    var volRelease;
    /** @type {number} */
    var modDelay;
    /** @type {number} */
    var modAttack;
    /** @type {number} */
    var modHold;
    /** @type {number} */
    var modDecay;
    /** @type {number} */
    var modSustain;
    /** @type {number} */
    var modRelease;
    /** @type {number} */
    var tune;
    /** @type {number} */
    var scale;
    /** @type {number} */
    var freqVibLFO;
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;
    /** @type {number} */
    var pan;
    /** 
     * @type {number} 
     * @const
     */

    if (generator['keyRange'] === void 0 || generator['sampleID'] === void 0) {
      return;
    }

    volDelay = this.getModGenAmount(generator, 'delayVolEnv', -12000);
    volAttack = this.getModGenAmount(generator, 'attackVolEnv', -12000);
    volHold = this.getModGenAmount(generator, 'holdVolEnv', -12000);
    volDecay = this.getModGenAmount(generator, 'decayVolEnv', -12000);
    volSustain = this.getModGenAmount(generator, 'sustainVolEnv');
    volRelease = this.getModGenAmount(generator, 'releaseVolEnv', -12000);
    modDelay = this.getModGenAmount(generator, 'delayModEnv', -12000);
    modAttack = this.getModGenAmount(generator, 'attackModEnv', -12000);
    modHold = this.getModGenAmount(generator, 'holdModEnv', -12000);
    modDecay = this.getModGenAmount(generator, 'decayModEnv', -12000);
    modSustain = this.getModGenAmount(generator, 'sustainModEnv');
    modRelease = this.getModGenAmount(generator, 'releaseModEnv', -12000);

    tune = (
      this.getModGenAmount(generator, 'coarseTune') +
      this.getModGenAmount(generator, 'fineTune') / 100
    );
    scale = this.getModGenAmount(generator, 'scaleTuning', 100) / 100;
    freqVibLFO = this.getModGenAmount(generator, 'freqVibLFO');
    pan = this.getModGenAmount(generator, 'pan');

    for (i = generator['keyRange'].lo, il = generator['keyRange'].hi; i <= il; ++i) {
      if (preset[i]) {
        continue;
      }

      sampleId = this.getModGenAmount(generator, 'sampleID');

      sampleHeader = parser.sampleHeader[sampleId];
      preset[i] = {
        'sample': parser.sample[sampleId],
        'sampleRate': sampleHeader.sampleRate,
        'sampleModes': this.getModGenAmount(generator, 'sampleModes'),
        'basePlaybackRate': Math.pow(
          Math.pow(2, 1 / 12),
          (
            i -
            this.getModGenAmount(generator, 'overridingRootKey', sampleHeader.originalPitch) +
            tune + (sampleHeader.pitchCorrection / 100)
          ) * scale
        ),
        'modEnvToPitch': this.getModGenAmount(generator, 'modEnvToPitch') / 100,
        'scaleTuning': scale,
        'start': this.getModGenAmount(generator, 'startAddrsCoarseOffset') * 32768 +
          this.getModGenAmount(generator, 'startAddrsOffset'),
        'end': this.getModGenAmount(generator, 'endAddrsCoarseOffset') * 32768 +
          this.getModGenAmount(generator, 'endAddrsOffset'),
        'loopStart': (
          //(sampleHeader.startLoop - sampleHeader.start) +
          (sampleHeader.startLoop) +
          this.getModGenAmount(generator, 'startloopAddrsCoarseOffset') * 32768 +
          this.getModGenAmount(generator, 'startloopAddrsOffset')
        ),
        'loopEnd': (
          //(sampleHeader.endLoop - sampleHeader.start) +
          (sampleHeader.endLoop) +
          this.getModGenAmount(generator, 'endloopAddrsCoarseOffset') * 32768 +
          this.getModGenAmount(generator, 'endloopAddrsOffset')
        ),
        'volDelay': Math.pow(2, volDelay / 1200),
        'volAttack': Math.pow(2, volAttack / 1200),
        'volHold': Math.pow(2, volHold / 1200) *
          Math.pow(2, (60 - i) * this.getModGenAmount(generator, 'keynumToVolEnvHold') / 1200),
        'volDecay': Math.pow(2, volDecay / 1200) *
          Math.pow(2, (60 - i) * this.getModGenAmount(generator, 'keynumToVolEnvDecay') / 1200),
        'volSustain': volSustain / 1000,
        'volRelease': Math.pow(2, volRelease / 1200),
        'modDelay': Math.pow(2, modDelay / 1200),
        'modAttack': Math.pow(2, modAttack / 1200),
        'modHold': Math.pow(2, modHold / 1200) *
          Math.pow(2, (60 - i) * this.getModGenAmount(generator, 'keynumToModEnvHold') / 1200),
        'modDecay': Math.pow(2, modDecay / 1200) *
          Math.pow(2, (60 - i) * this.getModGenAmount(generator, 'keynumToModEnvDecay') / 1200),
        'modSustain': modSustain / 1000,
        'modRelease': Math.pow(2, modRelease / 1200),
        'initialFilterFc': this.getModGenAmount(generator, 'initialFilterFc', 13500),
        'modEnvToFilterFc': this.getModGenAmount(generator, 'modEnvToFilterFc'),
        'initialFilterQ': this.getModGenAmount(generator, 'initialFilterQ'),
        'reverbEffectSend': this.getModGenAmount(generator, 'reverbEffectSend'),
        'initialAttenuation': this.getModGenAmount(generator, 'initialAttenuation'),
        'freqVibLFO': freqVibLFO ? Math.pow(2, freqVibLFO / 1200) * 8.176 : void 0,
        'pan': pan ? pan / 1200 : void 0
      };
    }
  };

  /**
   * @param {Object} generator
   * @param {string} enumeratorType
   * @param {number=} opt_default
   * @returns {number}
   */
  getModGenAmount(generator, enumeratorType, opt_default) {
    if (opt_default === void 0) {
      opt_default = 0;
    }

    return generator[enumeratorType] ? generator[enumeratorType].amount : opt_default;
  };

  start() {
    this.connect();
    this.setMasterVolume(16383);
    this.bufSrc.start(0);
  };

  setMasterVolume(volume) {
    this.masterVolume = volume;
    //this.gainMaster.gain.value = this.baseVolume * (volume / 16384);
    this.gainMaster.gain.setTargetAtTime(this.baseVolume * (volume / 16384), this.ctx.currentTime, 0.015);
  };

  connect() {
    this.setReverb(true);
    this.bufSrc.connect(this.gainMaster);
    this.gainMaster.connect(this.ctx.destination);
  };

  disconnect() {
    this.setReverb(false);
    this.bufSrc.disconnect(0);
    this.gainMaster.disconnect(0);
  };

  /** @param {boolean} value */
  setReverb(value) {

    this.useReverb = value;
    if (value) {
      this.gainMaster.connect(this.reverb.node);
      this.reverb.node.connect(this.ctx.destination);
    } else {
      this.reverb.node.disconnect(0);
    }
  };

  /** 
   * @param {number} channel
   * @param {number} depth 
   */
  reverbDepth(channel, depth) {
    this.reverbDepth[channel] = depth;
  };

  removeSynth() {
    this.ctx.close();
  };

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
    /** @type {HTMLDivElement} */
    let channel;
    /** @type {HTMLDivElement} */
    let item;
    /** @type {HTMLInputElement} */
    let checkbox;
    /** @type {HTMLLabelElement} */
    let label;

    for (let ch = 0; ch < 16; ch++) {
      channel = doc.createElement('div');
      channel.className = 'channel';
      for (let i in items) {
        /** @type {HTMLDivElement} */
        let item = doc.createElement('div');
        item.className = items[i];

        switch (items[i]) {
          case 'mute':
            let checkboxElement = document.createElement('div');
            checkboxElement.className = 'custom-control custom-checkbox custom-control-inline'
            let checkbox = doc.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.className = 'custom-control-input';
            checkbox.id = 'mute' + ch + 'ch';
            checkbox.addEventListener('change', ((synth, channel) => {
              return () => {
                synth.mute(channel, this.checked);
              };
            })(this, ch), false);
            checkboxElement.appendChild(checkbox);
            label = doc.createElement('label');
            label.className = 'custom-control-label';
            label.textContent = ch + 1;
            label.setAttribute('for', 'mute' + ch + 'ch');
            checkboxElement.appendChild(label);
            item.appendChild(checkboxElement);
            break;
          case 'bank':
            // Bank select
            let bank_select = doc.createElement('select');
            bank_select.className = 'form-control form-control-sm';
            item.appendChild(bank_select);
            let option = doc.createElement('option');
            bank_select.appendChild(option);

            bank_select.addEventListener('change', (function (synth, channel) {
              return function (event) {
                synth.bankChange(channel, event.target.value);
                synth.programChange(channel, synth.channelInstrument[channel]);
              };
            })(this, ch), false);

            bank_select.selectedIndex = this.channelInstrument[i];
            break;
          case 'program':
            // Program change
            let select = doc.createElement('select');
            select.className = 'form-control form-control-sm';

            item.appendChild(select);

            select.addEventListener('change', (function (synth, channel) {
              return function (event) {
                synth.programChange(channel, event.target.value);
              };
            })(this, ch), false);

            select.selectedIndex = this.channelInstrument[i];
            break;
          case 'volume':
            item.innerText = 100;
          case 'pitchBendSensitivity':
            item.innerText = 2;
            break;
          case 'panpot':
            let panpot = doc.createElement('meter');
            panpot.min = 0;
            panpot.max = 127;
            panpot.value = 64;
            item.appendChild(panpot);
            break;
          case 'pitchBend':
            let pitch = doc.createElement('meter');
            pitch.min = -8192;
            pitch.max = 8192;
            pitch.value = 0;
            item.appendChild(pitch);
            break;
          case 'keys':
            for (let j = 0; j < 127; j++) {
              let keyElem = doc.createElement('div');
              let n = j % 12;
              keyElem.className = 'key ' + ([1, 3, 6, 8, 10].includes(n) ? 'semitone' : 'tone');
              item.appendChild(keyElem);
              keyElem.addEventListener('mousedown', (function (synth, channel, key) {
                return function (event) {
                  event.preventDefault();
                  synth.drag = true;
                  synth.noteOn(channel, key, 127);
                };
              })(this, ch, j));
              keyElem.addEventListener('mouseover', (function (synth, channel, key) {
                return function (event) {
                  event.preventDefault();
                  if (synth.drag) {
                    synth.noteOn(channel, key, 127);
                  }
                };
              })(this, ch, j));
              keyElem.addEventListener('mouseout', (function (synth, channel, key) {
                return function (event) {
                  event.preventDefault();
                  synth.noteOff(channel, key, 0);
                };
              })(this, ch, j));
              keyElem.addEventListener('mouseup', (function (synth, channel, key) {
                return function (event) {
                  event.preventDefault();
                  synth.drag = false;
                  synth.noteOff(channel, key, 0);
                };
              })(this, ch, j));
            }
            break;
        }
        channel.appendChild(item);
      }
      instElem.appendChild(channel);
    }
    wrapper.appendChild(instElem);
    return wrapper;
  }

  /**
   * @param {number} channel NoteOn するチャンネル.
   * @param {number} key NoteOn するキー.
   * @param {number} velocity 強さ.
   */
  noteOn(channel, key, velocity) {
    /** @type {number} */
    var bankIndex = this.channelBank[channel];
    /** @type {Object} */
    var bank = (typeof this.bankSet[bankIndex] === 'object') ? this.bankSet[bankIndex] : this.bankSet[0];
    /** @type {Object} */
    var instrument = (typeof bank[this.channelInstrument[channel]] === 'object') ?
      bank[this.channelInstrument[channel]] : this.bankSet[0][this.channelInstrument[channel]];
    /** @type {Object} */
    var instrumentKey;
    /** @type {SynthesizerNote} */
    var note;

    if (instrument === void 0) {
      if (bankIndex < 125) {
        // 通常の音源の場合、バンク0の音を鳴らす
        instrument = this.bankSet[0][this.channelInstrument[channel]];
      } else {
        // パーカッション音源の場合1番目の楽器（Standard Kit）を鳴らす
        instrument = this.bankSet[bankIndex][0];
      }
    }

    if (instrument[key] === void 0) {
      // TODO
      console.warn(
        "instrument not found: bank=%s instrument=%s channel=%s key=%s",
        bankIndex,
        this.channelInstrument[channel],
        channel,
        key
      );
      return;
    }
    instrumentKey = instrument[key];

    var panpot = this.channelPanpot[channel] - 64;
    panpot /= panpot < 0 ? 64 : 63;

    // create note information
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

    // percussion
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
    }

    // note on
    note = new _sound_font_synth_note__WEBPACK_IMPORTED_MODULE_0__["default"](this.ctx, this.gainMaster, instrumentKey);
    note.noteOn();
    this.currentNoteOn[channel].push(note);

    this.updateSynthElement(channel, key, velocity);
  };

  /**
   * @param {number} channel NoteOff するチャンネル.
   * @param {number} key NoteOff するキー.
   * @param {number} velocity 強さ.
   */
  noteOff(channel, key, velocity) {
    /** @type {number} */
    var bankIndex = this.channelBank[channel];
    /** @type {Object} */
    var bank = this.bankSet[bankIndex];
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;
    /** @type {Array.<SoundFont.SynthesizerNote>} */
    var currentNoteOn = this.currentNoteOn[channel];
    /** @type {SoundFont.SynthesizerNote} */
    var note;
    /** @type {boolean} */
    var hold = this.channelHold[channel];

    for (i = 0, il = currentNoteOn.length; i < il; ++i) {
      note = currentNoteOn[i];
      if (note.key === key) {
        note.noteOff();
        // hold している時は NoteOff にはするがリリースはしない
        if (!hold) {
          note.release();
          currentNoteOn.splice(i, 1);
          --i;
          --il;
        }
      }
    }
    this.updateSynthElement(channel, key, 0);
  };

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
    const channelElement = this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ')');
    /** @type {HTMLDivElement} */
    const keyElement = channelElement.querySelector('.key:nth-child(' + (key + 1) + ')');

    if (velocity === 0) {
      keyElement.classList.remove('note-on');
      //keyElem.style.opacity = 1;
    } else {
      keyElement.classList.add('note-on');
      //keyElem.style.opacity = (velocity / 127).toFixed(2);
    }

    if (this.channelHold[channel]) {
      channelElement.classList.add('hold');
    } else {
      channelElement.classList.remove('hold');
    }
  }

  /**
   * @param {number} channel ホールドするチャンネル
   * @param {number} value 値
   */
  hold(channel, value) {
    /** @type {Array.<SoundFont.SynthesizerNote>} */
    var currentNoteOn = this.currentNoteOn[channel];
    /** @type {boolean} */
    var hold = this.channelHold[channel] = !(value < 64);
    /** @type {SoundFont.SynthesizerNote} */
    var note;
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;
    /** @type {HTMLDivElement} */
    var holdChannel;

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
  }

  /**
   * @param {number} channel チャンネルのバンクセレクトMSB
   * @param {number} value 値
   */
  bankSelectMsb(channel, value) {
    if (this.isXG) {
      // XG音源は、MSB→LSBの優先順でバンクセレクトをする。

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
      this.channelBank[channel] = value;
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
    if (!this.isXG || this.percussionPart[channel] === true) {
      return;
    }

    // 125より値が大きい場合、パーカッションとして処理
    this.percussionPart[channel] = value >= 125;

    this.channelBank[channel] = value;
    this.updateBankSelect(channel);
  };

  updateBankSelect(channel) {
    if (!this.element) {
      return;
    }
    const bankElement = this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') .bank > select');

    while (bankElement.firstChild) bankElement.removeChild(bankElement.firstChild);

    for (let bankNo in this.programSet) {
      let option = document.createElement('option');
      option.value = bankNo;
      option.textContent = ('000' + (parseInt(bankNo))).slice(-3);
      bankElement.appendChild(option);
    }
  }

  updateProgramSelect(channel) {
    if (!this.element) {
      return;
    }
    /** @type {number} */
    var bankIndex = this.channelBank[channel];

    const bankElement = this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') .bank > select');
    const programElement = this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') .program > select');

    bankElement.value = this.channelBank[channel];
    while (programElement.firstChild) programElement.removeChild(programElement.firstChild);

    for (let programNo in this.programSet[bankIndex]) {
      let option = document.createElement('option');
      option.value = programNo;
      option.textContent = ('000' + (parseInt(programNo) + 1)).slice(-3) + ':' + this.programSet[bankIndex][programNo];
      if (programNo === this.channelInstrument[channel]) {
        option.selected = 'selected';
      }
      programElement.appendChild(option);
    }
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
   * @param {number} instrument 音色番号.
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
    }

    // TODO: 厳密にはMIDI音源はプログラムチェンジがあったときにバンク・セレクトが反映される。
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
    var i;
    /** @type {number} */
    var il;
    /** @type {Array.<SynthesizerNote>} */
    var currentNoteOn = this.currentNoteOn[channel];

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
    var bend = (lowerByte & 0x7f) | ((higherByte & 0x7f) << 7);
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;
    /** @type {Array.<SoundFont.SynthesizerNote>} */
    var currentNoteOn = this.currentNoteOn[channel];
    /** @type {number} */
    var calculated = bend - 8192;

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
   * @param {number} atackTime
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
   * @param {number} channel pitch bend sensitivity を取得するチャンネル.
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
    var currentNoteOn = this.currentNoteOn[channel];

    // ホールドを解除
    this.hold(channel, 0);

    // 再生中の音をすべて止める
    while (currentNoteOn.length > 0) {
      this.noteOff(channel, currentNoteOn[0].key, 0);
    }
  }

  /**
   * @param {number} channel 音を消すチャンネル.
   */
  allSoundOff(channel) {
    /** @type {Array.<SynthesizerNote>} */
    var currentNoteOn = this.currentNoteOn[channel];
    /** @type {SynthesizerNote} */
    var note;

    while (currentNoteOn.length > 0) {
      note = currentNoteOn.shift();
      this.noteOff(channel, note.key, 0);
      note.release();
      note.disconnect();
    }

    // ホールドを解除
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
    var currentNoteOn = this.currentNoteOn[channel];
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;

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
   * @constructor
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

  noteOn() {
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
    //  console.log(this.sampleRate, 'Hz');
    //  filter.frequency.value = (cutOffFrequency / this.sampleRate) * 100000;	// Brightness = 0 ~ 127  64 = 350 / LPF 100~20000
    //  console.log('Brightness:', cutOffFrequency, ' = ', filter.frequency.value, 'Hz');
    //  filter.Q.value = harmonicContent < 0 ? 0 : harmonicContent - 64 ;	// Resonance 0 ~ 127 / Q = 0~50
    //  console.log('Resonance:', harmonicContent, ' = ', filter.Q.value);

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
  amountToFreq(val) {
    return Math.pow(2, (val - 6900) / 1200) * 440;
  };

  noteOff() {
    this.noteOffState = true;
  };

  isNoteOff() {
    return this.noteOffState;
  };

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
        console.log('detect unused sampleModes');
        break;
      case 3:
        bufferSource.loop = false;
        break;
    }
  };

  connect() {
    this.gainOutput.connect(this.destination);
  };

  disconnect() {
    this.gainOutput.disconnect(0);
  };

  schedulePlaybackRate() {
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

  updateExpression(expression) {
    //this.expressionGain.gain.value = (this.expression = expression) / 127;
    this.expressionGain.gain.setTargetAtTime((this.expression = expression) / 127, this.ctx.currentTime, 0.015);
  };

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
/* harmony import */ var _sound_font_synth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sound_font_synth */ "./src/sound_font_synth.js");


class WebMidiLink {
  /**
   * @constructor
   */
  constructor(option) {
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
    /** @type {SoundFont.Synthesizer} */
    this.synth;
    /** @type {function(ArrayBuffer)} */
    this.loadCallback = function (x) { };
    /** @type {Function} */
    this.messageHandler = this.onmessage.bind(this);
    /** @type {XMLHttpRequest} */
    this.xhr;
    /** @type {boolean} */
    this.rpnMode = true;
    /** @type {Object} */
    this.option = option || {};
    /** @type {boolean} */
    this.disableDrawSynth = option.disableDrawSynth !== void 0;
    /** @type {boolean} */
    this.cache = option.cache !== void 0;
    /** @type {Window} */
    this.opener;

    this.placeholder = option.placeholder !== void 0 ? document.getElementById(option.placeholder) : window.document.body

    window.addEventListener('DOMContentLoaded', function () {
      this.ready = true;
    }.bind(this), false);
  };

  setup(url) {
    /** @type {Window} */
    var w = window;

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

  };

  load(url) {
    /** @type {Window} */
    var opener = window.opener ? window.opener : window.parent;
    /** @type {SoundFOnt.WebMidiLink} */
    var self = this;
    /** @type {HTMLProgressElement} */
    var progress = this.placeholder.appendChild(document.createElement('progress'));
    /** @type {HTMLOutputElement} */
    var percentage = progress.parentNode.insertBefore(document.createElement('outpout'), progress.nextElementSibling);
    //this.cancelLoading();

    opener.postMessage("link,progress", '*');

    window.caches.open('wml').then(cache => {
      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        cache.put(url, response);
        console.info('cached');
      }).catch(error => {
        console.error('There has been a problem with your fetch operation: ', error.message);
      });
      cache.match(url).then(response => {
        response.arrayBuffer().then(stream => {
          self.placeholder.removeChild(progress);
          self.placeholder.removeChild(percentage);
          self.onload(stream);
          if (typeof self.loadCallback === 'function') {
            self.loadCallback(stream);
          }
          opener.postMessage("link,ready", '*');
        }).catch(error => {
          console.error('Cache API error: ', error.message);
        });
      });
    });

    /*
    fetch(url).then((res) => {
        // 全体サイズ
        const total = res.headers.get('content-length');
        progress.max = total;

        // body の reader を取得する
        let reader = res.body.getReader();
        let chunk = 0;
        let buffer = [];

        function concatenation(segments) {
            var sumLength = 0;
            for (var i = 0; i < segments.length; ++i) {
                sumLength += segments[i].byteLength;
            }
            var whole = new Uint8Array(sumLength);
            var pos = 0;
            for (var i = 0; i < segments.length; ++i) {
                whole.set(new Uint8Array(segments[i]), pos);
                pos += segments[i].byteLength;
            }
            return whole.buffer;
        }

        reader.read().then(function processResult(result) {
            // done が true なら最後の chunk
            if (result.done) {
                self.loadCallback(buffer);
                return;
            }

            // chunk の長さの蓄積を total で割れば進捗が分かる
            chunk += result.value.length;
            buffer.push(result.value);
            // 進捗を更新
            progress.value = chunk;
            percentage.innerText = Math.round((chunk / total) * 100) + ' %';
            opener.postMessage('link,progress,' + chunk + ',' + total, '*');

            // 再帰する
            return reader.read().then(processResult);
        });
    });
    */
  };
  setReverb(reverb) {
    this.synth.setReverb(reverb);
  };

  cancelLoading() {
    //if (this.xhr) {
    //    this.xhr.abort();
    //    this.xhr = null;
    //}
  };

  /**
   * @param {ArrayBuffer} response
   */
  onload(response) {
    /** @type {Uint8Array} */
    var input = new Uint8Array(response);

    this.loadSoundFont(input);
  };

  /**
   * @param {Uint8Array} input
   */
  loadSoundFont(input) {
    /** @type {Synthesizer} */
    var synth;
    var w = window;

    this.cancelLoading();

    if (!this.synth) {
      synth = this.synth = new _sound_font_synth__WEBPACK_IMPORTED_MODULE_0__["default"](input);
      if (!this.disableDrawSynth) {
        this.placeholder.appendChild(synth.drawSynth());
      }
      synth.init();
      synth.start();
      w.addEventListener('message', this.messageHandler, false);
    } else {
      synth = this.synth;
      synth.refreshInstruments(input);
    }

    // link ready
    w.postMessage("link,ready", '*');
  };

  /**
   * @param {Event} ev
   */
  onmessage(ev) {
    /** @type {Array} */
    var msg = typeof ev.data.split === 'function' ? ev.data.split(',') : [];
    /** @type {string} */
    var type = msg !== [] ? msg.shift() : '';
    /** @type {Window} */
    var opener = window.opener ? window.opener : window.parent;
    /** @type {string} */
    var command;

    switch (type) {
      case 'midi':
        this.processMidiMessage(
          msg.map(function (hex) {
            return parseInt(hex, 16);
          })
        );
        break;
      case 'link':
        if (opener === void 0) {
          return;
        }
        command = msg.shift();
        switch (command) {
          case 'reqpatch':
            // TODO: dummy data
            opener.postMessage("link,patch", '*');
            break;
          case 'setpatch':
          case 'ready':
            opener.postMessage("link,ready", '*');
            // TODO: NOP
            break;
          case 'progress':
            opener.postMessage("link,progress", '*');
            break;
          default:
            console.error('unknown link message:', command);
            break;
        }
        break;
      default:
      // console.error('unknown message type');
    }
  };

  /**
   * @param {function(ArrayBuffer)} callback
   */
  setLoadCallback(callback) {
    this.loadCallback = callback;
  };

  /**
   * @param {Array.<number>} message
   */
  processMidiMessage(message) {
    /** @type {number} */
    var channel = message[0] & 0x0f;
    /** @type {Synthesizer} */
    var synth = this.synth;

    switch (message[0] & 0xf0) {
      case 0x80: // NoteOff: 8n kk vv
        synth.noteOff(channel, message[1], message[2]);
        break;
      case 0x90: // NoteOn: 9n kk vv
        if (message[2] > 0) {
          synth.noteOn(channel, message[1], message[2]);
        } else {
          synth.noteOff(channel, message[1], 0);
        }
        break;
      case 0xB0: // Control Change: Bn cc dd
        /** @type {number} */
        var value = message[2];
        switch (message[1]) {
          case 0x00: // Bank Select MSB: Bn 00 dd
            synth.bankSelectMsb(channel, value);
            break;
          case 0x01: // Modulation
            break;
          case 0x06: // Data Entry(MSB): Bn 06 dd
            if (this.rpnMode) {
              // RPN
              switch (this.RpnMsb[channel]) {
                case 0:
                  switch (this.RpnLsb[channel]) {
                    case 0: // Pitch Bend Sensitivity
                      synth.pitchBendSensitivity(channel, value);
                      break;
                    case 1:
                      //console.log("fine");
                      break;
                    case 2:
                      //console.log("coarse");
                      break;
                    default:
                      //console.log("default");
                      break;
                  }
                  break;
                default:
                  //console.log("default:", this.RpnMsb[channel], this.RpnLsb[channel]);
                  break;
              }
            } else {
              // NRPN
              switch (this.NrpnMsb[channel]) {
                case 26: // Drum Instrument Level
                  synth.drumInstrumentLevel(this.NrpnLsb[channel], value);
                  break;
                default:
                  //console.log("default:", this.RpnMsb[channel], this.RpnLsb[channel]);
                  break;
              }
            }
            break;
          case 0x26: // Data Entry(LSB): Bn 26 dd
            if (this.rpnMode) {
              // RPN
              switch (this.RpnMsb[channel]) {
                case 0:
                  switch (this.RpnLsb[channel]) {
                    case 0: // Pitch Bend Sensitivity
                      synth.pitchBendSensitivity(
                        channel,
                        synth.getPitchBendSensitivity(channel) + value / 100
                      );
                      break;
                    case 1:
                      //console.log("fine");
                      break;
                    case 2:
                      //console.log("coarse");
                      break;
                  }
                  break;
              }
            }
            // NRPN で LSB が必要なものは今のところない
            break;
          case 0x07: // Volume Change: Bn 07 dd
            synth.volumeChange(channel, value);
            break;
          case 0x0A: // Panpot Change: Bn 0A dd
            synth.panpotChange(channel, value);
            break;
          case 0x78: // All Sound Off: Bn 78 00
            synth.allSoundOff(channel);
            break;
          case 0x79: // Reset All Control: Bn 79 00
            synth.resetAllControl(channel);
            break;
          case 0x20: // BankSelect LSB: Bn 00 dd
            synth.bankSelectLsb(channel, value);
            break;
          case 0x47: // Harmonic Content
            synth.harmonicContent(channel, value);
            break;
          case 0x60: //
            //console.log(60);
            break;
          case 0x61: //
            //console.log(61);
            break;
          case 0x62: // NRPN LSB
            this.rpnMode = false;
            this.NrpnLsb[channel] = value;
            break;
          case 0x63: // NRPN MSB
            this.rpnMode = false;
            this.NrpnMsb[channel] = value;
            break;
          case 0x64: // RPN LSB
            this.rpnMode = true;
            this.RpnLsb[channel] = value;
            break;
          case 0x65: // RPN MSB
            this.rpnMode = true;
            this.RpnMsb[channel] = value;
            break;
          case 0x40: // Hold
            synth.hold(channel, value);
            break;
          case 0x0b: // Expression
            synth.expression(channel, value);
            break;
          case 0x47: // Cutoff Fequency (Brightness)
            synth.cutOffFrequency[channel] = value;
            break;
          case 0x48: // DecayTyme
            synth.decayTime(channel, value);
            break;
          case 0x49: // ReleaseTime
            synth.releaseTime(channel, value);
            break;
          case 0x4A: // Attack time 
            synth.attackTime(channel, value);
            break;
          case 0x4B: // Brightness
            synth.cutOffFrequency(channel, value);
            break;
          case 0x5B: // Effect1 Depth（Reverb Send Level）
            synth.reverbDepth(channel, value);
            break;
          default:
            // not supported
            break;
        }
        break;
      case 0xC0: // Program Change: Cn pp
        synth.programChange(channel, message[1]);
        break;
      case 0xE0: // Pitch Bend
        synth.pitchBend(channel, message[1], message[2]);
        break;
      case 0xf0: // System Exclusive Message
        // ID number
        switch (message[1]) {
          case 0x7e: // non-realtime
            // TODO
            // GM Reset: F0 7E 7F 09 01 F7
            if (message[2] === 0x7f && message[3] === 0x09 && message[4] === 0x01) {
              synth.init('GM');
            }
            break;
          case 0x7f: // realtime
            var device = message[2];
            // sub ID 1
            switch (message[3]) {
              case 0x04: // device control
                // sub ID 2
                switch (message[4]) {
                  case 0x01: // master volume: F0 7F 7F 04 01 [value] [value] F7
                    synth.setMasterVolume(message[5] + (message[6] << 7));
                    break;
                }
                break;
            }
            break;
        }

        // Vendor
        switch (message[2]) {
          case 0x43: // Yamaha XG
            if (message[5] === 0x08) {
              // XG Dram Part: F0 43 [dev] 4C 08 [partNum] 07 [map] F7
              // but there is no file to use much this parameter...
              if (message[7] !== 0x00) { // [map]
                synth.setPercussionPart(message[6], true);
              } else {
                synth.setPercussionPart(message[6], false);
              }
              //console.log(message);
            }
            switch (message[7]) {
              case 0x04:
                // XG Master Volume: F0 43 [dev] 4C 00 00 04 [value] F7
                synth.setMasterVolume((message[8] << 7) * 2);
                //console.log(message[8] << 7);
                break;
              case 0x7E:
                // XG Reset: F0 43 [dev] 4C 00 00 7E 00 F7
                synth.init('XG');
                console.log('XG Reset');
                break;
            }
            break;
          case 0x41: // Roland GS / TG300B Mode
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

                var part = message[7] - 0x0F;
                var map = message[8];
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
      default: // not supported
        synth.setPercussionPart(9, true);
        break;
    }
  };
}

/* harmony default export */ __webpack_exports__["default"] = (WebMidiLink);

/***/ })

/******/ });
});
//# sourceMappingURL=sf2.synth.js.map
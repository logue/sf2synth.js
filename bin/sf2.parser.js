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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/sf2.js");
/******/ })
/************************************************************************/
/******/ ({

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

/***/ })

/******/ });
});
//# sourceMappingURL=sf2.parser.js.map
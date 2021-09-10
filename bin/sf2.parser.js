/*! @logue/sf2synth v0.3.5 | imaya / GREE Inc. / Logue | license: MIT | build: 2021-09-10T11:16:58.607Z */
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
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/riff.js":
/*!*********************!*\
  !*** ./src/riff.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Riff)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Riff Parser class
 * @private
 */
var Riff = /*#__PURE__*/function () {
  /**
   * @param {ByteArray} input input buffer.
   * @param {Object=} optParams option parameters.
   */
  function Riff(input) {
    var optParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Riff);

    /** @type {ByteArray} */
    this.input = input;
    /** @type {number} */

    this.ip = optParams.index || 0;
    /** @type {number} */

    this.length = optParams.length || input.length - this.ip;
    /** @type {Array.<RiffChunk>} */

    this.chunkList = [];
    /** @type {number} */

    this.offset = this.ip;
    /** @type {boolean} */

    this.padding = optParams.padding !== void 0 ? optParams.padding : true;
    /** @type {boolean} */

    this.bigEndian = optParams.bigEndian !== void 0 ? optParams.bigEndian : false;
  }
  /**
   */


  _createClass(Riff, [{
    key: "parse",
    value: function parse() {
      /** @type {number} */
      var length = this.length + this.offset;
      this.chunkList = [];

      while (this.ip < length) {
        this.parseChunk();
      }
    }
    /**
     */

  }, {
    key: "parseChunk",
    value: function parseChunk() {
      /** @type {ByteArray} */
      var input = this.input;
      /** @type {number} */

      var ip = this.ip;
      /** @type {number} */

      var size;
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

  }, {
    key: "getChunk",
    value: function getChunk(index) {
      /** @type {RiffChunk} */
      var chunk = this.chunkList[index];

      if (chunk === void 0) {
        return null;
      }

      return chunk;
    }
    /**
     * @return {number}
     */

  }, {
    key: "getNumberOfChunks",
    value: function getNumberOfChunks() {
      return this.chunkList.length;
    }
  }]);

  return Riff;
}();
/**
 * Riff Chunk Structure
 * @interface
 */




var RiffChunk =
/**
 * @param {string} type
 * @param {number} size
 * @param {number} offset
 */
function RiffChunk(type, size, offset) {
  _classCallCheck(this, RiffChunk);

  /** @type {string} */
  this.type = type;
  /** @type {number} */

  this.size = size;
  /** @type {number} */

  this.offset = offset;
};

/***/ }),

/***/ "./src/sf2.js":
/*!********************!*\
  !*** ./src/sf2.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Parser": () => (/* binding */ Parser),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _riff_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./riff.js */ "./src/riff.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


/**
 * SoundFont Parser Class
 */

var Parser = /*#__PURE__*/function () {
  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  function Parser(input) {
    var optParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Parser);

    /** @type {ByteArray} */
    this.input = input;
    /** @type {(Object|undefined)} */

    this.parserOption = optParams.parserOption || {};
    /** @type {(Number|undefined)} */

    this.sampleRate = optParams.sampleRate || 22050; // よくわからんが、OSで指定されているサンプルレートを入れないと音が切れ切れになる。

    /** @type {Array.<Object>} */

    this.presetHeader = [];
    /** @type {Array.<Object>} */

    this.presetZone = [];
    /** @type {Array.<Object>} */

    this.presetZoneModulator = [];
    /** @type {Array.<Object>} */

    this.presetZoneGenerator = [];
    /** @type {Array.<Object>} */

    this.instrument = [];
    /** @type {Array.<Object>} */

    this.instrumentZone = [];
    /** @type {Array.<Object>} */

    this.instrumentZoneModulator = [];
    /** @type {Array.<Object>} */

    this.instrumentZoneGenerator = [];
    /** @type {Array.<Object>} */

    this.sampleHeader = [];
    /**
     * @type {Array.<string>}
     * @const
     */
    // eslint-disable-next-line no-sparse-arrays

    this.GeneratorEnumeratorTable = [// 14
      // 18,19,20
      // 42
      // 49
      // 55
    'startAddrsOffset', 'endAddrsOffset', 'startloopAddrsOffset', 'endloopAddrsOffset', 'startAddrsCoarseOffset', 'modLfoToPitch', 'vibLfoToPitch', 'modEnvToPitch', 'initialFilterFc', 'initialFilterQ', 'modLfoToFilterFc', 'modEnvToFilterFc', 'endAddrsCoarseOffset', 'modLfoToVolume',, 'chorusEffectsSend', 'reverbEffectsSend', 'pan',,,, 'delayModLFO', 'freqModLFO', 'delayVibLFO', 'freqVibLFO', 'delayModEnv', 'attackModEnv', 'holdModEnv', 'decayModEnv', 'sustainModEnv', 'releaseModEnv', 'keynumToModEnvHold', 'keynumToModEnvDecay', 'delayVolEnv', 'attackVolEnv', 'holdVolEnv', 'decayVolEnv', 'sustainVolEnv', 'releaseVolEnv', 'keynumToVolEnvHold', 'keynumToVolEnvDecay', 'instrument',, 'keyRange', 'velRange', 'startloopAddrsCoarseOffset', 'keynum', 'velocity', 'initialAttenuation',, 'endloopAddrsCoarseOffset', 'coarseTune', 'fineTune', 'sampleID', 'sampleModes',, 'scaleTuning', 'exclusiveClass', 'overridingRootKey', // 59
    'endOper'];
  }
  /** @export */


  _createClass(Parser, [{
    key: "parse",
    value: function parse() {
      /** @type {Riff} */
      var parser = new _riff_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.input, this.parserOption); // parse RIFF chunk

      parser.parse();

      if (parser.chunkList.length !== 1) {
        throw new Error('wrong chunk length');
      }
      /** @type {?RiffChunk} */


      var chunk = parser.getChunk(0);

      if (chunk === null) {
        throw new Error('chunk not found');
      }

      this.parseRiffChunk(chunk); // console.log(this.sampleHeader);

      this.input = null;
    }
    /**
     * @param {RiffChunk} chunk
     */

  }, {
    key: "parseRiffChunk",
    value: function parseRiffChunk(chunk) {
      /** @type {ByteArray} */
      var data = this.input;
      /** @type {number} */

      var ip = chunk.offset; // check parse target

      if (chunk.type !== 'RIFF') {
        throw new Error('invalid chunk type:' + chunk.type);
      } // check signature

      /** @type {string} */


      var signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);

      if (signature !== 'sfbk') {
        throw new Error('invalid signature:' + signature);
      } // read structure

      /** @type {Riff} */


      var parser = new _riff_js__WEBPACK_IMPORTED_MODULE_0__["default"](data, {
        index: ip,
        length: chunk.size - 4
      });
      parser.parse();

      if (parser.getNumberOfChunks() !== 3) {
        throw new Error('invalid sfbk structure');
      } // INFO-list


      this.parseInfoList(parser.getChunk(0)); // sdta-list

      this.parseSdtaList(parser.getChunk(1)); // pdta-list

      this.parsePdtaList(parser.getChunk(2));
    }
    /**
     * @param {RiffChunk} chunk
     */

  }, {
    key: "parseInfoList",
    value: function parseInfoList(chunk) {
      /** @type {ByteArray} */
      var data = this.input;
      /** @type {number} */

      var ip = chunk.offset; // check parse target

      if (chunk.type !== 'LIST') {
        throw new Error('invalid chunk type:' + chunk.type);
      } // check signature

      /** @type {string} */


      var signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);

      if (signature !== 'INFO') {
        throw new Error('invalid signature:' + signature);
      } // read structure

      /** @type {Riff} */


      var parser = new _riff_js__WEBPACK_IMPORTED_MODULE_0__["default"](data, {
        index: ip,
        length: chunk.size - 4
      });
      parser.parse();
    }
    /**
     * @param {RiffChunk} chunk
     */

  }, {
    key: "parseSdtaList",
    value: function parseSdtaList(chunk) {
      /** @type {ByteArray} */
      var data = this.input;
      /** @type {number} */

      var ip = chunk.offset; // check parse target

      if (chunk.type !== 'LIST') {
        throw new Error('invalid chunk type:' + chunk.type);
      } // check signature

      /** @type {string} */


      var signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);

      if (signature !== 'sdta') {
        throw new Error('invalid signature:' + signature);
      } // read structure

      /** @type {Riff} */


      var parser = new _riff_js__WEBPACK_IMPORTED_MODULE_0__["default"](data, {
        index: ip,
        length: chunk.size - 4
      });
      parser.parse();

      if (parser.chunkList.length !== 1) {
        throw new Error('TODO');
      }

      this.samplingData = parser.getChunk(0);
    }
    /**
     * @param {RiffChunk} chunk
     */

  }, {
    key: "parsePdtaList",
    value: function parsePdtaList(chunk) {
      /** @type {ByteArray} */
      var data = this.input;
      /** @type {number} */

      var ip = chunk.offset; // check parse target

      if (chunk.type !== 'LIST') {
        throw new Error('invalid chunk type:' + chunk.type);
      } // check signature

      /** @type {string} */


      var signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);

      if (signature !== 'pdta') {
        throw new Error('invalid signature:' + signature);
      } // read structure

      /** @type {Riff} */


      var parser = new _riff_js__WEBPACK_IMPORTED_MODULE_0__["default"](data, {
        index: ip,
        length: chunk.size - 4
      });
      parser.parse(); // check number of chunks

      if (parser.getNumberOfChunks() !== 9) {
        throw new Error('invalid pdta chunk');
      }

      this.parsePhdr(parser.getChunk(0));
      this.parsePbag(parser.getChunk(1));
      this.parsePmod(parser.getChunk(2));
      this.parsePgen(parser.getChunk(3));
      this.parseInst(parser.getChunk(4));
      this.parseIbag(parser.getChunk(5));
      this.parseImod(parser.getChunk(6));
      this.parseIgen(parser.getChunk(7));
      this.parseShdr(parser.getChunk(8));
    }
    /**
     * @param {RiffChunk} chunk
     */

  }, {
    key: "parsePhdr",
    value: function parsePhdr(chunk) {
      /** @type {ByteArray} */
      var data = this.input;
      /** @type {number} */

      var ip = chunk.offset;
      /** @type {Array.<Object>} */

      var presetHeader = this.presetHeader = [];
      /** @type {number} */

      var size = chunk.offset + chunk.size; // check parse target

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

  }, {
    key: "parsePbag",
    value: function parsePbag(chunk) {
      /** @type {ByteArray} */
      var data = this.input;
      /** @type {number} */

      var ip = chunk.offset;
      /** @type {Array.<Object>} */

      var presetZone = this.presetZone = [];
      /** @type {number} */

      var size = chunk.offset + chunk.size; // check parse target

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

  }, {
    key: "parsePmod",
    value: function parsePmod(chunk) {
      // check parse target
      if (chunk.type !== 'pmod') {
        throw new Error('invalid chunk type:' + chunk.type);
      }

      this.presetZoneModulator = this.parseModulator(chunk);
    }
    /**
     * @param {RiffChunk} chunk
     */

  }, {
    key: "parsePgen",
    value: function parsePgen(chunk) {
      // check parse target
      if (chunk.type !== 'pgen') {
        throw new Error('invalid chunk type:' + chunk.type);
      }

      this.presetZoneGenerator = this.parseGenerator(chunk);
    }
    /**
     * @param {RiffChunk} chunk
     */

  }, {
    key: "parseInst",
    value: function parseInst(chunk) {
      /** @type {ByteArray} */
      var data = this.input;
      /** @type {number} */

      var ip = chunk.offset;
      /** @type {Array.<Object>} */

      var instrument = this.instrument = [];
      /** @type {number} */

      var size = chunk.offset + chunk.size; // check parse target

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

  }, {
    key: "parseIbag",
    value: function parseIbag(chunk) {
      /** @type {ByteArray} */
      var data = this.input;
      /** @type {number} */

      var ip = chunk.offset;
      /** @type {Array.<Object>} */

      var instrumentZone = this.instrumentZone = [];
      /** @type {number} */

      var size = chunk.offset + chunk.size; // check parse target

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

  }, {
    key: "parseImod",
    value: function parseImod(chunk) {
      // check parse target
      if (chunk.type !== 'imod') {
        throw new Error('invalid chunk type:' + chunk.type);
      }

      this.instrumentZoneModulator = this.parseModulator(chunk);
    }
    /**
     * @param {RiffChunk} chunk
     */

  }, {
    key: "parseIgen",
    value: function parseIgen(chunk) {
      // check parse target
      if (chunk.type !== 'igen') {
        throw new Error('invalid chunk type:' + chunk.type);
      }

      this.instrumentZoneGenerator = this.parseGenerator(chunk);
    }
    /**
     * @param {RiffChunk} chunk
     */

  }, {
    key: "parseShdr",
    value: function parseShdr(chunk) {
      /** @type {ByteArray} */
      var data = this.input;
      /** @type {number} */

      var ip = chunk.offset;
      /** @type {Array.<Object>} */

      var samples = this.sample = [];
      /** @type {Array.<Object>} */

      var sampleHeader = this.sampleHeader = [];
      /** @type {number} */

      var size = chunk.offset + chunk.size;
      /** @type {string} */

      var sampleName;
      /** @type {number} */

      var start;
      /** @type {number} */

      var end;
      /** @type {number} */

      var startLoop;
      /** @type {number} */

      var endLoop;
      /** @type {number} */

      var sampleRate;
      /** @type {number} */

      var originalPitch;
      /** @type {number} */

      var pitchCorrection;
      /** @type {number} */

      var sampleLink;
      /** @type {number} */

      var sampleType; // check parse target

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
        var sample = new Int16Array(new Uint8Array(data.subarray(this.samplingData.offset + start * 2, this.samplingData.offset + end * 2)).buffer);
        startLoop -= start;
        endLoop -= start;

        if (sampleRate > 0) {
          var adjust = this.adjustSampleData(sample, sampleRate);
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

  }, {
    key: "adjustSampleData",
    value: function adjustSampleData(sample, sampleRate) {
      /** @type {Int16Array} */
      var newSample;
      /** @type {number} */

      var i;
      /** @type {number} */

      var il;
      /** @type {number} */

      var j;
      /** @type {number} */

      var multiply = 1; // buffer

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

  }, {
    key: "parseModulator",
    value: function parseModulator(chunk) {
      /** @type {ByteArray} */
      var data = this.input;
      /** @type {number} */

      var ip = chunk.offset;
      /** @type {number} */

      var size = chunk.offset + chunk.size;
      /** @type {number} */

      var code;
      /** @type {string} */

      var key;
      /** @type {Array.<Object>} */

      var output = [];

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

  }, {
    key: "parseGenerator",
    value: function parseGenerator(chunk) {
      /** @type {ByteArray} */
      var data = this.input;
      /** @type {number} */

      var ip = chunk.offset;
      /** @type {number} */

      var size = chunk.offset + chunk.size;
      /** @type {number} */

      var code;
      /** @type {string} */

      var key;
      /** @type {Array.<Object>} */

      var output = [];

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

  }, {
    key: "createInstrument",
    value: function createInstrument() {
      /** @type {Array.<Object>} */
      var instrument = this.instrument;
      /** @type {Array.<Object>} */

      var zone = this.instrumentZone;
      /** @type {Array.<Object>} */

      var output = [];
      /** @type {number} */

      var bagIndex;
      /** @type {number} */

      var bagIndexEnd;
      /** @type {Array.<Object>} */

      var zoneInfo;
      /** @type {{generator: Object, generatorInfo: Array.<Object>}} */

      var instrumentGenerator;
      /** @type {{modulator: Object, modulatorInfo: Array.<Object>}} */

      var instrumentModulator;
      /** @type {number} */

      var i;
      /** @type {number} */

      var il;
      /** @type {number} */

      var j;
      /** @type {number} */

      var jl; // instrument -> instrument bag -> generator / modulator

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

  }, {
    key: "createPreset",
    value: function createPreset() {
      /** @type {Array.<Object>} */
      var preset = this.presetHeader;
      /** @type {Array.<Object>} */

      var zone = this.presetZone;
      /** @type {Array.<Object>} */

      var output = [];
      /** @type {number} */

      var bagIndex;
      /** @type {number} */

      var bagIndexEnd;
      /** @type {Array.<Object>} */

      var zoneInfo;
      /** @type {number} */

      var instrument;
      /** @type {{generator: Object, generatorInfo: Array.<Object>}} */

      var presetGenerator;
      /** @type {{modulator: Object, modulatorInfo: Array.<Object>}} */

      var presetModulator;
      /** @type {number} */

      var i;
      /** @type {number} */

      var il;
      /** @type {number} */

      var j;
      /** @type {number} */

      var jl; // preset -> preset bag -> generator / modulator

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

  }, {
    key: "createInstrumentGenerator_",
    value: function createInstrumentGenerator_(zone, index) {
      var modgen = this.createBagModGen_(zone, zone[index].instrumentGeneratorIndex, zone[index + 1] ? zone[index + 1].instrumentGeneratorIndex : this.instrumentZoneGenerator.length, this.instrumentZoneGenerator);
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

  }, {
    key: "createInstrumentModulator_",
    value: function createInstrumentModulator_(zone, index) {
      var modgen = this.createBagModGen_(zone, zone[index].presetModulatorIndex, zone[index + 1] ? zone[index + 1].instrumentModulatorIndex : this.instrumentZoneModulator.length, this.instrumentZoneModulator);
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

  }, {
    key: "createPresetGenerator_",
    value: function createPresetGenerator_(zone, index) {
      var modgen = this.createBagModGen_(zone, zone[index].presetGeneratorIndex, zone[index + 1] ? zone[index + 1].presetGeneratorIndex : this.presetZoneGenerator.length, this.presetZoneGenerator);
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

  }, {
    key: "createPresetModulator_",
    value: function createPresetModulator_(zone, index) {
      /** @type {{modgen: Object, modgenInfo: Array.<Object>}} */
      var modgen = this.createBagModGen_(zone, zone[index].presetModulatorIndex, zone[index + 1] ? zone[index + 1].presetModulatorIndex : this.presetZoneModulator.length, this.presetZoneModulator);
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

  }, {
    key: "createBagModGen_",
    value: function createBagModGen_(zone, indexStart, indexEnd, zoneModGen) {
      /** @type {Array.<Object>} */
      var modgenInfo = [];
      /** @type {Object} */

      var modgen = {
        unknown: [],
        keyRange: {
          hi: 127,
          lo: 0
        }
      }; // TODO

      /** @type {Object} */

      var info;
      /** @type {number} */

      var i;
      /** @type {number} */

      var il;

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
  }]);

  return Parser;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Parser);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("sf2_parser." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("e8057c4f65e9f20a2150")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "SoundFont:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises;
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 					blockingPromises.push(promise);
/******/ 					waitForBlockingPromises(function () {
/******/ 						return setStatus("ready");
/******/ 					});
/******/ 					return promise;
/******/ 				case "prepare":
/******/ 					blockingPromises.push(promise);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises.length === 0) return fn();
/******/ 			var blocker = blockingPromises;
/******/ 			blockingPromises = [];
/******/ 			return Promise.all(blocker).then(function () {
/******/ 				return waitForBlockingPromises(fn);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						blockingPromises = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error("apply() is only allowed in ready status");
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/css loading */
/******/ 	(() => {
/******/ 		var createStylesheet = (chunkId, fullhref, resolve, reject) => {
/******/ 			var linkTag = document.createElement("link");
/******/ 		
/******/ 			linkTag.rel = "stylesheet";
/******/ 			linkTag.type = "text/css";
/******/ 			var onLinkComplete = (event) => {
/******/ 				// avoid mem leaks.
/******/ 				linkTag.onerror = linkTag.onload = null;
/******/ 				if (event.type === 'load') {
/******/ 					resolve();
/******/ 				} else {
/******/ 					var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 					var realHref = event && event.target && event.target.href || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + realHref + ")");
/******/ 					err.code = "CSS_CHUNK_LOAD_FAILED";
/******/ 					err.type = errorType;
/******/ 					err.request = realHref;
/******/ 					linkTag.parentNode.removeChild(linkTag)
/******/ 					reject(err);
/******/ 				}
/******/ 			}
/******/ 			linkTag.onerror = linkTag.onload = onLinkComplete;
/******/ 			linkTag.href = fullhref;
/******/ 		
/******/ 			document.head.appendChild(linkTag);
/******/ 			return linkTag;
/******/ 		};
/******/ 		var findStylesheet = (href, fullhref) => {
/******/ 			var existingLinkTags = document.getElementsByTagName("link");
/******/ 			for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 				var tag = existingLinkTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 				if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
/******/ 			}
/******/ 			var existingStyleTags = document.getElementsByTagName("style");
/******/ 			for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 				var tag = existingStyleTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href");
/******/ 				if(dataHref === href || dataHref === fullhref) return tag;
/******/ 			}
/******/ 		};
/******/ 		var loadStylesheet = (chunkId) => {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				if(findStylesheet(href, fullhref)) return resolve();
/******/ 				createStylesheet(chunkId, fullhref, resolve, reject);
/******/ 			});
/******/ 		}
/******/ 		// no chunk loading
/******/ 		
/******/ 		var oldTags = [];
/******/ 		var newTags = [];
/******/ 		var applyHandler = (options) => {
/******/ 			return { dispose: () => {
/******/ 				for(var i = 0; i < oldTags.length; i++) {
/******/ 					var oldTag = oldTags[i];
/******/ 					if(oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);
/******/ 				}
/******/ 				oldTags.length = 0;
/******/ 			}, apply: () => {
/******/ 				for(var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";
/******/ 				newTags.length = 0;
/******/ 			} };
/******/ 		}
/******/ 		__webpack_require__.hmrC.miniCss = (chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList) => {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			chunkIds.forEach((chunkId) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				var oldTag = findStylesheet(href, fullhref);
/******/ 				if(!oldTag) return;
/******/ 				promises.push(new Promise((resolve, reject) => {
/******/ 					var tag = createStylesheet(chunkId, fullhref, () => {
/******/ 						tag.as = "style";
/******/ 						tag.rel = "preload";
/******/ 						resolve();
/******/ 					}, reject);
/******/ 					oldTags.push(oldTag);
/******/ 					newTags.push(tag);
/******/ 				}));
/******/ 			});
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			"sf2.parser": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId) {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		(typeof self !== 'undefined' ? self : this)["webpackHotUpdateSoundFont"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						!__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						__webpack_require__.o(installedChunks, chunkId) &&
/******/ 						installedChunks[chunkId] !== undefined
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("./src/sf2.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=sf2.parser.js.map
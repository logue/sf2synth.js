/*! @logue/sf2synth v0.3.9 | imaya / GREE Inc. / Logue | license: MIT | build: 2022-04-07T10:12:05.227Z */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("SoundFont", [], factory);
	else if(typeof exports === 'object')
		exports["SoundFont"] = factory();
	else
		root["SoundFont"] = factory();
})((typeof self !== 'undefined' ? self : this), () => {
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

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

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




var RiffChunk = /*#__PURE__*/_createClass(
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
});

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/sf2.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Parser)
/* harmony export */ });
/* harmony import */ var _riff_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./riff.js */ "./src/riff.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


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
    /** @type {Array.<string>} */

    this.GeneratorEnumeratorTable = Object.keys(this.getGeneratorTable());
  }
  /** @return {Object} ジェネレータとデフォルト値 */


  _createClass(Parser, [{
    key: "getGeneratorTable",
    value: function getGeneratorTable() {
      return Object.freeze({
        /** @type {number} サンプルヘッダの音声波形データ開始位置に加算されるオフセット(下位16bit） */
        startAddrsOffset: 0,

        /** @type {number} サンプルヘッダの音声波形データ終了位置に加算されるオフセット(下位16bit） */
        endAddrsOffset: 0,

        /** @type {number} サンプルヘッダの音声波形データループ開始位置に加算されるオフセット(下位16bit） */
        startloopAddrsOffset: 0,

        /** @type {number} サンプルヘッダの音声波形データループ開始位置に加算されるオフセット(下位16bit） */
        endloopAddrsOffset: 0,

        /** @type {number} サンプルヘッダの音声波形データ開始位置に加算されるオフセット(上位16bit） */
        startAddrsCoarseOffset: 0,

        /** @type {number} LFOによるピッチの揺れ幅 */
        modLfoToPitch: 0,

        /** @type {number} モジュレーションホイール用LFOからピッチに対しての影響量 */
        vibLfoToPitch: 0,

        /** @type {number} フィルタ・ピッチ用エンベロープからピッチに対しての影響量 */
        modEnvToPitch: 0,

        /** @type {number} フィルタのカットオフ周波数 */
        initialFilterFc: 13500,

        /** @type {number} フィルターのQ値(レゾナンス) */
        initialFilterQ: 0,

        /** @type {number} LFOによるフィルターカットオフ周波数の揺れ幅 */
        modLfoToFilterFc: 0,

        /** @type {number} フィルタ・ピッチ用エンベロープからフィルターカットオフに対しての影響量 */
        modEnvToFilterFc: 0,

        /** @type {number} サンプルヘッダの音声波形データ終了位置に加算されるオフセット(上位16bit） */
        endAddrsCoarseOffset: 0,

        /** @type {number} LFOによるボリュームの揺れ幅 */
        modLfoToVolume: 0,

        /** @type {undefined} 未使用1 */
        unused1: undefined,
        // 14

        /** @type {number} コーラスエフェクトのセンドレベル */
        chorusEffectsSend: 0,

        /** @type {number} リバーブエフェクトのセンドレベル */
        reverbEffectsSend: 0,

        /** @type {number} パンの位置 */
        pan: 0,

        /** @type {undefined} 未使用2 */
        unused2: undefined,

        /** @type {undefined} 未使用3 */
        unused3: undefined,

        /** @type {undefined} 未使用4 */
        unused4: undefined,

        /** @type {number} LFOの揺れが始まるまでの時間 */
        delayModLFO: -12000,

        /** @type {number} LFOの揺れの周期  */
        freqModLFO: 0,

        /** @type {number} ホイールの揺れが始まるまでの時間 */
        delayVibLFO: -12000,

        /** @type {number} ホイールの揺れの周期 */
        freqVibLFO: 0,

        /** @type {number} フィルタ・ピッチ用エンベロープのディレイ(アタックが始まるまでの時間) */
        delayModEnv: -12000,

        /** @type {number} フィルタ・ピッチ用エンベロープのアタック時間 */
        attackModEnv: -12000,

        /** @type {number} フィルタ・ピッチ用エンベロープのホールド時間(アタックが終わってからディケイが始まるまでの時間） */
        holdModEnv: -12000,

        /** @type {number} フィルタ・ピッチ用エンベロープのディケイ時間 */
        decayModEnv: -12000,

        /** @type {number} フィルタ・ピッチ用エンベロープのサステイン量 */
        sustainModEnv: 0,

        /** @type {number} フィルタ・ピッチ用エンベロープのリリース時間 */
        releaseModEnv: -12000,

        /** @type {number} キー(ノートNo)によるフィルタ・ピッチ用エンベロープのホールド時間への影響 */
        keynumToModEnvHold: 0,

        /** @type {number} キー(ノートNo)によるフィルタ・ピッチ用エンベロープのディケイ時間への影響 */
        keynumToModEnvDecay: 0,

        /** @type {number} アンプ用エンベロープのディレイ(アタックが始まるまでの時間) */
        delayVolEnv: -12000,

        /** @type {number} アンプ用エンベロープのアタック時間 */
        attackVolEnv: -12000,

        /** @type {number} アンプ用エンベロープのホールド時間(アタックが終わってからディケイが始まるまでの時間） */
        holdVolEnv: -12000,

        /** @type {number} アンプ用エンベロープのディケイ時間 */
        decayVolEnv: -12000,

        /** @type {number} アンプ用エンベロープのサステイン量 */
        sustainVolEnv: 0,

        /** @type {number} アンプ用エンベロープのリリース時間 */
        releaseVolEnv: -12000,

        /** @type {number} キー(ノートNo)によるアンプ用エンベロープのホールド時間への影響 */
        keynumToVolEnvHold: 0,

        /** @type {number} キー(ノートNo)によるアンプ用エンベロープのディケイ時間への影響 */
        keynumToVolEnvDecay: 0,

        /** @type {number} 割り当てるインストルメント(楽器) */
        instrument: null,

        /** @type {undefined} 予約済み1 */
        reserved1: undefined,
        // 42

        /** @type {number} マッピングするキー(ノートNo)の範囲 */
        keyRange: null,

        /** @type {number} マッピングするベロシティの範囲 */
        velRange: null,

        /** @type {number} サンプルヘッダの音声波形データループ開始位置に加算されるオフセット(上位16bit） */
        startloopAddrsCoarseOffset: 0,

        /** @type {number} どのキー(ノートNo)でも強制的に指定したキー(ノートNo)に変更する */
        keynum: null,

        /** @type {number} どのベロシティでも強制的に指定したベロシティに変更する */
        velocity: null,

        /** @type {number} 調整する音量 */
        initialAttenuation: 0,

        /** @type {undefined} 予約済み2 */
        reserved2: undefined,
        // 49

        /** @type {number} サンプルヘッダの音声波形データループ終了位置に加算されるオフセット(上位16bit） */
        endloopAddrsCoarseOffset: 0,

        /** @type {number} 半音単位での音程の調整 */
        coarseTune: 0,

        /** @type {number} cent単位での音程の調整 */
        fineTune: 0,

        /** @type {number} 割り当てるサンプル(音声波形) */
        sampleID: null,

        /** @type {number} サンプル(音声波形)をループさせるか等のフラグ */
        sampleModes: 0,

        /** @type {undefined} 予約済み3 */
        reserved3: undefined,
        // 55

        /** @type {number} キー(ノートNo)が+1されるごとに音程を何centあげるかの音階情報 */
        scaleTuning: 100,

        /** @type {number} 同時に音を鳴らさないようにするための排他ID(ハイハットのOpen、Close等に使用) */
        exclusiveClass: null,

        /** @type {number} サンプル(音声波形)の音程の上書き情報 */
        overridingRootKey: null,

        /** @type {undefined} 未使用5 */
        unuded5: undefined,
        // 59

        /** @type {undefined} 最後を示すオペレータ */
        endOper: undefined
      });
    }
    /** @export */

  }, {
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

      this.samplingData =
      /** @type {{type: string, size: number, offset: number}} */
      parser.getChunk(0);
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
                  amount: null,
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
                amount: null,
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
          amount: null,
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


})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=sf2.parser.js.map
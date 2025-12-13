import { Riff } from './riff.js';

/**
 * SoundFont Parser Class
 *
 * @author imaya
 */
export default class Parser {
  // Constants
  static CHUNK_ID_SIZE = 4;
  static EXPECTED_RIFF_CHUNKS = 1;
  static EXPECTED_SFBK_CHUNKS = 3;
  static EXPECTED_PDTA_CHUNKS = 9;
  static EXPECTED_SDTA_CHUNKS = 1;
  static PRESET_HEADER_SIZE = 38;
  static INSTRUMENT_HEADER_SIZE = 22;
  static NAME_SIZE = 20;
  static SAMPLE_HEADER_SIZE = 46;
  static BAG_SIZE = 4;
  static MODULATOR_SIZE = 10;
  static GENERATOR_SIZE = 4;

  /**
   * @param {Uint8Array} input
   * @param {Object} [optParams]
   */
  constructor(input, optParams = {}) {
    /** @type {Uint8Array} */
    this.input = input;
    /** @type {object} */
    this.parserOption = optParams.parserOption || {};
    /** @type {number} */
    this.sampleRate = optParams.sampleRate || 22050; // よくわからんが、OSで指定されているサンプルレートを入れないと音が切れ切れになる。

    /** @type {object[]} */
    this.presetHeader = [];
    /** @type {object[]} */
    this.presetZone = [];
    /** @type {object[]} */
    this.presetZoneModulator = [];
    /** @type {object[]} */
    this.presetZoneGenerator = [];
    /** @type {object[]} */
    this.instrument = [];
    /** @type {object[]} */
    this.instrumentZone = [];
    /** @type {object[]} */
    this.instrumentZoneModulator = [];
    /** @type {object[]} */
    this.instrumentZoneGenerator = [];
    /** @type {object[]} */
    this.sampleHeader = [];
    /** @type {string[]} */
    this.GeneratorEnumeratorTable = Object.keys(Parser.getGeneratorTable());
  }

  /** @return {Record<string, number?>} ジェネレータとデフォルト値 */
  static getGeneratorTable() {
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
      unused1: undefined, // 14
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
      /** @type {number} LFOの揺れの周期 */
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
      reserved1: undefined, // 42
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
      reserved2: undefined, // 49
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
      reserved3: undefined, // 55
      /** @type {number} キー(ノートNo)が+1されるごとに音程を何centあげるかの音階情報 */
      scaleTuning: 100,
      /** @type {number} 同時に音を鳴らさないようにするための排他ID(ハイハットのOpen、Close等に使用) */
      exclusiveClass: null,
      /** @type {number} サンプル(音声波形)の音程の上書き情報 */
      overridingRootKey: null,
      /** @type {undefined} 未使用5 */
      unuded5: undefined, // 59
      /** @type {undefined} 最後を示すオペレータ */
      endOper: undefined,
    });
  }

  /**
   * Read 4-character signature from data
   * @private
   * @param {Uint8Array} data Data array
   * @param {number} offset Offset position
   * @returns {string} Signature string
   */
  readSignature(data, offset) {
    return String.fromCharCode(
      data[offset],
      data[offset + 1],
      data[offset + 2],
      data[offset + 3]
    );
  }

  /**
   * Validate chunk type
   * @private
   * @param {import('./riff.js').RiffChunk} chunk Chunk to validate
   * @param {string} expectedType Expected chunk type
   * @throws {Error} If chunk type doesn't match
   */
  validateChunkType(chunk, expectedType) {
    if (chunk.type !== expectedType) {
      throw new Error(`invalid chunk type: expected '${expectedType}', got '${chunk.type}'`);
    }
  }

  /**
   * Validate signature
   * @private
   * @param {string} signature Actual signature
   * @param {string} expected Expected signature
   * @throws {Error} If signature doesn't match
   */
  validateSignature(signature, expected) {
    if (signature !== expected) {
      throw new Error(`invalid signature: expected '${expected}', got '${signature}'`);
    }
  }

  /** @export */
  parse() {
    const parser = new Riff(/** @type {ArrayBuffer} */ (this.input.buffer), this.parserOption);

    parser.parse();
    if (parser.chunkList.length !== Parser.EXPECTED_RIFF_CHUNKS) {
      throw new Error(`wrong chunk length: expected ${Parser.EXPECTED_RIFF_CHUNKS}, got ${parser.chunkList.length}`);
    }

    const chunk = parser.getChunk(0);
    if (chunk === null) {
      throw new Error('chunk not found');
    }

    this.parseRiffChunk(chunk);
    this.input = null;
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseRiffChunk(chunk) {
    const data = this.input;
    let ip = chunk.offset;

    this.validateChunkType(chunk, 'RIFF');

    const signature = this.readSignature(data, ip);
    ip += Parser.CHUNK_ID_SIZE;
    this.validateSignature(signature, 'sfbk');

    const parser = new Riff(data, { index: ip, length: chunk.size - Parser.CHUNK_ID_SIZE });
    parser.parse();
    if (parser.getNumberOfChunks() !== Parser.EXPECTED_SFBK_CHUNKS) {
      throw new Error(`invalid sfbk structure: expected ${Parser.EXPECTED_SFBK_CHUNKS} chunks, got ${parser.getNumberOfChunks()}`);
    }

    // INFO-list
    this.parseInfoList(
      /** @type {import('./riff.js').RiffChunk} */ (parser.getChunk(0))
    );

    // sdta-list
    this.parseSdtaList(
      /** @type {import('./riff.js').RiffChunk} */ (parser.getChunk(1))
    );

    // pdta-list
    this.parsePdtaList(
      /** @type {import('./riff.js').RiffChunk} */ (parser.getChunk(2))
    );
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseInfoList(chunk) {
    const data = this.input;
    let ip = chunk.offset;

    this.validateChunkType(chunk, 'LIST');

    const signature = this.readSignature(data, ip);
    ip += Parser.CHUNK_ID_SIZE;
    this.validateSignature(signature, 'INFO');

    const parser = new Riff(data, { index: ip, length: chunk.size - Parser.CHUNK_ID_SIZE });
    parser.parse();
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseSdtaList(chunk) {
    const data = this.input;
    let ip = chunk.offset;

    this.validateChunkType(chunk, 'LIST');

    const signature = this.readSignature(data, ip);
    ip += Parser.CHUNK_ID_SIZE;
    this.validateSignature(signature, 'sdta');

    const parser = new Riff(data, { index: ip, length: chunk.size - Parser.CHUNK_ID_SIZE });
    parser.parse();
    if (parser.chunkList.length !== Parser.EXPECTED_SDTA_CHUNKS) {
      throw new Error(`invalid sdta structure: expected ${Parser.EXPECTED_SDTA_CHUNKS} chunk, got ${parser.chunkList.length}`);
    }
    this.samplingData =
      /** @type {{ type: string; size: number; offset: number }} */
      (parser.getChunk(0));
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parsePdtaList(chunk) {
    const data = this.input;
    let ip = chunk.offset;

    this.validateChunkType(chunk, 'LIST');

    const signature = this.readSignature(data, ip);
    ip += Parser.CHUNK_ID_SIZE;
    this.validateSignature(signature, 'pdta');

    const parser = new Riff(data, { index: ip, length: chunk.size - Parser.CHUNK_ID_SIZE });
    parser.parse();

    if (parser.getNumberOfChunks() !== Parser.EXPECTED_PDTA_CHUNKS) {
      throw new Error(`invalid pdta chunk: expected ${Parser.EXPECTED_PDTA_CHUNKS} chunks, got ${parser.getNumberOfChunks()}`);
    }

    this.parsePhdr(
      /** @type {import('./riff.js').RiffChunk} */ (parser.getChunk(0))
    );
    this.parsePbag(
      /** @type {import('./riff.js').RiffChunk} */ (parser.getChunk(1))
    );
    this.parsePmod(
      /** @type {import('./riff.js').RiffChunk} */ (parser.getChunk(2))
    );
    this.parsePgen(
      /** @type {import('./riff.js').RiffChunk} */ (parser.getChunk(3))
    );
    this.parseInst(
      /** @type {import('./riff.js').RiffChunk} */ (parser.getChunk(4))
    );
    this.parseIbag(
      /** @type {import('./riff.js').RiffChunk} */ (parser.getChunk(5))
    );
    this.parseImod(
      /** @type {import('./riff.js').RiffChunk} */ (parser.getChunk(6))
    );
    this.parseIgen(
      /** @type {import('./riff.js').RiffChunk} */ (parser.getChunk(7))
    );
    this.parseShdr(
      /** @type {import('./riff.js').RiffChunk} */ (parser.getChunk(8))
    );
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parsePhdr(chunk) {
    this.validateChunkType(chunk, 'phdr');

    const data = this.input;
    let ip = chunk.offset;
    const presetHeader = (this.presetHeader = []);
    const size = chunk.offset + chunk.size;

    while (ip < size) {
      presetHeader.push({
        presetName: String.fromCharCode.apply(
          null,
          data.subarray(ip, (ip += 20))
        ),
        preset: data[ip++] | (data[ip++] << 8),
        bank: data[ip++] | (data[ip++] << 8),
        presetBagIndex: data[ip++] | (data[ip++] << 8),
        library:
          (data[ip++] |
            (data[ip++] << 8) |
            (data[ip++] << 16) |
            (data[ip++] << 24)) >>>
          0,
        genre:
          (data[ip++] |
            (data[ip++] << 8) |
            (data[ip++] << 16) |
            (data[ip++] << 24)) >>>
          0,
        morphology:
          (data[ip++] |
            (data[ip++] << 8) |
            (data[ip++] << 16) |
            (data[ip++] << 24)) >>>
          0,
      });
    }
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parsePbag(chunk) {
    this.validateChunkType(chunk, 'pbag');

    const data = this.input;
    let ip = chunk.offset;
    const presetZone = (this.presetZone = []);
    const size = chunk.offset + chunk.size;

    while (ip < size) {
      presetZone.push({
        presetGeneratorIndex: data[ip++] | (data[ip++] << 8),
        presetModulatorIndex: data[ip++] | (data[ip++] << 8),
      });
    }
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parsePmod(chunk) {
    this.validateChunkType(chunk, 'pmod');
    this.presetZoneModulator = this.parseModulator(chunk);
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parsePgen(chunk) {
    this.validateChunkType(chunk, 'pgen');
    this.presetZoneGenerator = this.parseGenerator(chunk);
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseInst(chunk) {
    this.validateChunkType(chunk, 'inst');

    const data = this.input;
    let ip = chunk.offset;
    const instrument = (this.instrument = []);
    const size = chunk.offset + chunk.size;

    while (ip < size) {
      instrument.push({
        instrumentName: String.fromCharCode.apply(
          null,
          data.subarray(ip, (ip += 20))
        ),
        instrumentBagIndex: data[ip++] | (data[ip++] << 8),
      });
    }
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseIbag(chunk) {
    this.validateChunkType(chunk, 'ibag');

    const data = this.input;
    let ip = chunk.offset;
    const instrumentZone = (this.instrumentZone = []);
    const size = chunk.offset + chunk.size;

    while (ip < size) {
      instrumentZone.push({
        instrumentGeneratorIndex: data[ip++] | (data[ip++] << 8),
        instrumentModulatorIndex: data[ip++] | (data[ip++] << 8),
      });
    }
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseImod(chunk) {
    this.validateChunkType(chunk, 'imod');
    this.instrumentZoneModulator = this.parseModulator(chunk);
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseIgen(chunk) {
    this.validateChunkType(chunk, 'igen');
    this.instrumentZoneGenerator = this.parseGenerator(chunk);
  }

  /**
   * Read 32-bit unsigned integer (little-endian)
   * @private
   * @param {Uint8Array} data Data array
   * @param {number} offset Offset position
   * @returns {number} 32-bit unsigned integer
   */
  readUInt32LE(data, offset) {
    return (
      (data[offset] << 0) |
      (data[offset + 1] << 8) |
      (data[offset + 2] << 16) |
      (data[offset + 3] << 24)
    ) >>> 0;
  }

  /**
   * Read 16-bit unsigned integer (little-endian)
   * @private
   * @param {Uint8Array} data Data array
   * @param {number} offset Offset position
   * @returns {number} 16-bit unsigned integer
   */
  readUInt16LE(data, offset) {
    return data[offset] | (data[offset + 1] << 8);
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseShdr(chunk) {
    this.validateChunkType(chunk, 'shdr');

    const data = this.input;
    let ip = chunk.offset;
    const samples = (this.sample = []);
    const sampleHeader = (this.sampleHeader = []);
    const size = chunk.offset + chunk.size;

    while (ip < size) {
      const sampleName = String.fromCharCode.apply(
        null,
        data.subarray(ip, ip + Parser.NAME_SIZE)
      );
      ip += Parser.NAME_SIZE;

      const start = this.readUInt32LE(data, ip);
      ip += 4;
      const end = this.readUInt32LE(data, ip);
      ip += 4;
      let startLoop = this.readUInt32LE(data, ip);
      ip += 4;
      let endLoop = this.readUInt32LE(data, ip);
      ip += 4;
      let sampleRate = this.readUInt32LE(data, ip);
      ip += 4;

      const originalPitch = data[ip++];
      const pitchCorrection = (data[ip++] << 24) >> 24; // Sign extend
      const sampleLink = this.readUInt16LE(data, ip);
      ip += 2;
      const sampleType = this.readUInt16LE(data, ip);
      ip += 2;

      let sample = new Int16Array(
        new Uint8Array(
          data.subarray(
            this.samplingData.offset + start * 2,
            this.samplingData.offset + end * 2
          )
        ).buffer
      );

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
        sampleName,
        start,
        end,
        startLoop,
        endLoop,
        sampleRate,
        originalPitch,
        pitchCorrection,
        sampleLink,
        sampleType,
      });
    }
  }

  /**
   * @param {Int16Array} sample
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
    let multiply = 1;

    // buffer
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
      sample,
      multiply,
    };
  }

  /**
   * @param {import('./riff.js').RiffChunk} chunk
   * @return {Object[]}
   */
  parseModulator(chunk) {
    const data = this.input;
    let ip = chunk.offset;
    const size = chunk.offset + chunk.size;
    const output = [];

    while (ip < size) {
      // Src  Oper
      // TODO
      ip += 2;

      // Dest Oper
      const code = data[ip++] | (data[ip++] << 8);
      const key = this.GeneratorEnumeratorTable[code];
      if (!key) {
        // Amount
        output.push({
          type: key,
          value: {
            code,
            amount: data[ip] | (((data[ip + 1] << 8) << 16) >> 16),
            lo: data[ip++],
            hi: data[ip++],
          },
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
                hi: data[ip++],
              },
            });
            break;
          default:
            output.push({
              type: key,
              value: {
                amount: data[ip++] | (((data[ip++] << 8) << 16) >> 16),
              },
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
  }

  /**
   * @param {import('./riff.js').RiffChunk} chunk
   * @return {Object[]}
   */
  parseGenerator(chunk) {
    const data = this.input;
    let ip = chunk.offset;
    const size = chunk.offset + chunk.size;
    const output = [];

    while (ip < size) {
      const code = data[ip++] | (data[ip++] << 8);
      const key = this.GeneratorEnumeratorTable[code];
      if (!key) {
        output.push({
          type: key,
          value: {
            code,
            amount: data[ip] | (((data[ip + 1] << 8) << 16) >> 16),
            lo: data[ip++],
            hi: data[ip++],
          },
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
              hi: data[ip++],
            },
          });
          break;
        default:
          output.push({
            type: key,
            value: {
              amount: data[ip++] | (((data[ip++] << 8) << 16) >> 16),
            },
          });
          break;
      }
    }

    return output;
  }

  /** @return {object[]} */
  createInstrument() {
    /** @type {Object[]} */
    const instrument = this.instrument;
    /** @type {Object[]} */
    const zone = this.instrumentZone;
    /** @type {Object[]} */
    const output = [];
    /** @type {number} */
    let bagIndex;
    /** @type {number} */
    let bagIndexEnd;
    /** @type {Object[]} */
    let zoneInfo;
    /** @type {{ generator: Object; generatorInfo: Object[] }} */
    let instrumentGenerator;
    /** @type {{ modulator: Object; modulatorInfo: Object[] }} */
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
      bagIndexEnd = instrument[i + 1]
        ? instrument[i + 1].instrumentBagIndex
        : zone.length;
      zoneInfo = [];

      // instrument bag
      for (j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
        instrumentGenerator = this.createInstrumentGenerator_(zone, j);
        instrumentModulator = this.createInstrumentModulator_(zone, j);

        zoneInfo.push({
          generator: instrumentGenerator.generator,
          generatorSequence: instrumentGenerator.generatorInfo,
          modulator: instrumentModulator.modulator,
          modulatorSequence: instrumentModulator.modulatorInfo,
        });
      }

      output.push({
        name: instrument[i].instrumentName,
        info: zoneInfo,
      });
    }

    return output;
  }

  /** @return {object[]} */
  createPreset() {
    /** @type {Object[]} */
    const preset = this.presetHeader;
    /** @type {Object[]} */
    const zone = this.presetZone;
    /** @type {Object[]} */
    const output = [];
    /** @type {number} */
    let bagIndex;
    /** @type {number} */
    let bagIndexEnd;
    /** @type {Object[]} */
    let zoneInfo;
    /** @type {number} */
    let instrument;
    /** @type {{ generator: Object; generatorInfo: Object[] }} */
    let presetGenerator;
    /** @type {{ modulator: Object; modulatorInfo: Object[] }} */
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
          modulatorSequence: presetModulator.modulatorInfo,
        });

        instrument =
          presetGenerator.generator.instrument !== undefined
            ? presetGenerator.generator.instrument.amount
            : presetModulator.modulator.instrument !== undefined
              ? presetModulator.modulator.instrument.amount
              : null;
      }

      output.push({
        name: preset[i].presetName,
        info: zoneInfo,
        header: preset[i],
        instrument,
      });
    }

    return output;
  }

  /**
   *
   * @private
   * @param {Object[]} zone
   * @param {number} index
   * @returns {{ generator: Object; generatorInfo: Object[] }}
   */
  createInstrumentGenerator_(zone, index) {
    const modgen = this.createBagModGen_(
      zone,
      zone[index].instrumentGeneratorIndex,
      zone[index + 1]
        ? zone[index + 1].instrumentGeneratorIndex
        : this.instrumentZoneGenerator.length,
      this.instrumentZoneGenerator
    );

    return {
      generator: modgen.modgen,
      generatorInfo: modgen.modgenInfo,
    };
  }

  /**
   *
   * @private
   * @param {Object[]} zone
   * @param {number} index
   * @returns {{ modulator: Object; modulatorInfo: Object[] }}
   */
  createInstrumentModulator_(zone, index) {
    const modgen = this.createBagModGen_(
      zone,
      zone[index].presetModulatorIndex,
      zone[index + 1]
        ? zone[index + 1].instrumentModulatorIndex
        : this.instrumentZoneModulator.length,
      this.instrumentZoneModulator
    );

    return {
      modulator: modgen.modgen,
      modulatorInfo: modgen.modgenInfo,
    };
  }

  /**
   *
   * @private
   * @param {Object[]} zone
   * @param {number} index
   * @returns {{ generator: Object; generatorInfo: Object[] }}
   */
  createPresetGenerator_(zone, index) {
    const modgen = this.createBagModGen_(
      zone,
      zone[index].presetGeneratorIndex,
      zone[index + 1]
        ? zone[index + 1].presetGeneratorIndex
        : this.presetZoneGenerator.length,
      this.presetZoneGenerator
    );

    return {
      generator: modgen.modgen,
      generatorInfo: modgen.modgenInfo,
    };
  }

  /**
   *
   * @private
   * @param {Object[]} zone
   * @param {number} index
   * @returns {{ modulator: Object; modulatorInfo: Object[] }}
   */
  createPresetModulator_(zone, index) {
    /** @type {{ modgen: Object; modgenInfo: Object[] }} */
    const modgen = this.createBagModGen_(
      zone,
      zone[index].presetModulatorIndex,
      zone[index + 1]
        ? zone[index + 1].presetModulatorIndex
        : this.presetZoneModulator.length,
      this.presetZoneModulator
    );

    return {
      modulator: modgen.modgen,
      modulatorInfo: modgen.modgenInfo,
    };
  }

  /**
   *
   * @private
   * @param {Object[]} _zone
   * @param {number} indexStart
   * @param {number} indexEnd
   * @param {Array} zoneModGen
   * @returns {{ modgen: Object; modgenInfo: Object[] }}
   */
  createBagModGen_(_zone, indexStart, indexEnd, zoneModGen) {
    /** @type {Object[]} */
    const modgenInfo = [];
    /** @type {Object} */
    const modgen = {
      unknown: [],
      keyRange: {
        amount: null,
        hi: 127,
        lo: 0,
      },
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
      modgen,
      modgenInfo,
    };
  }
}

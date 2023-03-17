import { Riff } from './riff.js';

/**
 * SoundFont Parser Class
 *
 * @author imaya
 */
export default class Parser {
  /**
   * @param {Uint8Array} input
   * @param {Object} [optParams]
   */
  constructor(input, optParams = {}) {
    /** @type {Uint8Array} */
    this.input = input;
    /** @type {Object | undefined} */
    this.parserOption = optParams.parserOption || {};
    /** @type {Number | undefined} */
    this.sampleRate = optParams.sampleRate || 22050; // よくわからんが、OSで指定されているサンプルレートを入れないと音が切れ切れになる。

    /** @type {Object[]} */
    this.presetHeader = [];
    /** @type {Object[]} */
    this.presetZone = [];
    /** @type {Object[]} */
    this.presetZoneModulator = [];
    /** @type {Object[]} */
    this.presetZoneGenerator = [];
    /** @type {Object[]} */
    this.instrument = [];
    /** @type {Object[]} */
    this.instrumentZone = [];
    /** @type {Object[]} */
    this.instrumentZoneModulator = [];
    /** @type {Object[]} */
    this.instrumentZoneGenerator = [];
    /** @type {Object[]} */
    this.sampleHeader = [];
    /** @type {string[]} */
    this.GeneratorEnumeratorTable = Object.keys(this.getGeneratorTable());
  }

  /** @return {Object} ジェネレータとデフォルト値 */
  getGeneratorTable() {
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

  /** @export */
  parse() {
    /** @type {Riff} */
    const parser = new Riff(this.input, this.parserOption);

    // parse RIFF chunk
    parser.parse();
    if (parser.chunkList.length !== 1) {
      throw new Error('wrong chunk length');
    }

    /** @type {import('./riff.js').RiffChunk | null} */
    const chunk = parser.getChunk(0);
    if (chunk === null) {
      throw new Error('chunk not found');
    }

    this.parseRiffChunk(chunk);
    // console.log(this.sampleHeader);
    this.input = null;
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseRiffChunk(chunk) {
    /** @type {ArrayBuffer} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;

    // check parse target
    if (chunk.type !== 'RIFF') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    // check signature
    /** @type {string} */
    const signature = String.fromCharCode(
      data[ip++],
      data[ip++],
      data[ip++],
      data[ip++]
    );
    if (signature !== 'sfbk') {
      throw new Error('invalid signature:' + signature);
    }

    // read structure
    /** @type {import('./riff.js').Riff} */
    const parser = new Riff(data, { index: ip, length: chunk.size - 4 });
    parser.parse();
    if (parser.getNumberOfChunks() !== 3) {
      throw new Error('invalid sfbk structure');
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
    /** @type {ArrayBuffer} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;

    // check parse target
    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    // check signature
    /** @type {string} */
    const signature = String.fromCharCode(
      data[ip++],
      data[ip++],
      data[ip++],
      data[ip++]
    );
    if (signature !== 'INFO') {
      throw new Error('invalid signature:' + signature);
    }

    // read structure
    /** @type {import('./riff.js').Riff} */
    const parser = new Riff(data, { index: ip, length: chunk.size - 4 });
    parser.parse();
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseSdtaList(chunk) {
    /** @type {ArrayBuffer} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;

    // check parse target
    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    // check signature
    /** @type {string} */
    const signature = String.fromCharCode(
      data[ip++],
      data[ip++],
      data[ip++],
      data[ip++]
    );
    if (signature !== 'sdta') {
      throw new Error('invalid signature:' + signature);
    }

    // read structure
    /** @type {import('./riff.js').Riff} */
    const parser = new Riff(data, { index: ip, length: chunk.size - 4 });
    parser.parse();
    if (parser.chunkList.length !== 1) {
      throw new Error('TODO');
    }
    this.samplingData =
      /** @type {{ type: string; size: number; offset: number }} */
      (parser.getChunk(0));
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parsePdtaList(chunk) {
    /** @type {Uint8Array} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;

    // check parse target
    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    // check signature
    /** @type {string} */
    const signature = String.fromCharCode(
      data[ip++],
      data[ip++],
      data[ip++],
      data[ip++]
    );
    if (signature !== 'pdta') {
      throw new Error('invalid signature:' + signature);
    }

    // read structure
    /** @type {import('./riff.js').Riff} */
    const parser = new Riff(data, { index: ip, length: chunk.size - 4 });
    parser.parse();

    // check number of chunks
    if (parser.getNumberOfChunks() !== 9) {
      throw new Error('invalid pdta chunk');
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
    /** @type {Uint8Array} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {Object[]} */
    const presetHeader = (this.presetHeader = []);
    /** @type {number} */
    const size = chunk.offset + chunk.size;

    // check parse target
    if (chunk.type !== 'phdr') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

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
    /** @type {ArrayBuffer} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {Object[]} */
    const presetZone = (this.presetZone = []);
    /** @type {number} */
    const size = chunk.offset + chunk.size;

    // check parse target
    if (chunk.type !== 'pbag') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      presetZone.push({
        presetGeneratorIndex: data[ip++] | (data[ip++] << 8),
        presetModulatorIndex: data[ip++] | (data[ip++] << 8),
      });
    }
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parsePmod(chunk) {
    // check parse target
    if (chunk.type !== 'pmod') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    this.presetZoneModulator = this.parseModulator(chunk);
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parsePgen(chunk) {
    // check parse target
    if (chunk.type !== 'pgen') {
      throw new Error('invalid chunk type:' + chunk.type);
    }
    this.presetZoneGenerator = this.parseGenerator(chunk);
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseInst(chunk) {
    /** @type {Uint8Array} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {Object[]} */
    const instrument = (this.instrument = []);
    /** @type {number} */
    const size = chunk.offset + chunk.size;

    // check parse target
    if (chunk.type !== 'inst') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

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
    /** @type {ArrayBuffer} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {Object[]} */
    const instrumentZone = (this.instrumentZone = []);
    /** @type {number} */
    const size = chunk.offset + chunk.size;

    // check parse target
    if (chunk.type !== 'ibag') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      instrumentZone.push({
        instrumentGeneratorIndex: data[ip++] | (data[ip++] << 8),
        instrumentModulatorIndex: data[ip++] | (data[ip++] << 8),
      });
    }
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseImod(chunk) {
    // check parse target
    if (chunk.type !== 'imod') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    this.instrumentZoneModulator = this.parseModulator(chunk);
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseIgen(chunk) {
    // check parse target
    if (chunk.type !== 'igen') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    this.instrumentZoneGenerator = this.parseGenerator(chunk);
  }

  /** @param {import('./riff.js').RiffChunk} chunk */
  parseShdr(chunk) {
    /** @type {Uint8Array} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {Object[]} */
    const samples = (this.sample = []);
    /** @type {Object[]} */
    const sampleHeader = (this.sampleHeader = []);
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
    let sampleType;

    // check parse target
    if (chunk.type !== 'shdr') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      sampleName = String.fromCharCode.apply(
        null,
        data.subarray(ip, (ip += 20))
      );
      start =
        ((data[ip++] << 0) |
          (data[ip++] << 8) |
          (data[ip++] << 16) |
          (data[ip++] << 24)) >>>
        0;
      end =
        ((data[ip++] << 0) |
          (data[ip++] << 8) |
          (data[ip++] << 16) |
          (data[ip++] << 24)) >>>
        0;
      startLoop =
        ((data[ip++] << 0) |
          (data[ip++] << 8) |
          (data[ip++] << 16) |
          (data[ip++] << 24)) >>>
        0;
      endLoop =
        ((data[ip++] << 0) |
          (data[ip++] << 8) |
          (data[ip++] << 16) |
          (data[ip++] << 24)) >>>
        0;
      sampleRate =
        ((data[ip++] << 0) |
          (data[ip++] << 8) |
          (data[ip++] << 16) |
          (data[ip++] << 24)) >>>
        0;
      originalPitch = data[ip++];
      pitchCorrection = (data[ip++] << 24) >> 24;
      sampleLink = data[ip++] | (data[ip++] << 8);
      sampleType = data[ip++] | (data[ip++] << 8);

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
        sampleName: sampleName,
        start: start,
        end: end,
        startLoop: startLoop,
        endLoop: endLoop,
        sampleRate: sampleRate,
        originalPitch: originalPitch,
        pitchCorrection: pitchCorrection,
        sampleLink: sampleLink,
        sampleType: sampleType,
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
      sample: sample,
      multiply: multiply,
    };
  }

  /**
   * @param {import('./riff.js').RiffChunk} chunk
   * @return {Object[]}
   */
  parseModulator(chunk) {
    /** @type {ArrayBuffer} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {number} */
    const size = chunk.offset + chunk.size;
    /** @type {number} */
    let code;
    /** @type {string} */
    let key;
    /** @type {Object[]} */
    const output = [];

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
    /** @type {ArrayBuffer} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {number} */
    const size = chunk.offset + chunk.size;
    /** @type {number} */
    let code;
    /** @type {string} */
    let key;
    /** @type {Object[]} */
    const output = [];

    while (ip < size) {
      code = data[ip++] | (data[ip++] << 8);
      key = this.GeneratorEnumeratorTable[code];
      if (key === void 0) {
        output.push({
          type: key,
          value: {
            code: code,
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
          presetGenerator.generator['instrument'] !== void 0
            ? presetGenerator.generator['instrument'].amount
            : presetModulator.modulator['instrument'] !== void 0
            ? presetModulator.modulator['instrument'].amount
            : null;
      }

      output.push({
        name: preset[i].presetName,
        info: zoneInfo,
        header: preset[i],
        instrument: instrument,
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
      modgen: modgen,
      modgenInfo: modgenInfo,
    };
  }
}

export interface GeneratorTable {
  /**  サンプルヘッダの音声波形データ開始位置に加算されるオフセット(下位16bit） */
  startAddrsOffset: number;
  /** サンプルヘッダの音声波形データ終了位置に加算されるオフセット(下位16bit） */
  endAddrsOffset: number;
  /** サンプルヘッダの音声波形データループ開始位置に加算されるオフセット(下位16bit） */
  startloopAddrsOffset: number;
  /** サンプルヘッダの音声波形データループ終了位置に加算されるオフセット(下位16bit） */
  endloopAddrsOffset: number;
  /** サンプルヘッダの音声波形データ開始位置に加算されるオフセット(上位16bit） */
  startAddrsCoarseOffset: number;
  /** LFOによるピッチの揺れ幅 */
  modLfoToPitch: number;
  /** モジュレーションホイール用LFOからピッチに対しての影響量 */
  vibLfoToPitch: number;
  /** フィルタ・ピッチ用エンベロープからピッチに対しての影響量 */
  modEnvToPitch: number;
  /** フィルタのカットオフ周波数 */
  initialFilterFc: number;
  /** フィルターのQ値(レゾナンス) */
  initialFilterQ: number;
  /** LFOによるフィルターカットオフ周波数の揺れ幅 */
  modLfoToFilterFc: number;
  /** フィルタ・ピッチ用エンベロープからフィルターカットオフに対しての影響量 */
  modEnvToFilterFc: number;
  /** サンプルヘッダの音声波形データ終了位置に加算されるオフセット(上位16bit） */
  endAddrsCoarseOffset: number;
  /** LFOによるボリュームの揺れ幅 */
  modLfoToVolume: number;
  /** 未使用1 */
  unused1: undefined; // 14
  /** コーラスエフェクトのセンドレベル */
  chorusEffectsSend: number;
  /** リバーブエフェクトのセンドレベル */
  reverbEffectsSend: number;
  /** パンの位置 */
  pan: number;
  /** 未使用2 */
  unused2: undefined;
  /** 未使用3 */
  unused3: undefined;
  /** 未使用4 */
  unused4: undefined;
  /** LFOの揺れが始まるまでの時間 */
  delayModLFO: number;
  /** LFOの揺れの周期 */
  freqModLFO: number;
  /** ホイールの揺れが始まるまでの時間 */
  delayVibLFO: number;
  /** ホイールの揺れの周期 */
  freqVibLFO: number;
  /** フィルタ・ピッチ用エンベロープのディレイ(アタックが始まるまでの時間) */
  delayModEnv: number;
  /** フィルタ・ピッチ用エンベロープのアタック時間 */
  attackModEnv: number;
  /** フィルタ・ピッチ用エンベロープのホールド時間(アタックが終わってからディケイが始まるまでの時間） */
  holdModEnv: number;
  /** フィルタ・ピッチ用エンベロープのディケイ時間 */
  decayModEnv: number;
  /** フィルタ・ピッチ用エンベロープのサステイン量 */
  sustainModEnv: number;
  /** フィルタ・ピッチ用エンベロープのリリース時間 */
  releaseModEnv: number;
  /** キー(ノートNo)によるフィルタ・ピッチ用エンベロープのホールド時間への影響 */
  keynumToModEnvHold: number;
  /** キー(ノートNo)によるフィルタ・ピッチ用エンベロープのディケイ時間への影響 */
  keynumToModEnvDecay: number;
  /** アンプ用エンベロープのディレイ(アタックが始まるまでの時間) */
  delayVolEnv: number;
  /** アンプ用エンベロープのアタック時間 */
  attackVolEnv: number;
  /** アンプ用エンベロープのホールド時間(アタックが終わってからディケイが始まるまでの時間） */
  holdVolEnv: number;
  /** アンプ用エンベロープのディケイ時間 */
  decayVolEnv: number;
  /** アンプ用エンベロープのサステイン量 */
  sustainVolEnv: number;
  /** アンプ用エンベロープのリリース時間 */
  releaseVolEnv: number;
  /** キー(ノートNo)によるアンプ用エンベロープのホールド時間への影響 */
  keynumToVolEnvHold: number;
  /** キー(ノートNo)によるアンプ用エンベロープのディケイ時間への影響 */
  keynumToVolEnvDecay: number;
  /** 割り当てるインストルメント(楽器) */
  instrument: number | null;
  /**  予約済み1 */
  reserved1: undefined; // 42
  /** マッピングするキー(ノートNo)の範囲 */
  keyRange: number | null;
  /** マッピングするベロシティの範囲 */
  velRange: number | null;
  /**  サンプルヘッダの音声波形データループ開始位置に加算されるオフセット(上位16bit） */
  startloopAddrsCoarseOffset: number;
  /**  どのキー(ノートNo)でも強制的に指定したキー(ノートNo)に変更する */
  keynum: number | null;
  /** どのベロシティでも強制的に指定したベロシティに変更する */
  velocity: number | null;
  /**  調整する音量 */
  initialAttenuation: number;
  /** 予約済み2 */
  reserved2: undefined; // 49
  /**  サンプルヘッダの音声波形データループ終了位置に加算されるオフセット(上位16bit） */
  endloopAddrsCoarseOffset: number;
  /**  半音単位での音程の調整 */
  coarseTune: number;
  /**  cent単位での音程の調整 */
  fineTune: number;
  /**  割り当てるサンプル(音声波形) */
  sampleID: number | null;
  /**  サンプル(音声波形)をループさせるか等のフラグ */
  sampleModes: number;
  /** 予約済み3 */
  reserved3: undefined; // 55
  /**  キー(ノートNo)が+1されるごとに音程を何centあげるかの音階情報 */
  scaleTuning: number;
  /** 同時に音を鳴らさないようにするための排他ID(ハイハットのOpen、Close等に使用) */
  exclusiveClass: number | null;
  /** サンプル(音声波形)の音程の上書き情報 */
  overridingRootKey: number | null;
  /** 未使用5 */
  unuded5: undefined; // 59
  /** 最後を示すオペレータ */
  endOper: undefined;
}

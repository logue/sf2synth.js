/* eslint-disable no-case-declarations */
import SynthesizerNote from './sound_font_synth_note';
import Parser from './sf2';
import Reverb from '@logue/reverb';
import { NoiseType } from '@logue/reverb/dist/NoiseType';

/**
 * Synthesizer Class
 * @private
 */
export class Synthesizer {
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
    this.channelVolume = [
      127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,
      127,
    ];
    /** @type {Array.<number>} */
    this.channelPanpot = [
      64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    ];
    /** @type {Array.<number>} */
    this.channelPitchBend = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {Array.<number>} */
    this.channelPitchBendSensitivity = [
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    ];
    /** @type {Array.<number>} */
    this.channelExpression = [
      127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,
      127,
    ];
    /** @type {Array.<number>} */
    this.channelAttack = [
      64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    ];
    /** @type {Array.<number>} */
    this.channelDecay = [
      64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    ];
    /** @type {Array.<number>} */
    this.channelSustin = [
      64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    ];
    /** @type {Array.<number>} */
    this.channelRelease = [
      64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    ];

    /** @type {Array.<boolean>} */
    this.channelHold = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ];
    /** @type {Array.<number>} */
    this.channelHarmonicContent = [
      64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    ];
    /** @type {Array.<number>} */
    this.channelCutOffFrequency = [
      64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    ];

    /** @type {boolean} */
    this.isGS = false;
    /** @type {boolean} */
    this.isXG = false;

    /** @type {Array.<Array.<string>>} */
    this.programSet = [];

    /** @type {Array.<boolean>} */
    this.channelMute = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
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
      [],
    ];
    /** @type {number} @const */
    this.baseVolume = 1 / 0xffff;
    /** @type {number} */
    this.masterVolume = 16384;

    /** @type {Array.<boolean>} */
    this.percussionPart = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ];

    /** @type {Array.<number>} */
    this.percussionVolume = new Array(128);
    for (i = 0, il = this.percussionVolume.length; i < il; ++i) {
      this.percussionVolume[i] = 127;
    }

    this.programSet = {};

    /** @type {Array.<Reverb>}リバーブエフェクト（チャンネル毎に用意する） */
    this.reverb = [];

    /** @type {Array.<number>} モジュレーション（ビブラート） */
    this.modulation = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    /** @type {Array.<BiquadFilterNode>} フィルタ */
    this.filter = [];

    for (i = 0; i < 16; ++i) {
      this.reverb[i] = new Reverb(this.ctx, {
        // ノイズはブラウンノイズとする。
        time: 1.1,
        noise: NoiseType.BROWN,
        once: false,
        filterType: 'lowpass',
      });
      // フィルタを定義
      this.filter[i] = this.ctx.createBiquadFilter();
    }

    /** 表示項目 */
    this.items = [];

    // 交差していない
    this.intersection = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) =>
            (entry.target.dataset.isIntersecting = entry.isIntersecting)
        ),
      {}
    );

    /** @type {function} タイマーのスレッド */
    this.timer = null;
  }

  /**
   * @return {AudioContext}
   */
  getAudioContext() {
    /** @type {AudioContext} */
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // for legacy browsers
    ctx.createGain = ctx.createGain || ctx.createGainNode;

    // Defreeze AudioContext for iOS.
    const initAudioContext = () => {
      document.removeEventListener('touchstart', initAudioContext);
      // wake up AudioContext
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

    console.log('Reset Type:', mode);

    /** @type {number} */
    let i;

    this.parser = new Parser(this.input, {
      sampleRate: this.ctx.sampleRate,
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
      this.hold(i, 0);
      this.expression[i] = 127;
      this.bankSelectMsb(i, i === 9 ? 127 : 0);
      this.attackTime(i, 64);
      this.decayTime(i, 64);
      this.sustinTime(i, 64);
      this.releaseTime(i, 64);
      this.harmonicContent(i, 64);
      this.cutOffFrequency(i, 64);
      this.reverbDepth(i, 40);
      this.modulationDepth(i, 0);
      this.updateBankSelect(i);
      this.updateProgramSelect(i);
    }

    this.setPercussionPart(9, true);

    for (i = 0; i < 128; ++i) {
      this.percussionVolume[i] = 127;
    }

    // this.setMasterVolume(8192);

    this.gainMaster.connect(this.ctx.destination);

    if (this.element) {
      this.element.querySelector('.header .keys div').innerText =
        mode + ' Mode';
    }

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
    this.parser = new Parser(input);
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
  }

  /**
   * @param {Parser} parser
   * @param {*} info
   * @param {*} preset
   */
  createNoteInfo(parser, info, preset) {
    /** @type {Generator} */
    const generator = info.generator;

    // console.log(generator);

    if (!generator.keyRange || !generator.sampleID) {
      return;
    }
    // console.log(generator);

    // デフォルト値
    // https://www.utsbox.com/?p=2390

    /** @type {number} 33: delayVolEnv*/
    const volDelay = this.getModGenAmount(generator, 'delayVolEnv');
    /** @type {number} 34: attackVolEnv */
    const volAttack = this.getModGenAmount(generator, 'attackVolEnv');
    /** @type {number} 35: holdVolEnv */
    const volHold = this.getModGenAmount(generator, 'holdVolEnv');
    /** @type {number} 36: decayVolEnv*/
    const volDecay = this.getModGenAmount(generator, 'decayVolEnv');
    /** @type {number} 37: sustainVolEnv */
    const volSustain = this.getModGenAmount(generator, 'sustainVolEnv');
    /** @type {number} 38: releaseVolEnv */
    const volRelease = this.getModGenAmount(generator, 'releaseVolEnv');
    /** @type {number} 25: delayModEnv*/
    const modDelay = this.getModGenAmount(generator, 'delayModEnv');
    /** @type {number} 26: attackModEnv*/
    const modAttack = this.getModGenAmount(generator, 'attackModEnv');
    /** @type {number} 27: holdModEnv */
    const modHold = this.getModGenAmount(generator, 'holdModEnv');
    /** @type {number} 28: decayModEnv */
    const modDecay = this.getModGenAmount(generator, 'decayModEnv');
    /** @type {number} 29: sustainModEnv */
    const modSustain = this.getModGenAmount(generator, 'sustainModEnv');
    /** @type {number} 30: releaseModEnv */
    const modRelease = this.getModGenAmount(generator, 'releaseModEnv');
    /** @type {number} 56: scaleTuning */
    const scale = this.getModGenAmount(generator, 'scaleTuning') / 100;
    /** @type {number} */
    const tune =
      this.getModGenAmount(generator, 'coarseTune') +
      this.getModGenAmount(generator, 'fineTune') / 100;

    const sampleModes = this.getModGenAmount(generator, 'sampleModes');

    for (
      let i = generator.keyRange.lo, il = generator.keyRange.hi;
      i <= il;
      ++i
    ) {
      if (preset[i]) {
        continue;
      }
      /** @type {number} */
      const sampleId = this.getModGenAmount(generator, 'sampleID');
      /** @type {object} */
      const sampleHeader = parser.sampleHeader[sampleId];
      preset[i] = {
        sample: parser.sample[sampleId],
        sampleRate: sampleHeader.sampleRate,
        // 54
        sampleModes: sampleModes,
        basePlaybackRate:
          1.0594630943592953 ** // Math.pow(2, 1 / 12)
          ((i -
            this.getModGenAmount(
              generator,
              'overridingRootKey',
              sampleHeader.originalPitch
            ) +
            tune +
            sampleHeader.pitchCorrection / 100) *
            scale),
        modEnvToPitch: this.getModGenAmount(generator, 'modEnvToPitch') / 100,
        scaleTuning: scale,
        start:
          this.getModGenAmount(generator, 'startAddrsCoarseOffset') * 32768 +
          this.getModGenAmount(generator, 'startAddrsOffset'),
        end:
          this.getModGenAmount(generator, 'endAddrsCoarseOffset') * 32768 +
          this.getModGenAmount(generator, 'endAddrsOffset'),
        loopStart:
          // (sampleHeader.startLoop - sampleHeader.start) +
          sampleHeader.startLoop +
          this.getModGenAmount(generator, 'startloopAddrsCoarseOffset') *
            32768 +
          this.getModGenAmount(generator, 'startloopAddrsOffset'),
        loopEnd:
          // (sampleHeader.endLoop - sampleHeader.start) +
          sampleHeader.endLoop +
          this.getModGenAmount(generator, 'endloopAddrsCoarseOffset') * 32768 +
          this.getModGenAmount(generator, 'endloopAddrsOffset'),
        volDelay: 2 ** (volDelay / 1200),
        volAttack: 2 ** (volAttack / 1200),
        volHold:
          2 ** (volHold / 1200) *
          2 **
            (((60 - i) *
              this.getModGenAmount(generator, 'keynumToVolEnvHold')) /
              1200),
        volDecay:
          2 ** (volDecay / 1200) *
          2 **
            (((60 - i) *
              this.getModGenAmount(generator, 'keynumToVolEnvDecay')) /
              1200),
        volSustain: volSustain / 1000,
        volRelease: 2 ** (volRelease / 1200),
        modDelay: 2 ** (modDelay / 1200),
        modAttack: 2 ** (modAttack / 1200),
        modHold:
          2 ** (modHold / 1200) *
          2 **
            (((60 - i) *
              this.getModGenAmount(generator, 'keynumToModEnvHold')) /
              1200),
        modDecay:
          2 ** (modDecay / 1200) *
          2 **
            (((60 - i) *
              this.getModGenAmount(generator, 'keynumToModEnvDecay')) /
              1200),
        modSustain: modSustain / 1000,
        modRelease: 2 ** (modRelease / 1200),
        initialFilterFc:
          8.176 *
          Math.pow(
            2,
            this.getModGenAmount(generator, 'initialFilterFc') / 1200
          ),
        modEnvToFilterFc:
          this.getModGenAmount(generator, 'modEnvToFilterFc') / 100,
        initialFilterQ: this.getModGenAmount(generator, 'initialFilterQ') / 10,
        reverbEffectSend:
          this.getModGenAmount(generator, 'reverbEffectSend') / 10,
        initialAttenuation:
          this.getModGenAmount(generator, 'initialAttenuation') / 10,
        freqVibLFO:
          8.176 *
          Math.pow(2, this.getModGenAmount(generator, 'freqVibLFO') / 1200),
        pan: this.getModGenAmount(generator, 'pan') / 1200,
      };
    }
  }

  /**
   * @param {Object} generator
   * @param {string} enumeratorType
   * @return {number}
   */
  getModGenAmount(generator, enumeratorType) {
    return generator[enumeratorType]
      ? generator[enumeratorType].amount
      : this.parser.getGeneratorTable()[enumeratorType];
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
    const wrapper = (this.element = doc.createElement('div'));
    wrapper.className = 'synthesizer';
    /** @type {HTMLDivElement} */
    const instElem = doc.createElement('div');
    instElem.className = 'instrument';
    /** @type {Array} */
    this.items = [
      'mute',
      'bank',
      'program',
      'volume',
      'expression',
      'panpot',
      'pitchBend',
      'pitchBendSensitivity',
      'reverbDepth',
      'keys',
    ];
    /** @type {string} */
    const eventStart = 'ontouchstart' in window ? 'touchstart' : 'mousedown';
    /** @type {string} */
    const eventEnd = 'ontouchend' in window ? 'touchend' : 'mouseup';

    for (let channel = 0; channel < 16; channel++) {
      /** @type {HTMLDivElement} */
      const channelElem = doc.createElement('div');
      channelElem.className = 'channel';
      // ホールドを無効化する処理
      channelElem.addEventListener(eventStart, () => {
        this.hold(channel, 0);
      });
      for (const item in this.items) {
        if (!{}.hasOwnProperty.call(this.items, item)) {
          continue;
        }
        /** @type {HTMLDivElement} */
        const itemElem = doc.createElement('div');
        itemElem.className = this.items[item];

        switch (this.items[item]) {
          case 'mute':
            /** @type {HTMLDivElement|null} */
            const checkboxElement = doc.createElement('div');
            checkboxElement.className = 'form-check';
            /** @type {HTMLInputElement|null} */
            const checkbox = doc.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.className = 'form-check-input';
            checkbox.id = 'mute' + channel + 'ch';
            checkbox.value = channel;
            checkbox.addEventListener(
              'input',
              (event) => {
                this.mute(channel, event.target.checked);
              },
              false
            );
            checkboxElement.appendChild(checkbox);
            /** @type {HTMLLabelElement} */
            const labelElem = doc.createElement('label');
            labelElem.className = 'form-check-label';
            labelElem.textContent = channel + 1;
            labelElem.setAttribute('for', 'mute' + channel + 'ch');
            checkboxElement.appendChild(labelElem);
            itemElem.appendChild(checkboxElement);
            break;
          case 'bank':
            // Bank select
            /** @type {HTMLSelectElement} */
            const bankSelect = doc.createElement('select');
            bankSelect.className = 'form-select form-select-sm';
            itemElem.appendChild(bankSelect);
            /** @type {HTMLOptionElement} */
            const option = doc.createElement('option');
            bankSelect.appendChild(option);

            bankSelect.addEventListener(
              'change',
              ((synth, ch) => (event) => {
                synth.bankChange(ch, event.target.value);
                synth.programChange(
                  ch,
                  synth.channelElemInstrument[channelElem]
                );
              })(this, channel),
              false
            );

            bankSelect.selectedIndex = this.channelBank[item];
            break;
          case 'program':
            // Program change
            /** @type {HTMLSelectElement|null} */
            const select = doc.createElement('select');
            select.className = 'form-select form-select-sm';

            itemElem.appendChild(select);

            select.addEventListener(
              'change',
              ((synth, ch) => (event) => {
                synth.programChange(ch, event.target.value);
              })(this, channel),
              false
            );

            select.selectedIndex = this.channelInstrument[item];
            break;
          case 'volume':
            const volumeElem = document.createElement('var');
            volumeElem.innerText = 100;
            itemElem.appendChild(volumeElem);
            break;
          case 'expression':
            const expressionElem = document.createElement('var');
            expressionElem.innerText = 127;
            itemElem.appendChild(expressionElem);
            break;
          case 'pitchBendSensitivity':
            const pitchSensElem = document.createElement('var');
            pitchSensElem.innerText = 2;
            itemElem.appendChild(pitchSensElem);
            break;
          case 'reverbDepth':
            const reverbDepthElem = document.createElement('var');
            reverbDepthElem.innerText = 40;
            itemElem.appendChild(reverbDepthElem);
            break;
          case 'panpot':
            /** @type {HTMLDivElement|null} */
            const panpotOuter = doc.createElement('div');
            panpotOuter.className = 'progress';
            const panpot = doc.createElement('div');
            // 緑色
            panpot.className = 'progress-bar';
            panpotOuter.appendChild(panpot);
            itemElem.appendChild(panpotOuter);
            break;
          case 'pitchBend':
            /** @type {HTMLDivElement|null} */
            const pitchOuter = doc.createElement('div');
            pitchOuter.className = 'progress';
            const pitch = doc.createElement('div');
            // 黄色
            pitch.className = 'progress-bar progress-bar-animated';
            pitchOuter.appendChild(pitch);
            itemElem.appendChild(pitchOuter);
            break;
          case 'keys':
            // 鍵盤の描画
            for (let key = 0; key < 127; key++) {
              /** @type {HTMLDivElement|null} */
              const keyElem = doc.createElement('div');
              /** @type {number} */
              const n = key % 12;
              // 白鍵と黒鍵の色分け
              keyElem.className =
                'key ' + ([1, 3, 6, 8, 10].includes(n) ? 'semitone' : 'tone');
              itemElem.appendChild(keyElem);

              // イベント割当
              keyElem.addEventListener(
                eventStart,
                ((synth, ch, k) => (event) => {
                  event.preventDefault();
                  synth.drag = true;
                  synth.noteOn(ch, k, 127);
                })(this, channel, key)
              );
              keyElem.addEventListener(
                'mouseover',
                ((synth, ch, k) => (event) => {
                  event.preventDefault();
                  if (synth.drag) {
                    synth.noteOn(ch, k, 127);
                  }
                })(this, channel, key)
              );
              keyElem.addEventListener(
                'mouseout',
                ((synth, ch, k) => (event) => {
                  event.preventDefault();
                  synth.noteOff(ch, k, 0);
                })(this, channel, key)
              );
              keyElem.addEventListener(
                eventEnd,
                ((synth, ch, k) => (event) => {
                  event.preventDefault();
                  synth.drag = false;
                  synth.noteOff(ch, k, 0);
                })(this, channel, key)
              );
            }
            break;
        }
        channelElem.appendChild(itemElem);
      }
      instElem.appendChild(channelElem);
      this.intersection.observe(channelElem);
    }
    // ヘッダー行の描画
    const itemName = [
      'Ch.',
      'Bank',
      'Program',
      'Vol.',
      'Exp.',
      'Panpot',
      'Pitch',
      '',
      'Rev.',
      '',
    ];
    const headerElem = doc.createElement('div');
    headerElem.className = 'header';
    for (const item in this.items) {
      if (!{}.hasOwnProperty.call(this.items, item)) {
        continue;
      }
      const itemElem = doc.createElement('div');
      itemElem.className = this.items[item];
      itemElem.textContent = itemName[item];
      if (this.items[item] === 'keys') {
        // MIDI音源のLCDのテキスト領域エミュレーター
        itemElem.appendChild(document.createElement('code'));
        // GM / GS / XG表記
        itemElem.appendChild(document.createElement('div'));
      }
      headerElem.appendChild(itemElem);
    }
    instElem.prepend(headerElem);
    wrapper.appendChild(instElem);

    // ヘッダー行のリサイズ
    const ro = new ResizeObserver((entries) => {
      for (const item in this.items) {
        if (!{}.hasOwnProperty.call(this.items, item)) {
          continue;
        }

        wrapper.querySelector(`.header .${this.items[item]}`).style.width =
          wrapper.querySelector(`.channel .${this.items[item]}`).offsetWidth +
          'px';
      }

      wrapper.querySelector(`.header .keys`).style.display =
        document.documentElement.clientWidth <= 680 ? 'none' : 'flex';
    });
    ro.observe(wrapper);

    return wrapper;
  }

  /**
   * シンセサイザーのDOMの更新
   * @param {number} channel
   * @param {number} key
   * @param {number} velocity
   */
  updateSynthElement(channel, key, velocity) {
    if (!this.element) {
      return;
    }
    /** @type {HTMLDivElement} */
    const channelElem = this.element.querySelectorAll(`.instrument > .channel`)[
      channel
    ];

    if (channelElem.dataset.isIntersecting) {
      /** @type {HTMLDivElement} */
      const keyElem = channelElem.querySelector(`.key:nth-child(${key + 1})`);
      if (velocity === 0) {
        if (keyElem.classList.contains('note-on')) {
          keyElem.classList.remove('note-on');
        }
        keyElem.style.opacity = 1;
      } else {
        keyElem.classList.add('note-on');
        // ベロシティに応じて透過度を調整
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
    const bankElement = this.element
      .querySelectorAll(`.instrument > .channel`)
      [channel].querySelector('.bank > select');

    while (bankElement.firstChild)
      bankElement.removeChild(bankElement.firstChild);

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
    const dom = this.element.querySelectorAll(`.instrument > .channel`)[
      channel
    ];
    /** @type {number} */
    const bankIndex = this.channelBank[channel];
    /** @type {HTMLElement} */
    const bankElement = dom.querySelector('.bank > select');
    /** @type {HTMLElement} */
    const programElement = dom.querySelector('.program > select');

    bankElement.value = this.channelBank[channel];
    while (programElement.firstChild)
      programElement.removeChild(programElement.firstChild);

    for (const programNo in this.programSet[bankIndex]) {
      if (!{}.hasOwnProperty.call(this.programSet[bankIndex], programNo)) {
        continue;
      }
      // TODO: 存在しないプログラムの場合、現状では空白になってしまう
      const option = document.createElement('option');
      option.value = programNo;
      option.textContent = `${('000' + (parseInt(programNo) + 1)).slice(-3)}:${
        this.programSet[bankIndex][programNo]
      }`;
      if (programNo === this.channelInstrument[channel]) {
        option.selected = 'selected';
      }
      programElement.appendChild(option);
    }
  }

  /**
   * ノートオン
   * @param {number} channel NoteOn するチャンネル.
   * @param {number} key NoteOn するキー.
   * @param {number} velocity 強さ.
   */
  noteOn(channel, key, velocity) {
    /** @type {number} */
    const bankIndex = this.channelBank[channel];
    /** @type {Object} */
    const bank =
      typeof this.bankSet[bankIndex] === 'object'
        ? this.bankSet[bankIndex]
        : this.bankSet[0];
    /** @type {Object} */
    let instrument;

    if (typeof bank[this.channelInstrument[channel]] === 'object') {
      // 音色が存在する場合
      instrument = bank[this.channelInstrument[channel]];
    } else if (this.percussionPart[channel]) {
      // パーカッションバンクが選択されている場合で音色が存在しない場合Standard Kitを選択
      instrument = this.bankSet[this.isXG ? 127 : 128][0];
    } else {
      // 通常バンクが選択されている状態で音色が存在しない場合バンク0を選択
      instrument = this.bankSet[0][this.channelInstrument[channel]];
    }

    if (instrument[key] === void 0) {
      // TODO
      console.warn(
        'instrument not found: bank=%s instrument=%s channel=%s key=%s',
        bankIndex,
        this.channelInstrument[channel],
        channel,
        key
      );
      return;
    }
    /** @type {Object} */
    const instrumentKey = instrument[key];
    /** @type {number} */
    let panpot =
      this.channelPanpot[channel] === 0
        ? (Math.random() * 127) | 0
        : this.channelPanpot[channel] - 64;
    panpot /= panpot < 0 ? 64 : 63;

    // create note information
    instrumentKey['channel'] = channel;
    instrumentKey['key'] = key;
    instrumentKey['velocity'] = velocity;
    instrumentKey['panpot'] = panpot;
    instrumentKey['volume'] = this.channelVolume[channel] / 127;
    instrumentKey['pitchBend'] = this.channelPitchBend[channel] - 8192;
    instrumentKey['expression'] = this.channelExpression[channel];
    instrumentKey['pitchBendSensitivity'] = Math.round(
      this.channelPitchBendSensitivity[channel]
    );
    instrumentKey['mute'] = this.channelMute[channel];
    instrumentKey['releaseTime'] = this.channelRelease[channel];
    instrumentKey['cutOffFrequency'] = this.cutOffFrequency[channel];
    instrumentKey['harmonicContent'] = this.harmonicContent[channel];
    instrumentKey['reverb'] = this.reverb[channel];
    instrumentKey['modulation'] = this.modulation[channel];

    // percussion
    if (bankIndex > 125) {
      /*
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
      */
      instrument['volume'] *= this.percussionVolume[key] / 127;
    }

    // note on
    /** @type {SynthesizerNote} */
    const note = new SynthesizerNote(this.ctx, this.gainMaster, instrumentKey);
    note.noteOn();
    this.currentNoteOn[channel].push(note);

    this.updateSynthElement(channel, key, velocity);
  }

  /**
   * ノートオフ
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
  }

  /**
   * ホールド（ダンパーペダル）
   * @param {number} channel ホールドするチャンネル
   * @param {number} value 値
   */
  hold(channel, value) {
    /** @type {Array.<SynthesizerNote>} */
    const currentNoteOn = this.currentNoteOn[channel];
    /** @type {boolean} 0以外はonである。 */
    const hold = (this.channelHold[channel] = value > 64);
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
      const channelElement = this.element.querySelectorAll(
        `.instrument > .channel`
      )[channel];
      if (!channelElement) {
        return;
      }
      if (this.channelHold[channel]) {
        channelElement.classList.add('hold');
      } else if (channelElement.classList.contains('hold')) {
        channelElement.classList.remove('hold');
      }
    }
  }

  /**
   * バンクセレクトMSB（GS音源/GM Level2用）
   * @param {number} channel チャンネルのバンクセレクトMSB
   * @param {number} value 値
   */
  bankSelectMsb(channel, value) {
    if (this.isXG) {
      // 念の為バンクを0にリセット
      this.channelBank[channel] = 0;
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
      } else if (value === 128) {
        this.channelBank[channel] = 127;
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
   * バンクセレクトLSB（XG音源）
   * @param {number} channel チャンネルのバンクセレクトLSB
   * @param {number} value 値
   */
  bankSelectLsb(channel, value) {
    // XG音源以外は処理しない
    if (!this.isXG || this.percussionPart[channel] === true) {
      return;
    }

    // 125より値が大きい場合、パーカッションとして処理
    this.percussionPart[channel] = value >= 125;

    this.channelBank[channel] = value;
    this.updateBankSelect(channel);
  }

  /**
   * プログラムチェンジ
   * @param {number} channel 音色を変更するチャンネル.
   * @param {number} instrument 音色番号.
   */
  programChange(channel, instrument) {
    this.channelInstrument[channel] = instrument;

    this.bankChange(channel, this.channelBank[channel]);
    if (this.element) {
      this.element
        .querySelectorAll(`.instrument > .channel`)
        [channel].querySelector('.program > select').value = instrument;
    }
  }

  /**
   * バンクセレクト
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
    }

    // TODO: 厳密にはMIDI音源はプログラムチェンジがあったときに、バンク・セレクトの値が反映されるのでこの実装は正しくない。
    this.updateProgramSelect(channel);

    if (this.element) {
      this.element
        .querySelectorAll(`.instrument > .channel`)
        [channel].querySelector('.bank > select').value = bank;
    }
  }

  /**
   * ボリューム
   * @param {number} channel 音量を変更するチャンネル.
   * @param {number} volume 音量(0-127).
   */
  volumeChange(channel, volume) {
    if (this.element) {
      this.element
        .querySelectorAll(`.instrument > .channel`)
        [channel].querySelector('.volume var').innerText = volume;
    }

    this.channelVolume[channel] = volume;
  }

  /**
   * エクスプレッション
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

    if (this.element) {
      this.element
        .querySelectorAll(`.instrument > .channel`)
        [channel].querySelector('.expression var').innerText = expression;
    }

    this.channelExpression[channel] = expression;
  }

  /**
   * パンポット
   * @param {number} channel panpot を変更するチャンネル.
   * @param {number} panpot panpot(0-127).
   */
  panpotChange(channel, panpot) {
    this.channelPanpot[channel] = panpot;
    if (this.element) {
      const dom = this.element
        .querySelectorAll(`.instrument > .channel`)
        [channel].querySelector('.panpot .progress-bar');
      const percentage = (panpot / 127) * 100;
      dom.style.width = `${percentage}%`;
      dom.classList.remove('left', 'right');
      if (panpot === 64) {
        return;
      }
      dom.classList.add([panpot < 63 ? 'left' : 'right']);
    }
  }

  /**
   * ピッチベンド
   * @param {number} channel ピッチベンドを変更するチャンネル.
   * @param {number} lowerByte
   * @param {number} higherByte
   */
  pitchBend(channel, lowerByte, higherByte) {
    /** @type {number} */
    const bend = (lowerByte & 0x7f) | ((higherByte & 0x7f) << 7);
    /** @type {number} */
    let i;
    /** @type {number} */
    let il;
    /** @type {Array.<SoundFont.SynthesizerNote>} */
    const currentNoteOn = this.currentNoteOn[channel];
    /** @type {number} */
    const calculated = bend - 8192;

    for (i = 0, il = currentNoteOn.length; i < il; ++i) {
      currentNoteOn[i].updatePitchBend(calculated);
    }

    this.channelPitchBend[channel] = bend;

    if (this.element) {
      const dom = this.element
        .querySelectorAll(`.instrument > .channel`)
        [channel].querySelector('.pitchBend .progress-bar');
      dom.style.width = `${Math.floor((bend / 16384) * 100)}%`;
      dom.classList.remove('high', 'low');
      if (calculated === 0) {
        return;
      }
      dom.classList.add(calculated < 0 ? 'low' : 'high');
    }
  }

  /**
   * ピッチベンド・センシビリティ
   * @param {number} channel pitch bend sensitivity を変更するチャンネル.
   * @param {number} sensitivity
   */
  pitchBendSensitivity(channel, sensitivity) {
    if (this.element) {
      this.element
        .querySelectorAll(`.instrument > .channel`)
        [channel].querySelector('.pitchBendSensitivity > var').innerText =
        sensitivity;
    }
    this.channelPitchBendSensitivity[channel] = sensitivity;
  }

  /**
   * アタックタイム
   * @param {number} channel
   * @param {number} attackTime
   */
  attackTime(channel, attackTime) {
    this.channelAttack[channel] = attackTime;
  }

  /**
   * ディケイタイム
   * @param {number} channel
   * @param {number} decayTime
   */
  decayTime(channel, decayTime) {
    this.channelDecay[channel] = decayTime;
  }

  /**
   * サスティンタイム
   * @param {number} channel
   * @param {number} sustinTime
   */
  sustinTime(channel, sustinTime) {
    this.channelSustin[channel] = sustinTime;
  }

  /**
   * リリースタイム
   * @param {number} channel
   * @param {number} releaseTime
   */
  releaseTime(channel, releaseTime) {
    this.channelRelease[channel] = releaseTime;
  }

  /**
   * ハーモニックコンテント（ブライトネス）
   * @param {number} channel
   * @param {number} value
   */
  harmonicContent(channel, value) {
    this.channelHarmonicContent[channel] = value;
  }

  /**
   * カットオフフリクエンシー
   * @param {number} channel
   * @param {number} value
   */
  cutOffFrequency(channel, value) {
    this.channelCutOffFrequency[channel] = value;
  }

  /**
   * リバーブエフェクト
   * @param {number} channel
   * @param {number} depth
   */
  reverbDepth(channel, depth) {
    // リバーブ深度は、ドライ／ウェット比とする。
    this.reverb[channel].mix(depth / 127);

    if (this.element) {
      this.element
        .querySelectorAll(`.instrument > .channel`)
        [channel].querySelector('.reverbDepth var').innerText = depth;
    }
  }

  /**
   * モジュレーション（ビブラート）デプス
   * @param {number} channel
   * @param {number} depth
   */
  modulationDepth(channel, depth) {
    if (this.element) {
      const dom = this.element
        .querySelectorAll(`.instrument > .channel`)
        [channel].querySelector('.pitchBend .progress-bar');

      // モデレーターが0でないときは、ピッチに斜め線を入れる
      if (depth !== 0) {
        dom.classList.add(['progress-bar-striped']);
      } else {
        dom.classList.remove(['progress-bar-striped']);
      }
    }
    this.modulation[channel] = depth;
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
   * オールノートオフ
   * @param {number} channel NoteOff するチャンネル.
   */
  allNoteOff(channel) {
    /** @type {Array.<SynthesizerNote>} */
    const currentNoteOn = this.currentNoteOn[channel];

    // ホールドを解除
    this.hold(channel, 0);

    // 再生中の音をすべて止める
    while (currentNoteOn.length > 0) {
      this.noteOff(channel, currentNoteOn[0].key, 0);
    }
  }

  /**
   * オールサウンドオフ
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
    }

    // ホールドを解除
    this.hold(channel, 0);
  }

  /**
   * リセットオールコントロール
   * @param {number} channel リセットするチャンネル
   */
  resetAllControl(channel) {
    this.allNoteOff(channel);
    this.expression(channel, 127);
    this.pitchBend(channel, 0x00, 0x40);
  }

  /**
   * ミュート
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
   * パーカッションチャネルにする
   * @param {number} channel パーカッションチャネルとしてセットするチャンネル
   * @param {boolean} sw パーカッションチャネルか通常かのスイッチ
   */
  setPercussionPart(channel, sw) {
    if (!this.isXG) {
      this.channelBank[channel] = 128;
    } else {
      this.channelBank[channel] = 127;
    }
    this.percussionPart[channel] = sw;
  }

  /**
   * MIDI音源のメッセージ欄に送られるsysExを解析
   * @param {array} message
   */
  processMidiMessage(message) {
    clearTimeout(this.timer);
    const dom = this.element.querySelector('.header .keys code');
    dom.innerText = message.map((e) => String.fromCharCode(e)).join('');

    // 10秒後に削除
    this.timer = setTimeout(() => {
      dom.innerText = '';
    }, 50000);
  }
}

export default Synthesizer;

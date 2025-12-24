import Reverb from '@logue/reverb';

import Parser from './sf2.js';
import SynthesizerNote from './sound_font_synth_note.js';

/**
 * Synthesizer Class
 *
 * @author imaya
 */
export default class Synthesizer {
  // Constants
  static MIDI_CHANNELS = 16;
  static MIDI_KEYS = 128;
  static DEFAULT_CHANNEL_VALUE = 64;
  static DEFAULT_EXPRESSION = 127;
  static DEFAULT_VOLUME = 100;
  static DEFAULT_PITCH_BEND_SENSITIVITY = 2;
  static MASTER_VOLUME_DEFAULT = 16384;
  static MASTER_VOLUME_MAX = 16383;
  static MASTER_VOLUME_DIVISOR = 16384;
  static BASE_VOLUME_DIVISOR = 0xffff;
  static DRUM_CHANNEL = 9; // 0-indexed
  static BUFFER_SIZE = 2048;
  static PITCH_BEND_CENTER = 8192;
  static PERCUSSION_BANK_XG = 127;
  static PERCUSSION_BANK_GS = 128;
  static SFX_BANK = 64;
  static SFX_BANK_XG = 125;

  // MIDI Note numbers for percussion
  static MIDI_CLOSED_HI_HAT = 42;
  static MIDI_PEDAL_HI_HAT = 44;
  static MIDI_OPEN_HI_HAT = 46;
  static MIDI_MUTE_TRIANGLE = 80;
  static MIDI_OPEN_TRIANGLE = 81;

  /** @param {Uint8Array} input */
  constructor(input) {
    /** @type {number} */
    let i;
    /** @type {Uint8Array} */
    this.input = input;
    /** @type {Parser} */
    this.parser = undefined;
    /** @type {number} */
    this.bank = 0;
    /** @type {Object} */
    this.bankSet = {};
    /** @type {number} */
    this.bufferSize = Synthesizer.BUFFER_SIZE;
    /** @type {AudioContext} */
    this.ctx = this.getAudioContext();
    /** @type {GainNode} */
    this.gainMaster = this.ctx.createGain();
    /** @type {AudioBufferSourceNode} */
    this.bufSrc = this.ctx.createBufferSource();
    /** @type {number[]} */
    this.channelInstrument = new Array(Synthesizer.MIDI_CHANNELS).fill(0);
    /** @type {number[]} */
    this.channelBank = new Array(Synthesizer.MIDI_CHANNELS).fill(0);
    this.channelBank[Synthesizer.DRUM_CHANNEL] = Synthesizer.PERCUSSION_BANK_XG;
    /** @type {number[]} */
    this.channelVolume = new Array(Synthesizer.MIDI_CHANNELS).fill(
      Synthesizer.DEFAULT_VOLUME
    );
    /** @type {number[]} */
    this.channelPanpot = new Array(Synthesizer.MIDI_CHANNELS).fill(
      Synthesizer.DEFAULT_CHANNEL_VALUE
    );
    /** @type {number[]} */
    this.channelPitchBend = new Array(Synthesizer.MIDI_CHANNELS).fill(0);
    /** @type {number[]} */
    this.channelPitchBendSensitivity = new Array(
      Synthesizer.MIDI_CHANNELS
    ).fill(Synthesizer.DEFAULT_PITCH_BEND_SENSITIVITY);
    /** @type {number[]} */
    this.channelExpression = new Array(Synthesizer.MIDI_CHANNELS).fill(
      Synthesizer.DEFAULT_EXPRESSION
    );
    /** @type {number[]} */
    this.channelAttack = new Array(Synthesizer.MIDI_CHANNELS).fill(
      Synthesizer.DEFAULT_CHANNEL_VALUE
    );
    /** @type {number[]} */
    this.channelDecay = new Array(Synthesizer.MIDI_CHANNELS).fill(
      Synthesizer.DEFAULT_CHANNEL_VALUE
    );
    /** @type {number[]} */
    this.channelSustin = new Array(Synthesizer.MIDI_CHANNELS).fill(
      Synthesizer.DEFAULT_CHANNEL_VALUE
    );
    /** @type {number[]} */
    this.channelRelease = new Array(Synthesizer.MIDI_CHANNELS).fill(
      Synthesizer.DEFAULT_CHANNEL_VALUE
    );

    /** @type {boolean[]} */
    this.channelHold = new Array(Synthesizer.MIDI_CHANNELS).fill(false);
    /** @type {number[]} */
    this.channelHarmonicContent = new Array(Synthesizer.MIDI_CHANNELS).fill(
      Synthesizer.DEFAULT_CHANNEL_VALUE
    );
    /** @type {number[]} */
    this.channelCutOffFrequency = new Array(Synthesizer.MIDI_CHANNELS).fill(
      Synthesizer.DEFAULT_CHANNEL_VALUE
    );

    /** @type {'GM'|'GM2'|'XG'|'GS'} */
    this.mode = 'GM2';

    /** @type {string[][]} */
    this.programSet = [];

    /** @type {boolean[]} */
    this.channelMute = new Array(Synthesizer.MIDI_CHANNELS).fill(false);
    /** @type {SynthesizerNote[][]} */
    this.currentNoteOn = Array.from(
      { length: Synthesizer.MIDI_CHANNELS },
      () => []
    );
    /** @type {number} @const */
    this.baseVolume = 1 / Synthesizer.BASE_VOLUME_DIVISOR;
    /** @type {number} */
    this.masterVolume = Synthesizer.MASTER_VOLUME_DEFAULT;

    /** @type {boolean[]} */
    this.percussionPart = new Array(Synthesizer.MIDI_CHANNELS).fill(false);
    this.percussionPart[Synthesizer.DRUM_CHANNEL] = true;

    /** @type {number[]} */
    this.percussionVolume = new Array(Synthesizer.MIDI_KEYS).fill(
      Synthesizer.DEFAULT_EXPRESSION
    );

    /** @type {string[][]} */
    this.programSet = [];

    /** @type {Reverb[]} リバーブエフェクト（チャンネル毎に用意する） */
    this.reverb = [];

    /** @type {number[]} モジュレーション（ビブラート） */
    this.modulation = new Array(Synthesizer.MIDI_CHANNELS).fill(0);

    /** @type {BiquadFilterNode[]} フィルタ */
    this.filter = [];

    for (i = 0; i < Synthesizer.MIDI_CHANNELS; ++i) {
      // @ts-ignore
      this.reverb[i] = new Reverb(this.ctx, { noise: 'violet' });
      // フィルタを定義
      this.filter[i] = this.ctx.createBiquadFilter();
    }

    /** @type {string[]} 表示項目 */
    this.items = [];

    /** @type {IntersectionObserver} 交差していない */
    this.intersection = new IntersectionObserver(
      entries =>
        entries.forEach(entry => {
          // @ts-ignore
          entry.target.dataset.isIntersecting = entry.isIntersecting;
        }),
      {}
    );

    /** @type {NodeJS.Timeout} タイマーのスレッド */
    this.timer = undefined;
    /** @type {boolean} */
    this.drag = false;
  }

  /** @return {AudioContext} */
  getAudioContext() {
    /** @type {AudioContext} */
    const ctx = new AudioContext();

    // Defreeze AudioContext for iOS.
    const initAudioContext = () => {
      document.removeEventListener('touchstart', initAudioContext);
      /** @type {AudioBufferSourceNode} wake up AudioContext */
      const emptySource = ctx.createBufferSource();
      emptySource.start();
      emptySource.stop();
    };

    document.addEventListener('touchstart', initAudioContext);

    return ctx;
  }

  /**
   * System Reset
   *
   * @param {'GM'|'GM2'|'XG'|'GS'} mode 音源モード
   */
  init(mode = 'GM') {
    this.gainMaster.disconnect();

    this.refreshInstruments(this.input);

    this.mode = mode;

    for (let i = 0; i < Synthesizer.MIDI_CHANNELS; ++i) {
      this.setPercussionPart(i, i === 9);
      this.programChange(i, 0);
      this.volumeChange(i, 100);
      this.panpotChange(i, 64);
      this.pitchBend(i, 0x00, 0x40); // 8192
      this.pitchBendSensitivity(i, 2);
      this.hold(i, 0);
      this.expression(i, 127);
      this.bankSelectMsb(i, i === 9 ? 127 : 0);
      this.bankSelectLsb(i, i === 9 ? 127 : 0);
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

    this.setPercussionPart(Synthesizer.DRUM_CHANNEL, true);

    for (let i = 0; i < Synthesizer.MIDI_KEYS; ++i) {
      this.percussionVolume[i] = 127;
    }

    this.setMasterVolume(Synthesizer.MASTER_VOLUME_DEFAULT / 2);

    this.gainMaster.connect(this.ctx.destination);

    if (this.element) {
      /** @type {HTMLDivElement} */
      const modeElement = this.element.querySelector('.header .keys div');
      modeElement.innerText = mode + ' Mode';
      /** @type {NodeListOf<HTMLSelectElement>} */
      const bankSelectElement = this.element.querySelectorAll(
        '.instrument .bank > select'
      );

      bankSelectElement.forEach(element => (element.disabled = mode === 'GM'));
      this.element.dataset.mode = mode;
    }
  }

  /** Close AudioContext */
  async close() {
    await this.ctx.close();
  }

  /** @param {Uint8Array} input */
  refreshInstruments(input) {
    this.input = input;
    this.parser = new Parser(input, {
      sampleRate: this.ctx.sampleRate,
    });
    this.bankSet = this.createAllInstruments();
  }

  /** @returns {Object[][]} */
  createAllInstruments() {
    /** @type {Parser} */
    const parser = this.parser;
    parser.parse();
    /** @type {Array} TODO */
    const presets = parser.createPreset();
    /** @type {Array} TODO */
    const instruments = parser.createInstrument();
    /** @type {Array} */
    const banks = [];
    /** @type {Record<number, any>} */
    let bank;
    /** @type {number} */
    let bankNumber;
    /** @type {Object} */
    let instrument;
    /** @type {number} */
    let presetNumber;
    /** @type {string} */
    let presetName;

    const programSet = [];

    presets.forEach(preset => {
      presetNumber = preset.header.preset;
      bankNumber = preset.header.bank;
      presetName = preset.name.replace(/\0*$/, '');

      if (typeof preset.instrument !== 'number') {
        return;
      }

      instrument = instruments[preset.instrument];
      if (instrument.name.replace(/\0*$/, '') === 'EOI') {
        return;
      }

      // select bank
      banks[bankNumber] = banks[bankNumber] ?? [];
      bank = banks[bankNumber];
      bank[presetNumber] = {};
      bank[presetNumber].name = presetName;

      instrument.info.forEach(info =>
        this.createNoteInfo(parser, info, bank[presetNumber])
      );

      if (!programSet[bankNumber]) {
        programSet[bankNumber] = [];
      }
      programSet[bankNumber][presetNumber] = presetName;
    });

    this.programSet = programSet;

    return banks;
  }

  // Constants for SoundFont calculations
  static SEMITONE_RATIO = 1.0594630943592953; // 2^(1/12)
  static CENTS_PER_OCTAVE = 1200;
  static COARSE_OFFSET_MULTIPLIER = 32768;
  static BASE_FREQUENCY_HZ = 8.176; // C-1
  static MIDDLE_C_NOTE = 60; // C4
  static ENVELOPE_SUSTAIN_DIVISOR = 1000;
  static FILTER_Q_DIVISOR = 10;
  static ATTENUATION_DIVISOR = 10;
  static REVERB_SEND_DIVISOR = 10;
  static PAN_DIVISOR = 1200;
  static MODULATION_DIVISOR = 100;

  /**
   * @param {Parser} parser
   * @param {any} info
   * @param {any} preset
   */
  createNoteInfo(parser, info, preset) {
    /** @type {*} */
    const generator = info.generator;

    if (!generator.keyRange || !generator.sampleID) {
      return;
    }

    // デフォルト値
    // https://www.utsbox.com/?p=2390

    /** @type {number} 33: DelayVolEnv */
    const volDelay = this.getModGenAmount(generator, 'delayVolEnv');
    /** @type {number} 34: AttackVolEnv */
    const volAttack = this.getModGenAmount(generator, 'attackVolEnv');
    /** @type {number} 35: HoldVolEnv */
    const volHold = this.getModGenAmount(generator, 'holdVolEnv');
    /** @type {number} 36: DecayVolEnv */
    const volDecay = this.getModGenAmount(generator, 'decayVolEnv');
    /** @type {number} 37: SustainVolEnv */
    const volSustain = this.getModGenAmount(generator, 'sustainVolEnv');
    /** @type {number} 38: ReleaseVolEnv */
    const volRelease = this.getModGenAmount(generator, 'releaseVolEnv');
    /** @type {number} 25: DelayModEnv */
    const modDelay = this.getModGenAmount(generator, 'delayModEnv');
    /** @type {number} 26: AttackModEnv */
    const modAttack = this.getModGenAmount(generator, 'attackModEnv');
    /** @type {number} 27: HoldModEnv */
    const modHold = this.getModGenAmount(generator, 'holdModEnv');
    /** @type {number} 28: DecayModEnv */
    const modDecay = this.getModGenAmount(generator, 'decayModEnv');
    /** @type {number} 29: SustainModEnv */
    const modSustain = this.getModGenAmount(generator, 'sustainModEnv');
    /** @type {number} 30: ReleaseModEnv */
    const modRelease = this.getModGenAmount(generator, 'releaseModEnv');
    /** @type {number} 56: ScaleTuning */
    const scale = this.getModGenAmount(generator, 'scaleTuning') / 100;
    /** @type {number} */
    const tune =
      this.getModGenAmount(generator, 'coarseTune') +
      this.getModGenAmount(generator, 'fineTune') / 100;
    /** @type {number} */
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
        sampleModes,
        basePlaybackRate:
          Synthesizer.SEMITONE_RATIO **
          ((i -
            this.getModGenAmount(generator, 'overridingRootKey') +
            tune +
            sampleHeader.pitchCorrection / Synthesizer.MODULATION_DIVISOR) *
            scale),
        modEnvToPitch:
          this.getModGenAmount(generator, 'modEnvToPitch') /
          Synthesizer.MODULATION_DIVISOR,
        scaleTuning: scale,
        start:
          this.getModGenAmount(generator, 'startAddrsCoarseOffset') *
            Synthesizer.COARSE_OFFSET_MULTIPLIER +
          this.getModGenAmount(generator, 'startAddrsOffset'),
        end:
          this.getModGenAmount(generator, 'endAddrsCoarseOffset') *
            Synthesizer.COARSE_OFFSET_MULTIPLIER +
          this.getModGenAmount(generator, 'endAddrsOffset'),
        loopStart:
          sampleHeader.startLoop +
          this.getModGenAmount(generator, 'startloopAddrsCoarseOffset') *
            Synthesizer.COARSE_OFFSET_MULTIPLIER +
          this.getModGenAmount(generator, 'startloopAddrsOffset'),
        loopEnd:
          sampleHeader.endLoop +
          this.getModGenAmount(generator, 'endloopAddrsCoarseOffset') *
            Synthesizer.COARSE_OFFSET_MULTIPLIER +
          this.getModGenAmount(generator, 'endloopAddrsOffset'),
        volDelay: 2 ** (volDelay / Synthesizer.CENTS_PER_OCTAVE),
        volAttack: 2 ** (volAttack / Synthesizer.CENTS_PER_OCTAVE),
        volHold:
          2 ** (volHold / Synthesizer.CENTS_PER_OCTAVE) *
          2 **
            (((Synthesizer.MIDDLE_C_NOTE - i) *
              this.getModGenAmount(generator, 'keynumToVolEnvHold')) /
              Synthesizer.CENTS_PER_OCTAVE),
        volDecay:
          2 ** (volDecay / Synthesizer.CENTS_PER_OCTAVE) *
          2 **
            (((Synthesizer.MIDDLE_C_NOTE - i) *
              this.getModGenAmount(generator, 'keynumToVolEnvDecay')) /
              Synthesizer.CENTS_PER_OCTAVE),
        volSustain: volSustain / Synthesizer.ENVELOPE_SUSTAIN_DIVISOR,
        volRelease: 2 ** (volRelease / Synthesizer.CENTS_PER_OCTAVE),
        modDelay: 2 ** (modDelay / Synthesizer.CENTS_PER_OCTAVE),
        modAttack: 2 ** (modAttack / Synthesizer.CENTS_PER_OCTAVE),
        modHold:
          2 ** (modHold / Synthesizer.CENTS_PER_OCTAVE) *
          2 **
            (((Synthesizer.MIDDLE_C_NOTE - i) *
              this.getModGenAmount(generator, 'keynumToModEnvHold')) /
              Synthesizer.CENTS_PER_OCTAVE),
        modDecay:
          2 ** (modDecay / Synthesizer.CENTS_PER_OCTAVE) *
          2 **
            (((Synthesizer.MIDDLE_C_NOTE - i) *
              this.getModGenAmount(generator, 'keynumToModEnvDecay')) /
              Synthesizer.CENTS_PER_OCTAVE),
        modSustain: modSustain / Synthesizer.ENVELOPE_SUSTAIN_DIVISOR,
        modRelease: 2 ** (modRelease / Synthesizer.CENTS_PER_OCTAVE),
        initialFilterFc:
          Synthesizer.BASE_FREQUENCY_HZ *
          2 **
            (this.getModGenAmount(generator, 'initialFilterFc') /
              Synthesizer.CENTS_PER_OCTAVE),
        modEnvToFilterFc:
          this.getModGenAmount(generator, 'modEnvToFilterFc') /
          Synthesizer.MODULATION_DIVISOR,
        initialFilterQ:
          this.getModGenAmount(generator, 'initialFilterQ') /
          Synthesizer.FILTER_Q_DIVISOR,
        reverbEffectSend:
          this.getModGenAmount(generator, 'reverbEffectSend') /
          Synthesizer.REVERB_SEND_DIVISOR,
        initialAttenuation:
          this.getModGenAmount(generator, 'initialAttenuation') /
          Synthesizer.ATTENUATION_DIVISOR,
        freqVibLFO:
          Synthesizer.BASE_FREQUENCY_HZ *
          2 **
            (this.getModGenAmount(generator, 'freqVibLFO') /
              Synthesizer.CENTS_PER_OCTAVE),
        pan: this.getModGenAmount(generator, 'pan') / Synthesizer.PAN_DIVISOR,
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
      : Parser.getGeneratorTable()[enumeratorType];
  }

  /**
   * Start Tone Generator
   */
  start() {
    this.connect();
    this.bufSrc.start(0);
    this.setMasterVolume(Synthesizer.MASTER_VOLUME_MAX);
  }

  /** @param {number} volume */
  setMasterVolume(volume) {
    this.masterVolume = volume;
    this.gainMaster.gain.value =
      this.baseVolume * (volume / Synthesizer.MASTER_VOLUME_DIVISOR);
  }

  /** Connect root AudioContext */
  connect() {
    this.bufSrc.connect(this.gainMaster);
  }

  /** Disconnect root AudioContext */
  disconnect() {
    this.bufSrc.disconnect(this.gainMaster);
    this.bufSrc.buffer = null;
  }

  /** @return {HTMLDivElement} */
  drawSynth() {
    /** @type {Document} */
    const doc = window.document;
    /** @type {HTMLDivElement} */
    const wrapper = (this.element = doc.createElement('div'));
    wrapper.className = 'synthesizer';
    /** @type {HTMLDivElement} */
    const instElem = doc.createElement('div');
    instElem.className = 'instrument';
    /** @type {string[]} */
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

    for (let channel = 0; channel < Synthesizer.MIDI_CHANNELS; channel++) {
      /** @type {HTMLDivElement} */
      const channelElem = doc.createElement('div');
      channelElem.className = 'channel';
      // ホールドを無効化する処理
      channelElem.addEventListener(eventStart, () => {
        this.hold(channel, 0);
      });
      for (const item in this.items) {
        if (!Object.hasOwn(this.items, item)) {
          continue;
        }
        /** @type {HTMLDivElement} */
        const itemElem = doc.createElement('div');
        itemElem.className = this.items[item];

        switch (this.items[item]) {
          case 'mute': {
            /** @type {HTMLDivElement | null} */
            const checkboxElement = doc.createElement('div');
            checkboxElement.className = 'form-check form-check-inline';
            /** @type {HTMLInputElement | null} */
            const checkbox = doc.createElement('input');
            checkbox.ariaLabel = `Ch.${channel + 1} Mute`;
            checkbox.setAttribute('type', 'checkbox');
            checkbox.className = 'form-check-input';
            checkbox.id = 'mute' + channel + 'ch';
            checkbox.value = channel.toString();
            checkbox.addEventListener(
              'change',
              event => {
                // @ts-ignore
                this.mute(channel, event.target.checked);
              },
              false
            );
            checkboxElement.appendChild(checkbox);
            /** @type {HTMLLabelElement} */
            const labelElem = doc.createElement('label');

            labelElem.className = 'form-check-label';
            labelElem.textContent = (channel + 1).toString();
            labelElem.setAttribute('for', 'mute' + channel + 'ch');
            checkboxElement.appendChild(labelElem);
            itemElem.appendChild(checkboxElement);
            break;
          }
          case 'bank': {
            /** @type {HTMLSelectElement} Bank select */
            const bankSelect = doc.createElement('select');
            bankSelect.ariaLabel = `Ch.${channel + 1} Bank Select`;
            bankSelect.className = 'form-select form-select-sm bank-select';
            bankSelect.addEventListener(
              'change',
              ((synth, ch) => event => {
                /** @type {HTMLSelectElement} */
                const program = channelElem.querySelector('.program select');
                // console.log(ch, event.target.value, program);
                // @ts-ignore
                synth.bankChange(ch, event.target.value);
                synth.programChange(ch, Number.parseInt(program.value));
              })(this, channel),
              false
            );
            itemElem.appendChild(bankSelect);
            break;
          }
          case 'program': {
            /** @type {HTMLSelectElement} Program change */
            const select = doc.createElement('select');
            select.className = 'form-select form-select-sm';
            select.ariaLabel = `Ch.${channel + 1} Program Change`;
            select.addEventListener(
              'change',
              ((synth, ch) => event => {
                // @ts-ignore
                synth.programChange(ch, event.target.value);
              })(this, channel),
              false
            );
            itemElem.appendChild(select);
            break;
          }
          case 'volume': {
            /** @type {HTMLElement} */
            const volumeElem = document.createElement('var');
            volumeElem.ariaLabel = `Ch.${channel + 1} Volume`;
            volumeElem.innerText = '100';
            itemElem.appendChild(volumeElem);
            break;
          }
          case 'expression': {
            /** @type {HTMLElement} */
            const expressionElem = document.createElement('var');
            expressionElem.ariaLabel = `Ch.${channel + 1} Expression`;
            expressionElem.innerText = '127';
            itemElem.appendChild(expressionElem);
            break;
          }
          case 'pitchBendSensitivity': {
            /** @type {HTMLElement} */
            const pitchSensElem = document.createElement('var');
            pitchSensElem.ariaLabel = `Ch.${
              channel + 1
            } Pitch Bend Sensitivity`;
            pitchSensElem.innerText = '2';
            itemElem.appendChild(pitchSensElem);
            break;
          }
          case 'reverbDepth': {
            /** @type {HTMLElement} */
            const reverbDepthElem = document.createElement('var');
            reverbDepthElem.ariaLabel = `Ch.${channel + 1} Reverb Depth`;
            reverbDepthElem.innerText = '40';
            itemElem.appendChild(reverbDepthElem);
            break;
          }
          case 'panpot': {
            /** @type {HTMLDivElement} */
            const panpotOuter = doc.createElement('div');
            panpotOuter.role = 'progressbar';
            panpotOuter.ariaLabel = `Ch.${channel + 1} Panpod`;
            panpotOuter.ariaValueMin = '0';
            panpotOuter.ariaValueNow = '64';
            panpotOuter.ariaValueMax = '127';
            panpotOuter.className = 'progress';
            const panpot = doc.createElement('div');
            // 緑色
            panpot.className = 'progress-bar';
            panpotOuter.appendChild(panpot);
            itemElem.appendChild(panpotOuter);
            break;
          }
          case 'pitchBend': {
            /** @type {HTMLDivElement} */
            const pitchOuter = doc.createElement('div');
            pitchOuter.className = 'progress';
            pitchOuter.role = 'progressbar';
            pitchOuter.ariaLabel = `Ch.${channel + 1} Pitch Bend`;
            pitchOuter.ariaValueMin = '-8192';
            pitchOuter.ariaValueNow = '0';
            pitchOuter.ariaValueMax = '8192';
            pitchOuter.className = 'progress';
            /** @type {HTMLDivElement} */
            const pitch = doc.createElement('div');
            // 黄色
            pitch.className = 'progress-bar progress-bar-animated';
            pitchOuter.appendChild(pitch);
            itemElem.appendChild(pitchOuter);
            break;
          }
          case 'keys': {
            // 鍵盤の描画
            for (let key = 0; key < 127; key++) {
              /** @type {HTMLDivElement} */
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
                ((synth, ch, k) => event => {
                  event.preventDefault();
                  synth.drag = true;
                  synth.noteOn(ch, k, 127);
                })(this, channel, key)
              );
              keyElem.addEventListener(
                'mouseover',
                ((synth, ch, k) => event => {
                  event.preventDefault();
                  if (synth.drag) {
                    synth.noteOn(ch, k, 127);
                  }
                })(this, channel, key)
              );
              keyElem.addEventListener(
                'mouseout',
                ((synth, ch, k) => event => {
                  event.preventDefault();
                  synth.noteOff(ch, k);
                })(this, channel, key)
              );
              keyElem.addEventListener(
                eventEnd,
                ((synth, ch, k) => event => {
                  event.preventDefault();
                  synth.drag = false;
                  synth.noteOff(ch, k);
                })(this, channel, key)
              );
            }
            break;
          }
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
      'Pitch Bend',
      '',
      'Rev.',
      '',
    ];
    /** @type {HTMLDivElement} */
    const headerElem = doc.createElement('div');
    headerElem.className = 'header';
    for (const item in this.items) {
      if (!Object.hasOwn(this.items, item)) {
        continue;
      }
      /** @type {HTMLDivElement} */
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
    const ro = new ResizeObserver(_entries => {
      this.items.forEach(item => {
        /** @type {HTMLElement} */
        const headerItem = wrapper.querySelector(`.header .${item}`);
        /** @type {HTMLElement} */
        const channelItem = wrapper.querySelector(`.channel .${item}`);

        headerItem.style.width = channelItem.offsetWidth + 'px';
      });
      /** @type {HTMLElement} */
      const keysItem = wrapper.querySelector('.header .keys');

      keysItem.style.display =
        document.documentElement.clientWidth <= 680 ? 'none' : 'flex';
    });
    ro.observe(wrapper);

    return wrapper;
  }

  /**
   * シンセサイザーのDOMの更新
   *
   * @param {number} channel
   * @param {number} key
   * @param {number | null} velocity
   */
  updateSynthElement(channel, key, velocity = 100) {
    if (!this.element) {
      return;
    }
    /** @type {NodeListOf<HTMLDivElement>} */
    const channelElems = this.element.querySelectorAll(
      '.instrument > .channel'
    );

    if (channelElems[channel].dataset.isIntersecting) {
      /** @type {HTMLDivElement} */
      const keyElem = channelElems[channel].querySelector(
        `.key:nth-child(${key + 1})`
      );
      if (velocity) {
        keyElem.classList.add('note-on');
        // ベロシティに応じて透過度を調整
        keyElem.style.opacity = (velocity / 127).toFixed(2);
      } else {
        if (keyElem.classList?.contains('note-on')) {
          keyElem.classList.remove('note-on');
        }
        keyElem.style.opacity = '1';
      }
    }
  }

  /**
   * Get channel element from the instrument panel
   * @private
   * @param {number} channel Channel number
   * @returns {Element | null}
   */
  getChannelElement(channel) {
    if (!this.element) {
      return null;
    }
    return (
      this.element.querySelectorAll('.instrument > .channel')[channel] || null
    );
  }

  /**
   * Get a specific element from a channel
   * @private
   * @param {number} channel Channel number
   * @param {string} selector CSS selector
   * @returns {Element | null}
   */
  getChannelChildElement(channel, selector) {
    const channelElem = this.getChannelElement(channel);
    return channelElem ? channelElem.querySelector(selector) : null;
  }

  /**
   * バンクセレクタの選択ボックスの処理
   *
   * @param {number} channel
   */
  updateBankSelect(channel) {
    const bankElement = this.getChannelChildElement(channel, '.bank > select');
    if (!bankElement) {
      return;
    }

    while (bankElement.firstChild) {
      bankElement.removeChild(bankElement.firstChild);
    }

    for (const bankNo in this.programSet) {
      if (!Object.hasOwn(this.programSet, bankNo)) {
        continue;
      }
      const option = document.createElement('option');
      option.value = bankNo;
      option.textContent = ('000' + Number.parseInt(bankNo)).slice(-3);
      if (Number.parseInt(bankNo) === this.channelBank[channel]) {
        option.selected = true;
      }
      bankElement.appendChild(option);
    }
  }

  /**
   * プログラムチェンジの選択ボックスの処理
   *
   * @param {number} channel
   */
  updateProgramSelect(channel) {
    const dom = this.getChannelElement(channel);
    if (!dom) {
      return;
    }

    /** @type {number} */
    const bankIndex = this.channelBank[channel];
    /** @type {HTMLSelectElement} */
    const bankElement = dom.querySelector('.bank > select');
    /** @type {HTMLSelectElement} */
    const programElement = dom.querySelector('.program > select');

    bankElement.value = this.channelBank[channel].toString();
    while (programElement.firstChild) {
      programElement.removeChild(programElement.firstChild);
    }

    for (const programNo in this.programSet[bankIndex]) {
      if (!Object.hasOwn(this.programSet[bankIndex], programNo)) {
        continue;
      }
      // TODO: 存在しないプログラムの場合、現状では空白になってしまう
      /** @type {HTMLOptionElement} */
      const option = document.createElement('option');
      option.value = programNo;
      option.textContent = `${('000' + (Number.parseInt(programNo) + 1)).slice(-3)}:${
        this.programSet[bankIndex][programNo]
      }`;
      if (Number.parseInt(programNo) === this.channelInstrument[channel]) {
        option.selected = true;
      }
      programElement.appendChild(option);
    }
  }

  /**
   * Get the appropriate instrument for the given channel and key
   * @private
   * @param {number} channel Channel number
   * @returns {Object | null}
   */
  getInstrumentForChannel(channel) {
    /** @type {number} */
    const bankIndex = this.channelBank[channel];

    // Select bank: prefer current bank, fallback to bank 0
    // Exception: SFX (Bank 64) should not sound
    // Percussion (Bank 127~128) should use Standard Kit from bank 0
    /** @type {Object} */
    const bank =
      typeof this.bankSet[bankIndex] === 'object'
        ? this.bankSet[bankIndex]
        : this.bankSet[0];

    /** @type {Object} */
    let instrument;

    if (typeof bank[this.channelInstrument[channel]] === 'object') {
      // Instrument exists
      instrument = bank[this.channelInstrument[channel]];
    } else if (this.percussionPart[channel]) {
      // Percussion bank selected but instrument doesn't exist: use Standard Kit
      instrument =
        this.bankSet[
          this.mode === 'XG'
            ? Synthesizer.PERCUSSION_BANK_XG
            : Synthesizer.PERCUSSION_BANK_GS
        ][0];
    } else {
      // Normal instrument doesn't exist: use bank 0
      instrument = this.bankSet[0][this.channelInstrument[channel]];
    }

    return instrument;
  }

  /**
   * Calculate panpot value
   * @private
   * @param {number} channel Channel number
   * @returns {number} Normalized panpot value (-1 to 1)
   */
  calculatePanpot(channel) {
    let panpot =
      this.channelPanpot[channel] === 0
        ? Math.floor(Math.random() * Synthesizer.DEFAULT_EXPRESSION)
        : this.channelPanpot[channel] - Synthesizer.DEFAULT_CHANNEL_VALUE;
    return panpot / (panpot < 0 ? Synthesizer.DEFAULT_CHANNEL_VALUE : 63);
  }

  /**
   * Handle percussion-specific note off logic
   * @private
   * @param {number} channel Channel number
   * @param {number} key MIDI key number
   * @param {number} bankIndex Bank index
   * @param {Object} instrument Instrument object
   */
  handlePercussionExclusiveNotes(channel, key, bankIndex, instrument) {
    if (bankIndex < Synthesizer.PERCUSSION_BANK_XG) {
      return;
    }

    // Handle hi-hat exclusivity
    if (
      key === Synthesizer.MIDI_CLOSED_HI_HAT ||
      key === Synthesizer.MIDI_PEDAL_HI_HAT
    ) {
      this.noteOff(channel, Synthesizer.MIDI_OPEN_HI_HAT);
    }

    // Handle triangle exclusivity
    if (key === Synthesizer.MIDI_MUTE_TRIANGLE) {
      this.noteOff(channel, Synthesizer.MIDI_OPEN_TRIANGLE);
    }

    // Apply percussion volume
    instrument.volume *=
      this.percussionVolume[key] / Synthesizer.DEFAULT_EXPRESSION;
  }

  /**
   * ノートオン
   *
   * @param {number} channel NoteOn するチャンネル.
   * @param {number} key NoteOn するキー.
   * @param {number} velocity 強さ.
   */
  noteOn(channel, key, velocity = 100) {
    const bankIndex = this.channelBank[channel];
    const instrument = this.getInstrumentForChannel(channel);

    if (!instrument?.[key]) {
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
    const panpot = this.calculatePanpot(channel);

    // Create note information
    Object.assign(instrumentKey, {
      channel,
      key,
      velocity,
      panpot,
      volume: this.channelVolume[channel] / Synthesizer.DEFAULT_EXPRESSION,
      pitchBend: this.channelPitchBend[channel] - Synthesizer.PITCH_BEND_CENTER,
      expression: this.channelExpression[channel],
      pitchBendSensitivity: Math.round(
        Number.isFinite(this.channelPitchBendSensitivity[channel])
          ? this.channelPitchBendSensitivity[channel]
          : Synthesizer.DEFAULT_PITCH_BEND_SENSITIVITY
      ),
      mute: this.channelMute[channel],
      releaseTime: this.channelRelease[channel],
      cutOffFrequency: this.cutOffFrequency[channel],
      harmonicContent: this.harmonicContent[channel],
      reverb: this.reverb[channel],
      modulation: this.modulation[channel],
    });

    // Handle percussion-specific logic
    this.handlePercussionExclusiveNotes(channel, key, bankIndex, instrument);

    // Create and start note
    /** @type {SynthesizerNote} */
    const note = new SynthesizerNote(this.ctx, this.gainMaster, instrumentKey);
    note.noteOn();
    this.currentNoteOn[channel].push(note);

    this.updateSynthElement(channel, key, velocity);
  }

  /**
   * ノートオフ
   *
   * @param {number} channel NoteOff するチャンネル.
   * @param {number} key NoteOff するキー.
   */
  noteOff(channel, key) {
    /** @type {number} */
    let i;
    /** @type {number} */
    let il;
    /** @type {SynthesizerNote[]} */
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
   *
   * @param {number} channel ホールドするチャンネル
   * @param {number} value 値
   */
  hold(channel, value) {
    /** @type {SynthesizerNote[]} */
    const currentNoteOn = this.currentNoteOn[channel];
    /** @type {boolean} 0以外はonである。 */
    const hold = (this.channelHold[channel] =
      value > Synthesizer.DEFAULT_CHANNEL_VALUE);
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

    const channelElement = this.getChannelElement(channel);
    if (channelElement) {
      if (this.channelHold[channel]) {
        channelElement.classList.add('hold');
      } else if (channelElement.classList.contains('hold')) {
        channelElement.classList.remove('hold');
      }
    }
  }

  /**
   * バンクセレクトMSB（GS音源/GM Level2用）
   *
   * @param {number} channel チャンネルのバンクセレクトMSB
   * @param {number} value 値
   */
  bankSelectMsb(channel, value) {
    // 125より値が大きい場合、パーカッションとして処理
    this.percussionPart[channel] = value >= Synthesizer.SFX_BANK_XG;

    // 念の為バンクをリセット（モードに応じたパーカッションバンクを使用）
    if (channel === Synthesizer.DRUM_CHANNEL) {
      this.channelBank[channel] =
        this.mode === 'XG' || this.mode === 'GM'
          ? Synthesizer.PERCUSSION_BANK_XG
          : Synthesizer.PERCUSSION_BANK_GS;
    } else {
      this.channelBank[channel] = 0;
    }

    if (this.mode === 'GM') {
      // GM音源モードのときはバンク・セレクトを無視
      return;
    } else if (this.mode === 'XG') {
      // XG音源は、MSB→LSBの優先順でバンクセレクトをする。
      if (value === Synthesizer.SFX_BANK) {
        // Bank Select MSB #64 (Voice Type: SFX)
        this.channelBank[channel] = Synthesizer.SFX_BANK_XG;
      } else if (
        value === Synthesizer.PERCUSSION_BANK_XG - 1 ||
        value === Synthesizer.PERCUSSION_BANK_XG
      ) {
        // Bank Select MSB #126 (Voice Type: Drum)
        // Bank Select MSB #127 (Voice Type: Drum)
        this.channelBank[channel] = value;
      } else if (value === 128) {
        this.channelBank[channel] = 127;
      }
    } else {
      // GS音源
      // ※チャンネル10のバンク・セレクト命令は無視する。
      this.channelBank[channel] =
        channel === Synthesizer.DRUM_CHANNEL
          ? Synthesizer.PERCUSSION_BANK_GS
          : value;
      this.percussionPart[channel] = value === Synthesizer.PERCUSSION_BANK_GS;
    }
    this.updateBankSelect(channel);
  }

  /**
   * バンクセレクトLSB（XG音源）
   *
   * @param {number} channel チャンネルのバンクセレクトLSB
   * @param {number} value 値
   */
  bankSelectLsb(channel, value) {
    // XG音源以外は処理しない
    if (this.mode !== 'XG') {
      return;
    }

    if (!this.percussionPart[channel]) {
      // ドラムパートではバンクセレクトLSB命令を無視する。
      this.channelBank[channel] = value;
    }

    this.updateBankSelect(channel);
  }

  /**
   * プログラムチェンジ
   *
   * @param {number} channel 音色を変更するチャンネル.
   * @param {number} instrument 音色番号.
   */
  programChange(channel, instrument) {
    this.channelInstrument[channel] = instrument;

    this.bankChange(channel, this.channelBank[channel]);
    const select = /** @type {HTMLSelectElement | null} */ (
      this.getChannelChildElement(channel, '.program > select')
    );
    if (select) {
      select.value = instrument.toString();
    }
  }

  /**
   * バンクセレクト
   *
   * @param {number} channel 音色を変更するチャンネル.
   * @param {number} bank バンク・セレクト.
   */
  bankChange(channel, bank) {
    /** パーカッションバンク */
    const percussionBank =
      this.mode === 'XG' || this.mode === 'GM'
        ? Synthesizer.PERCUSSION_BANK_XG
        : Synthesizer.PERCUSSION_BANK_GS;
    if (this.mode === 'GM') {
      // GMの場合バンクセレクトを無効化
      bank = 0;
    }
    if (channel === Synthesizer.DRUM_CHANNEL) {
      // GS、XGフラグが立っていない（拡張音源ではない）場合は、ch10はドラム固定、それ以外は0とする。
      bank = percussionBank;
    }
    if (this.bankSet[bank]) {
      this.channelBank[channel] = bank;
    } else {
      // 存在しない場合0を選択
      this.channelBank[channel] = this.percussionPart[channel]
        ? percussionBank
        : 0;
    }
    // }

    const bankSelect = /** @type {HTMLSelectElement | null} */ (
      this.getChannelChildElement(channel, '.bank > select')
    );
    if (bankSelect) {
      bankSelect.value = bank.toString();
    }
    // TODO: 厳密にはMIDI音源はプログラムチェンジがあったときに、バンク・セレクトの値が反映されるのでこの実装は正しくない。
    this.updateProgramSelect(channel);
  }

  /**
   * ボリューム
   *
   * @param {number} channel 音量を変更するチャンネル.
   * @param {number} volume 音量(0-127).
   */
  volumeChange(channel, volume = 100) {
    const volumeVariable = /** @type {HTMLElement | null} */ (
      this.getChannelChildElement(channel, '.volume var')
    );
    if (volumeVariable) {
      volumeVariable.innerText = volume.toString();
    }

    this.channelVolume[channel] = volume;
  }

  /**
   * エクスプレッション
   *
   * @param {number} channel 音量を変更するチャンネル.
   * @param {number} expression 音量(0-127).
   */
  expression(channel, expression = 127) {
    /** @type {number} */
    let i;
    /** @type {number} */
    let il;
    /** @type {SynthesizerNote[]} */
    const currentNoteOn = this.currentNoteOn[channel];

    for (i = 0, il = currentNoteOn.length; i < il; ++i) {
      currentNoteOn[i].updateExpression(expression);
    }

    const expressionVariable = /** @type {HTMLElement | null} */ (
      this.getChannelChildElement(channel, '.expression var')
    );
    if (expressionVariable) {
      expressionVariable.innerText = expression.toString();
    }

    this.channelExpression[channel] = expression;
  }

  /**
   * パンポット
   *
   * @param {number} channel Panpot を変更するチャンネル.
   * @param {number} panpot Panpot(0-127).
   */
  panpotChange(channel, panpot = 64) {
    this.channelPanpot[channel] = panpot;
    const dom = this.getChannelChildElement(channel, '.panpot');
    if (dom) {
      dom.ariaValueNow = panpot.toString();
      /** @type {HTMLDivElement} */
      const progressBar = dom.querySelector('.progress-bar');
      const percentage = (panpot / Synthesizer.DEFAULT_EXPRESSION) * 100;
      progressBar.style.width = `${percentage}%`;
      progressBar.classList.remove('left', 'right');
      progressBar.title = panpot.toString();
      if (panpot === Synthesizer.DEFAULT_CHANNEL_VALUE) {
        return;
      }
      dom.classList.add(panpot < 63 ? 'left' : 'right');
    }
  }

  /**
   * ピッチベンド
   *
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
    /** @type {import('./sound_font_synth_note.js').default[]} */
    const currentNoteOn = this.currentNoteOn[channel];
    /** @type {number} */
    const calculated = bend - Synthesizer.PITCH_BEND_CENTER;

    for (i = 0, il = currentNoteOn.length; i < il; ++i) {
      currentNoteOn[i].updatePitchBend(calculated);
    }

    this.channelPitchBend[channel] = bend;

    if (this.element) {
      /** @type {HTMLDivElement} */
      const dom = this.element
        .querySelectorAll('.instrument > .channel')
        [channel].querySelector('.pitchBend');
      dom.ariaValueNow = bend.toString();
      /** @type {HTMLDivElement} */
      const progressBar = dom.querySelector('.progress-bar');
      progressBar.style.width = `${Math.floor((bend / 16384) * 100)}%`;
      progressBar.title = calculated.toString();
      progressBar.classList.remove('high', 'low');
      if (calculated === 0) {
        return;
      }
      progressBar.classList.add(calculated < 0 ? 'low' : 'high');
    }
  }

  /**
   * ピッチベンド・センシビリティ
   *
   * @param {number} channel Pitch bend sensitivity を変更するチャンネル.
   * @param {number} sensitivity
   */
  pitchBendSensitivity(channel, sensitivity = 2) {
    // Ensure sensitivity is a valid finite number
    const validSensitivity = Number.isFinite(sensitivity)
      ? sensitivity
      : Synthesizer.DEFAULT_PITCH_BEND_SENSITIVITY;

    if (this.element) {
      /** @type {HTMLElement} */
      const pitchBendSensitivityVariable = this.element
        .querySelectorAll('.instrument > .channel')
        [channel].querySelector('.pitchBendSensitivity > var');
      pitchBendSensitivityVariable.innerText = validSensitivity.toString();
    }
    this.channelPitchBendSensitivity[channel] = validSensitivity;
  }

  /**
   * アタックタイム
   *
   * @param {number} channel
   * @param {number} attackTime
   */
  attackTime(channel, attackTime) {
    this.channelAttack[channel] = attackTime;
  }

  /**
   * ディケイタイム
   *
   * @param {number} channel
   * @param {number} decayTime
   */
  decayTime(channel, decayTime) {
    this.channelDecay[channel] = decayTime;
  }

  /**
   * サスティンタイム
   *
   * @param {number} channel
   * @param {number} sustinTime
   */
  sustinTime(channel, sustinTime) {
    this.channelSustin[channel] = sustinTime;
  }

  /**
   * リリースタイム
   *
   * @param {number} channel
   * @param {number} releaseTime
   */
  releaseTime(channel, releaseTime) {
    this.channelRelease[channel] = releaseTime;
  }

  /**
   * ハーモニックコンテント（ブライトネス）
   *
   * @param {number} channel
   * @param {number} value
   */
  harmonicContent(channel, value = 64) {
    this.channelHarmonicContent[channel] = value;
  }

  /**
   * カットオフフリクエンシー
   *
   * @param {number} channel
   * @param {number} value
   */
  cutOffFrequency(channel, value = 64) {
    this.channelCutOffFrequency[channel] = value;
  }

  /**
   * リバーブエフェクト
   *
   * @param {number} channel
   * @param {number} depth
   */
  reverbDepth(channel, depth = 40) {
    // リバーブ深度は、ドライ／ウェット比とする。
    this.reverb[channel].mix(depth / 127);

    if (this.element) {
      /** @type {HTMLElement} */
      const reverbVariable = this.element
        .querySelectorAll('.instrument > .channel')
        [channel].querySelector('.reverbDepth var');
      reverbVariable.innerText = depth.toString();
    }
  }

  /**
   * モジュレーション（ビブラート）デプス
   *
   * @param {number} channel
   * @param {number} depth
   */
  modulationDepth(channel, depth = 0) {
    if (this.element) {
      const dom = this.element
        .querySelectorAll('.instrument > .channel')
        [channel].querySelector('.pitchBend .progress-bar');

      // モデレーターが0でないときは、ピッチに斜め線を入れる
      if (depth !== 0) {
        dom.classList.add('progress-bar-striped');
      } else {
        dom.classList.remove('progress-bar-striped');
      }
    }
    this.modulation[channel] = depth;
  }

  /**
   * @param {number} channel Pitch bend sensitivity を取得するチャンネル.
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
   *
   * @param {number} channel NoteOff するチャンネル.
   */
  allNoteOff(channel) {
    /** @type {SynthesizerNote[]} */
    const currentNoteOn = this.currentNoteOn[channel];

    // ホールドを解除
    this.hold(channel, 0);

    // 再生中の音をすべて止める
    while (currentNoteOn.length > 0) {
      this.noteOff(channel, currentNoteOn[0].key);
    }
  }

  /**
   * オールサウンドオフ
   *
   * @param {number} channel 音を消すチャンネル.
   */
  allSoundOff(channel) {
    /** @type {SynthesizerNote[]} */
    const currentNoteOn = this.currentNoteOn[channel];
    /** @type {SynthesizerNote} */
    let note;

    while (currentNoteOn.length > 0) {
      note = currentNoteOn.shift();
      this.noteOff(channel, note.key);
      note.release();
      note.disconnect();
    }

    // ホールドを解除
    this.hold(channel, 0);
  }

  /**
   * リセットオールコントロール
   *
   * @param {number} channel リセットするチャンネル
   */
  resetAllControl(channel) {
    // 実装不十分では？
    this.allNoteOff(channel);
    this.expression(channel, 127);
    this.pitchBend(channel, 0x00, 0x40);
  }

  /**
   * ミュート
   *
   * @param {number} channel ミュートの設定を変更するチャンネル.
   * @param {boolean} mute ミュートにするなら true.
   */
  mute(channel, mute) {
    /** @type {SynthesizerNote[]} */
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
   *
   * @param {number} channel パーカッションチャネルとしてセットするチャンネル
   * @param {boolean} sw パーカッションチャネルか通常かのスイッチ
   */
  setPercussionPart(channel, sw) {
    // XG/GMは127、GS/GM2は128をパーカッションバンクとする
    this.channelBank[channel] =
      this.mode === 'XG' || this.mode === 'GM'
        ? Synthesizer.PERCUSSION_BANK_XG
        : Synthesizer.PERCUSSION_BANK_GS;

    this.percussionPart[channel] = sw;
    this.updateBankSelect(channel);
  }

  /**
   * MIDI音源のメッセージ欄に送られるsysExを解析
   *
   * @param {number[]} message
   */
  processMidiMessage(message) {
    clearTimeout(this.timer);
    /** @type {HTMLElement} */
    const dom = this.element.querySelector('.header .keys code');
    dom.innerText = message.map(e => String.fromCharCode(e)).join('');

    // 10秒後に削除
    this.timer = setTimeout(() => {
      dom.innerText = '';
    }, 50000);
  }
}

import SynthesizerNote from './sound_font_synth_note';
import Parser from './sf2';
import Reverb from './reverb';
/**
 * @constructor
 */
export class Synthesizer {
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
    this.reverb = new Reverb(this.ctx);

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

    this.parser = new Parser(this.input, {
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
    this.parser = new Parser(input);
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
    note = new SynthesizerNote(this.ctx, this.gainMaster, instrumentKey);
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

export default Synthesizer
goog.provide('SoundFont.Synthesizer');

goog.require('SoundFont.SynthesizerNote');
goog.require('SoundFont.Parser');
goog.require('SoundFont.Reverb');
goog.require('SoundFont.Instruments');

/**
 * @constructor
 */
SoundFont.Synthesizer = function (input) {
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
    this.channelRelease = [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64];
    /** @type {Array.<boolean>} */
    this.channelHold = [
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false
    ];
    /** @type {Array.<number>} */
    this.channelBankMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0];
    /** @type {Array.<number>} */
    this.channelBankLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {Array.<number>} */
    this.reverbDepth = [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40];
    /** @type {Array.<number>} */
    this.harmonicContent = [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64];
    /** @type {Array.<number>} */
    this.cutOffFrequency = [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64];

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
        false, false, false, false, false, false, false, false
    ];

    /** @type {Array.<number>} */
    this.percussionVolume = new Array(128);
    for (i = 0, il = this.percussionVolume.length; i < il; ++i) {
        this.percussionVolume[i] = 127;
    }

    /** @type {boolean} */
    this.useReverb = true;

    /** @type {SoundFont.Reverb} */
    this.reverb = new SoundFont.Reverb(this.ctx, {
        time: 2,
        mix:0.5
    });
};

/**
 * @returns {AudioContext}
 */
SoundFont.Synthesizer.prototype.getAudioContext = function () {
    /** @type {AudioContext} */
    var ctx;

    if (goog.global['AudioContext'] !== void 0) {
        ctx = new goog.global['AudioContext']();
    } else if (goog.global['webkitAudioContext'] !== void 0) {
        ctx = new goog.global['webkitAudioContext']();
    } else if (goog.global['mozAudioContext'] !== void 0) {
        ctx = new goog.global['mozAudioContext']();
    } else {
        throw new Error('Web Audio not supported');
    }

    if (ctx.createGainNode === void 0) {
        ctx.createGainNode = ctx.createGain;
    }

    return ctx;
};

SoundFont.Synthesizer.prototype.init = function (mode = 'GM') {
    /** @type {number} */
    var i;

    this.parser = new SoundFont.Parser(this.input, {
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
        this.bankSelectMsb(i, i === 9 ? 128 : 0x00);
        this.bankSelectLsb(i, 0x00);
        this.setPercussionPart(i, false);
        this.setReverbDepth(i, 40);
    }

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
        this.element.querySelector('.header div:last-child').innerText = mode + ' Mode';
    }
};

SoundFont.Synthesizer.prototype.close = function () {
    this.ctx.close();
};

/**
 * @param {Uint8Array} input
 */
SoundFont.Synthesizer.prototype.refreshInstruments = function (input) {
    this.input = input;
    this.parser = new SoundFont.Parser(input);
    this.bankSet = this.createAllInstruments();
};

/** @return {Array.<Array.<Object>>} */
SoundFont.Synthesizer.prototype.createAllInstruments = function () {
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

    for (i = 0, il = presets.length; i < il; ++i) {
        preset = presets[i];
        presetNumber = preset.header.preset;
        bankNumber = preset.header.bank;

        if (!goog.isNumber(preset.instrument)) {
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
        bank[presetNumber].name = preset.name;

        for (j = 0, jl = instrument.info.length; j < jl; ++j) {
            this.createNoteInfo(parser, instrument.info[j], bank[presetNumber]);
        }
    }

    return banks;
};

SoundFont.Synthesizer.prototype.createNoteInfo = function (parser, info, preset) {
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
SoundFont.Synthesizer.prototype.getModGenAmount = function (generator, enumeratorType, opt_default) {
    if (opt_default === void 0) {
        opt_default = 0;
    }

    return generator[enumeratorType] ? generator[enumeratorType].amount : opt_default;
};

SoundFont.Synthesizer.prototype.start = function () {
    this.connect();
    this.setMasterVolume(16383);
    this.bufSrc.start(0);
};

SoundFont.Synthesizer.prototype.setMasterVolume = function (volume) {
    this.masterVolume = volume;
    //this.gainMaster.gain.value = this.baseVolume * (volume / 16384);
    this.gainMaster.gain.setTargetAtTime(this.baseVolume * (volume / 16384), this.ctx.currentTime, 0.015);
};

SoundFont.Synthesizer.prototype.connect = function () {
    this.setReverb(true);
    this.bufSrc.connect(this.gainMaster);
    this.gainMaster.connect(this.ctx.destination);
};

SoundFont.Synthesizer.prototype.disconnect = function () {
    this.setReverb(false);
    this.bufSrc.disconnect(0);
    this.gainMaster.disconnect(0);
};

/** @param {boolean} value */
SoundFont.Synthesizer.prototype.setReverb = function (value) {

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
SoundFont.Synthesizer.prototype.setReverbDepth = function (channel, depth) {
    this.reverbDepth[channel] = depth;
};

/**
 * @type {!Array.<string>}
 * @const
 */
SoundFont.Synthesizer.Header = ['Mute', 'Instrument', 'Vol', 'Panpot', 'Pitch', '', 'Mode'];

SoundFont.Synthesizer.prototype.removeSynth = function () {
    this.ctx.close();
};

SoundFont.Synthesizer.prototype.drawSynth = function () {
    /** @type {Document} */
    const doc = goog.global.window.document;
    /** @type {HTMLDivElement} */
    const wrapper = this.element = doc.createElement('div');
    /** @type {HTMLDivElement} */
    const instElem = doc.createElement('div');
    instElem.className = 'instrument';
    /** @type {Array} */
    const items = ['mute', 'program', 'volume', 'panpot', 'pitchBend', 'pitchBendSensitivity', 'keys'];
    /** @type {HTMLDivElement} */
    let channel;
    /** @type {HTMLDivElement} */
    let item;
    /** @type {HTMLInputElement} */
    let checkbox;
    /** @type {HTMLLabelElement} */
    let label;


    let header = doc.createElement('div');
    header.className = 'instrument header';
    for (let i in items) {
        let headerItem = doc.createElement('div');
        headerItem.className = items[i] !== 'keys' ? items[i] : 'mode';
        headerItem.innerText = SoundFont.Synthesizer.Header[i];
        header.appendChild(headerItem);
    }
    wrapper.appendChild(header);

    for (let ch = 0; ch < 16; ch++) {
        channel = doc.createElement('div');
        channel.className = 'channel';
        for (let i in items) {
            /** @type {HTMLDivElement} */
            let item = doc.createElement('div');
            item.className = items[i];

            switch (items[i]) {
                case 'mute':
                    item.className += ' custom-control custom-checkbox custom-control-inline'
                    let checkbox = doc.createElement('input');
                    checkbox.setAttribute('type', 'checkbox');
                    checkbox.className = 'custom-control-input';
                    checkbox.id = 'mute' + ch + 'ch';
                    checkbox.addEventListener('change', (function (synth, channel) {
                        return function (event) {
                            synth.mute(channel, this.checked);
                        };
                    })(this, ch), false);
                    item.appendChild(checkbox);
                    label = doc.createElement('label');
                    label.className = 'custom-control-label';
                    label.setAttribute('for', 'mute' + ch + 'ch');
                    item.appendChild(label);
                    break;
                case 'bank':
                    // Bank select
                    let bank_select = doc.createElement('select');
                    bank_select.className = 'custom-select custom-select-sm';
                    for (let j = 0; j < 127; j++) {
                        let option = doc.createElement('option');
                        option.textContent = ('000' + (parseInt(j) + 1)).slice(-3);
                        option.value = j;
                        bank_select.appendChild(option);
                    }
                    item.appendChild(bank_select);

                    bank_select.addEventListener('change', (function (synth, channel) {
                        return function (event) {
                            synth.bank(channel, event.target.value);
                        };
                    })(this, ch), false);

                    bank_select.selectedIndex = this.channelInstrument[i];
                case 'program':
                    // Program change
                    let select = doc.createElement('select');
                    select.className = 'custom-select custom-select-sm';
                    let programNames = (ch !== 9) ? SoundFont.Instruments.ProgramName : SoundFont.Instruments.PercussionProgramName;
                    for (let j in programNames) {
                        let option = doc.createElement('option');
                        if (!programNames[j]) continue;
                        option.textContent = ('000' + (parseInt(j) + 1)).slice(-3) + ' :' + programNames[j];
                        option.value = j;
                        select.appendChild(option);
                    }
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
};


/**
 * @param {number} channel NoteOn するチャンネル.
 * @param {number} key NoteOn するキー.
 * @param {number} velocity 強さ.
 */
SoundFont.Synthesizer.prototype.noteOn = function (channel, key, velocity) {
    /** @type {number} */
    var bankIndex = this.getBank(channel);
    /** @type {Object} */
    var bank = this.bankSet[bankIndex];
    /** @type {Object} */
    var instrument = bank[this.channelInstrument[channel]];
    /** @type {Object} */
    var instrumentKey;
    /** @type {SoundFont.SynthesizerNote} */
    var note;
    /** @type {string} */
    var modeElem;

    if (instrument === void 0) {

        instrument = this.bankSet[0][this.channelInstrument[channel]];
        // TODO
        goog.global.console.warn(
            "instrument not found: bank=%s instrument=%s channel=%s",
            bankIndex,
            this.channelInstrument[channel],
            channel
        );
    }

    if (instrument[key] === void 0) {
        // TODO
        goog.global.console.warn(
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
    if (this.percussionPart[channel]) {
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
    note = new SoundFont.SynthesizerNote(this.ctx, this.gainMaster, instrumentKey);
    note.noteOn();
    this.currentNoteOn[channel].push(note);

    this.updateSynthElement(channel, key, velocity);
};

/**
 * @param {number} channel NoteOff するチャンネル.
 * @param {number} key NoteOff するキー.
 * @param {number} velocity 強さ.
 */
SoundFont.Synthesizer.prototype.noteOff = function (channel, key, velocity) {
    /** @type {number} */
    var bankIndex = this.getBank(channel);
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

    //hold = false;

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
SoundFont.Synthesizer.prototype.updateSynthElement = function (channel, key, velocity) {
    if (!this.element){
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
SoundFont.Synthesizer.prototype.hold = function (channel, value) {
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
};

/**
 * @param {number} channel チャンネルのバンクセレクトMSB
 * @param {number} value 値
 */
SoundFont.Synthesizer.prototype.bankSelectMsb = function (channel, value) {
    this.channelBankMsb[channel] = value;
};

/**
 * @param {number} channel チャンネルのバンクセレクトLSB
 * @param {number} value 値
 */
SoundFont.Synthesizer.prototype.bankSelectLsb = function (channel, value) {
    this.channelBankLsb[channel] = value;
};

/**
 * @param {number} channel 音色を変更するチャンネル.
 * @param {number} instrument 音色番号.
 */
SoundFont.Synthesizer.prototype.programChange = function (channel, instrument) {
    if (this.element) {
        this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') > .program > select').value = instrument;
    }
    this.channelInstrument[channel] = instrument;
};

/**
 * @param {number} channel 音色を変更するチャンネル.
 * @param {number} instrument 音色番号.
 */
SoundFont.Synthesizer.prototype.bankSelect = function (channel, instrument) {
    //if (this.element) {
     //   this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') > .program > select').value = instrument;
    //}
    this.bankSet[channel] = instrument;
};

/**
 * @param {number} channel 音量を変更するチャンネル.
 * @param {number} volume 音量(0-127).
 */
SoundFont.Synthesizer.prototype.volumeChange = function (channel, volume) {
    if (this.element) {
        this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') > .volume').innerText = volume;
    }
    this.channelVolume[channel] = volume;
};

/**
 * @param {number} channel 音量を変更するチャンネル.
 * @param {number} expression 音量(0-127).
 */
SoundFont.Synthesizer.prototype.expression = function (channel, expression) {
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;
    /** @type {Array.<SoundFont.SynthesizerNote>} */
    var currentNoteOn = this.currentNoteOn[channel];

    for (i = 0, il = currentNoteOn.length; i < il; ++i) {
        currentNoteOn[i].updateExpression(expression);
    }

    this.channelExpression[channel] = expression;
};

/**
 * @param {number} channel panpot を変更するチャンネル.
 * @param {number} panpot panpot(0-127).
 */
SoundFont.Synthesizer.prototype.panpotChange = function (channel, panpot) {
    if (this.element) {
        this.element.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') > .panpot > meter').value = panpot;
    }

    this.channelPanpot[channel] = panpot;
};

/**
 * @param {number} channel panpot を変更するチャンネル.
 * @param {number} lowerByte
 * @param {number} higherByte
 */
SoundFont.Synthesizer.prototype.pitchBend = function (channel, lowerByte, higherByte) {
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
};

/**
 * @param {number} channel pitch bend sensitivity を変更するチャンネル.
 * @param {number} sensitivity
 */
SoundFont.Synthesizer.prototype.pitchBendSensitivity = function (channel, sensitivity) {
    if (this.element) {
        document.querySelector('.instrument > .channel:nth-child(' + (channel + 1) + ') > .pitchBendSensitivity').innerText = sensitivity;
    }
    this.channelPitchBendSensitivity[channel] = sensitivity;
};

/**
 * @param {number} channel
 * @param {number} releaseTime
 */
SoundFont.Synthesizer.prototype.releaseTime = function (channel, releaseTime) {
    this.channelRelease[channel] = releaseTime;
};

/**
 * @param {number} channel pitch bend sensitivity を取得するチャンネル.
 */
SoundFont.Synthesizer.prototype.getPitchBendSensitivity = function (channel) {
    return this.channelPitchBendSensitivity[channel];
};

/**
 * @param {number} key
 * @param {number} volume
 */
SoundFont.Synthesizer.prototype.drumInstrumentLevel = function (key, volume) {
    this.percussionVolume[key] = volume;
};

/**
 * @param {number} channel NoteOff するチャンネル.
 */
SoundFont.Synthesizer.prototype.allNoteOff = function (channel) {
    /** @type {Array.<SoundFont.SynthesizerNote>} */
    var currentNoteOn = this.currentNoteOn[channel];

    // ホールドを解除
    this.hold(channel, 0);

    // 再生中の音をすべて止める
    while (currentNoteOn.length > 0) {
        this.noteOff(channel, currentNoteOn[0].key, 0);
    }
};

/**
 * @param {number} channel 音を消すチャンネル.
 */
SoundFont.Synthesizer.prototype.allSoundOff = function (channel) {
    /** @type {Array.<SoundFont.SynthesizerNote>} */
    var currentNoteOn = this.currentNoteOn[channel];
    /** @type {SoundFont.SynthesizerNote} */
    var note;

    while (currentNoteOn.length > 0) {
        note = currentNoteOn.shift();
        this.noteOff(channel, note.key, 0);
        note.release();
        note.disconnect();
    }

    // ホールドを解除
    this.hold(channel, 0);
};

/**
 * @param {number} channel リセットするチャンネル
 */
SoundFont.Synthesizer.prototype.resetAllControl = function (channel) {
    this.allNoteOff(channel);
    this.expression(channel, 127);
    this.pitchBend(channel, 0x00, 0x40);
};

/**
 * @param {number} channel ミュートの設定を変更するチャンネル.
 * @param {boolean} mute ミュートにするなら true.
 */
SoundFont.Synthesizer.prototype.mute = function (channel, mute) {
    /** @type {Array.<SoundFont.SynthesizerNote>} */
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
};

/**
 * @param {number} channel バンクを変更するチャンネル.
 */
SoundFont.Synthesizer.prototype.getBank = function (channel) {
    /** @type {number} */
    var bankIndex = 0;
    if (channel === 9) {
        this.setPercussionPart(9, true);
        return this.isXG ? 127 : 128;
    }

    if (this.isXG) {
        // XG音源は、MSB→LSBの優先順でバンクセレクトをする。
        if (this.channelBankMsb[channel] === 64) {
            // Bank Select MSB #64 (Voice Type: SFX)
            bankIndex = 125;
        } else if (this.channelBankMsb[channel] === 126 || this.channelBankMsb[channel] === 127) {
            // Bank Select MSB #126 (Voice Type: Drum)
            // Bank Select MSB #127 (Voice Type: Drum)
            bankIndex = this.channelBankMsb[channel];
        } else {
            // Bank Select MSB #0 (Voice Type: Normal)
            // TODO:本来こちらが正しいが、バンクに存在しない楽器の処理ができていないためコメントアウト
            //bankIndex = this.channelBankLsb[channel];  
            bankIndex = 0;
        }
    } else if (this.isGS) {
        // GS音源
        bankIndex = 0;

        if (this.percussionPart[channel]) {
            // http://www.roland.co.jp/support/by_product/sd-20/knowledge_base/1826700/
            bankIndex = 128;
        } else {
            // TODO: 本来こちらが正しいが、バンクに存在しない楽器の処理ができていないためコメントアウト
            //bankIndex = this.channelBankMsb[channel];
        }
    } else {
        // GM音源の場合バンクセレクト無効化
        bankIndex = 0;
    }
    if (this.percussionPart[channel] && SoundFont.Instruments.PercussionProgramName[this.channelInstrument[channel]] === void 0) {
        // パーカッションチャンネルで、GM に存在しないドラムセットが呼び出された時は、Standard Setを呼び出す。
        this.channelInstrument[channel] = 0;
    }

    return bankIndex;
};

/**
 * @param {number} channel TODO:ドラムパートとしてセットするチャンネル
 * @param {boolean} sw ドラムか通常かのスイッチ
 */
SoundFont.Synthesizer.prototype.setPercussionPart = function (channel, sw) {
    this.percussionPart[channel] = sw;
};
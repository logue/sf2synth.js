goog.provide('SoundFont.Synthesizer');

goog.require('SoundFont.SynthesizerNote');
goog.require('SoundFont.Parser');
goog.require('SoundFont.Reverb');
goog.require('SoundFont.Instruments');

/**
 * @constructor
 */
SoundFont.Synthesizer = function(input) {
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
    this.reverb = new SoundFont.Reverb(this.ctx);
};

/**
 * @returns {AudioContext}
 */
SoundFont.Synthesizer.prototype.getAudioContext = function() {
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

SoundFont.Synthesizer.prototype.init = function() {
    /** @type {number} */
    var i;

    this.parser = new SoundFont.Parser(this.input, { sampleRate: this.ctx.sampleRate });
    this.bankSet = this.createAllInstruments();

    this.isXG = false;
    this.isGS = false;

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
};

SoundFont.Synthesizer.prototype.close = function() {
    this.ctx.close();
};

/**
 * @param {Uint8Array} input
 */
SoundFont.Synthesizer.prototype.refreshInstruments = function(input) {
    this.input = input;
    this.parser = new SoundFont.Parser(input);
    this.bankSet = this.createAllInstruments();
};

/** @return {Array.<Array.<Object>>} */
SoundFont.Synthesizer.prototype.createAllInstruments = function() {
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

SoundFont.Synthesizer.prototype.createNoteInfo = function(parser, info, preset) {
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
    var ROOT12 = Math.pow(2, 1 / 12);

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
                ROOT12,
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
SoundFont.Synthesizer.prototype.getModGenAmount = function(generator, enumeratorType, opt_default) {
    if (opt_default === void 0) {
        opt_default = 0;
    }

    return generator[enumeratorType] ? generator[enumeratorType].amount : opt_default;
};

SoundFont.Synthesizer.prototype.start = function() {
    this.connect();
    this.setMasterVolume(16383);
    this.bufSrc.start(0);
};

SoundFont.Synthesizer.prototype.setMasterVolume = function(volume) {
    this.masterVolume = volume;
    this.gainMaster.gain.value = this.baseVolume * (volume / 16384);
};

SoundFont.Synthesizer.prototype.connect = function() {
    this.bufSrc.connect(this.gainMaster);
    this.gainMaster.connect(this.ctx.destination);
    if (this.useReverb === true) {
        this.gainMaster.connect(this.reverb);
        this.reverb.connect(this.ctx.destination);
    }
};

SoundFont.Synthesizer.prototype.disconnect = function() {
    this.bufSrc.disconnect(0);
    this.gainMaster.disconnect(0);
    this.reverb.disconnect(0);
};

/** @param {boolean} value */
SoundFont.Synthesizer.prototype.setReverb = function(value) {
    if (this.useReverb === false) {
        this.reverb.disconnect(0);
    } else {
        this.gainMaster.connect(this.reverb);
        this.reverb.connect(this.ctx.destination);
    }
    this.useReverb = value;
};

/** 
 * @param {number} channel
 * @param {number} depth 
 */
SoundFont.Synthesizer.prototype.setReverbDepth = function(channel, depth) {
    this.reverbDepth[channel] = depth;
};

/**
 * @type {!Array.<string>}
 * @const
 */
SoundFont.Synthesizer.TableHeader = ['Instrument', 'Vol', 'Pan', 'Bend', 'Range', 'GM Mode'];

SoundFont.Synthesizer.prototype.drawSynth = function() {
    /** @type {Document} */
    var doc = goog.global.window.document;

    /** @type {HTMLTableElement} */
    var table = this.table =
        /** @type {HTMLTableElement} */
        (doc.createElement('table'));
    /** @type {HTMLTableSectionElement} */
    var head =
        /** @type {HTMLTableSectionElement} */
        (doc.createElement('thead'));
    /** @type {HTMLTableSectionElement} */
    var body =
        /** @type {HTMLTableSectionElement} */
        (doc.createElement('tbody'));
    /** @type {HTMLTableRowElement} */
    var tableLine;
    /** @type {NodeList} */
    var notes;
    /** @type {Element} */
    var firstColumn;
    /** @type {Element} */
    var checkbox;
    /** @type {Element} */
    var select;
    /** @type {Element} */
    var option;
    /** @type {Element} */
    var panpot;
    /** @type {Element} */
    var pitch;
    /** @type {number} */
    var i;
    /** @type {number} */
    var j;
    /** @type {string} */
    var programName;

    head.appendChild(this.createTableLine(SoundFont.Synthesizer.TableHeader, true));

    for (i = 0; i < 16; ++i) {
        tableLine = this.createTableLine(SoundFont.Synthesizer.TableHeader.length + 128, false);
        body.appendChild(tableLine);

        // mute checkbox
        firstColumn = tableLine.querySelector('td:nth-child(1)');
        checkbox = doc.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('change', (function(synth, channel) {
            return function(event) {
                synth.mute(channel, this.checked);
            };
        })(this, i), false);
        firstColumn.appendChild(checkbox);

        // Program change
        select = doc.createElement('select');
        for (j = 0; j < 128; ++j) {
            programName = (i !== 9) ? SoundFont.Instruments.ProgramName[j] : SoundFont.Instruments.PercussionProgramName[j];
            option = doc.createElement('option');
            if (programName === "") continue;
            option.textContent = programName;
            option.value = j;
            select.appendChild(option);
        }
        firstColumn.appendChild(select);

        select.addEventListener('change', (function(synth, channel) {
            return function(event) {
                synth.programChange(channel, event.target.value);
            };
        })(this, i), false);

        select.selectedIndex = this.channelInstrument[i];

        // panpot
        panpot = doc.createElement('meter');
        panpot.min = 0;
        panpot.max = 127;
        panpot.value = 64;
        panpot.textContent = 64;
        tableLine.querySelector('td:nth-child(3)').appendChild(panpot);

        // PitchBend
        pitch = doc.createElement('meter');
        pitch.min = -8192;
        pitch.max = 8192;
        pitch.value = 0;
        pitch.textContent = 0;
        tableLine.querySelector('td:nth-child(4)').appendChild(pitch);

        notes = tableLine.querySelectorAll('td:nth-last-child(-n+128)');
        for (j = 0; j < 128; ++j) {
            notes[j].addEventListener('mousedown', (function(synth, channel, key) {
                return function(event) {
                    event.preventDefault();
                    synth.drag = true;
                    synth.noteOn(channel, key, 127);
                };
            })(this, i, j));
            notes[j].addEventListener('mouseover', (function(synth, channel, key) {
                return function(event) {
                    event.preventDefault();
                    if (synth.drag) {
                        synth.noteOn(channel, key, 127);
                    }
                };
            })(this, i, j));
            notes[j].addEventListener('mouseout', (function(synth, channel, key) {
                return function(event) {
                    event.preventDefault();
                    synth.noteOff(channel, key, 0);
                };
            })(this, i, j));
            notes[j].addEventListener('mouseup', (function(synth, channel, key) {
                return function(event) {
                    event.preventDefault();
                    synth.drag = false;
                    synth.noteOff(channel, key, 0);
                };
            })(this, i, j));
        }
    }

    table.appendChild(head);
    table.appendChild(body);
    this.synthRootTags = document.getElementsByTagName('tbody');

    return table;
};

SoundFont.Synthesizer.prototype.removeSynth = function() {
    var table = this.table;

    if (table) {
        table.parentNode.removeChild(table);
        this.table = null;
    }
    this.ctx.close();
};

/**
 * @param {!(Array.<string>|number)} array
 * @param {boolean} isTitleLine
 * @returns {HTMLTableRowElement}
 */
SoundFont.Synthesizer.prototype.createTableLine = function(array, isTitleLine) {
    /** @type {Document} */
    var doc = goog.global.window.document;
    /** @type {HTMLTableRowElement} */
    var tr = /** @type {HTMLTableRowElement} */ (doc.createElement('tr'));
    /** @type {HTMLTableCellElement} */
    var cell;
    /** @type {boolean} */
    var isArray = array instanceof Array;
    /** @type {number} */
    var i;
    /** @type {number} */
    var il = isArray ? array.length : /** @type {number} */ (array);

    for (i = 0; i < il; ++i) {
        cell =
            /** @type {HTMLTableCellElement} */
            (doc.createElement(isTitleLine ? 'th' : 'td'));
        cell.textContent = (isArray && array[i] !== void 0) ? array[i] : '';
        if (isTitleLine && il === i + 1) cell.setAttribute('colspan', 129); // Mode
        tr.appendChild(cell);
    }

    return tr;
};


/**
 * @param {number} channel NoteOn するチャンネル.
 * @param {number} key NoteOn するキー.
 * @param {number} velocity 強さ.
 */
SoundFont.Synthesizer.prototype.noteOn = function(channel, key, velocity) {
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

    if (this.table) {
        //this.table.querySelector('thead tr:first-child > th:nth-child(6)').innerText 
        modeElem = this.table.firstChild.lastChild.innerText;
        if (this.isXG) {
            modeElem = 'XG Mode';
        } else if (this.isGS) {
            modeElem = 'GS Mode';
        } else {
            modeElem = 'GM Mode';
        }
    }

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
    this.updateSynthTable(channel, key, velocity);
};

/**
 * @param {number} channel NoteOff するチャンネル.
 * @param {number} key NoteOff するキー.
 * @param {number} velocity 強さ.
 */
SoundFont.Synthesizer.prototype.noteOff = function(channel, key, velocity) {
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

    for (i = 0, il = currentNoteOn.length; i < il; ++i) {
        note = currentNoteOn[i];
        if (note.key === key) {
            note.noteOff();
            this.updateSynthTable(channel, key, 0);
            // hold している時は NoteOff にはするがリリースはしない
            if (!hold) {
                note.release();
                currentNoteOn.splice(i, 1);
                --i;
                --il;
            }
        }
    }
};

/**
 * @param {number} channel
 * @param {number} key
 * @param {number} velocity
 */
SoundFont.Synthesizer.prototype.updateSynthTable = function(channel, key, velocity) {
    if (!this.table) return;
    var cell = this.table.querySelector(
        'tbody > ' +
        'tr:nth-child(' + (channel + 1) + ') > ' +
        'td:nth-child(' + (key + SoundFont.Synthesizer.TableHeader.length + 1) + ')'
    );
    if (velocity === 0) {
        // 本来は正しくない
        cell.classList.remove('note-on');
        cell.style.opacity = 1;
    } else {
        cell.classList.add('note-on');
        cell.style.opacity = velocity / 127;
    }
}

/**
 * @param {number} channel ホールドするチャンネル
 * @param {number} value 値
 */
SoundFont.Synthesizer.prototype.hold = function(channel, value) {
    /** @type {Array.<SoundFont.SynthesizerNote>} */
    var currentNoteOn = this.currentNoteOn[channel];
    /** @type {boolean} */
    var hold = this.channelHold[channel] = (value < 64);
    /** @type {SoundFont.SynthesizerNote} */
    var note;
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;

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
SoundFont.Synthesizer.prototype.bankSelectMsb = function(channel, value) {
    this.channelBankMsb[channel] = value;
};

/**
 * @param {number} channel チャンネルのバンクセレクトLSB
 * @param {number} value 値
 */
SoundFont.Synthesizer.prototype.bankSelectLsb = function(channel, value) {
    this.channelBankLsb[channel] = value;
};

/**
 * @param {number} channel 音色を変更するチャンネル.
 * @param {number} instrument 音色番号.
 */
SoundFont.Synthesizer.prototype.programChange = function(channel, instrument) {
    if (this.table) {
        this.table.querySelector('tbody > tr:nth-child(' + (channel + 1) + ') > td:first-child > select').value = instrument;
    }
    this.channelInstrument[channel] = instrument;
};

/**
 * @param {number} channel 音量を変更するチャンネル.
 * @param {number} volume 音量(0-127).
 */
SoundFont.Synthesizer.prototype.volumeChange = function(channel, volume) {
    if (this.table) {
        this.table.querySelector('tbody > tr:nth-child(' + (channel + 1) + ') > td:nth-child(2)').textContent = volume;
    }

    this.channelVolume[channel] = volume;
};

/**
 * @param {number} channel 音量を変更するチャンネル.
 * @param {number} expression 音量(0-127).
 */
SoundFont.Synthesizer.prototype.expression = function(channel, expression) {
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
SoundFont.Synthesizer.prototype.panpotChange = function(channel, panpot) {
    if (this.table) {
        this.table.querySelector('tbody > tr:nth-child(' + (channel + 1) + ') > td:nth-child(3) > meter').value = panpot;
        this.table.querySelector('tbody > tr:nth-child(' + (channel + 1) + ') > td:nth-child(3) > meter').textContent = panpot;
    }

    this.channelPanpot[channel] = panpot;
};

/**
 * @param {number} channel panpot を変更するチャンネル.
 * @param {number} lowerByte
 * @param {number} higherByte
 */
SoundFont.Synthesizer.prototype.pitchBend = function(channel, lowerByte, higherByte) {
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

    if (this.table) {
        //this.table.querySelector('tbody > tr:nth-child(' + (channel + 1) + ') > td:nth-child(4)').textContent = calculated;
        this.table.querySelector('tbody > tr:nth-child(' + (channel + 1) + ') > td:nth-child(4) > meter').value = calculated;
        this.table.querySelector('tbody > tr:nth-child(' + (channel + 1) + ') > td:nth-child(4) > meter').textContent = calculated;
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
SoundFont.Synthesizer.prototype.pitchBendSensitivity = function(channel, sensitivity) {
    if (this.table) {
        this.table.querySelector('tbody > tr:nth-child(' + (channel + 1) + ') > td:nth-child(5)').textContent = sensitivity;
    }

    this.channelPitchBendSensitivity[channel] = sensitivity;
};

/**
 * @param {number} channel
 * @param {number} releaseTime
 */
SoundFont.Synthesizer.prototype.releaseTime = function(channel, releaseTime) {
    this.channelRelease[channel] = releaseTime;
};

/**
 * @param {number} channel pitch bend sensitivity を取得するチャンネル.
 */
SoundFont.Synthesizer.prototype.getPitchBendSensitivity = function(channel) {
    return this.channelPitchBendSensitivity[channel];
};

/**
 * @param {number} key
 * @param {number} volume
 */
SoundFont.Synthesizer.prototype.drumInstrumentLevel = function(key, volume) {
    this.percussionVolume[key] = volume;
};

/**
 * @param {number} channel NoteOff するチャンネル.
 */
SoundFont.Synthesizer.prototype.allNoteOff = function(channel) {
    /** @type {Array.<SoundFont.SynthesizerNote>} */
    var currentNoteOn = this.currentNoteOn[channel];

    while (currentNoteOn.length > 0) {
        this.noteOff(channel, currentNoteOn[0].key, 0);
    }
};

/**
 * @param {number} channel 音を消すチャンネル.
 */
SoundFont.Synthesizer.prototype.allSoundOff = function(channel) {
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
};

/**
 * @param {number} channel リセットするチャンネル
 */
SoundFont.Synthesizer.prototype.resetAllControl = function(channel) {
    this.expression(channel, 127);
    this.pitchBend(channel, 0x00, 0x40);
    this.hold(channel, 0);
};

/**
 * @param {number} channel ミュートの設定を変更するチャンネル.
 * @param {boolean} mute ミュートにするなら true.
 */
SoundFont.Synthesizer.prototype.mute = function(channel, mute) {
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
SoundFont.Synthesizer.prototype.getBank = function(channel) {
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
SoundFont.Synthesizer.prototype.setPercussionPart = function(channel, sw) {
    this.percussionPart[channel] = sw;
};
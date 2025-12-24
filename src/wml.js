import Loader from './loader.js';
import Synthesizer from './sound_font_synth.js';

// MIDI定数
const MIDI_CHANNELS = 16;
const MIDI_NOTE_OFF = 0x80;
const MIDI_NOTE_ON = 0x90;
const MIDI_CONTROL_CHANGE = 0xb0;
const MIDI_PROGRAM_CHANGE = 0xc0;
const MIDI_PITCH_BEND = 0xe0;
const MIDI_SYSTEM_EXCLUSIVE = 0xf0;

// Control Change番号
const CC = {
  BANK_SELECT_MSB: 0x00,
  MODULATION: 0x01,
  DATA_ENTRY_MSB: 0x06,
  VOLUME: 0x07,
  PANPOT: 0x0a,
  EXPRESSION: 0x0b,
  BANK_SELECT_LSB: 0x20,
  DATA_ENTRY_LSB: 0x26,
  HOLD: 0x40,
  HARMONIC_CONTENT: 0x47,
  ATTACK_TIME: 0x4a,
  BRIGHTNESS: 0x4b,
  DECAY_TIME: 0x48,
  RELEASE_TIME: 0x49,
  REVERB_DEPTH: 0x5b,
  NRPN_LSB: 0x62,
  NRPN_MSB: 0x63,
  RPN_LSB: 0x64,
  RPN_MSB: 0x65,
  ALL_SOUND_OFF: 0x78,
  RESET_ALL_CONTROL: 0x79,
};

// System Exclusive Manufacturer ID
const MANUFACTURER = {
  GM_NON_REALTIME: 0x7e,
  REALTIME: 0x7f,
  PRIVATE: 0x7d,
};

// デフォルトSoundFont URL
const DEFAULT_SOUNDFONT_URL =
  'https://cdn.jsdelivr.net/npm/@logue/sf2synth@latest/dist/Yamaha XG Sound Set.sf2';

// Ready表示時間（ミリ秒）
const READY_DISPLAY_TIME = 3000;

/**
 * WebMidiLink Class
 *
 * @author imaya
 */
export default class WebMidiLink {
  /** @param {object} option */
  constructor(option = {}) {
    this._initializeChannelData();
    this._initializeOptions(option);
    this._initializeWindow();
  }

  /**
   * チャンネルデータの初期化
   * @private
   */
  _initializeChannelData() {
    const emptyChannelArray = new Array(MIDI_CHANNELS).fill(0);
    /** @type {number[]} */
    this.NrpnMsb = [...emptyChannelArray];
    /** @type {number[]} */
    this.NrpnLsb = [...emptyChannelArray];
    /** @type {number[]} */
    this.RpnMsb = [...emptyChannelArray];
    /** @type {number[]} */
    this.RpnLsb = [...emptyChannelArray];
    /** @type {boolean} */
    this.ready = false;
    /** @type {Synthesizer} */
    this.synth = undefined;
    /** @type {Function} */
    this.messageHandler = this.onMessage.bind(this);
    /** @type {boolean} */
    this.rpnMode = true;
  }

  /**
   * オプションの初期化
   * @private
   * @param {object} option
   */
  _initializeOptions(option) {
    /** @type {object} */
    this.option = {
      /** @type {boolean} Display synthsizer Web UI */
      drawSynth: option.drawSynth ?? true,
      /** @type {boolean} Use Cache API */
      cache: option.cache ?? true,
      /** @type {string} CORS */
      targetOrigin: option.targetOrigin ?? '*',
      /** @type {'dark'|'light'|'auto'|undefined} Color mode */
      colorMode: option.colorMode ?? 'auto',
    };

    /** @type {string} SoundFont URL */
    this.url = option.url ?? DEFAULT_SOUNDFONT_URL;

    /** @type {HTMLDivElement} */
    // @ts-ignore
    this.placeholder = option.placeholder
      ? document.getElementById(option.placeholder)
      : window.document.body;

    this.setColorMode(this.option.colorMode);
  }

  /**
   * ウィンドウの初期化
   * @private
   */
  _initializeWindow() {
    /** @type {Window} */
    if (window.opener) {
      this.window = window.opener;
    } else if (window.parent !== window) {
      this.window = window.parent;
    } else {
      this.window = window;
    }
  }

  /**
   * Setup Soundfont by URL.
   *
   * @param {string?} url SoundFont URL
   * @public
   */
  async setup(url = undefined) {
    this._clearPlaceholder();

    if (url) {
      this.url = url;
    }

    const loader = new Loader(
      this.url,
      this.placeholder,
      this.option.cache,
      (/** @type {ArrayBuffer} */ buffer) => this.setupByBuffer(buffer)
    );
    await loader.fetch();
  }

  /**
   * Get SoundFont URL.
   *
   * @return {string}
   */
  getUrl() {
    return this.url;
  }

  /**
   * Setup SoundFont by ArrayBuffer.
   *
   * @param {ArrayBuffer} buffer
   */
  setupByBuffer(buffer) {
    this._clearPlaceholder();
    this._setupSynthesizer(buffer);
    this._renderUI();
    this.synth.init();
    this.onReady();
  }

  /**
   * プレースホルダーのDOMをクリア
   * @private
   */
  _clearPlaceholder() {
    while (this.placeholder.firstChild) {
      this.placeholder.removeChild(this.placeholder.firstChild);
    }
  }

  /**
   * シンセサイザのセットアップまたはリロード
   * @private
   * @param {ArrayBuffer} buffer
   */
  _setupSynthesizer(buffer) {
    if (!this.synth) {
      // @ts-ignore
      this.synth = new Synthesizer(buffer);
      this.synth.start();
    } else {
      // @ts-ignore
      this.synth.refreshInstruments(buffer);
    }
  }

  /**
   * UIの描画
   * @private
   */
  _renderUI() {
    if (this.option.drawSynth) {
      this.placeholder.appendChild(this.synth.drawSynth());
    } else {
      this._showReadyMessage();
    }
  }

  /**
   * Ready メッセージを表示
   * @private
   */
  _showReadyMessage() {
    const readyElem = document.createElement('div');
    readyElem.className = 'alert alert-success';
    readyElem.role = 'alert';
    readyElem.innerText = 'Ready.';
    this.placeholder.appendChild(readyElem);

    setTimeout(() => {
      if (this.placeholder.contains(readyElem)) {
        this.placeholder.removeChild(readyElem);
      }
    }, READY_DISPLAY_TIME);
  }

  /**
   * Callback
   *
   * @protected
   */
  callback() {}

  /**
   * SoundFont Load Ready
   *
   * @protected
   */
  onReady() {
    // 一旦MIDI Link待受を解除
    // @ts-ignore
    window.removeEventListener('message', this.messageHandler);
    // コールバック実行
    this.callback();
    // MIDI Link待ち受け開始
    // @ts-ignore
    window.addEventListener('message', this.messageHandler, false);
    // ホスト側に準備完了通知を送信
    this.window.postMessage('link,ready', this.option.targetOrigin);
  }

  /**
   * WebMidiLink信号をパース
   *
   * @param {Event} ev
   * @private
   */
  onMessage(ev) {
    // @ts-ignore
    const msg = typeof ev.data.split === 'function' ? ev.data.split(',') : [];
    if (msg.length === 0) {
      console.error('unknown message type');
      return;
    }

    // @ts-ignore
    const type = msg.shift();

    switch (type) {
      case 'midi':
        this._handleMidiMessage(msg);
        break;
      case 'link':
        this._handleLinkMessage(msg);
        break;
      default:
        console.error('unknown message type');
    }
  }

  /**
   * MIDIメッセージの処理
   * @private
   * @param {string[]} msg
   */
  _handleMidiMessage(msg) {
    this.processMidiMessage(msg.map(hex => Number.parseInt(hex, 16)));
  }

  /**
   * Linkメッセージの処理
   * @private
   * @param {string[]} msg
   */
  _handleLinkMessage(msg) {
    if (!this.window) {
      return;
    }

    const command = msg.shift();
    const { targetOrigin } = this.option;

    switch (command) {
      case 'reqpatch':
        // TODO: dummy data
        this.window.postMessage('link,patch', targetOrigin);
        break;
      case 'setpatch':
      case 'ready':
        this.window.postMessage('link,ready', targetOrigin);
        break;
      case 'progress':
        // ※この命令は、WebMidiLinkの仕様に含まれていません。
        this.window.postMessage('link,progress', targetOrigin);
        break;
      default:
        console.error('unknown link message:', command);
    }
  }

  /**
   * MIDI準備完了時のコールバック処理を登録する
   *
   * @param {()=>{}} callback コールバック関数
   * @public
   */
  setLoadCallback(callback) {
    this.callback = callback;
  }

  /**
   * MIDI信号を解析し、シンセサイザーを操作する
   *
   * @param {number[]} message
   * @protected
   */
  processMidiMessage(message) {
    const channel = message[0] & 0x0f;
    const synth = this.synth;
    const status = message[0] & 0xf0;

    // http://amei.or.jp/midistandardcommittee/MIDI1.0.pdf
    switch (status) {
      case MIDI_NOTE_OFF: // NoteOff: 8n kk vv
        // @ts-ignore
        synth.noteOff(channel, message[1], message[2]);
        break;
      case MIDI_NOTE_ON: // NoteOn: 9n kk vv
        if (message[2] > 0) {
          synth.noteOn(channel, message[1], message[2]);
        } else {
          // @ts-ignore
          synth.noteOff(channel, message[1], 0);
        }
        break;
      case MIDI_CONTROL_CHANGE: {
        // Control Change: Bn cc dd
        const controlNumber = message[1];
        const value = message[2];

        switch (controlNumber) {
          case CC.BANK_SELECT_MSB: // Bank Select MSB: Bn 00 dd
            synth.bankSelectMsb(channel, value);
            break;
          case CC.MODULATION: // Modulation Depth
            synth.modulationDepth(channel, value);
            break;
          case 0x05: // Portament Time
            break;
          case CC.DATA_ENTRY_MSB: // Data Entry(MSB): Bn 06 dd
            this._handleDataEntryMsb(channel, value);
            break;
          case CC.DATA_ENTRY_LSB: // Data Entry(LSB): Bn 26 dd
            this._handleDataEntryLsb(channel, value);
            break;

          case CC.VOLUME: // Volume Change: Bn 07 dd
            synth.volumeChange(channel, value);
            break;
          case CC.PANPOT: // Panpot Change: Bn 0A dd
            synth.panpotChange(channel, value);
            break;
          case CC.EXPRESSION: // Expression
            synth.expression(channel, value);
            break;
          case CC.BANK_SELECT_LSB: // BankSelect LSB: Bn 20 dd
            synth.bankSelectLsb(channel, value);
            break;
          case CC.HOLD: // Hold
            synth.hold(channel, value);
            break;
          case CC.HARMONIC_CONTENT: // Harmonic Content
            synth.harmonicContent(channel, value);
            break;
          case CC.DECAY_TIME: // DecayTime
            synth.decayTime(channel, value);
            break;
          case CC.RELEASE_TIME: // ReleaseTime
            synth.releaseTime(channel, value);
            break;
          case CC.ATTACK_TIME: // Attack time
            synth.attackTime(channel, value);
            break;
          case CC.BRIGHTNESS: // Brightness
            synth.cutOffFrequency(channel, value);
            break;
          case CC.REVERB_DEPTH: // Effect1 Depth（Reverb Send Level）
            synth.reverbDepth(channel, value);
            break;
          case CC.NRPN_LSB: // NRPN LSB
            this.rpnMode = false;
            this.NrpnLsb[channel] = value;
            break;
          case CC.NRPN_MSB: // NRPN MSB
            this.rpnMode = false;
            this.NrpnMsb[channel] = value;
            break;
          case CC.RPN_LSB: // RPN LSB
            this.rpnMode = true;
            this.RpnLsb[channel] = value;
            break;
          case CC.RPN_MSB: // RPN MSB
            this.rpnMode = true;
            this.RpnMsb[channel] = value;
            break;
          case CC.ALL_SOUND_OFF: // All Sound Off: Bn 78 00
            synth.allSoundOff(channel);
            break;
          case CC.RESET_ALL_CONTROL: // Reset All Control: Bn 79 00
            synth.resetAllControl(channel);
            break;
          default:
            // not supported
            break;
        }
        break;
      }
      case MIDI_PROGRAM_CHANGE: // Program Change: Cn pp
        synth.programChange(channel, message[1]);
        break;
      case MIDI_PITCH_BEND: // Pitch Bend
        synth.pitchBend(channel, message[1], message[2]);
        break;
      case MIDI_SYSTEM_EXCLUSIVE: {
        // delete checksum
        message.splice(1, 1);

        // System Exclusive Message
        // [1] F0
        // [2] <Manufacturer SysEx ID Numbers ID> https://www.amei.or.jp/report/report6.html
        // [3] <Device ID>
        // [4] <Model ID>
        // [5] <Sub ID>
        // [6] <size of parameter key>
        // [7] <size of parameter value>
        // [8] <MSB>
        // [9] <LSB>
        // [10] <data>
        // [11] <checksum> [IGNORE]
        // [12] F7 EOX [IGNORE]
        // console.log(this.dumpMessage(message));

        /**
         * @type {number} System Exclusive Manufacture's ID Number
         * @see {@link https://electronicmusic.fandom.com/wiki/List_of_MIDI_Manufacturer_IDs}
         */
        const manufacturerId = message[1];
        /** @type {number} Device ID (GM extended=0x10 / ポケミク=0x79 / Any=0x7F) */
        const device = message[2];
        /** @type {number} Model ID: (GM=0x09 / GS=0x42 / XG=0x4C) */
        const model = message[3];

        if (
          manufacturerId === MANUFACTURER.GM_NON_REALTIME ||
          device === 0x09
        ) {
          // General MIDI
          this._handleGMMessage(message, model);
        } else if (manufacturerId === MANUFACTURER.REALTIME) {
          // Realtime
          this._handleRealtimeMessage(message, model);
        } else if (manufacturerId === MANUFACTURER.PRIVATE) {
          // smfplayer / sf2synth固有命令
          this._handlePrivateMessage(message);
        }

        if (model === 0x42) {
          // Roland GS
          this._handleGSMessage(message);
        } else if (model === 0x4c) {
          // YAMAHA XG
          this._handleXGMessage(message);
        }
        break;
      }
      default:
        // not supported
        synth.setPercussionPart(9, true);
        break;
    }
  }

  /**
   * Data Entry MSBの処理
   * @private
   * @param {number} channel
   * @param {number} value
   */
  _handleDataEntryMsb(channel, value) {
    const synth = this.synth;
    if (this.rpnMode) {
      // RPN
      if (this.RpnMsb[channel] === 0 && this.RpnLsb[channel] === 0) {
        // Pitch Bend Sensitivity
        synth.pitchBendSensitivity(channel, value);
      }
    } else if (this.NrpnMsb[channel] === 26) {
      // NRPN: Drum Instrument Level
      synth.drumInstrumentLevel(this.NrpnLsb[channel], value);
    }
  }

  /**
   * Data Entry LSBの処理
   * @private
   * @param {number} channel
   * @param {number} value
   */
  _handleDataEntryLsb(channel, value) {
    const synth = this.synth;
    if (this.rpnMode) {
      // RPN
      if (this.RpnMsb[channel] === 0 && this.RpnLsb[channel] === 0) {
        // Pitch Bend Sensitivity
        synth.pitchBendSensitivity(
          channel,
          synth.getPitchBendSensitivity(channel) + value / 100
        );
      }
    }
    // NRPN で LSB が必要なものは今のところない
  }

  /**
   * General MIDIメッセージの処理
   * @private
   * @param {number[]} message
   * @param {number} model
   */
  _handleGMMessage(message, model) {
    const synth = this.synth;
    // http://amei.or.jp/midistandardcommittee/Recommended_Practice/GM2_japanese.pdf
    switch (model) {
      case 0x01:
        // GM System On
        synth.init('GM');
        console.info('\x1b[34mGM System On\x1b[0m');
        break;
      case 0x02:
        // GM System Off
        console.info('\x1b[34mGM System Off\x1b[0m');
        break;
      case 0x03:
        // GM2 System On
        console.info('\x1b[34mGM (v2) System On\x1b[0m');
        synth.init('GM2');
        break;
      default:
        // @ts-ignore
        console.log('\x1b[34mGM\x1b[0m: ' + this.dumpMessage(message));
    }
  }

  /**
   * Realtimeメッセージの処理
   * @private
   * @param {number[]} message
   * @param {number} model
   */
  _handleRealtimeMessage(message, model) {
    if (model === 0x01) {
      // master volume: F0 7F 7F 04 01 [value] [value] F7
      this.synth.setMasterVolume(message[4] + (message[5] << 7));
    } else {
      // @ts-ignore
      console.log('\x1b[34mRealtime\x1b[0m: ' + this.dumpMessage(message));
    }
  }

  /**
   * Privateメッセージの処理 (sf2synth固有命令)
   * @private
   * @param {number[]} message
   */
  _handlePrivateMessage(message) {
    // smfplayer / sf2synth固有命令は、プライベート／非営利用途用のManufacturer IDである0x7Dを使用する。
    // プログラム上意味はないが、GM互換であるため、deviceID:0x10、ModelID:0x00とする。
    // よって、F0 7D 10 00 [...] 7Fで定義

    if (message[4] === 0x01) {
      // カラーモード切替
      // F0 7D 10 00 01 [value]
      if (message[5] === 0x01) {
        this.setColorMode('light');
      } else if (message[5] === 0x02) {
        this.setColorMode('dark');
      } else {
        this.setColorMode('auto');
      }
    }
  }

  /**
   * Roland GSメッセージの処理
   * @private
   * @param {number[]} message
   */
  _handleGSMessage(message) {
    // Roland GS
    // http://lib.roland.co.jp/support/jp/manuals/res/1809974/SC-88VL_j.pdf
    // deviceは10、modelIDは42固定。
    // F0 41 10 42 12 [addr] [part] [key] [value] [checksum] F7
    // (DeviceID = 10, ModelID = 42, CommandID = 12)

    const synth = this.synth;
    const GsPart = message[6] - 0x0f;
    const GsKey = message[7];
    const GsValue = message[8];

    switch (GsKey) {
      case 0x00:
        // TEXT INSERT FOR SC (ASCII code)
        this._handleGSTextMessage(message, GsPart);
        break;
      case 0x04:
        // GS Master Volume
        synth.setMasterVolume(GsValue * 64);
        break;
      case 0x15:
        // GS Drum part
        this._handleGSDrumPart(GsPart, GsValue);
        break;
      case 0x19:
        console.info('\x1b[31mGS Volume On/Off\x1b[0m: ' + GsPart, GsValue);
        break;
      case 0x30:
        console.info('\x1b[31mGS Reverb\x1b[0m: ' + this.dumpMessage(message));
        break;
      case 0x38:
        console.info('\x1b[31mGS Chorus\x1b[0m: ' + this.dumpMessage(message));
        break;
      case 0x45:
        console.info('\x1b[31mGS Bitmap\x1b[0m: ' + this.dumpMessage(message));
        break;
      case 0x7f:
        // GS Reset
        synth.init('GS');
        console.info('\x1b[31mGS Reset\x1b[0m');
        break;
      default:
        // @ts-ignore
        console.log('\x1b[31mGS\x1b[0m: ' + this.dumpMessage(message));
    }
  }

  /**
   * GS テキストメッセージの処理
   * @private
   * @param {number[]} message
   * @param {number} GsPart
   */
  _handleGSTextMessage(message, GsPart) {
    // TEXT INSERT FOR SC (ASCII code)
    // http://kurizill.g1.xrea.com/memorandum/midi2.htm
    // F0 41 10 45 12 10 [page] 00 [...value] [checksum] F7
    // ex. F0 41 10 45 12 10 00 00 [48 65 6C 6C 6F] 21 F7 = Hello

    if (GsPart === 0x00) {
      // ページが0x00の場合、LCDに表示するメッセージとする
      // @ts-ignore
      const msg = message.slice(8, -2); // Remove checksum and F7
      this.synth.processMidiMessage(msg);
    } else {
      // GS音源のLCDの16x16のビットマップ画像
      // @ts-ignore
      console.log(
        '\x1b[31mGS Bitmap message\x1b[0m:' + this.dumpMessage(message)
      );
    }
  }

  /**
   * GS ドラムパートの設定
   * @private
   * @param {number} GsPart
   * @param {number} GsValue
   */
  _handleGSDrumPart(GsPart, GsValue) {
    // GS Drum part: F0 41 10 42 12 40 1[part no] [Map] [checksum] F7
    const synth = this.synth;
    if (GsPart === 0) {
      synth.setPercussionPart(9, GsValue !== 0x00);
    } else if (GsPart >= 10) {
      synth.setPercussionPart(GsPart - 1, GsValue !== 0x00);
    } else {
      synth.setPercussionPart(GsPart, GsValue !== 0x00);
    }
  }

  /**
   * YAMAHA XGメッセージの処理
   * @private
   * @param {number[]} message
   */
  _handleXGMessage(message) {
    // YAMAHA XG
    // F0 43 10 4C [...] F7
    // https://jp.yamaha.com/files/download/other_assets/9/321739/read_aoyama.pdf
    // https://jp.yamaha.com/files/download/other_assets/1/316861/MU100J1.pdf

    const synth = this.synth;
    const XgKey = message[4];
    const XgPart = message[5];

    switch (XgKey) {
      case 0x00:
        // XG Reset
        if (message[6] === 0x7e) {
          synth.init('XG');
          console.info('\x1b[32mXG Reset\x1b[0m');
        }
        break;
      case 0x02:
        // Effect
        console.log('\x1b[32mXG Effect\x1b[0m: ' + this.dumpMessage(message));
        break;
      case 0x03:
        // Insertion Effect
        console.log(
          '\x1b[32mXG Insertion Effect\x1b[0m: ' + this.dumpMessage(message)
        );
        break;
      case 0x04:
        // XG Master Volume
        synth.setMasterVolume(message[9] * 64);
        break;
      case 0x06: {
        // Text
        // @ts-ignore
        const msg = message.slice(8, -1); // Remove F7
        synth.processMidiMessage(msg);
        break;
      }
      case 0x07:
        // Bitmap Window
        console.log('\x1b[32mXG Bitmap\x1b[0m: ' + this.dumpMessage(message));
        break;
      case 0x08:
        // XG Drum Part
        synth.setPercussionPart(XgPart, message[8] !== 0x00);
        break;
      default:
        // @ts-ignore
        console.log('\x1b[32mXG\x1b[0m: ', this.dumpMessage(message));
    }
  }

  /**
   * Dump System Exclusive Message
   *
   * @private
   * @param {number[]} messages
   * @return {string}
   */
  dumpMessage(messages) {
    const ret = [];
    let i = 0;
    for (const msg of messages) {
      let str = '';
      switch (i) {
        case 0:
          // 青
          str = '\x1b[35m';
          break;
        case 1:
        case 2:
        case 3:
          // 黄色
          str = '\x1b[33m';
          break;
        default:
          // 末尾の場合は青、それ以外はシアン
          str = messages.length - 1 === i ? '\x1b[35m' : '\x1b[36m';
          break;
      }

      ret.push(str + msg.toString(16).toUpperCase().padStart(2, '0'));
      i++;
    }
    return ret.join(' ') + '\x1b[0m';
  }

  /**
   * Change Color mode
   *
   * @param {'dark'|'light'|'auto'|undefined} mode Color Mode
   * @public
   */
  setColorMode(mode) {
    // Mode was given
    if (mode) {
      if (mode === 'auto') {
        mode = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      // Update data-* attr on html
      document.documentElement.setAttribute('data-bs-theme', mode);
    }
    // No mode given (e.g. reset)
    else {
      document.documentElement.setAttribute('data-bs-theme', 'auto');
      // Remove data-* attr from html
      document.documentElement.removeAttribute('data-bs-theme');
    }
  }
}

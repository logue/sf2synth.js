import Loader from '@/Loader';
import Synthesizer from '@/Synthesizer';

import type { WebMidiLinkOptions } from '@/interfaces/WebMidiLinkOptions';

/**
 * Web MIDI API Reciever Class.
 *
 * @author imaya, Logue <logue@hotmail.co.jp>
 */
export default class WebMidiLink {
  // MIDI定数
  static readonly MIDI_CHANNELS = 16;
  static readonly MIDI_NOTE_OFF = 0x80;
  static readonly MIDI_NOTE_ON = 0x90;
  static readonly MIDI_CONTROL_CHANGE = 0xb0;
  static readonly MIDI_PROGRAM_CHANGE = 0xc0;
  static readonly MIDI_PITCH_BEND = 0xe0;
  static readonly MIDI_SYSTEM_EXCLUSIVE = 0xf0;

  // Control Change番号
  static readonly CC = {
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
  static readonly MANUFACTURER = {
    GM_NON_REALTIME: 0x7e,
    REALTIME: 0x7f,
    PRIVATE: 0x7d,
  };

  // デフォルトSoundFont URL
  static readonly DEFAULT_SOUNDFONT_URL =
    'https://cdn.jsdelivr.net/npm/@logue/sf2synth@latest/dist/Yamaha XG Sound Set.sf2';

  // Ready表示時間（ミリ秒）
  static readonly READY_DISPLAY_TIME = 3000;

  private readonly globalThis = globalThis;

  private NrpnMsb: number[] = [];
  private NrpnLsb: number[] = [];
  private RpnMsb: number[] = [];
  private RpnLsb: number[] = [];
  private synth?: Synthesizer;
  private messageHandler!: EventListenerOrEventListenerObject;
  private rpnMode: boolean = true;

  private option: WebMidiLinkOptions = {
    drawSynth: true,
    cache: true,
    colorMode: 'auto',
    url: WebMidiLink.DEFAULT_SOUNDFONT_URL,
    placeholder: 'wml',
    messageOptions: {
      targetOrigin: '*',
    },
  };
  private placeholder?: HTMLElement | null = undefined;

  private window?: Window | Worker;

  constructor(option: Partial<WebMidiLinkOptions> = {}) {
    this.initializeChannelData();
    this.initializeOptions(option);
    this.initializeWindow();
  }

  /**
   * チャンネルデータの初期化
   */
  private initializeChannelData() {
    const emptyChannelArray = new Array(WebMidiLink.MIDI_CHANNELS).fill(0);
    this.NrpnMsb = [...emptyChannelArray];
    this.NrpnLsb = [...emptyChannelArray];
    this.RpnMsb = [...emptyChannelArray];
    this.RpnLsb = [...emptyChannelArray];
    this.synth = undefined;
    this.messageHandler = this.onMessage.bind(this);
    this.rpnMode = true;
  }

  /**
   * オプションの初期化
   */
  private initializeOptions(option: Partial<WebMidiLinkOptions>) {
    this.option = { ...this.option, ...option };

    if (this.globalThis.document) {
      this.placeholder = option.placeholder
        ? this.globalThis.document.getElementById(option.placeholder)
        : this.globalThis.document.body;
    }

    this.setColorMode(this.option.colorMode);
  }

  /**
   * ウィンドウの初期化
   */
  private initializeWindow() {
    if (this.globalThis.opener) {
      this.window = this.globalThis.opener;
    } else if (this.globalThis.parent === this.globalThis.window) {
      this.window = this.globalThis as unknown as Window;
    } else if (this.globalThis.parent) {
      this.window = this.globalThis.parent;
    } else {
      // WorkerGlobalScope であれば workerGlobal を使用
      this.window =
        (this.globalThis as any).workerGlobal ||
        (this.globalThis as unknown as Window);
    }
  }

  /**
   * Setup Soundfont by URL.
   *
   * @param url SoundFont URL
   */
  public async setup(url?: string) {
    this.clearPlaceholder();

    if (url) {
      this.option.url = url;
    }

    const loader = new Loader(
      this.option.url,
      this.placeholder!,
      this.option.cache,
      (buffer: ArrayBuffer | Uint8Array) => {
        this.setupByBuffer(buffer);
      },
    );
    await loader.fetch();
  }

  /**
   * Get SoundFont URL.
   */
  public getUrl(): string {
    return this.option.url;
  }

  /**
   * Setup SoundFont by ArrayBuffer or Uint8Array.
   */
  public setupByBuffer(buffer: ArrayBuffer | Uint8Array) {
    const ab =
      buffer instanceof Uint8Array
        ? buffer.buffer.slice(
            buffer.byteOffset,
            buffer.byteOffset + buffer.byteLength,
          )
        : buffer;
    this.clearPlaceholder();
    console.info('[WebMidiLink] setupByBuffer: byteLength=', ab.byteLength);
    this.setupSynthesizer(new Uint8Array(ab));
    this.renderUI();
    this.synth?.init();
    this.onReady();
  }

  /**
   * プレースホルダーのDOMをクリア
   */
  private clearPlaceholder() {
    // If running in a Worker there is no DOM/document available
    if (!this.globalThis.document) {
      return;
    }
    while (this.placeholder?.firstChild) {
      this.placeholder.firstChild?.remove();
    }
  }

  /**
   * シンセサイザのセットアップまたはリロード
   */
  private setupSynthesizer(buffer: Uint8Array) {
    if (!this.synth) {
      this.synth = new Synthesizer(buffer);
      console.info('[WebMidiLink] Synthesizer created');
      if (typeof window !== 'undefined') {
        window.__lastSynth = this.synth;
      }
      this.synth.start();
      console.info('[WebMidiLink] Synthesizer.start called');
    } else {
      // 音源切り替え前に全チャンネルの音を停止してリソースを解放
      for (let ch = 0; ch < WebMidiLink.MIDI_CHANNELS; ch++) {
        this.synth.allSoundOff(ch);
      }
      this.synth.refreshInstruments(buffer);
      console.info('[WebMidiLink] Synthesizer.refreshInstruments called');
      if (typeof window !== 'undefined') {
        window.__lastSynth = this.synth;
      }
    }
  }

  /**
   * UIの描画
   */
  private renderUI() {
    // Skip UI rendering when running in a Worker (no DOM)
    if (!this.globalThis.document) {
      return;
    }
    if (this.option.drawSynth) {
      this.placeholder?.appendChild(this.synth!.drawSynth());
    } else {
      this.showReadyMessage();
    }
  }

  /**
   * Ready メッセージを表示
   */
  private showReadyMessage() {
    const readyElem = document.createElement('div');
    readyElem.className = 'alert alert-success';
    readyElem.role = 'alert';
    readyElem.innerText = 'Ready.';
    this.placeholder?.appendChild(readyElem);

    setTimeout(() => {
      this.placeholder?.remove();
    }, WebMidiLink.READY_DISPLAY_TIME);
  }

  /**
   * Callback
   */
  protected callback() {
    // through
  }

  /**
   * SoundFont Load Ready
   */
  protected onReady() {
    // Determine appropriate target for event handling and postMessage
    const isDom = !!this.globalThis.document;
    const target = isDom ? this.window : this.globalThis;

    if (!target) {
      throw new Error(
        '[WebMidiLink] No valid target for WebMidiLink communication',
      );
    }

    // 一旦MIDI Link待受を解除
    if (typeof target.removeEventListener === 'function') {
      target.removeEventListener('message', this.messageHandler);
    }
    // コールバック実行
    this.callback();
    // MIDI Link待ち受け開始
    if (typeof target.addEventListener === 'function') {
      target.addEventListener('message', this.messageHandler, false);
    }

    // ホスト側に準備完了通知を送信
    if (typeof target.postMessage === 'function') {
      if (isDom) {
        // Cast targetOrigin to any to satisfy differing TS DOM lib overloads for postMessage
        target.postMessage('link,ready', this.option.messageOptions);
      } else {
        // Worker global scope: postMessage(message) without targetOrigin
        target.postMessage('link,ready');
      }
    }
  }

  /**
   * WebMidiLink信号をパース
   */
  private onMessage(ev: Event) {
    if (!(ev instanceof MessageEvent)) {
      return;
    }
    const msg: string[] =
      typeof ev.data.split === 'function' ? ev.data.split(',') : [];
    if (msg.length === 0) {
      console.error('unknown message type');
      return;
    }

    const type = msg.shift();

    switch (type) {
      case 'midi':
        this.handleMidiMessage(msg);
        break;
      case 'link':
        this.handleLinkMessage(msg);
        break;
      default:
        console.error('unknown message type');
    }
  }

  /**
   * MIDIメッセージの処理
   */
  private handleMidiMessage(msg: string[]) {
    this.processMidiMessage(msg.map((hex) => Number.parseInt(hex, 16)));
  }

  /**
   * Linkメッセージの処理
   */
  private handleLinkMessage(msg: string[]) {
    const command = msg.shift();

    switch (command) {
      case 'reqpatch':
        // TODO: dummy data
        this.window!.postMessage('link,patch', this.option.messageOptions);
        break;
      case 'setpatch':
      case 'ready':
        this.window!.postMessage('link,ready', this.option.messageOptions);
        break;
      case 'progress':
        // ※この命令は、WebMidiLinkの仕様に含まれていません。
        this.window!.postMessage('link,progress', this.option.messageOptions);
        break;
      default:
        console.error('unknown link message:', command);
    }
  }

  /**
   * MIDI準備完了時のコールバック処理を登録する
   *
   * @param callback コールバック関数
   */
  public setLoadCallback(callback: () => void) {
    this.callback = callback;
  }

  /**
   * MIDI信号を解析し、シンセサイザーを操作する
   */
  protected processMidiMessage(message: number[]) {
    const synth = this.synth;
    if (!synth) {
      return;
    }

    const channel = message[0] & 0x0f;
    const status = message[0] & 0xf0;

    // http://amei.or.jp/midistandardcommittee/MIDI1.0.pdf
    switch (status) {
      case WebMidiLink.MIDI_NOTE_OFF: // NoteOff: 8n kk vv
        synth.noteOff(channel, message[1]);
        break;
      case WebMidiLink.MIDI_NOTE_ON: // NoteOn: 9n kk vv
        if (message[2] > 0) {
          synth.noteOn(channel, message[1], message[2]);
        } else {
          synth.noteOff(channel, message[1]);
        }
        break;
      case WebMidiLink.MIDI_CONTROL_CHANGE: {
        // Control Change: Bn cc dd
        const controlNumber = message[1];
        const value = message[2];

        switch (controlNumber) {
          case WebMidiLink.CC.BANK_SELECT_MSB: // Bank Select MSB: Bn 00 dd
            synth.bankSelectMsb(channel, value);
            break;
          case WebMidiLink.CC.MODULATION: // Modulation Depth
            synth.modulationDepth(channel, value);
            break;
          case 0x05: // Portament Time
            break;
          case WebMidiLink.CC.DATA_ENTRY_MSB: // Data Entry(MSB): Bn 06 dd
            this.handleDataEntryMsb(channel, value);
            break;
          case WebMidiLink.CC.DATA_ENTRY_LSB: // Data Entry(LSB): Bn 26 dd
            this.handleDataEntryLsb(channel, value);
            break;

          case WebMidiLink.CC.VOLUME: // Volume Change: Bn 07 dd
            synth.volumeChange(channel, value);
            break;
          case WebMidiLink.CC.PANPOT: // Panpot Change: Bn 0A dd
            synth.panpotChange(channel, value);
            break;
          case WebMidiLink.CC.EXPRESSION: // Expression
            synth.expression(channel, value);
            break;
          case WebMidiLink.CC.BANK_SELECT_LSB: // BankSelect LSB: Bn 20 dd
            synth.bankSelectLsb(channel, value);
            break;
          case WebMidiLink.CC.HOLD: // Hold
            synth.hold(channel, value);
            break;
          case WebMidiLink.CC.HARMONIC_CONTENT: // Harmonic Content
            synth.harmonicContent(channel, value);
            break;
          case WebMidiLink.CC.DECAY_TIME: // DecayTime
            synth.decayTime(channel, value);
            break;
          case WebMidiLink.CC.RELEASE_TIME: // ReleaseTime
            synth.releaseTime(channel, value);
            break;
          case WebMidiLink.CC.ATTACK_TIME: // Attack time
            synth.attackTime(channel, value);
            break;
          case WebMidiLink.CC.BRIGHTNESS: // Brightness
            synth.cutOffFrequency(channel, value);
            break;
          case WebMidiLink.CC.REVERB_DEPTH: // Effect1 Depth（Reverb Send Level）
            synth.reverbDepth(channel, value);
            break;
          case WebMidiLink.CC.NRPN_LSB: // NRPN LSB
            this.rpnMode = false;
            this.NrpnLsb[channel] = value;
            break;
          case WebMidiLink.CC.NRPN_MSB: // NRPN MSB
            this.rpnMode = false;
            this.NrpnMsb[channel] = value;
            break;
          case WebMidiLink.CC.RPN_LSB: // RPN LSB
            this.rpnMode = true;
            this.RpnLsb[channel] = value;
            break;
          case WebMidiLink.CC.RPN_MSB: // RPN MSB
            this.rpnMode = true;
            this.RpnMsb[channel] = value;
            break;
          case WebMidiLink.CC.ALL_SOUND_OFF: // All Sound Off: Bn 78 00
            synth.allSoundOff(channel);
            break;
          case WebMidiLink.CC.RESET_ALL_CONTROL: // Reset All Control: Bn 79 00
            synth.resetAllControl(channel);
            break;
          default:
            // not supported
            break;
        }
        break;
      }
      case WebMidiLink.MIDI_PROGRAM_CHANGE: // Program Change: Cn pp
        synth.programChange(channel, message[1]);
        break;
      case WebMidiLink.MIDI_PITCH_BEND: // Pitch Bend
        synth.pitchBend(channel, message[1], message[2]);
        break;
      case WebMidiLink.MIDI_SYSTEM_EXCLUSIVE: {
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
         * System Exclusive Manufacture's ID Number
         * @see {@link https://electronicmusic.fandom.com/wiki/List_of_MIDI_Manufacturer_IDs}
         */
        const manufacturerId: number = message[1];
        /** Device ID (GM extended=0x10 / ポケミク=0x79 / Any=0x7F) */
        const device: number = message[2];
        /** Model ID: (GM=0x09 / GS=0x42 / XG=0x4C) */
        const model: number = message[3];

        if (
          manufacturerId === WebMidiLink.MANUFACTURER.GM_NON_REALTIME ||
          device === 0x09
        ) {
          // General MIDI
          this.handleGMMessage(message, model);
        } else if (manufacturerId === WebMidiLink.MANUFACTURER.REALTIME) {
          // Realtime
          this.handleRealtimeMessage(message, model);
        } else if (manufacturerId === WebMidiLink.MANUFACTURER.PRIVATE) {
          // smfplayer / sf2synth固有命令
          this.handlePrivateMessage(message);
        }

        if (model === 0x42) {
          // Roland GS
          this.handleGSMessage(message);
        } else if (model === 0x4c) {
          // YAMAHA XG
          this.handleXGMessage(message);
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
   */
  private handleDataEntryMsb(channel: number, value: number) {
    const synth = this.synth;
    if (!synth) return;
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
   * @param channel
   * @param value
   */
  private handleDataEntryLsb(channel: number, value: number) {
    const synth = this.synth;
    if (!synth) return;
    if (this.rpnMode) {
      // RPN
      if (this.RpnMsb[channel] === 0 && this.RpnLsb[channel] === 0) {
        // Pitch Bend Sensitivity
        synth.pitchBendSensitivity(
          channel,
          synth.getPitchBendSensitivity(channel) + value / 100,
        );
      }
    }
    // NRPN で LSB が必要なものは今のところない
  }

  /**
   * General MIDIメッセージの処理
   */
  private handleGMMessage(message: number[], model: number) {
    const synth = this.synth;
    if (!synth) return;
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
        console.log('\x1b[34mGM\x1b[0m: ' + this.dumpMessage(message));
    }
  }

  /**
   * Realtimeメッセージの処理
   */
  private handleRealtimeMessage(message: number[], model: number) {
    const synth = this.synth;
    if (!synth) return;
    if (model === 0x01) {
      // master volume: F0 7F 7F 04 01 [value] [value] F7
      synth.setMasterVolume(message[4] + (message[5] << 7));
    } else {
      console.log('\x1b[34mRealtime\x1b[0m: ' + this.dumpMessage(message));
    }
  }

  /**
   * Privateメッセージの処理 (sf2synth固有命令)
   * @param message
   */
  private handlePrivateMessage(message: number[]) {
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
   * @param message
   */
  private handleGSMessage(message: number[]) {
    // Roland GS
    // http://lib.roland.co.jp/support/jp/manuals/res/1809974/SC-88VL_j.pdf
    // deviceは10、modelIDは42固定。
    // F0 41 10 42 12 [addr] [part] [key] [value] [checksum] F7
    // (DeviceID = 10, ModelID = 42, CommandID = 12)

    const synth = this.synth;
    if (!synth) return;
    const GsPart = message[6] - 0x0f;
    const GsKey = message[7];
    const GsValue = message[8];

    switch (GsKey) {
      case 0x00:
        // TEXT INSERT FOR SC (ASCII code)
        this.handleGSTextMessage(message, GsPart);
        break;
      case 0x04:
        // GS Master Volume
        synth.setMasterVolume(GsValue * 64);
        break;
      case 0x15:
        // GS Drum part
        this.handleGSDrumPart(GsPart, GsValue);
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
        console.log('\x1b[31mGS\x1b[0m: ' + this.dumpMessage(message));
    }
  }

  /**
   * GS テキストメッセージの処理
   * @param message
   * @param GsPart
   */
  private handleGSTextMessage(message: number[], GsPart: number) {
    // TEXT INSERT FOR SC (ASCII code)
    // http://kurizill.g1.xrea.com/memorandum/midi2.htm
    // F0 41 10 45 12 10 [page] 00 [...value] [checksum] F7
    // ex. F0 41 10 45 12 10 00 00 [48 65 6C 6C 6F] 21 F7 = Hello

    const synth = this.synth;
    if (!synth) return;
    if (GsPart === 0x00) {
      // ページが0x00の場合、LCDに表示するメッセージとする
      const msg = message.slice(8, -2); // Remove checksum and F7
      synth.processMidiMessage(msg);
    } else {
      // GS音源のLCDの16x16のビットマップ画像
      console.log(
        '\x1b[31mGS Bitmap message\x1b[0m:' + this.dumpMessage(message),
      );
    }
  }

  /**
   * GS ドラムパートの設定
   * @param GsPart
   * @param GsValue
   */
  private handleGSDrumPart(GsPart: number, GsValue: number) {
    // GS Drum part: F0 41 10 42 12 40 1[part no] [Map] [checksum] F7
    const synth = this.synth;
    if (!synth) return;
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
   * @param message
   */
  private handleXGMessage(message: number[]) {
    // YAMAHA XG
    // F0 43 10 4C [...] F7
    // https://jp.yamaha.com/files/download/other_assets/9/321739/read_aoyama.pdf
    // https://jp.yamaha.com/files/download/other_assets/1/316861/MU100J1.pdf

    const synth = this.synth;
    if (!synth) return;
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
          '\x1b[32mXG Insertion Effect\x1b[0m: ' + this.dumpMessage(message),
        );
        break;
      case 0x04:
        // XG Master Volume
        synth.setMasterVolume(message[9] * 64);
        break;
      case 0x06: {
        // Text
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
        console.log('\x1b[32mXG\x1b[0m: ', this.dumpMessage(message));
    }
  }

  /**
   * Dump System Exclusive Message
   */
  private dumpMessage(messages: number[]): string {
    const ret = [];
    let i = 0;
    for (const msg of messages) {
      let str;
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
   */
  public setColorMode(mode: 'dark' | 'light' | 'auto' | undefined) {
    // If running in a Worker there is no DOM to update
    if (this.window instanceof Window) {
      // Mode was given
      if (mode) {
        if (mode === 'auto') {
          mode = this.window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        }
        // Update data-* attr on html
        this.window.document.documentElement.dataset.bsTheme = mode;
      }
      // No mode given (e.g. reset)
      else {
        this.window.document.documentElement.dataset.bsTheme = 'auto';
        // Remove data-* attr from html
        delete this.window!.document.documentElement.dataset.bsTheme;
      }
    }
  }
}

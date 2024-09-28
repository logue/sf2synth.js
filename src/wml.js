import Loader from './loader.js';
import Synthesizer from './sound_font_synth.js';

/**
 * WebMidiLink Class
 *
 * @author imaya
 */
export default class WebMidiLink {
  /** @param {object} option */
  constructor(option = {}) {
    /** @type {number[]} */
    this.NrpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {number[]} */
    this.NrpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {number[]} */
    this.RpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {number[]} */
    this.RpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {boolean} */
    this.ready = false;
    /** @type {Synthesizer} */
    this.synth = undefined;
    /** @type {Function} */
    this.messageHandler = this.onMessage.bind(this);
    /** @type {boolean} */
    this.rpnMode = true;
    /** @type {object} */
    this.option = {};
    /** @type {boolean} Display synthsizer Web UI */
    this.option.drawSynth = option.drawSynth ?? true;
    /** @type {boolean} Use Cache API */
    this.option.cache = option.cache ?? true;
    /** @type {string} CORS */
    this.option.targetOrigin = option.targetOrigin ?? '*';
    /** @type {'dark'|'light'|'auto'|undefined} Color mode */
    this.option.colorMode = option.colorMode ?? 'auto';
    /** @type {string} SoundFont URL */
    this.url =
      option.url ??
      'https://cdn.jsdelivr.net/npm/@logue/sf2synth@latest/dist/Yamaha XG Sound Set.sf2';

    /** @type {HTMLDivElement} */
    // @ts-ignore
    this.placeholder = option.placeholder
      ? document.getElementById(option.placeholder)
      : window.document.body;
    this.setColorMode(this.option.colorMode);
    /** @type {Window} */
    this.window = null;

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
    // DOMをクリア
    while (this.placeholder.firstChild) {
      this.placeholder.removeChild(this.placeholder.firstChild);
    }
    if (url) {
      // URLが明示的に指定されていた場合
      this.url = url;
    }

    /** 読み込み */
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
    // DOMをクリア
    while (this.placeholder.firstChild) {
      this.placeholder.removeChild(this.placeholder.firstChild);
    }

    if (!this.synth) {
      // 読み込まれていないときシンセサイザをセットアップ
      // @ts-ignore
      this.synth = new Synthesizer(buffer);
      // 待受開始
      this.synth.start();
    } else {
      // 別のSoundFontが読み込まれたときリロード
      // @ts-ignore
      this.synth.refreshInstruments(buffer);
    }
    if (this.option.drawSynth) {
      // キーボードなどを描画
      this.placeholder.appendChild(this.synth.drawSynth());
    } else {
      /** @type {HTMLDivElement} キーボードを描画しないときはReadyだけを表示する。 */
      const readyElem = document.createElement('div');
      readyElem.className = 'alert alert-success';
      readyElem.role = 'alert';
      readyElem.innerText = 'Ready.';
      this.placeholder.appendChild(readyElem);

      setTimeout(() => {
        this.placeholder.removeChild(readyElem);
      }, 3000);
    }
    // シンセサイザを初期化
    this.synth.init();

    this.onReady();
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
    /** @type {Array} */
    // @ts-ignore
    const msg = typeof ev.data.split === 'function' ? ev.data.split(',') : [];
    /** @type {string} */
    // @ts-ignore
    const type = msg.length !== 0 ? msg.shift() : '';
    /** @type {string} */
    let command;

    switch (type) {
      case 'midi':
        this.processMidiMessage(msg.map(hex => parseInt(hex, 16)));
        break;
      case 'link':
        if (!this.window) {
          return;
        }
        command = msg.shift();
        switch (command) {
          case 'reqpatch':
            // TODO: dummy data
            this.window.postMessage('link,patch', this.option.targetOrigin);
            break;
          case 'setpatch':
          case 'ready':
            this.window.postMessage('link,ready', this.option.targetOrigin);
            // TODO: NOP
            break;
          case 'progress':
            // ※この命令は、WebMidiLinkの仕様に含まれていません。
            this.window.postMessage('link,progress', this.option.targetOrigin);
            break;
          default:
            console.error('unknown link message:', command);
            break;
        }
        break;
      default:
        console.error('unknown message type');
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
    /** @type {number} */
    const channel = message[0] & 0x0f;
    /** @type {Synthesizer} */
    const synth = this.synth;

    // http://amei.or.jp/midistandardcommittee/MIDI1.0.pdf
    switch (message[0] & 0xf0) {
      case 0x80: // NoteOff: 8n kk vv
        // @ts-ignore
        synth.noteOff(channel, message[1], message[2]);
        break;
      case 0x90: // NoteOn: 9n kk vv
        if (message[2] > 0) {
          synth.noteOn(channel, message[1], message[2]);
        } else {
          // @ts-ignore
          synth.noteOff(channel, message[1], 0);
        }
        break;
      case 0xb0: {
        // Control Change: Bn cc dd
        /** @type {number} */
        const value = message[2];
        switch (message[1]) {
          case 0x00: // Bank Select MSB: Bn 00 dd
            synth.bankSelectMsb(channel, value);
            break;
          case 0x01: // Modulation Depth
            synth.modulationDepth(channel, value);
            break;
          case 0x05: // Portament Time
            break;
          case 0x06: // Data Entry(MSB): Bn 06 dd
            if (this.rpnMode) {
              // RPN
              switch (this.RpnMsb[channel]) {
                case 0:
                  switch (this.RpnLsb[channel]) {
                    case 0: // Pitch Bend Sensitivity
                      synth.pitchBendSensitivity(channel, value);
                      break;
                    case 1:
                      // console.log("fine");
                      break;
                    case 2:
                      // console.log("coarse");
                      break;
                    default:
                      // console.log("default");
                      break;
                  }
                  break;
                default:
                  // console.log("default:", this.RpnMsb[channel], this.RpnLsb[channel]);
                  break;
              }
            } else {
              // NRPN
              switch (this.NrpnMsb[channel]) {
                case 26: // Drum Instrument Level
                  synth.drumInstrumentLevel(this.NrpnLsb[channel], value);
                  break;
                default:
                  // console.log("default:", this.RpnMsb[channel], this.RpnLsb[channel]);
                  break;
              }
            }
            break;
          case 0x26: // Data Entry(LSB): Bn 26 dd
            if (this.rpnMode) {
              // RPN
              switch (this.RpnMsb[channel]) {
                case 0:
                  switch (this.RpnLsb[channel]) {
                    case 0: // Pitch Bend Sensitivity
                      synth.pitchBendSensitivity(
                        channel,
                        synth.getPitchBendSensitivity(channel) + value / 100
                      );
                      break;
                    case 1:
                      // console.log("fine");
                      break;
                    case 2:
                      // console.log("coarse");
                      break;
                  }
                  break;
              }
            }

            // NRPN で LSB が必要なものは今のところない
            break;

          case 0x07: // Volume Change: Bn 07 dd
            synth.volumeChange(channel, value);
            break;
          case 0x0a: // Panpot Change: Bn 0A dd
            synth.panpotChange(channel, value);
            break;
          case 0x78: // All Sound Off: Bn 78 00]
            synth.allSoundOff(channel);
            break;
          case 0x79: // Reset All Control: Bn 79 00
            synth.resetAllControl(channel);
            break;
          case 0x20: // BankSelect LSB: Bn 00 dd
            synth.bankSelectLsb(channel, value);
            break;
          case 0x47: // Harmonic Content
            synth.harmonicContent(channel, value);
            break;
          case 0x60: //
            // console.log(60);
            break;
          case 0x61: //
            // console.log(61);
            break;
          case 0x62: // NRPN LSB
            this.rpnMode = false;
            this.NrpnLsb[channel] = value;
            break;
          case 0x63: // NRPN MSB
            this.rpnMode = false;
            this.NrpnMsb[channel] = value;
            break;
          case 0x64: // RPN LSB
            this.rpnMode = true;
            this.RpnLsb[channel] = value;
            break;
          case 0x65: // RPN MSB
            this.rpnMode = true;
            this.RpnMsb[channel] = value;
            break;
          case 0x40: // Hold
            synth.hold(channel, value);
            break;
          case 0x0b: // Expression
            synth.expression(channel, value);
            break;
          case 0x48: // DecayTyme
            synth.decayTime(channel, value);
            break;
          case 0x49: // ReleaseTime
            synth.releaseTime(channel, value);
            break;
          case 0x4a: // Attack time
            synth.attackTime(channel, value);
            break;
          case 0x4b: // Brightness
            synth.cutOffFrequency(channel, value);
            break;
          case 0x5b: // Effect1 Depth（Reverb Send Level）
            synth.reverbDepth(channel, value);
            break;
          default:
            // not supported
            break;
        }
        break;
      }
      case 0xc0: // Program Change: Cn pp
        synth.programChange(channel, message[1]);
        break;
      case 0xe0: // Pitch Bend
        synth.pitchBend(channel, message[1], message[2]);
        break;
      case 0xf0: {
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

        if (manufacturerId === 0x7e || device === 0x09) {
          // Gneral MIDI
          // http://amei.or.jp/midistandardcommittee/Recommended_Practice/GM2_japanese.pdf
          // console.log('GM:', this.dumpMessage(message));
          // Non Realtime
          switch (model) {
            case 0x01:
              // GM System On
              synth.init('GM');
              console.info('\x1b[34mGM System On\x1b[0m');
              break;
            case 0x02:
              // GM System Off
              console.info('\x1b[34mGM System Off\x1b[0m');
              // Throuh
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
        } else if (manufacturerId === 0x7f) {
          // Realtime
          if (model === 0x01) {
            // master volume: F0 7F 7F 04 01 [value] [value] F7
            synth.setMasterVolume(message[4] + (message[5] << 7));
          } else {
            // @ts-ignore
            console.log(
              '\x1b[34mRealtime\x1b[0m: ' + this.dumpMessage(message)
            );
          }
        } else if (manufacturerId === 0x7d) {
          // smfplayer / sf2synth固有命令は、プライベート／非営利用途用のManufacturer IDである0x7Dを使用する。
          // プログラム上意味はないが、GM互換であるため、deviceID:0x10、ModelID:0x00とする。
          // よって、F0 7D 10 00 [...] 7Fで定義

          if (message[4] === 0x01) {
            // カラーモード切替
            // F0 7D 10 00 01 [value]
            if (message[5] === 0x01) {
              // 明示的にライトモード
              this.setColorMode('light');
            } else if (message[5] === 0x02) {
              // 明示的にダークモード
              this.setColorMode('dark');
            } else {
              // OSの設定に合わせる
              this.setColorMode('auto');
            }
          }
        }

        if (model === 0x42) {
          // Roland GS
          // http://lib.roland.co.jp/support/jp/manuals/res/1809974/SC-88VL_j.pdf
          // deviceは10、modelIDは42固定。
          // F0 41 10 42 12 [addr] [part] [key] [value] [checksum] F7
          // (DeviceID = 10, ModelID = 42, CommandID = 12)

          // QuickTime音源や、WindowsMIDI音源は、GS互換音源なのでmanufacturerIdが41とは限らない

          /* * @param {number} GsAddress GSアドレス（未使用）
          const GsAddress = message[6];
          */
          /** @type {number} GSパート番号 */
          const GsPart = message[6] - 0x0f;
          /** @type {number} GSのキーパラメータ */
          const GsKey = message[7];
          /** @type {number} GSの値 */
          const GsValue = message[8];
          // TODO
          switch (GsKey) {
            case 0x00:
              // TEXT INSERT FOR SC (ASCI code)
              // http://kurizill.g1.xrea.com/memorandum/midi2.htm
              // F0 41 10 45 12 10 [page] 00 [...value] [checksum] F7
              // ex. F0 41 10 45 12 10 00 00 [48 65 6C 6C 6F] 21 F7 = Hello

              // device IDの値は0x45固定だがその判定処理は省略

              if (GsPart === 0x00) {
                // ページが0x00の場合、LCDに表示するメッセージとする
                // @ts-ignore
                const msg = message.splice(8);
                // Remove F7
                msg.pop();
                // Remove Checksum
                msg.pop();
                synth.processMidiMessage(msg);
              } else {
                // GS音源のLCDの16x16のビットマップ画像
                // @ts-ignore
                console.log(
                  '\x1b[31mGS Bitmap message\x1b[0m:' +
                    this.dumpMessage(message)
                );
              }
              break;
            case 0x04:
              // GS Master Volume:
              // F0 41 10 42 12 40 00 04 [value] [checksum] F7
              // console.log('GS Volume:', this.dumpMessage(message));
              synth.setMasterVolume(GsValue * 64);
              break;

            case 0x15: {
              // GS Dram part: F0 41 10 42 12 40 1[part no] [Map] [checksum] F7
              // Notice: [sum] is ignroe in this program.

              if (GsPart === 0) {
                // 10 Ch.
                synth.setPercussionPart(9, GsValue !== 0x00);
              } else if (GsPart >= 10) {
                // 1~9 Ch.
                synth.setPercussionPart(GsPart - 1, GsValue !== 0x00);
              } else {
                // 11~16 Ch.
                synth.setPercussionPart(GsPart, GsValue !== 0x00);
              }
              break;
            }
            case 0x19:
              // VOLUME ON/OFF (PART LEVEL)
              // F0 41 10 42 12 40 1[part no] 19 [value] [checksum] F7
              console.info(
                '\x1b[31mGS Volume On/Off\x1b[0m: ' + GsPart,
                GsValue
              );
              break;
            case 0x30:
              // Reverb Effect
              console.info(
                '\x1b[31mGS Reverb\x1b[0m: ' + this.dumpMessage(message)
              );
              break;
            case 0x38:
              // Chorus Effect
              console.info(
                '\x1b[31mGS Chorus\x1b[0m: ' + this.dumpMessage(message)
              );
              break;
            case 0x45:
              // Bitmap icon 16x16 ?
              console.info(
                '\x1b[31mGS Bitmap\x1b[0m: ' + this.dumpMessage(message)
              );
              break;
            case 0x7f:
              // GS Reset: F0 41 10 42 12 40 00 7F 00 [checksum] F7
              synth.init('GS');
              console.info('\x1b[31mGS Reset\x1b[0m');
              break;
            default:
              // @ts-ignore
              console.log('\x1b[31mGS\x1b[0m: ' + this.dumpMessage(message));
          }
        } else if (model === 0x4c) {
          // YAMAHA XG
          // F0 43 10 4C [...] F7
          // https://jp.yamaha.com/files/download/other_assets/9/321739/read_aoyama.pdf
          // https://jp.yamaha.com/files/download/other_assets/1/316861/MU100J1.pdf

          // カシオとKORGはXG互換音源を作っていたためmanufacturerIdが43とは限らない

          /** @type {number} Xg音源のキー */
          const XgKey = message[4];
          /** @type {number} Xg音源のパート */
          const XgPart = message[5];

          switch (XgKey) {
            case 0x00:
              // XG Reset:
              // F0 43 1n 4C 00 00 7E 00 F7
              if (message[6] === 0x7e) {
                synth.init('XG');
                console.info('\x1b[32mXG Reset\x1b[0m');
              }
              break;
            case 0x02:
              // Effect
              // https://jp.yamaha.com/files/download/other_assets/5/321745/efctparamlist.pdf
              // F0 43 10 4C 02 01 [type] [value] F7
              //
              // type
              // 02: Reverb
              //   リバーブエフェクトのインパルス応答を選択する
              // 40: Variation
              //   F0 43 10 4C 02 01 40 [type] 00 F7
              //   インサーションエフェクトとして使用するモードと全チャンネルにかけるシステムエフェクトモード場合がある。
              //   アンプシミュレーターやディストーション、フェイザー、ディレイなど飛び道具的なエフェクトはここに入っていた。
              // 41: バリエーションエフェクトの種類
              //   [value]にエフェクトの種類
              // 5B: バリエーションエフェクトをかけるパート
              //   F0 43 10 4C 02 01 5B [part] F7
              //   [value]が0でインサーションエフェクト、1でシステムエフェクトモードに切り替える。
              //   インサーションエフェクトが実装される前（MU100よりも前の機種）は、ディレイ・エフェクトで使う場合が多かった。
              console.log(
                '\x1b[32mXG Effect\x1b[0m: ' + this.dumpMessage(message)
              );
              break;
            case 0x03:
              // Insertion Effect
              // F0 43 10 4C 03 [type] [value] F7
              // MU100以降の機種で実装されている。最大２系統。１チャンネルのみ指定可能。
              console.log(
                '\x1b[32mXG Insertion Effect\x1b[0m: ' +
                  this.dumpMessage(message)
              );
              break;
            case 0x04:
              // XG Master Volume:
              // F0 43 1n 4C 00 00 04 [value] F7
              synth.setMasterVolume(message[9] * 64);
              break;
            case 0x06: {
              // Text:
              // F0 43 1n 4C 06 00 00 [text] F7
              // ex. F0 43 1n 4C 06 00 00 48 65 6C 6C 6F 21 F7 = Hello
              // @ts-ignore
              const msg = message.splice(8);
              // Remove F7
              msg.pop();
              synth.processMidiMessage(msg);
              break;
            }
            case 0x07:
              // Bitmap Window
              // F0 43 10 4C 07 00 00 [bitmap] F7
              // 音源のアイコン描画領域に描画する16x16のビットマップ画像。
              // 7bitごとに左上から描画する。仕様がややこしいので処理しない
              console.log(
                '\x1b[32mXG Bitmap\x1b[0m: ' + this.dumpMessage(message)
              );
              break;
            case 0x08:
              // XG Dram Part:
              // F0 43 10 4C 08 [partNum] 07 [map] F7
              // 厳密には[map]は1以上の値が入り、３＋１系統までしか使えない（MU2000の場合）が、本プログラムでは制限しない。
              synth.setPercussionPart(XgPart, message[8] !== 0x00);
              break;

            default:
              // @ts-ignore
              console.log('\x1b[32mXG\x1b[0m: ', this.dumpMessage(message));
          }
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

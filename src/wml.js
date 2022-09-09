import Synthesizer from './sound_font_synth';
import Loader from './loader';

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
    /** @type {function(ArrayBuffer)?} */
    this.loadCallback = undefined;
    /** @type {Function} */
    this.messageHandler = this.onmessage.bind(this);
    /** @type {boolean} */
    this.rpnMode = true;
    /** @type {object} */
    this.option = option;
    /** @type {boolean} */
    this.option.drawSynth =
      option.drawSynth !== void 0 ? option.drawSynth : true;
    /** @type {boolean} */
    this.option.cache = option.cache || false;
    /** @type {HTMLElement} */
    this.placeholder =
      option.placeholder !== void 0
        ? document.getElementById(option.placeholder)
        : window.document.body;
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
   * @param {string} url
   * @public
   */
  async setup(url) {
    /** 読み込み */
    const loader = new Loader(
      url,
      this.placeholder,
      this.option.cache,
      buffer => this.setupByBuffer(buffer)
    );
    await loader.fetch();
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
      this.synth = new Synthesizer(buffer);
      if (this.option.drawSynth) {
        // キーボードなどを描画
        this.placeholder.appendChild(this.synth.drawSynth());
      } else {
        // キーボードを描画しないときはReadyだけを表示する。
        const readyElem = document.createElement('strong');
        readyElem.innerText = 'Ready.';
        this.placeholder.appendChild(readyElem);
      }
      // シンセサイザを初期化
      this.synth.init();
      // 待受開始
      this.synth.start();
    } else {
      // 別のSoundFontが読み込まれたときリロード
      this.synth.refreshInstruments(buffer);
    }
    this.onReady();
  }

  /**
   * SoundFont Load Ready
   *
   * @protected
   */
  onReady() {
    // 一旦MIDI Link待受を解除
    window.removeEventListener('message', this.messageHandler);
    if (this.loadCallback) {
      // コールバック実行
      this.loadCallback();
    }
    // MIDI Link待ち受け開始
    window.addEventListener('message', this.messageHandler, false);
    // ホスト側に準備完了通知を送信
    this.window.postMessage('link,ready', '*');
  }

  /**
   * WebMidiLink信号をパース
   *
   * @param {Event} ev
   * @private
   */
  onmessage(ev) {
    /** @type {Array} */
    const msg = typeof ev.data.split === 'function' ? ev.data.split(',') : [];
    /** @type {string} */
    const type = msg !== [] ? msg.shift() : '';
    /** @type {string} */
    let command;

    switch (type) {
      case 'midi':
        // console.log(msg);
        this.processMidiMessage(msg.map(hex => parseInt(hex, 16)));
        break;
      case 'link':
        if (this.window === void 0) {
          return;
        }
        command = msg.shift();
        switch (command) {
          case 'reqpatch':
            // TODO: dummy data
            this.window.postMessage('link,patch', '*');
            break;
          case 'setpatch':
          case 'ready':
            this.window.postMessage('link,ready', '*');
            // TODO: NOP
            break;
          case 'progress':
            // ※この命令は、WebMidiLinkの仕様に含まれていません。
            this.window.postMessage('link,progress', '*');
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
   * @param {function(ArrayBuffer)} callback
   * @public
   */
  setLoadCallback(callback) {
    this.loadCallback = callback;
  }

  /**
   * MIDI信号を解析し、シンセサイザーを操作する
   *
   * @param {number[] | ArrayBuffer} message
   * @private
   */
  processMidiMessage(message) {
    /** @type {number} */
    const channel = message[0] & 0x0f;
    /** @type {Synthesizer} */
    const synth = this.synth;

    // http://amei.or.jp/midistandardcommittee/MIDI1.0.pdf
    switch (message[0] & 0xf0) {
      case 0x80: // NoteOff: 8n kk vv
        synth.noteOff(channel, message[1], message[2]);
        break;
      case 0x90: // NoteOn: 9n kk vv
        if (message[2] > 0) {
          synth.noteOn(channel, message[1], message[2]);
        } else {
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
        // System Exclusive Message
        // [1] F0
        // [2] <vendor ID> http://www.amei.or.jp/report/report4.html
        // [3] <device ID>
        // [4] <sub ID 1>
        // [5] <sub ID 2>
        // [6] <size of parameter key>
        // [7] <size of parameter value>
        // [8] <MSB>
        // [9] <LSB>
        // [10] <data>
        // [11] <checksum> [IGNORE]
        // [12] F7 EOX [IGNORE]
        // console.log(this.dumpMessage(message));

        /**
         * @type {number} Vendor ID (Roland=0x41 / YAMAHA=0x43 / Non
         *   Realtime=0x7E / Realtime=0x7F)
         */
        const vendor = message[2];
        /** @type {number} Device ID (GM extended=0x10 / ポケミク=0x79 / Any=0x7F) */
        const device = message[3];
        /** @type {number} Sub ID 1 (Model ID: GM=0x09 / GS=0x42 / XG=0x4C) */
        const model = message[4];

        if (vendor === 0x7e || device === 0x09) {
          // Gneral MIDI
          // http://amei.or.jp/midistandardcommittee/Recommended_Practice/GM2_japanese.pdf
          // console.log('GM:', this.dumpMessage(message));
          // Non Realtime
          switch (model) {
            case 0x01:
              // GM System On
              synth.init('GM');
              console.info('GM System On');
              break;
            case 0x02:
              // GM System Off
              console.info('GM System Off');
              // Throuh
              break;
            case 0x03:
              // GM2 System On
              console.info('GM (v2) System On');
              synth.init('GM2');
              break;
            default:
              console.log('GM:', this.dumpMessage(message));
          }
        } else if (vendor === 0x7f) {
          // Realtime
          if (message[4] === 1) {
            // master volume: F0 7F 7F 04 01 [value] [value] F7
            synth.setMasterVolume(message[5] + (message[6] << 7));
          } else {
            console.log('realtime:', this.dumpMessage(message));
          }
        } else if (vendor === 0x41) {
          // GS
          // http://lib.roland.co.jp/support/jp/manuals/res/1809974/SC-88VL_j.pdf
          // F0 41 10 42 12 40 [part] [key] [value] [checksum] F7
          const part = message[7] - 0x0f;
          // TODO
          switch (message[8]) {
            case 0x00:
              // TEXT INSERT FOR SC (ASCI code)
              // http://kurizill.g1.xrea.com/memorandum/midi2.htm
              // F0 41 10 45 12 10 [page] 00 [...value] [checksum] F7
              // ex. F0 41 10 45 12 10 00 00 [48 65 6C 6C 6F] 21 F7 = Hello

              // device IDの値は0x45固定だがその判定処理は省略

              if (message[7] === 0x00) {
                // ページが0x00の場合、LCDに表示するメッセージとする
                const msg = message.splice(8);
                // Remove F7
                msg.pop();
                // Remove Checksum
                msg.pop();
                synth.processMidiMessage(msg);
              } else {
                // GS音源のLCDの16x16のビットマップ画像
                console.log('GS Bitmap message:', this.dumpMessage(message));
              }
              break;
            case 0x04:
              // GS Master Volume:
              // F0 41 10 42 12 40 00 04 [value] [checksum] F7
              // console.log('GS Volume:', this.dumpMessage(message));
              synth.setMasterVolume(message[9] * 64);
              break;

            case 0x15: {
              // GS Dram part: F0 41 10 42 12 40 1[part no] [Map] [checksum] F7
              // Notice: [sum] is ignroe in this program.

              const map = message[8];
              if (part === 0) {
                // 10 Ch.
                synth.setPercussionPart(9, map !== 0x00);
              } else if (part >= 10) {
                // 1~9 Ch.
                synth.setPercussionPart(part - 1, map !== 0x00);
              } else {
                // 11~16 Ch.
                synth.setPercussionPart(part, map !== 0x00);
              }
              break;
            }
            case 0x19:
              // VOLUME ON/OFF (PART LEVEL)
              // F0 41 10 42 12 40 1[part no] 19 [value] [checksum] F7
              console.info('GS Volume On/Off: ', part, message[9]);
              break;
            case 0x30:
              // Reverb Effect
              console.info('GS Reverb:', this.dumpMessage(message));
              break;
            case 0x38:
              // Chorus Effect
              console.info('GS Chorus:', this.dumpMessage(message));
              break;
            case 0x45:
              // Bitmap icon 16x16 ?
              console.info('GS Bitmap:', this.dumpMessage(message));
              break;
            case 0x7f:
              // GS Reset: F0 41 10 42 12 40 00 7F 00 [checksum] F7
              synth.init('GS');
              console.info('GS Reset');
              break;
            default:
              console.log('GS:', this.dumpMessage(message));
          }
        } else if (vendor == 0x43) {
          // YAMAHA XG
          // https://jp.yamaha.com/files/download/other_assets/9/321739/read_aoyama.pdf
          // https://jp.yamaha.com/files/download/other_assets/1/316861/MU100J1.pdf

          if (message[2] !== 0x43 && message[3] === 0x43) {
            // delete checksum
            message.splice(1, 1);
            console.log('message:', this.dumpMessage(message));
          }

          switch (message[5]) {
            case 0x00:
              // XG Reset:
              // F0 43 1n 4C 00 00 7E 00 F7
              // console.log('message:', this.dumpMessage(message));
              if (message[7] === 0x7e) {
                synth.init('XG');
                console.info('XG Reset');
              }
              break;
            case 0x02:
              // Effect
              // F0 43 10 4C 02 01 [type] [value] F7
              // type
              // 02: Reverb
              // 40: Variation
              // 5B: Part to apply variation effect
              console.log('XG Effect:', this.dumpMessage(message));
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
              // 7bitごとに上から描画するが仕様がややこしいので処理しない
              console.log('XG Bitmap:', this.dumpMessage(message));
              break;
            case 0x08:
              // XG Dram Part:
              // F0 43 10 4C 08 [partNum] 07 [map] F7
              // ※厳密には[map]は1以上の値が入るが、本プログラムでは一律パーカッションパートとして処理をする。
              synth.setPercussionPart(message[6], message[8] !== 0x00);
              break;

            default:
              console.log('XG:', this.dumpMessage(message));
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
   * @param {Array} message
   * @return {string}
   */
  dumpMessage(message) {
    const ret = [];
    for (const msg of message) {
      ret.push(msg.toString(16).toUpperCase());
    }
    return ret.join(' ');
  }
}

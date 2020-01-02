import Meta from './meta.js';
import Synthesizer from './sound_font_synth';

/**
 * WebMidiLink Class
 */
export class WebMidiLink {
  /**
   * @param {object} option
   */
  constructor(option = {}) {
    /** @type {Array.<number>} */
    this.NrpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {Array.<number>} */
    this.NrpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {Array.<number>} */
    this.RpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {Array.<number>} */
    this.RpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {boolean} */
    this.ready = false;
    /** @type {Synthesizer} */
    this.synth;
    /** @type {function(ArrayBuffer)} */
    this.loadCallback = () => { };
    /** @type {Function} */
    this.messageHandler = this.onmessage.bind(this);
    /** @type {XMLHttpRequest} */
    this.xhr;
    /** @type {boolean} */
    this.rpnMode = true;
    /** @type {object} */
    this.option = option;
    /** @type {boolean} */
    this.option.drawSynth = option.drawSynth !== void 0 ? option.drawSynth : true;
    /** @type {boolean} */
    this.option.cache = option.cache !== void 0 ? option.cache : true;
    /** @type {HTMLElement} */
    this.placeholder = option.placeholder !== void 0 ? document.getElementById(option.placeholder) : window.document.body;
    /** @type {Window} */
    this.opener;
    /** @type {number} */
    this.version = Meta.version;
    /** @type {string} */
    this.build = Meta.date;

    // eslint-disable-next-line space-before-function-paren
    window.addEventListener('DOMContentLoaded', function () {
      this.ready = true;
    }.bind(this), false);
  };

  /**
   * @param {string} url
   * @export
   */
  setup(url) {
    /** @type {Window} */
    const w = window;

    if (!this.ready) {
      w.addEventListener('DOMContentLoaded', function onload() {
        w.removeEventListener('DOMContentLoaded', onload, false);
        this.load(url);
      }.bind(this), false);
    } else {
      this.load(url);
    }

    if (w.opener) {
      this.opener = w.opener;
    } else if (w.parent !== w) {
      this.opener = w.parent;
    }
  }

  /**
   * @param {string} url
   * @export
   */
  load(url) {
    /** @type {Window} */
    const opener = window.opener ? window.opener : window.parent;
    /** @type {HtmlDIVElement} */
    const loading = this.placeholder.appendChild(document.createElement('div'));
    /** @type {HTMLStrongElement} */
    const loadingText = loading.appendChild(document.createElement('p'));
    /** @type {HTMLDivElement} */
    const progress = loading.appendChild(document.createElement('div'));
    progress.className = 'progress';
    /** @type {HTMLDivElement} */
    const progressBar = progress.appendChild(document.createElement('div'));
    progressBar.className = 'progress-bar';
    progressBar.role = 'progressbar';
    /** @type {WebMidiLink} */
    const self = this;

    opener.postMessage('link,progress', '*');
    loading.className = 'alert alert-warning';
    loadingText.innerText = 'Now Loading...';

    const promise = new Promise(resolve =>{ 
      if (this.option.cache && window.caches) {
        // キャッシュが利用可能な場合
        loadingText.className = 'ml-1';
        loading.className = 'd-flex';

        window.caches.open('wml').then((cache) => {
          cache
            .match(url)
            .then((response) => response.arrayBuffer())
            .then((stream) => resolve(stream))
            .catch(() => {
              console.info('Fetch from server.');
              fetch(url)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok.');
                  }
                  /** @type {number} */
                  const total = response.headers.get('content-length') | 0;
                  loadingText.innerText += ` (${total}bytes)`;
                  /** @type {Response} レスポンスのストリーム */
                  const copy = response.clone();
                  cache.put(url, response);
                  return copy.arrayBuffer();
                })
                .then((stream) => resolve(stream))
                // .catch((e) => {

              // console.error(e);
              // alert('There has been a problem with your fetch operation: ' + e.message);
              //  )}
              ;
            });
        });
      } else {
        // キャッシュが使えない場合
        console.info('This server/client does not cache function.');

        // 結合処理
        const concatenation = (segments) => {
          let sumLength = 0;
          for (let i = 0; i < segments.length; ++i) {
            sumLength += segments[i].byteLength;
          }
          const whole = new Uint8Array(sumLength);
          let pos = 0;
          for (let i = 0; i < segments.length; ++i) {
            whole.set(new Uint8Array(segments[i]), pos);
            pos += segments[i].byteLength;
          }
          return whole.buffer;
        };

        fetch(url)
          .then((res) => {
            // 全体サイズ
            const total = res.headers.get('content-length');
            progress.max = total;

            // body の reader を取得する
            const reader = res.body.getReader();
            let chunk = 0;
            const buffer = [];
            const processResult = (result) => {
              // done が true なら最後の chunk
              if (result.done) {
                const stream = concatenation(buffer);
                resolve(stream);
                return;
              }

              // chunk の長さの蓄積を total で割れば進捗が分かる
              chunk += result.value.length;
              buffer.push(result.value);
              // 進捗を更新
              const percentage = Math.round((chunk / total) * 100);
              progressBar.style.width = percentage + '%';
              progressBar.innerText = percentage + ' %';
              opener.postMessage('link,progress,' + chunk + ',' + total, '*');

              // 再帰する
              return reader.read().then(processResult);
            };
            reader.read().then(processResult);
          })
          .catch((e) => alert('There has been a problem with your fetch operation: ' + e.message));
      }
    }).then(stream => {
      console.info('ready');
      loadingText.innerText = 'Parsing SoundFont...';
      self.onload(stream);
      loadingText.innerText = '';
      if (typeof self.loadCallback === 'function') {
        self.loadCallback(stream);
      }
      opener.postMessage('link,ready', '*');
    });
  }

  /**
   * @param {ArrayBuffer} response
   */
  onload(response) {
    /** @type {Uint8Array} */
    const input = new Uint8Array(response);

    this.loadSoundFont(input);
  }

  /**
   * @param {Uint8Array} input
   */
  loadSoundFont(input) {
    /** @type {Window} */
    const w = window;

    if (!this.synth) {
      // 子要素を全削除
      //while (this.placeholder.firstChild) {
      //  this.placeholder.removeChild(this.placeholder.firstChild);
      //}
      /** @type {Synthesizer} */
      const synth = this.synth = new Synthesizer(input);
      if (this.option.drawSynth) {
        this.placeholder.appendChild(synth.drawSynth());
      } else {
        const readyElem = document.createElement('strong');
        readyElem.innerText = 'Ready.';
        this.placeholder.appendChild(readyElem);
      }
      synth.init();
      synth.start();
      w.addEventListener('message', this.messageHandler, false);
    } else {
      this.synth.refreshInstruments(input);
    }

    // link ready
    w.postMessage('link,ready', '*');
  };

  /**
   * @param {Event} ev
   */
  onmessage(ev) {
    /** @type {Array} */
    const msg = typeof ev.data.split === 'function' ? ev.data.split(',') : [];
    /** @type {string} */
    const type = msg !== [] ? msg.shift() : '';
    /** @type {Window} */
    const opener = window.opener ? window.opener : window.parent;
    /** @type {string} */
    let command;

    switch (type) {
      case 'midi':
        this.processMidiMessage(msg.map((hex) => {
          return parseInt(hex, 16);
        }));
        break;
      case 'link':
        if (opener === void 0) {
          return;
        }
        command = msg.shift();
        switch (command) {
          case 'reqpatch':
            // TODO: dummy data
            opener.postMessage('link,patch', '*');
            break;
          case 'setpatch':
          case 'ready':
            opener.postMessage('link,ready', '*');
            // TODO: NOP
            break;
          case 'progress':
            opener.postMessage('link,progress', '*');
            break;
          default:
            console.error('unknown link message:', command);
            break;
        }
        break;
      default:
      // console.error('unknown message type');
    }
  };

  /**
   * @param {function(ArrayBuffer)} callback
   * @export
   */
  setLoadCallback(callback) {
    this.loadCallback = callback;
  };

  /**
   * @param {Array.<number>} message
   */
  processMidiMessage(message) {
    /** @type {number} */
    const channel = message[0] & 0x0f;
    /** @type {Synthesizer} */
    const synth = this.synth;

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
      case 0xB0: // Control Change: Bn cc dd
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
                        synth.getPitchBendSensitivity(channel) + value / 100,
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
          case 0x0A: // Panpot Change: Bn 0A dd
            synth.panpotChange(channel, value);
            break;
          case 0x78: // All Sound Off: Bn 78 00
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
          case 0x4A: // Attack time
            synth.attackTime(channel, value);
            break;
          case 0x4B: // Brightness
            synth.cutOffFrequency(channel, value);
            break;
          case 0x5B: // Effect1 Depth（Reverb Send Level）
            synth.reverbDepth(channel, value);
            break;
          default:
            // not supported
            break;
        }
        break;
      case 0xC0: // Program Change: Cn pp
        synth.programChange(channel, message[1]);
        break;
      case 0xE0: // Pitch Bend
        synth.pitchBend(channel, message[1], message[2]);
        break;
      case 0xf0: // System Exclusive Message
        //   F0
        //   [2]<vendor ID>
        //   [3]<device ID>
        //   [4]<sub ID 1>
        //   [5]<sub ID 2>
        //   [6]<size of parameter key>
        //   [7]<size of parameter value>
        //   [8]<MSB>
        //   [9]<LSB>
        //   [10]<data>
        //   [11]<checksum> [IGNORE]
        //   F7 EOX [IGNORE]

        /** @type {number} Vendor ID (Roland=0x41 / YAMAHA=0x43 / Non Realtime=0x7E / Realtime=0x7F) */
        const vendor = message[2];
        /** @type {number} Device ID (GM extended=0x10 / ポケミク=0x79 / Any=0x7F) */
        const device = message[3];
        /** @type {number} Sub ID 1 (Model ID: GM=0x09 / GS=0x42 / XG=0x4C) */
        const subId1 = message[4];
        /** @type {number} Sub ID 2 */
        const subId2 = message[5];

        // Gneral MIDI
        // http://amei.or.jp/midistandardcommittee/Recommended_Practice/GM2_japanese.pdf

        if (vendor === 0x7e && device === 0x09) {
          // Non Realtime
          switch (subId1) {
            case 0x01:
              // GM System On
              synth.init('GM');
              break;
            case 0x02:
              // GM System Off
              // Ignore
            case 0x03:
              // GM2 System On
              synth.init('GM2');
              break;
          }
        } else if (vendor === 0x7f) {
          // Realtime

          // Through
        }

        // http://www.amei.or.jp/report/report4.html
        if (vendor === 0x41) {
          console.log('GS:', this.dumpMessage(message));
          // GS
          // http://lib.roland.co.jp/support/jp/manuals/res/1809974/SC-88VL_j.pdf
          // F0 42 10 42 12 40 [part] [key] [value] [checksum] F7
          // TODO
          switch (message[8]) {
            case 0x04:
              // GS Master Volume: F0 41 10 42 12 40 00 04 [value] [checksum] F7
              synth.setMasterVolume(message[9] << 7);
              break;
            case 0x7F:
              // GS Reset: F0 41 10 42 12 40 00 7F 00 [checksum] F7
              synth.init('GS');
              console.info('GS Reset');
              break;
            case 0x15:
              // GS Dram part: F0 41 10 42 12 40 1[part no] [Map] [checksum] F7
              // Notice: [sum] is ignroe in this program.

              const part = message[7] - 0x0F;
              const map = message[8];
              if (part === 0) {
                // 10 Ch.
                if (map !== 0x00) {
                  synth.setPercussionPart(9, true);
                } else {
                  synth.setPercussionPart(9, false);
                }
              } else if (part >= 10) {
                // 1~9 Ch.
                if (map !== 0x00) {
                  synth.setPercussionPart(part - 1, true);
                } else {
                  synth.setPercussionPart(part - 1, false);
                }
              } else {
                // 11~16 Ch.
                if (map !== 0x00) {
                  synth.setPercussionPart(part, true);
                } else {
                  synth.setPercussionPart(part, false);
                }
              }
              break;
          }
        } else if (vendor == 0x43) {
          console.log('XG:', this.dumpMessage(message));
          // XG
          if (subId2 === 0x08) {
            // XG Dram Part: F0 43 10 4C 08 [partNum] 07 [map] F7
            // but there is no file to use much this parameter...
            if (message[7] !== 0x00) { // [map]
              synth.setPercussionPart(message[6], true);
            } else {
              synth.setPercussionPart(message[6], false);
            }
            // console.log(message);
          }
          switch (message[7]) {
            case 0x04:
              // XG Master Volume: F0 43 10 4C 00 00 04 [value] F7
              synth.setMasterVolume((message[8] << 7) * 2);
              // console.log(message[8] << 7);
              break;
            case 0x7E:
              // XG Reset: F0 43 10 4C 00 00 7E 00 F7
              synth.init('XG');
              console.info('XG Reset');
              break;
          }
        }

        switch (device) {
          case 0x04: // device control
            // sub ID 2
            switch (subId2) {
              case 0x01: // master volume: F0 7F 7F 04 01 [value] [value] F7
                synth.setMasterVolume(message[5] + (message[6] << 7));
                break;
            }
            break;
        }

        break;
      default: // not supported
        synth.setPercussionPart(9, true);
        break;
    }
  };

  /**
   * Dump System Exclusive Message
   * @private
   * @param {Array} message
   */
  dumpMessage(message) {
    const ret = [];
    for (const msg of message) {
      ret.push(msg.toString(16).toUpperCase());
    }
    return ret.join(' ');
  }
}

export default WebMidiLink;

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
    this.option.disableDrawSynth = option.disableDrawSynth || false;
    /** @type {boolean} */
    this.option.cache = option.cache || true;
    /** @type {HTMLElement} */
    this.placeholder = option.placeholder !== void 0 ? document.getElementById(option.placeholder) : window.document.body;
    /** @type {Window} */
    this.opener;


    // eslint-disable-next-line space-before-function-paren
    window.addEventListener('DOMContentLoaded', function () {
      this.ready = true;
    }.bind(this), false);
  };

  /** @export */
  /**
   * @param {string} url
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
    /** @type {WebMidiLink} */
    const self = this;
    /** @type {HtmlDIVElement} */
    const loading = this.placeholder.appendChild(document.createElement('div'));

    opener.postMessage('link,progress', '*');

    const ready = (stream) => {
      console.info('ready');
      self.placeholder.removeChild(loading);
      self.onload(stream);
      if (typeof self.loadCallback === 'function') {
        self.loadCallback(stream);
      }
      opener.postMessage('link,ready', '*');
    };

    if (this.option.cache && window.caches) {
      // キャッシュが利用可能な場合

      loading.className = 'd-flex';

      /** @type {HTMLDivElement} */
      const spiner = loading.appendChild(document.createElement('div'));
      spiner.className = 'spinner-border text-primary';
      spiner.role = 'status';
      spiner.ariaHidden = true;

      /** @type {HTMLStrongElement} */
      const loadingText = loading.appendChild(document.createElement('strong'));
      loadingText.className = 'ml-1';
      loadingText.innerText = 'Now Loading...';

      window.caches.open('wml').then((cache) => {
        cache
          .match(url)
          .then((response) => response.arrayBuffer())
          .then((stream) => ready(stream))
          .catch(() => {
            console.info('Fetch from server.');
            fetch(url)
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Network response was not ok.');
                }
                const copy = response.clone();
                cache.put(url, response);
                return copy.arrayBuffer();
              })
              .then((stream) => ready(stream))
              .catch((e) => alert('There has been a problem with your fetch operation: ' + e.message));
          });
      });
    } else {
      // キャッシュが使えない場合
      console.info('This server/client does not cache function.');

      // プログレスバーを表示

      /** @type {HTMLDivElement} */
      const progress =
        loading.appendChild(document.createElement('div'));
      progress.className = 'progress';
      /** @type {HTMLDivElement} */
      const progressBar =
        progress.appendChild(document.createElement('div'));
      progressBar.className = 'progress-bar';
      progressBar.role = 'progressbar';
      progressBar.innerText = '0%';

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
              ready(stream);
              return;
            }

            // chunk の長さの蓄積を total で割れば進捗が分かる
            chunk += result.value.length;
            buffer.push(result.value);
            // 進捗を更新
            const percentage = Math.round((chunk / total) * 100) + ' %';
            progressBar.style.width = percentage;
            progressBar.innerText = percentage;
            opener.postMessage('link,progress,' + chunk + ',' + total, '*');

            // 再帰する
            return reader.read().then(processResult);
          };
          reader.read().then(processResult);
        })
        .catch((e) => alert('There has been a problem with your fetch operation: ' + e.message));
    }
  }

  /**
   * @param {boolean} sw
   * @export
   */
  setReverb(sw) {
    this.synth.setReverb(sw);
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
    /** @type {Synthesizer} */
    let synth;
    /** @type {Window} */
    const w = window;

    if (!this.synth) {
      synth = this.synth = new Synthesizer(input);
      if (!this.disableDrawSynth) {
        this.placeholder.appendChild(synth.drawSynth());
      }
      synth.init();
      synth.start();
      w.addEventListener('message', this.messageHandler, false);
    } else {
      synth = this.synth;
      synth.refreshInstruments(input);
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
          case 0x01: // Modulation
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
        // ID number
        switch (message[1]) {
          case 0x7e: // non-realtime
            // TODO
            // GM Reset: F0 7E 7F 09 01 F7
            if (message[2] === 0x7f && message[3] === 0x09 && message[4] === 0x01) {
              synth.init('GM');
            }
            break;
          case 0x7f: // realtime
            // sub ID 1
            switch (message[3]) {
              case 0x04: // device control
                // sub ID 2
                switch (message[4]) {
                  case 0x01: // master volume: F0 7F 7F 04 01 [value] [value] F7
                    synth.setMasterVolume(message[5] + (message[6] << 7));
                    break;
                }
                break;
            }
            break;
        }

        // Vendor
        switch (message[2]) {
          case 0x43: // Yamaha XG
            if (message[5] === 0x08) {
              // XG Dram Part: F0 43 [dev] 4C 08 [partNum] 07 [map] F7
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
                // XG Master Volume: F0 43 [dev] 4C 00 00 04 [value] F7
                synth.setMasterVolume((message[8] << 7) * 2);
                // console.log(message[8] << 7);
                break;
              case 0x7E:
                // XG Reset: F0 43 [dev] 4C 00 00 7E 00 F7
                synth.init('XG');
                console.log('XG Reset');
                break;
            }
            break;
          case 0x41: // Roland GS / TG300B Mode
            // TODO
            switch (message[8]) {
              case 0x04:
                // GS Master Volume: F0 41 [dev] 42 12 40 00 04 [value] 58 F7
                synth.setMasterVolume(message[9] << 7);
                break;
              case 0x7F:
                // GS Reset: F0 41 [dev] 42 12 40 00 7F 00 41 F7
                synth.init('GS');
                console.log('GS Reset');
                break;
              case 0x15:
                // GS Dram part: F0 41 [dev] 42 12 40 1[part no] [Map] [sum] F7
                // Notice: [sum] is ignroe in this program.
                // http://www.ssw.co.jp/dtm/drums/drsetup.htm
                // http://www.roland.co.jp/support/by_product/sd-20/knowledge_base/1826700/

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
            break;
        }
        break;
      default: // not supported
        synth.setPercussionPart(9, true);
        break;
    }
  };
}

export default WebMidiLink;

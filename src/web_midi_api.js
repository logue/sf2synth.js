import WebMidiLink from './wml';

/**
 * Web MIDI API Reciever Class.
 *
 * @author Logue <logue@hotmail.co.jp>
 */
export default class WebMidiApi extends WebMidiLink {
  /**
   * Constructor
   */
  constructor() {
    super();
    /** @type {MIDIAccess?} */
    this.midi = undefined;
  }

  /**
   * セットアップ
   *
   * @param {string} SoundFontのURL
   */
  async setup(url) {
    /** @type {MIDIAccess} */
    const midi = new Promise((resolve, reject) => {
      parent.window.navigator
        .requestMIDIAccess(/** @type {MIDIOptions} */ { sysex: true })
        .then(
          access => {
            this.success(access);
            resolve(this);
            parent.setup(url);
          },
          err => {
            reject(err);
          }
        );
    });

    this.midi = midi;
    parent.setup(url);
  }

  /** Web Midi API Ready */
  onReady() {
    if (parent.loadCallback) {
      // コールバック実行
      parent.loadCallback();
    }
    this.midi.onmidimessage = (/** @type {Uint8Array} */ msg) =>
      parent.processMidiMessage(msg);
  }
}

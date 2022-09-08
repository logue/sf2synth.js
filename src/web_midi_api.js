import WebMidiLink from './wml';

/**
 * Web MIDI API Reciever Class.
 *
 * @author Logue <logue@hotmail.co.jp>
 */
export default class WebMidiApi extends WebMidiLink {
  /**
   * @inheritdoc
   */
  constructor(option = {}) {
    super(option);
    /** @type {MIDIAccess?} */
    this.midi = undefined;
  }

  /**
   * @inheritdoc
   */
  async setup(url) {
    this.midi = await navigator.requestMIDIAccess(
      /** @type {MIDIOptions} */ { sysex: true }
    );
    await super.setup(url);
  }

  /**
   * @inheritdoc
   */
  onReady() {
    if (super.loadCallback) {
      // コールバック実行
      super.loadCallback();
    }
    // Web MIDI APIを待ち受け
    this.midi.onmidimessage = (/** @type {Uint8Array} */ msg) =>
      super.processMidiMessage(msg);
  }
}

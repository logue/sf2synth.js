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
    /** @type {MIDIAccess | undefined} */
    this.midi = undefined;
  }

  /**
   * @inheritdoc
   * @param {string} url
   */
  async setup(url) {
    this.midi = await window.navigator.requestMIDIAccess({ sysex: true });
    await super.setup(url);
  }

  /**
   * @inheritdoc
   */
  onReady() {
    // コールバック実行
    super.callback();
    if (!this.midi) {
      throw new Error('Web MIDI API is not supported in this environment.');
    }
    // Web MIDI APIを待ち受け
    this.midi.inputs.forEach(input => {
      input.onmidimessage = msg => {
        if (msg.data) {
          super.processMidiMessage(Array.from(msg.data));
        }
      };
    });
  }
}

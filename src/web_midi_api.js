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
    /** @type {WebMidi.MIDIAccess | undefined} */
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
    // Web MIDI APIを待ち受け
    this.midi.inputs.forEach(
      (
        /** @type {{ onmidimessage: (msg: WebMidi.MIDIMessageEvent) => void; }} */ input
      ) =>
        (input.onmidimessage = msg =>
          super.processMidiMessage(Array.from(msg.data)))
    );
  }
}

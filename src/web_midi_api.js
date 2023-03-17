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
    /** @type {WebMidi.MIDIAccess} */
    this.midi;
  }

  /**
   * @inheritdoc
   */
  async setup(url) {
    this.midi = await window.navigator.requestMIDIAccess({ sysex: true });
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
    this.midi.inputs.forEach(
      (
        /** @type {{ onmidimessage: (msg: WebMidi.MIDIMessageEvent) => void; }} */ input
      ) => (input.onmidimessage = msg => super.processMidiMessage(msg.data))
    );
  }
}

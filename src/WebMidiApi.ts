import type { WebMidiLinkOptions } from '@/interfaces/WebMidiLinkOptions';
import WebMidiLink from '@/WebMidiLink';

/**
 * Web MIDI API Reciever Class.
 *
 * @author Logue <logue@hotmail.co.jp>
 */
export default class WebMidiApi extends WebMidiLink {
  private midi: MIDIAccess | undefined;
  /**
   * @inheritdoc
   */
  constructor(option: Partial<WebMidiLinkOptions> = {}) {
    super(option);
    this.midi = undefined;
  }

  /**
   * @inheritdoc
   * @param url
   */
  async setup(url?: string) {
    this.midi = await globalThis.navigator.requestMIDIAccess({ sysex: true });
    await super.setup(url);
  }

  /**
   * @inheritdoc
   */
  onReady() {
    // コールバック実行
    super.callback();
    if (!this.midi) {
      throw new Error(
        '[sf2synth] Web MIDI API is not supported in this environment.',
      );
    }
    // Web MIDI APIを待ち受け
    this.midi.inputs.forEach((input) => {
      input.onmidimessage = (msg) => {
        if (msg.data) {
          super.processMidiMessage(Array.from(msg.data));
        }
      };
    });
  }
}

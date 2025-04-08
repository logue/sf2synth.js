import Synthesizer from './sound_font_synth.ts';

interface Bank {
  id: string;
  name: string;
}

interface Program {
  id: string;
  name: string;
}

/**
 * Reads a File object and returns its contents as an ArrayBuffer
 * @param file The File object to read
 * @returns Promise that resolves to an ArrayBuffer
 */
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => reader.result instanceof ArrayBuffer ?
      resolve(reader.result) :
      reject(new TypeError('File reader did not yield ArrayBuffer.'));
    reader.onerror = error => reject(error);

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Fetches a resource from a URL and returns it as an ArrayBuffer
 * @param url The URL to fetch from
 * @returns Promise that resolves to an ArrayBuffer
 */
async function fetchResourceAsArrayBuffer(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Did not get an OK response when fetching resource.');
  }

  const arrayBuffer = await response.arrayBuffer();

  return arrayBuffer;
}

/**
 * Waits for a reference to be defined
 * @param ref The reference to wait for
 * @returns Promise that resolves when the reference is defined
 */
const waitForReference = <T>(ref: T): Promise<void> => new Promise(resolve => {
  const iid = setInterval(() => {
    if (ref !== undefined) {
      clearInterval(iid);
      resolve();
    }
  }, 16);
});

export default class SoundFont {
  private synth?: Synthesizer;
  private _channel: number = 0;
  private _bankIndex: number = 0;
  private _programIndex: number = 0;

  set channel(channel: number) {
    this._channel = channel;
  }

  /**
   * Loads a SoundFont from a File object
   * @param file The File object containing the SoundFont
   * @returns Promise that resolves when loading is complete
   */
  async loadSoundFontFromFile(file: File): Promise<void> {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    await this.bootSynth(arrayBuffer);
  }

  /**
   * Loads a SoundFont from a URL
   * @param url The URL of the SoundFont
   * @returns Promise that resolves when loading is complete
   */
  async loadSoundFontFromURL(url: string): Promise<void> {
    const arrayBuffer = await fetchResourceAsArrayBuffer(url);
    await this.bootSynth(arrayBuffer);
  }

  set bank(index: number) {
    this._bankIndex = index;
    if (this.synth) {
      this.synth.bankChange(this._channel, index);
    }
  }

  get banks(): Bank[] {
    if (!this.synth?.programSet) {
      return [];
    }
    return Object.keys(this.synth.programSet).map(id => ({
      id,
      name: ('000' + parseInt(id, 10)).slice(-3)
    }));
  }

  set program(index: number) {
    this._programIndex = index;
    if (this.synth) {
      this.synth.programChange(this._channel, index);
    }
  }

  get programs(): Program[] {
    if (!this.synth?.programSet || !this.synth.programSet[this._bankIndex]) {
      return [];
    }
    const { programSet } = this.synth;

    return Object.keys(programSet[this._bankIndex]).map(id => ({
      id,
      name: ('000' + (parseInt(id, 10) + 1)).slice(-3) + ':' + programSet[this._bankIndex][id]
    }));
  }

  /**
   * Initializes the synthesizer with the provided SoundFont data
   * @param arrayBuffer The SoundFont data as an ArrayBuffer
   * @returns Promise that resolves when initialization is complete
   */
  async bootSynth(arrayBuffer: ArrayBuffer): Promise<void> {
    const input = new Uint8Array(arrayBuffer);

    if (this.synth) {
      this.synth.refreshInstruments(input);
    } else {
      this.synth = new Synthesizer(input);

      this.synth.init();
      this.synth.start();

      await waitForReference(this.synth.programSet);
    }
  }

  /**
   * Triggers a note on event
   * @param midiNumber The MIDI note number
   * @param velocity The velocity of the note (0-127)
   * @param channel The MIDI channel to use (optional)
   */
  noteOn(midiNumber: number, velocity: number = 127, channel?: number): void {
    if (this.synth) {
      this.synth.noteOn(channel ?? this._channel, midiNumber, velocity);
    }
  }

  /**
   * Triggers a note off event
   * @param midiNumber The MIDI note number
   * @param velocity The velocity of the note (0-127)
   * @param channel The MIDI channel to use (optional)
   */
  noteOff(midiNumber: number, velocity: number = 127, channel?: number): void {
    if (this.synth) {
      this.synth.noteOff(channel ?? this._channel, midiNumber, velocity);
    }
  }
} 
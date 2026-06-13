import SoundFontParser from '../SoundFontParser';
import WebMidiApi from '../WebMidiApi';
import WebMidiLink from '../WebMidiLink';

export interface SoundFontSynth {
  version: string;
  build: string;
  WebMidiLink: typeof WebMidiLink;
  WebMidiApi: typeof WebMidiApi;
  Parser: typeof SoundFontParser;
}

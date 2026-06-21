import type SoundFontParser from '../SoundFontParser';
import type WebMidiApi from '../WebMidiApi';
import type WebMidiLink from '../WebMidiLink';

export interface SoundFontSynth {
  version: string;
  build: string;
  WebMidiLink: typeof WebMidiLink;
  WebMidiApi: typeof WebMidiApi;
  Parser: typeof SoundFontParser;
}

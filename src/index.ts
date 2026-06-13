import { SoundFontSynth } from './interfaces/SoundFontSynth';
import Meta from './Meta';
import Parser from './SoundFontParser';
import WebMidiApi from './WebMidiApi';
import WebMidiLink from './WebMidiLink';
import './WebMidiLink.scss';

const SoundFont: SoundFontSynth = {
  version: Meta.version,
  build: Meta.date,
  WebMidiLink,
  WebMidiApi,
  Parser,
} as const;

export default SoundFont;

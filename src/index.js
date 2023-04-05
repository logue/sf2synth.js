import WebMidiLink from './wml';
import WebMidiApi from './web_midi_api';
import Parser from './sf2';
import Meta from './meta.js';
import './wml.scss';

const SoundFont = {
  version: Meta.version,
  build: Meta.date,
  WebMidiLink,
  WebMidiApi,
  Parser,
};

export default SoundFont;

if (!window.SoundFont) {
  // @ts-ignore
  window.SoundFont = SoundFont;
}

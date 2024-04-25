import Meta from './meta.js';
import Parser from './sf2.js';
import WebMidiApi from './web_midi_api.js';
import WebMidiLink from './wml.js';
import './wml.scss';

const SoundFont = {
  version: Meta.version,
  build: Meta.date,
  WebMidiLink,
  WebMidiApi,
  Parser,
};

export default SoundFont;

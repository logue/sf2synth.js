import WebMidiLink from './wml';
import Parser from './sf2';
import './wml.scss';

const SoundFont = {
  WebMidiLink,
  Parser,
};

export default SoundFont;

if (!window.SoundFont) {
  // for CDN
  window.SoundFont = SoundFont;
}

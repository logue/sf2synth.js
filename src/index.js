/**
 * @typedef {{
 *   version: string;
 *   build: string;
 *   WebMidiLink: typeof WebMidiLink;
 *   WebMidiApi: typeof WebMidiApi;
 *   Parser: typeof Parser;
 * }} SoundFontType
 */

import Meta from './meta.js';
import Parser from './sf2.js';
import WebMidiApi from './web_midi_api.js';
import WebMidiLink from './wml.js';
import './wml.scss';

/** @type {SoundFontType} */
const SoundFont = {
  version: Meta.version,
  build: Meta.date,
  WebMidiLink,
  WebMidiApi,
  Parser,
};

export default SoundFont;

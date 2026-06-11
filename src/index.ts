/**
 * @typedef {{
 *   version: string;
 *   build: string;
 *   WebMidiLink: typeof WebMidiLink;
 *   WebMidiApi: typeof WebMidiApi;
 *   Parser: typeof Parser;
 * }} SoundFontType
 */

import Meta from './Meta';
import Parser from './SF2';
import WebMidiApi from './WebMidiApi';
import WebMidiLink from './WebMidiLink';
import './WebMidiLink.scss';

/** @type {SoundFontType} */
const SoundFont = {
  version: Meta.version,
  build: Meta.date,
  WebMidiLink,
  WebMidiApi,
  Parser,
};

export default SoundFont;

import Parser from '@/SoundFontParser';
import { Meta } from '@/types/Meta';
import type { SoundFont2Synth } from '@/types/SoundFont2Synth';
import WebMidiApi from '@/WebMidiApi';
import WebMidiLink from '@/WebMidiLink';
import '@/WebMidiLink.scss';

const SoundFont: SoundFont2Synth = {
  version: Meta.version,
  build: Meta.date,
  WebMidiLink,
  WebMidiApi,
  Parser,
} as const;

export default SoundFont;

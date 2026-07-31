/**
 * WebMidiLink initialization options.
 */
export type WebMidiLinkOptions = {
  /** Display synthsizer Web UI */
  drawSynth: boolean;
  /** Use Cache API */
  cache: boolean;
  /** Color mode */
  colorMode: 'dark' | 'light' | 'auto';
  /** SoundFont URL */
  url: string;
  /** Placeholder element ID */
  placeholder: string;
  /** Target origin for postMessage */
  messageOptions: WindowPostMessageOptions | StructuredSerializeOptions;
};

/** Default SoundFont URL used when no `url` option is given */
const DEFAULT_SOUNDFONT_URL =
  'https://cdn.jsdelivr.net/npm/@logue/sf2synth@latest/dist/Yamaha XG Sound Set.sf2';

/** Default WebMidiLink options */
export const WebMidiLinkOptions: WebMidiLinkOptions = {
  drawSynth: true,
  cache: true,
  colorMode: 'auto',
  url: DEFAULT_SOUNDFONT_URL,
  placeholder: 'wml',
  messageOptions: {
    targetOrigin: '*',
  },
};

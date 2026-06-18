export interface WebMidiLinkOptions {
  /** Display synthsizer Web UI */
  drawSynth: boolean;
  /**  Use Cache API */
  cache: boolean;
  /** Color mode */
  colorMode: 'dark' | 'light' | 'auto';
  /** SoundFont URL */
  url: string;
  /** Placeholder element ID */
  placeholder: string;
  /** Target origin for postMessage */
  messageOptions: WindowPostMessageOptions | StructuredSerializeOptions;
}

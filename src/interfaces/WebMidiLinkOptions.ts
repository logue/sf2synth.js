export interface WebMidiLinkOptions {
  /** Display synthsizer Web UI */
  drawSynth: boolean;
  /**  Use Cache API */
  cache: boolean;
  /** CORS */
  targetOrigin: string;
  /** Color mode */
  colorMode: 'dark' | 'light' | 'auto';
  /** SoundFont URL */
  url: string;
  /** Placeholder element ID */
  placeholder: string;
}

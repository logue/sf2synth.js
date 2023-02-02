# sf2synth.js

[![jsdelivr CDN](https://data.jsdelivr.com/v1/package/npm/@logue/sf2synth/badge)](https://www.jsdelivr.com/package/npm/@logue/sf2synth)
[![NPM Downloads](https://img.shields.io/npm/dm/@logue/sf2synth.svg?style=flat)](https://www.npmjs.com/package/@logue/sf2synth)
[![Open in unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/@logue/sf2synth/file/README.md)
[![npm version](https://img.shields.io/npm/v/@logue/sf2synth.svg)](https://www.npmjs.com/package/@logue/sf2synth)
[![Open in Gitpod](https://shields.io/badge/Open%20in-Gitpod-green?logo=Gitpod)](https://gitpod.io/#https://github.com/logue/@logue/sf2synth)

sf2synth.js is [WebMidiLink](http://www.g200kg.com/en/docs/webmidilink/) based SoundFont Synthesizer.

## Install

```sh
npm install @logue/sf2synth
```

or

```sh
yarn add @logue/sf2synth
```

### CDN

```html
<link
  href="https://cdn.jsdelivr.net/npm/@logue/sf2synth@latest/dist/style.min.css"
  rel="stylesheet"
/>
<script src="https://cdn.jsdelivr.net/npm/@logue/sf2synth@latest/dist/sf2synth.umd.min.js"></script>
```

## Usage

```html
<div id="placeholder"></div>
```

```js
import SoundFont from '@logue/sf2synth';

// Url to SoundFont file.
const sf2 = './Yamaha XG Sound Set.sf2';

const option = {
  // attach dom id
  placeholder: 'placeholder',
  // If you not nessesaly to draw keyboad, set false.
  drawSynth: true,
  // Cache Soundfont
  cache: true,
};

const wml = new SoundFont.WebMidiLink(option);
wml.setLoadCallback(() => {
  // When ready to load.
});
wml.setup(sf2);
```

### ArrayBuffer usage

When using File API, pour the arraybuffer directly into the setup function.

In this case, the cache cannot be used. You will have to implement the caching yourself if necessary.

```js
import SoundFont from '@logue/sf2synth';

/** SoundFont file. */
const buffer = new ArrayBuffer(...);

/** Option */
const option = {
  // attach dom id
  placeholder: 'placeholder',
  // If you not nessesaly to draw keyboad, set false.
  drawSynth: true
};

const wml = new SoundFont.WebMidiLink(option);
wml.setupByBuffer(buffer);

```

## WebMidiApi

[WebMidiApi](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) is supported experimentally. A sound will be produced when a MIDI signal is sent to the DOM specified by the `placeholder`.

```js
import SoundFont from '@logue/sf2synth';

// Url to SoundFont file.
const sf2 = './Yamaha XG Sound Set.sf2';

const option = {
  // attach dom id
  placeholder: 'placeholder',
  // If you not nessesaly to draw keyboad, set false.
  drawSynth: true,
  // Cache Soundfont
  cache: true,
  // postMessage origin
  targetOrigin: '*',
};

/** Initialize Web MIDI API */
const wml = new SoundFont.WebMidiApi(option);
wml.setLoadCallback(() => {
  // When ready to load.
});
wml.setup(sf2);
```

## Sample

sf2synth.js corresponds to the sound source in MIDI. Call and use this wml.html from a sequencer like [smfplayer.js](https://github.com/logue/smfplayer.js).

<https://logue.dev/sf2synth.js/wml.html>

## Compatibility

equires a browser that supports the Web Audio API.

- Google Chrome 25+
- Google Chrome for Android 28+
- FireFox 25+
- Edge

## MIDI Compatibility

- sf2synth.js is compliant with [WebMidiLink](http://www.g200kg.com/en/docs/webmidilink/) Level 1.
- Supported MIDI standards are [GM Level 2](https://en.wikipedia.org/wiki/General_MIDI_Level_2) and [YAMAHA XG Lite](https://en.wikipedia.org/wiki/Yamaha_XG) (equivalent to YAMAHA MU50).
- MIDI files created in the [Roland GS](https://en.wikipedia.org/wiki/Roland_GS) standard may not play properly.
- Portamento and chorus effect is not supported.
- A specification called `progress` has been added as an instruction that is not compliant with WebMidiLink.

## See Also

- [smfplayer.js](https://github.com/logue/smfplayer.js) - MIDI player part
- [Reverb.js](https://github.com/logue/Reverb.js) - Used in the reverb effect of this program.

## License

Licensed under the MIT License.

- 2013 by imaya / GREE Inc.
- 2013-2023 by Logue

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

## Usage

```html
<div id="placeholder"></div>
```

```js
import SoundFont from '@logue/sf2synth';

const option = {
  // Url to SoundFont file.
  url: 'https://cdn.jsdelivr.net/npm/@logue/sf2synth@latest/dist/Yamaha XG Sound Set.sf2', // Default
  // url: 'https://cdn.jsdelivr.net/npm/@logue/sf2synth@latest/dist/A320U.sf2', // Same as original sf2synth.js
  // Enter the ID of the destination DOM. If left blank, it will be added to the end of body.
  placeholder: 'placeholder',
  // Displays the MIDI keyboard GUI. Set it to false if you don't need. Since it does not process the drawing load, the operation becomes lighter.
  drawSynth: true,
  // ave the acquired SoundFont data in the browser using the Cache API. (Default is false)
  cache: true,
};

const wml = new SoundFont.WebMidiLink({});
wml.setLoadCallback(() => {
  // When ready to load.
});
wml.setup(); // If you want to override the SoundFont URL, put that address in this function.
```

Please refer to the [index.html](./index.html) source code for details.

### CDN

Entry point is `SoundFont`.

```html
<link
  href="https://cdn.jsdelivr.net/npm/@logue/sf2synth@latest/dist/style.min.css"
  rel="stylesheet"
/>
<script src="https://cdn.jsdelivr.net/npm/@logue/sf2synth@latest/dist/sf2synth.iife.min.js"></script>
<script>
  const wml = new SoundFont.WebMidiLink({});
  // ...
</script>
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

const option = {
  // Default Url to SoundFont file. If blank, the Yamaha XG Sound Set.sf2 from jsdelivr will be loaded.
  // The following address will be the same SoundFont as the original sf2synth.js.
  // url: 'https://cdn.jsdelivr.net/npm/@logue/sf2synth@latest/dist/A320U.sf2',

  // attach dom id
  placeholder: 'placeholder',

  // If you not nessesaly to draw keyboad, set false.
  drawSynth: true,

  // Cache Soundfont
  cache: true,

  // postMessage origin
  targetOrigin: '*',

  // Default Color Mode (dark, light)
  colorMode: 'auto',
};

/** Initialize Web MIDI API */
const wml = new SoundFont.WebMidiApi(option);
wml.setLoadCallback(() => {
  // When ready to load.
});

// If you want to explicitly specify another SoundFont, put the SoundFont URL in the setup function.
// No need to restart this program.
wml.setup();
```

## Dark mode

If you want switch dark mode, specify it using the SysEx [non-commercial (Manifucture ID = `7D`)](https://www.amei.or.jp/report/report4.html) area.

| SysEx                     | Mode  |
| ------------------------- | ----- |
| `F0 0A 7D 10 00 01 00 F7` | Auto  |
| `F0 0A 7D 10 00 01 01 F7` | Light |
| `F0 0A 7D 10 00 01 02 F7` | Dark  |

This feature may change in the future.

## Sample

sf2synth.js corresponds to the sound source in MIDI. Call and use this wml.html from a sequencer like [smfplayer.js](https://github.com/logue/smfplayer.js).

<https://logue.dev/sf2synth.js/>

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

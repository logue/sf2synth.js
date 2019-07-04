# sf2synth.js

sf2synth.js is [WebMidiLink](http://www.g200kg.com/en/docs/webmidilink/) based SoundFont Synthesizer.

## Install

```
npm install @logue/sf2synth
```

or

```html
<script src="https://cdn.jsdelivr.net/gh/logue/sf2synth.js@develop/bin/sf2.synth.min.js"></script>
```

## Usage

```html
<div id="placeholder"></div>
```

```js
// Url to SoundFont file.
const soundfont = 'Yamaha XG Sound Set.sf2';
// Option
const option = {
  // attach dom id
  placeholder : 'placeholder',
  // If you not nessesaly to draw keyboad, set false.
  drawSynth : true,
  // Cache Soundfont
  cache : true
};

const wml = new SoundFont.WebMidiLink(option);
wml.setLoadCallback(() => {
    // Finishd to 
});
wml.setup(url);
```

## Sample

<https://logue.github.io/smfplayer.js/wml.html>

## Compatibility

equires a browser that supports the Web Audio API.

* Google Chrome 25+
* Google Chrome for Android 28+
* FireFox 25+
* Edge

## MIDI Compatibility

* sf2synth.js is compliant with [WebMidiLink](http://www.g200kg.com/en/docs/webmidilink/) Level 1.
* Supported MIDI standards are [GM Level 2](https://en.wikipedia.org/wiki/General_MIDI_Level_2) and [YAMAHA XG Lite](https://en.wikipedia.org/wiki/Yamaha_XG) (equivalent to YAMAHA MU50).
* MIDI files created in the [Roland GS](https://en.wikipedia.org/wiki/Roland_GS) standard may not play properly.
* Portamento and chorus effect is not supported.
* A specification called `progress` has been added as an instruction that is not compliant with WebMidiLink.

## License

Licensed under the MIT License.

* 2013      by imaya / GREE Inc.
* 2013-2019 by Logue.np

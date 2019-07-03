# sf2synth.js

sf2synth.js is [WebMidiLink](http://www.g200kg.com/en/docs/webmidilink/) based SoundFont Synthesizer.

## Install

```
npm install @logue/sf2synth
```

or

```html
<script src="https://cdn.jsdelivr.net/gh/logue/sf2synth.js@master/bin/sf2synth.min.js"></script>
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
  // If you not nessesaly to draw keyboad, set true.
  disableSynth : false.
};

const wml = new SoundFont.WebMidiLink();
wml.setLoadCallback(() => {
    // Finishd to 
});
wml.setup(url);
```

## Sample

<https://logue.github.io/smfplayer.js/wml.html>

## Compatibility

equires a browser that supports the Web Audio API.

- Google Chrome 25+
- Google Chrome for Android 28+
- FireFox 25+
- Edge

iOS is not supported.

## WebMidiLink 対応

* sf2synth.js is WebMidiLink の Link Level 1 に対応しています。
* GM Level 2およびXG Lite相当です。
* A specification called `progress` has been added as an instruction that is not compliant with WebMidiLink.

## License

Licensed under the MIT License.

* 2013      by imaya / GREE Inc.
* 2013-2019 by Logue.

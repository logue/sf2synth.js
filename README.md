# sf2synth.js

sf2synth.js は [WebMidiLink](http://www.g200kg.com/en/docs/webmidilink/) 対応の SoundFont シンセサイザです。

## 使い方

```js
var url = '//cdn.rawgit.com/logue/smfplayer.js/gh-pages/Yamaha%20XG%20Sound%20Set.sf2';
var wml = new SoundFont.WebMidiLink();
wml.setLoadCallback(function(arraybuffer) {
    // ロード完了時の処理
});
wml.setup(url);
```

キーボード表示を無効化したい場合は、wmlの定義を以下のようにしてください。

```js
var wml = new SoundFont.WebMidiLink({disableDrawSynth:true});
```

WebMidiLinkに準拠していない命令としてprogressがあります。ここには読み込んだバイト数とトータルのバイト数が入ります。重たい音源を開くときなどに活用してください。

## 対応ブラウザ

最新の Web Audio API 実装を必要とします。

- Google Chrome 25+
- Google Chrome for Android 28+
- FireFox 25+
- Edge

## WebMidiLink 対応

sf2synth.js は WebMidiLink の Link Level 1 に対応しています。
GM Level 2およびXG Lite相当です。

## ライセンス

Copyright &copy; 2013 imaya / GREE Inc.
Licensed under the MIT License.

Modified by Logue.

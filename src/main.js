import queryString from 'query-string';
import WebMidiLink from './wml';

const message = document.getElementById('message');
const qs = queryString.parse(window.location.search);
const option = {};
if (qs.ui === 'false') {
  option.drawSynth = false;
}
const sf = qs.soundfont
  ? decodeURIComponent(qs.soundfont)
  : 'docs/Yamaha XG Sound Set.sf2';
document.getElementById('soundfont').innerText = sf;
option.placeholder = 'placeholder';
const wml = new WebMidiLink(option);
document.getElementById('build').innerText = new Date(
  wml.build
).toLocaleString();
wml.setLoadCallback(function () {
  message.style.display = 'none';
});
wml.setup(sf);

// Load sound font
const handleSoundFont = file => {
  const reader = new FileReader();

  // wml.cancelLoading();

  reader.readAsArrayBuffer(file);

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    wml.loadSoundFont(data);
  };
};

// local file
window.addEventListener(
  'DOMContentLoaded',
  _event => {
    // File selector
    document.getElementById('file').addEventListener(
      'change',
      event => {
        const file = document.getElementById('file').files[0];
        handleSoundFont(file);
        event.preventDefault();
      },
      false
    );

    const droparea = document.getElementById('placeholder');
    droparea.addEventListener(
      'dragover',
      e => {
        droparea.className = 'alert-danger';
        e.preventDefault();
      },
      true
    );

    droparea.addEventListener(
      'drop',
      e => {
        droparea.className = '';
        const dt = e.dataTransfer;
        const files = dt.files;
        e.stopPropagation();
        e.preventDefault();
        handleSoundFont(files[0]);
      },
      true
    );

    droparea.addEventListener(
      'dragleave',
      e => {
        droparea.className = '';
      },
      true
    );
  },
  false
);

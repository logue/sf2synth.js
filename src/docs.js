import queryString from 'query-string';
import WebMidiLink from './wml';

/** Query string */
const qs = queryString.parse(window.location.search);
/** sf2synth.js Option */
const option = { placeholder: 'placeholder' };
if (qs.ui === 'false') {
  option.drawSynth = false;
}

/** WebMidiLink */
const wml = new WebMidiLink(option);
/** Message DOM */
const message = document.getElementById('message');
/** File Input Form */
const fileInput = document.getElementById('file');
/** Placeholder */
const placeholder = document.getElementById('placeholder');

/** SoundFont file */
const sf = qs.soundfont
  ? decodeURIComponent(qs.soundfont)
  : 'Yamaha XG Sound Set.sf2';

document.getElementById('soundfont').innerText = sf;

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

  reader.onload = e => {
    console.log('loaded', file);
    document.getElementById('soundfont').innerText = file.name;
    const data = new Uint8Array(e.target.result);
    wml.loadSoundFont(data, true);
  };
};

// local file
document.addEventListener(
  'DOMContentLoaded',
  event => {
    console.log('Document loaded');
    // File selector

    fileInput.addEventListener('change', event => {
      event.preventDefault();
      handleSoundFont(fileInput.files[0]);
      fileInput.value = '';
    });

    placeholder.addEventListener(
      'dragover',
      e => {
        placeholder.className = 'alert-danger';
        e.preventDefault();
      },
      true
    );

    placeholder.addEventListener(
      'drop',
      e => {
        placeholder.className = '';
        const dt = e.dataTransfer;
        const files = dt.files;
        e.stopPropagation();
        e.preventDefault();
        handleSoundFont(files[0]);
      },
      true
    );

    placeholder.addEventListener(
      'dragleave',
      e => {
        placeholder.className = '';
      },
      true
    );
  },
  false
);

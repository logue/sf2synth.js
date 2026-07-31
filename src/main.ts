import SoundFont from '@/index';
import type { WebMidiLinkOptions } from '@/types/WebMidiLinkOptions';

/**
 * Main entry point (index.html) for the SoundFont Synthesizer application.
 *
 * This script initializes the Web MIDI Link, sets up event listeners for file input and drag-and-drop,
 * and manages the user interface for loading SoundFont files and displaying build information.
 *
 * @author Logue <logue@hotmail.co.jp>
 */

// Constants
const CSS_CLASS = {
  DRAG_ACTIVE: 'bg-info',
} as const;

const ELEMENT_IDS = {
  FILE_INPUT: 'file',
  DRAG_AREA: 'drag',
  BUILD_TIME: 'build',
  DARK_MODE_TOGGLE: 'toggleDarkMode',
  SOUNDFONT_NAME: 'soundfont',
} as const;

// Default options
const defaultOptions: Partial<WebMidiLinkOptions> = {
  drawSynth: true,
  placeholder: 'placeholder',
  colorMode: 'auto',
};

// Merge options from URL parameters (replaces query-string dependency)
const searchParams = Object.fromEntries(
  new URLSearchParams(window.location.search),
);
const hashParams = Object.fromEntries(
  new URLSearchParams(window.location.hash.replace(/^#/, '')),
);

const options: Partial<WebMidiLinkOptions> = {
  ...defaultOptions,
  ...(searchParams as Partial<WebMidiLinkOptions>),
  ...(hashParams as Partial<WebMidiLinkOptions>),
};

const wml = new SoundFont.WebMidiLink(options);

/**
 * Extract filename from URL
 */
function extractFilename(url: string): string {
  const match = decodeURIComponent(url).match('.+/(.+?)([?#;].*)?$');
  return match ? match[1] : url;
}

/**
 * Update soundfont display name
 */
function updateSoundfontName(name: string): void {
  const el = document.getElementById(ELEMENT_IDS.SOUNDFONT_NAME);
  if (el) {
    el.innerText = name;
  }
}

/**
 * Load sound font from file
 */
function loadSoundFont(file: File): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    updateSoundfontName(file.name);
    const data = new Uint8Array(e.target!.result as ArrayBuffer);
    wml.setupByBuffer(data);
  };
  reader.readAsArrayBuffer(file);
}

/**
 * Setup drag area visual feedback
 */
function setupDragHandlers(element: HTMLElement): void {
  element.addEventListener(
    'drop',
    (event) => {
      const files = (event as DragEvent).dataTransfer?.files;
      if (files?.length) {
        event.preventDefault();
        event.stopPropagation();
        loadSoundFont(files[0]);
      }
      element.classList.remove(CSS_CLASS.DRAG_ACTIVE);
    },
    false,
  );

  element.addEventListener(
    'dragover',
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      element.classList.add(CSS_CLASS.DRAG_ACTIVE);
    },
    false,
  );

  element.addEventListener(
    'dragleave',
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      element.classList.remove(CSS_CLASS.DRAG_ACTIVE);
    },
    false,
  );
}

/**
 * Setup color mode watcher
 */
function setupColorModeWatcher(toggle: HTMLInputElement): void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (document.documentElement.getAttribute('data-bs-theme')) {
      return;
    }
    wml.setColorMode(options.colorMode);
    toggle.checked = mediaQuery.matches;
  });
}

// DOM Content Loaded
document.addEventListener(
  'DOMContentLoaded',
  () => {
    const fileInput = document.getElementById(
      ELEMENT_IDS.FILE_INPUT,
    ) as HTMLInputElement;
    const dragArea = document.getElementById(
      ELEMENT_IDS.DRAG_AREA,
    ) as HTMLElement;
    const buildTime = document.getElementById(
      ELEMENT_IDS.BUILD_TIME,
    ) as HTMLTimeElement;
    const darkModeToggle = document.getElementById(
      ELEMENT_IDS.DARK_MODE_TOGGLE,
    ) as HTMLInputElement;

    // Setup load callback
    wml.setLoadCallback(() => {
      dragArea.classList.remove(CSS_CLASS.DRAG_ACTIVE);
      updateSoundfontName(extractFilename(wml.getUrl()));
    });

    // Display build time
    buildTime.dateTime = SoundFont.build;
    buildTime.innerText = new Date(SoundFont.build).toLocaleString();

    // Initialize WebMidiLink
    wml.setup();

    // Setup color mode watcher
    setupColorModeWatcher(darkModeToggle);

    // File input change handler
    fileInput.addEventListener(
      'change',
      (event) => {
        event.preventDefault();
        if (fileInput.files?.[0]) {
          loadSoundFont(fileInput.files[0]);
          fileInput.value = '';
        }
      },
      false,
    );

    // Setup drag and drop handlers
    setupDragHandlers(dragArea);

    // Dark mode toggle handler
    darkModeToggle.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      wml.setColorMode(target.checked ? 'dark' : 'light');
    });
  },
  false,
);

// Hash change handler
window.addEventListener(
  'hashchange',
  () => {
    const urlParams = Object.fromEntries(
      new URLSearchParams(window.location.hash.replace(/^#/, '')),
    );
    if (urlParams.url) {
      wml.setup(urlParams.url);
    }
  },
  false,
);

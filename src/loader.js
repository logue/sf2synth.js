/**
 * File Loader Class
 *
 * @private
 * @author Logue <logue@hotmail.co.jp>
 */
export default class Loader {
  /**
   * Contructor
   * @param {string} url
   * @param {HTMLDivElement} placeholder
   * @param {function} callback
   */
  constructor(url, placeholder, callback) {
    this.url = url;
    this.placeholder = placeholder;
    this.callback = callback;

    /** @type {HtmlDIVElement} */
    this.alert = document.createElement('div');
    this.alert.className = 'alert alert-warning';

    /** @type {HTMLParagraphElement} */
    this.message = document.createElement('p');
    this.message.innerText = 'Now Loading...';

    /** @type {HTMLDivElement} */
    this.progressOuter = document.createElement('div');
    this.progressOuter.className = 'progress';
    /** @type {HTMLDivElement} */
    this.progress = document.createElement('div');
    this.progress.className = 'progress-bar';

    this.progressOuter.appendChild(this.progress);
    this.alert.appendChild(this.message);
    this.alert.appendChild(this.progressOuter);
    this.placeholder.appendChild(this.alert);
  }

  /**
   * ダウンロード中のハンドラ
   * @param {number} current
   * @param {number} total
   */
  onProgress(current, total) {
    const percentCompleted = Math.floor((current / total) * 100);
    this.progress.style.width = percentCompleted + '%';
    this.progress.innerText = percentCompleted + ' %';
    requestAnimationFrame(this.onProgress);
  }

  /**
   * ロード完了時のハンドラ
   * @param {ArrayBuffer} buffer
   */
  onComplete(buffer) {
    this.alert.className = 'alert alert-info';
    this.message.innerText = 'Initializing...';
    this.progress.style.width = '100%';
    this.progress.className =
      'progress-bar progress-bar-striped progress-bar-animated';

    const input = new Uint8Array(buffer);
    this.callback(input);
    this.placeholder.removeChild(this.alert);
  }

  /**
   * エラー時のハンドラ
   * @param {Error} error エラー内容
   */
  onError(error) {
    this.alert.className = 'alert alert-danger';
    this.message.innerText =
      'An error occurred while parsing SoundFont. See the console log for details. In addition, it may be cured by deleting the cache of the browser.';
    this.progressOuter.style.display = 'none';
    throw Error(error);
  }

  /**
   * データ取得
   */
  async fetch() {
    /** @type {CacheStorage} */
    const cache = await window.caches.open('wml');
    /** @type {Response} */
    const cached = await cache.match(this.url);

    if (cached) {
      this.onComplete(await cached.arrayBuffer());
      return;
    }

    /** @type {Response} キャッシュがない場合Fetchで取得 */
    const response = await fetch(this.url, {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        Accept: 'audio/x-soundfont',
        'Access-Control-Allow-Origin': '*',
        credentials: 'include',
      },
    });
    if (!response.ok) {
      this.onError();
      return;
    }
    const clonedResponse = response.clone();
    const clonedResponse2 = response.clone();

    /** @type {RedableStream} */
    const reader = response.body.getReader();

    // eslint-disable-next-line
    while (true) {
      // 最後のチャンクも場合、done は true。
      // value はチャンクバイトの Uint8Array
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      this.message.innerText = `Now Loading... (${value.length} byte)`;

      if (response.headers.has('Content-Length')) {
        // Content lengthヘッダーが出力されている場合プログレスバーを表示
        this.onProgress(value.length, response.headers.get('Content-Length'));
      }
    }

    cache.put(this.url, clonedResponse);
    this.onComplete(await clonedResponse2.arrayBuffer());
  }
}

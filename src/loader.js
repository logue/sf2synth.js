/**
 * @classdesc File Loader Class
 * @private
 * @author Logue <logue@hotmail.co.jp>
 */
export default class Loader {
  /**
   * コンストラクタ
   *
   * @param {string} url
   * @param {HTMLDivElement} placeholder
   * @param {boolean} cache
   * @param {function} callback
   */
  constructor(url, placeholder, cache, callback) {
    this.url = url;
    this.cache = cache;
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

    placeholder.appendChild(this.alert);
  }

  /**
   * ダウンロード中のハンドラ
   * @param {number} current
   * @param {number} total
   */
  onProgress(current, total) {
    const percentCompleted = Math.floor((current / total) * 100);
    if (this.progress) {
      this.progress.style.width = percentCompleted + '%';
      this.progress.innerText = percentCompleted + ' %';
    }
    requestAnimationFrame(this.onProgress);
  }

  /**
   * ロード完了時のハンドラ
   *
   * @param {ArrayBuffer} buffer
   */
  onComplete(buffer) {
    this.alert.className = 'alert alert-info';
    this.message.innerText = 'Initializing...';
    this.progress.className =
      'progress-bar progress-bar-striped progress-bar-animated';
    this.progress.style.width = '100%';
    requestAnimationFrame(this.onComplete);

    const input = new Uint8Array(buffer);
    this.callback(input);
  }

  /**
   * エラー時のハンドラ
   *
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

    if (this.cache && cached) {
      // キャッシュが存在する場合、キャッシュの値を返す
      this.onComplete(await cached.arrayBuffer());
      return;
    }

    /** @type {Response} キャッシュがない場合Fetchで取得 */
    const response = await fetch(this.url, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

    /** @type {Response} キャッシュ用レスポンス */
    const cloned = response.clone();

    /** @type {number} ファイルの容量 */
    const contentLength = parseInt(response.headers.get('Content-Length'));

    /** @type {RedableStream<Uint8Array>} ファイルリーダー */
    const reader = response.body.getReader();

    /** @type {number} その時点の長さ */
    let receivedLength = 0;

    /** @type {ArrayBuffer} 受信したバイナリチャンクの配列(本文を構成します) */
    const chunks = [];

    // eslint-disable-next-line
    while (true) {
      // 最後のチャンクも場合、done は true。
      // value はチャンクバイトの Uint8Array
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
      receivedLength += value.length;

      this.message.innerText = `Now Loading... (${receivedLength} of ${contentLength} byte)`;

      // Content lengthヘッダーが出力されている場合プログレスバーを表示
      this.onProgress(receivedLength, contentLength);
    }

    const chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position); // (4.2)
      position += chunk.length;
    }

    if (response.ok) {
      // キャッシュ保存
      cache.put(this.url, cloned);
    }
    this.onComplete(chunksAll);
  }
}

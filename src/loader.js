/**
 * @classdesc File Loader Class
 * @private
 * @author Logue <logue@hotmail.co.jp>
 */
export default class Loader {
  /** キャッシュの名前空間 */
  static CACHE_NAME = 'wml';
  /**
   * コンストラクタ
   *
   * @constructor
   * @param {string} url
   * @param {HTMLDivElement} placeholder
   * @param {boolean} cache
   * @param {Function} callback
   */
  constructor(url, placeholder, cache, callback) {
    this.url = url;
    this.cache = cache;
    this.callback = callback;

    /** @type {HTMLDivElement} */
    this.alert = document.createElement('div');
    this.alert.className = 'alert alert-warning';

    /** @type {HTMLParagraphElement} */
    this.message = document.createElement('p');
    this.message.innerText = 'Now Loading...';

    /** @type {HTMLDivElement} */
    this.progressOuter = document.createElement('div');
    this.progressOuter.className = 'progress';
    this.progressOuter.role = 'progressbar';
    this.progressOuter.ariaLabel = `Loading Progress`;
    this.progressOuter.ariaValueMin = '0';
    this.progressOuter.ariaValueNow = '0';
    this.progressOuter.ariaValueMax = '100';

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
   * @private
   */
  onProgress(current, total) {
    const percentCompleted = Math.floor((current / total) * 100);
    this.progress.style.width = `${percentCompleted}%`;
    this.progress.innerText = `${percentCompleted}%`;
  }

  /**
   * ロード完了時のハンドラ
   *
   * @param {ArrayBuffer} buffer
   * @private
   */
  onComplete(buffer) {
    this.alert.className = 'alert alert-info';
    this.message.innerText = 'Initializing...';
    this.progress.className =
      'progress-bar progress-bar-striped progress-bar-animated';
    this.progress.style.width = '100%';
    // コールバック実行
    this.callback(new Uint8Array(buffer));
  }

  /**
   * エラー時のハンドラ
   *
   * @param {Error | undefined} error エラー内容
   * @private
   */
  onError(error = undefined) {
    requestAnimationFrame(() => {
      this.alert.className = 'alert alert-danger';
      this.message.innerText =
        'An error occurred while loading SoundFont. See the console log for details. In addition, it may be cured by deleting the cache of the browser.';
      this.progressOuter.style.display = 'none';
    });
  }

  /**
   * データ取得
   * @public
   */
  async fetch() {
    /** @type {Cache} */
    const cache = await window.caches.open(Loader.CACHE_NAME);
    /** @type {Response} */
    const cached = await cache.match(this.url);

    if (this.cache && cached) {
      // キャッシュが存在する場合、キャッシュの値を返す
      this.onComplete(await cached.arrayBuffer());
      return;
    }

    /** @type {void | Response} キャッシュがない場合Fetchで取得 */
    const response = await fetch(this.url, {
      method: 'GET',
    }).catch(e => this.onError(e));

    if (!response || (response && !response.ok)) {
      return;
    }

    /** @type {Response} キャッシュ用レスポンス */
    const cloned = response.clone();

    /** @type {number} ファイルの容量 */
    const contentLength = parseInt(response.headers.get('Content-Length'));

    /** @type {ReadableStreamDefaultReader<Uint8Array>} ファイルリーダー */
    const reader = cloned.body.getReader();

    /** @type {number} 読み込まれたチャンクの長さ */
    let receivedLength = 0;

    /** @type {Uint8Array[]} 受信したバイナリチャンクの配列(本文を構成します) */
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

    /** @type {Uint8Array} 全チャンク */
    const chunksAll = new Uint8Array(receivedLength);
    /** @type {number} 現在の読み込んだチャンク位置 */
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }

    // キャッシュへ保存
    await cache.put(this.url, response);
    // 完了時のイベントを実行
    this.onComplete(chunksAll);
  }
}

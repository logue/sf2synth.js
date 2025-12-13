/**
 * @classdesc File Loader Class
 * @private
 * @author Logue <logue@hotmail.co.jp>
 */
export default class Loader {
  // Constants
  /** キャッシュの名前空間 */
  static CACHE_NAME = 'wml';
  static FETCH_METHOD = 'GET';
  static PROGRESS_MAX = 100;

  // CSS classes
  static CLASS_ALERT_WARNING = 'alert alert-warning';
  static CLASS_ALERT_INFO = 'alert alert-info';
  static CLASS_ALERT_DANGER = 'alert alert-danger';
  static CLASS_PROGRESS = 'progress';
  static CLASS_PROGRESS_BAR = 'progress-bar';
  static CLASS_PROGRESS_BAR_ANIMATED = 'progress-bar progress-bar-striped progress-bar-animated';

  // Messages
  static MSG_LOADING = 'Now Loading...';
  static MSG_INITIALIZING = 'Initializing...';
  static MSG_ERROR = 'An error occurred while loading SoundFont. See the console log for details. In addition, it may be cured by deleting the cache of the browser.';

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

    this.createUIElements();
    placeholder.appendChild(this.alert);
  }

  /**
   * Create UI elements for loading progress
   * @private
   */
  createUIElements() {
    this.alert = this.createElement('div', Loader.CLASS_ALERT_WARNING);
    this.message = this.createElement('p');
    this.message.innerText = Loader.MSG_LOADING;

    this.progressOuter = this.createProgressBar();
    this.progress = this.createElement('div', Loader.CLASS_PROGRESS_BAR);

    this.progressOuter.appendChild(this.progress);
    this.alert.appendChild(this.message);
    this.alert.appendChild(this.progressOuter);
  }

  /**
   * Create a DOM element with optional class name
   * @private
   * @param {string} tagName Element tag name
   * @param {string} [className] Optional class name
   * @returns {HTMLElement}
   */
  createElement(tagName, className = '') {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    return element;
  }

  /**
   * Create progress bar element
   * @private
   * @returns {HTMLDivElement}
   */
  createProgressBar() {
    const progressOuter = this.createElement('div', Loader.CLASS_PROGRESS);
    progressOuter.role = 'progressbar';
    progressOuter.ariaLabel = 'Loading Progress';
    progressOuter.ariaValueMin = '0';
    progressOuter.ariaValueNow = '0';
    progressOuter.ariaValueMax = Loader.PROGRESS_MAX.toString();
    return progressOuter;
  }

  /**
   * ダウンロード中のハンドラ
   * @param {number} current 現在のダウンロード済みバイト数
   * @param {number} total 総バイト数
   * @private
   */
  onProgress(current, total) {
    const percentCompleted = Math.floor((current / total) * Loader.PROGRESS_MAX);
    this.updateProgress(percentCompleted);
  }

  /**
   * Update progress bar
   * @private
   * @param {number} percent Progress percentage (0-100)
   */
  updateProgress(percent) {
    this.progress.style.width = `${percent}%`;
    this.progress.innerText = `${percent}%`;
    this.progressOuter.ariaValueNow = percent.toString();
  }

  /**
   * ロード完了時のハンドラ
   *
   * @param {Uint8Array} buffer
   * @private
   */
  onComplete(buffer) {
    this.alert.className = Loader.CLASS_ALERT_INFO;
    this.message.innerText = Loader.MSG_INITIALIZING;
    this.progress.className = Loader.CLASS_PROGRESS_BAR_ANIMATED;
    this.updateProgress(Loader.PROGRESS_MAX);
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
    if (error) {
      console.error('[Loader] Error occurred:', error);
    }
    requestAnimationFrame(() => {
      this.alert.className = Loader.CLASS_ALERT_DANGER;
      this.message.innerText = Loader.MSG_ERROR;
      this.progressOuter.style.display = 'none';
    });
  }

  /**
   * データ取得
   * @public
   */
  async fetch() {
    try {
      const cache = await window.caches.open(Loader.CACHE_NAME);
      const cached = await this.loadFromCache(cache);

      if (cached) {
        this.onComplete(cached);
        return;
      }

      await this.loadFromNetwork(cache);
    } catch (error) {
      this.onError(error);
    }
  }

  /**
   * Load data from cache
   * @private
   * @param {Cache} cache Cache storage
   * @returns {Promise<Uint8Array | null>}
   */
  async loadFromCache(cache) {
    if (!this.cache) {
      return null;
    }

    const cached = await cache.match(this.url);
    if (cached) {
      return new Uint8Array(await cached.arrayBuffer());
    }
    return null;
  }

  /**
   * Load data from network
   * @private
   * @param {Cache} cache Cache storage for storing the response
   */
  async loadFromNetwork(cache) {
    const response = await fetch(this.url, {
      method: Loader.FETCH_METHOD,
    }).catch(e => {
      this.onError(e);
      return null;
    });

    if (!response || !response.ok) {
      this.onError(new Error(`Failed to fetch: ${response?.status} ${response?.statusText}`));
      return;
    }

    const cloned = response.clone();
    const contentLength = parseInt(response.headers.get('Content-Length') || '0', 10);

    const data = await this.readResponseBody(cloned, contentLength);

    // キャッシュへ保存
    await cache.put(this.url, response);
    // 完了時のイベントを実行
    this.onComplete(data);
  }

  /**
   * Read response body with progress tracking
   * @private
   * @param {Response} response Response object
   * @param {number} contentLength Total content length in bytes
   * @returns {Promise<Uint8Array>}
   */
  async readResponseBody(response, contentLength) {
    const reader = response.body.getReader();
    let receivedLength = 0;
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      chunks.push(value);
      receivedLength += value.length;

      this.updateLoadingMessage(receivedLength, contentLength);

      if (contentLength > 0) {
        this.onProgress(receivedLength, contentLength);
      }
    }

    return this.mergeChunks(chunks, receivedLength);
  }

  /**
   * Update loading message with current progress
   * @private
   * @param {number} received Bytes received
   * @param {number} total Total bytes
   */
  updateLoadingMessage(received, total) {
    this.message.innerText = `${Loader.MSG_LOADING} (${received} of ${total} byte)`;
  }

  /**
   * Merge all chunks into a single Uint8Array
   * @private
   * @param {Uint8Array[]} chunks Array of chunks
   * @param {number} totalLength Total length of all chunks
   * @returns {Uint8Array}
   */
  mergeChunks(chunks, totalLength) {
    const result = new Uint8Array(totalLength);
    let position = 0;
    for (const chunk of chunks) {
      result.set(chunk, position);
      position += chunk.length;
    }
    return result;
  }
}

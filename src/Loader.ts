/**
 * @classdesc File Loader Class
 * @private
 * @author Logue <logue@hotmail.co.jp>
 */
export default class Loader {
  // Constants
  /** Cache Namespace */
  static readonly CACHE_NAME = 'wml';
  static readonly FETCH_METHOD = 'GET';
  static readonly PROGRESS_MAX = 100;

  // CSS classes
  static readonly CLASS_ALERT_WARNING = 'alert alert-warning';
  static readonly CLASS_ALERT_INFO = 'alert alert-info';
  static readonly CLASS_ALERT_DANGER = 'alert alert-danger';
  static readonly CLASS_PROGRESS = 'progress';
  static readonly CLASS_PROGRESS_BAR = 'progress-bar';
  static readonly CLASS_PROGRESS_BAR_ANIMATED =
    'progress-bar progress-bar-striped progress-bar-animated';

  // Messages
  static readonly MSG_LOADING = 'Now Loading...';
  static readonly MSG_INITIALIZING = 'Initializing...';
  static readonly MSG_ERROR =
    'An error occurred while loading SoundFont. See the console log for details. In addition, it may be cured by deleting the cache of the browser.';

  private readonly url: string;
  private readonly cache: boolean;
  private readonly callback: (data: ArrayBuffer | Uint8Array) => void;
  private alert: HTMLDivElement = document.createElement('div');
  private message: HTMLParagraphElement = document.createElement('p');
  private progressOuter: HTMLDivElement = document.createElement('div');
  private progress: HTMLDivElement = document.createElement('div');

  /**
   * コンストラクタ
   *
   * @constructor
   * @param  url
   * @param  placeholder
   * @param  cache
   * @param {Function} callback
   */
  constructor(
    url: string,
    placeholder: HTMLElement,
    cache: boolean,
    callback: (data: ArrayBuffer | Uint8Array) => void,
  ) {
    this.url = url;
    this.cache = cache;
    this.callback = callback;

    this.createUIElements();
    placeholder.appendChild(this.alert);
  }

  /**
   * Create UI elements for loading progress
   */
  private createUIElements() {
    this.alert = this.createElement(
      'div',
      Loader.CLASS_ALERT_WARNING,
    ) as HTMLDivElement;
    this.message = this.createElement('p') as HTMLParagraphElement;
    this.message.innerText = Loader.MSG_LOADING;

    this.progressOuter = this.createProgressBar();
    this.progress = this.createElement(
      'div',
      Loader.CLASS_PROGRESS_BAR,
    ) as HTMLDivElement;

    this.progressOuter.appendChild(this.progress);
    this.alert.appendChild(this.message);
    this.alert.appendChild(this.progressOuter);
  }

  /**
   * Create a DOM element with optional class name
   * @param  tagName Element tag name
   * @param  [className] Optional class name
   * @returns Created HTMLElement
   */
  private createElement(tagName: string, className: string = ''): HTMLElement {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    return element;
  }

  /**
   * Create progress bar element
   */
  private createProgressBar(): HTMLDivElement {
    const progressOuter = this.createElement(
      'div',
      Loader.CLASS_PROGRESS,
    ) as HTMLDivElement;
    progressOuter.role = 'progressbar';
    progressOuter.ariaLabel = 'Loading Progress';
    progressOuter.ariaValueMin = '0';
    progressOuter.ariaValueNow = '0';
    progressOuter.ariaValueMax = Loader.PROGRESS_MAX.toString();
    return progressOuter;
  }

  /**
   * Handler for download progress
   * @param current Bytes received
   * @param total Total bytes
   */
  private onProgress(current: number, total: number) {
    const percentCompleted = Math.floor(
      (current / total) * Loader.PROGRESS_MAX,
    );
    this.updateProgress(percentCompleted);
  }

  /**
   * Update progress bar and message
   * @param percent Progress percentage (0-100)
   */
  private updateProgress(percent: number) {
    this.progress.style.width = `${percent}%`;
    this.progress.innerText = `${percent}%`;
    this.progressOuter.ariaValueNow = percent.toString();
  }

  /**
   * Handler for load completion
   *
   * @param buffer Loaded data buffer
   */
  private onComplete(buffer: Uint8Array) {
    this.alert.className = Loader.CLASS_ALERT_INFO;
    this.message.innerText = Loader.MSG_INITIALIZING;
    this.progress.className = Loader.CLASS_PROGRESS_BAR_ANIMATED;
    this.updateProgress(Loader.PROGRESS_MAX);
    // Execute callback
    // Provide an ArrayBuffer view to callers to match expected type
    const ab = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    );
    this.callback(ab as ArrayBuffer);
  }

  /**
   * Error handler for loading failures
   *
   * @param error Error details
   */
  private onError(error?: Error) {
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
   * Fetch data from cache or network
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
      this.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Load data from cache
   * @param cache Cache storage
   */
  private async loadFromCache(cache: Cache): Promise<Uint8Array | null> {
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
   * Load data from network and store in cache
   * @param cache Cache storage for storing the response
   */
  private async loadFromNetwork(cache: Cache) {
    const response = await fetch(this.url, {
      method: Loader.FETCH_METHOD,
    }).catch((e) => {
      this.onError(e);
      return null;
    });

    if (!response?.ok) {
      this.onError(
        new Error(
          `Failed to fetch: ${response?.status} ${response?.statusText}`,
        ),
      );
      return;
    }

    const cloned = response.clone();
    const contentLength = Number.parseInt(
      response.headers.get('Content-Length') || '0',
      10,
    );

    const data = await this.readResponseBody(cloned, contentLength);

    // キャッシュへ保存
    await cache.put(this.url, response);
    // 完了時のイベントを実行
    this.onComplete(data);
  }

  /**
   * Read response body with progress tracking
   * @param response Response object
   * @param  contentLength Total content length in bytes
   */
  private async readResponseBody(
    response: Response,
    contentLength: number,
  ): Promise<Uint8Array> {
    const reader = response.body!.getReader();
    let receivedLength = 0;
    const chunks: Uint8Array[] = [];

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
   * @param received Bytes received
   * @param total Total bytes
   */
  private updateLoadingMessage(received: number, total: number) {
    this.message.innerText = `${Loader.MSG_LOADING} (${received} of ${total} byte)`;
  }

  /**
   * Merge all chunks into a single Uint8Array
   * @param chunks Array of chunks
   * @param totalLength Total length of all chunks
   */
  private mergeChunks(chunks: Uint8Array[], totalLength: number): Uint8Array {
    const result = new Uint8Array(totalLength);
    let position = 0;
    for (const chunk of chunks) {
      result.set(chunk, position);
      position += chunk.length;
    }
    return result;
  }
}

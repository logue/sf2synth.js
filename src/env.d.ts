/// <reference types="@rsbuild/core/types" />
/// <reference types="@rslib/core/types" />

declare const __APP_VERSION__: string;
declare const __BUILD_DATE__: string;

interface Window {
  __lastSynth?: import('./Synthesizer').default;
}

/**
 * Worker自身のグローバルスコープ（`self`）が持つ最小限の形。
 *
 * `webworker` libを丸ごと有効化すると`dom` libのグローバル宣言（`self`等）と
 * 衝突するため、WebMidiLinkが実際に使うAPIだけを手書きで宣言している。
 */
interface DedicatedWorkerGlobalScope {
  postMessage(message: unknown, transfer?: Transferable[]): void;
  addEventListener(
    type: 'message',
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: 'message',
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

/**
 * @typedef {{
 *   index?: number;
 *   length?: number;
 *   padding?: boolean;
 *   bigEndian?: boolean;
 * }} RiffOptions
 */

/**
 * Riff Parser class
 *
 * @author imaya
 */
export class Riff {
  // Constants
  static CHUNK_ID_SIZE = 4;
  static CHUNK_SIZE_BYTES = 4;
  static SHIFT_8_BITS = 8;
  static SHIFT_16_BITS = 16;
  static SHIFT_24_BITS = 24;
  static UNSIGNED_32_BIT_MASK = 0;

  /**
   * @param {Uint8Array | ArrayBuffer} input Input buffer.
   * @param {RiffOptions} [optParams] Option parameters.
   */
  constructor(input, optParams = {}) {
    /** @type {Uint8Array} */
    this.input = input instanceof Uint8Array ? input : new Uint8Array(input);
    /** @type {number} */
    this.ip = optParams.index || 0;
    /** @type {number} */
    this.length = optParams.length || input.byteLength - this.ip;
    /** @type {RiffChunk[]} */
    this.chunkList = [];
    /** @type {number} */
    this.offset = this.ip;
    /** @type {boolean} */
    this.padding = optParams.padding !== undefined ? optParams.padding : true;
    /** @type {boolean} */
    this.bigEndian =
      optParams.bigEndian !== undefined ? optParams.bigEndian : false;
  }

  /** @returns {void} */
  parse() {
    /** @type {number} */
    const length = this.length + this.offset;

    this.chunkList = [];

    while (this.ip < length) {
      this.parseChunk();
    }
  }

  /**
   * Read 4-byte chunk ID
   * @private
   * @param {Uint8Array} data Data array
   * @param {number} offset Offset position
   * @returns {string} Chunk ID
   */
  readChunkId(data, offset) {
    return String.fromCharCode(
      data[offset],
      data[offset + 1],
      data[offset + 2],
      data[offset + 3]
    );
  }

  /**
   * Read 32-bit unsigned integer
   * @private
   * @param {Uint8Array} data Data array
   * @param {number} offset Offset position
   * @returns {number} 32-bit unsigned integer
   */
  readUInt32(data, offset) {
    if (this.bigEndian) {
      return (
        ((data[offset] << Riff.SHIFT_24_BITS) |
          (data[offset + 1] << Riff.SHIFT_16_BITS) |
          (data[offset + 2] << Riff.SHIFT_8_BITS) |
          data[offset + 3]) >>>
        Riff.UNSIGNED_32_BIT_MASK
      );
    }
    return (
      (data[offset] |
        (data[offset + 1] << Riff.SHIFT_8_BITS) |
        (data[offset + 2] << Riff.SHIFT_16_BITS) |
        (data[offset + 3] << Riff.SHIFT_24_BITS)) >>>
      Riff.UNSIGNED_32_BIT_MASK
    );
  }

  /** @returns {void} */
  parseChunk() {
    const input = this.input;
    let ip = this.ip;

    const chunkId = this.readChunkId(input, ip);
    ip += Riff.CHUNK_ID_SIZE;

    const size = this.readUInt32(input, ip);
    ip += Riff.CHUNK_SIZE_BYTES;

    this.chunkList.push(new RiffChunk(chunkId, size, ip));

    ip += size;

    // Apply padding if necessary (align to 2-byte boundary)
    if (this.padding && ((ip - this.offset) & 1) === 1) {
      ip++;
    }

    this.ip = ip;
  }

  /**
   * @param {number} index Chunk index.
   * @returns {RiffChunk | null}
   */
  getChunk(index) {
    /** @type {RiffChunk} */
    const chunk = this.chunkList[index];

    return chunk !== undefined ? chunk : null;
  }

  /** @returns {number} */
  getNumberOfChunks() {
    return this.chunkList.length;
  }
}

/**
 * Riff Chunk Structure
 *
 * @interface
 */
export class RiffChunk {
  /**
   * @param {string} type
   * @param {number} size
   * @param {number} offset
   */
  constructor(type, size, offset) {
    /** @type {string} */
    this.type = type;
    /** @type {number} */
    this.size = size;
    /** @type {number} */
    this.offset = offset;
  }
}

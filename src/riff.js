/**
 * Riff Parser class
 *
 * @author imaya
 */
export class Riff {
  /**
   * @param {ArrayBuffer} input Input buffer.
   * @param {Object} [optParams] Option parameters.
   */
  constructor(input, optParams = {}) {
    /** @type {ArrayBuffer} */
    this.input = input;
    /** @type {number} */
    this.ip = optParams.index || 0;
    /** @type {number} */
    this.length = optParams.length || input.byteLength - this.ip;
    /** @type {RiffChunk[]} */
    this.chunkList = [];
    /** @type {number} */
    this.offset = this.ip;
    /** @type {boolean} */
    this.padding = optParams.padding !== void 0 ? optParams.padding : true;
    /** @type {boolean} */
    this.bigEndian =
      optParams.bigEndian !== void 0 ? optParams.bigEndian : false;
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

  /** @returns {void} */
  parseChunk() {
    /** @type {ArrayBuffer} */
    const input = this.input;
    /** @type {number} */
    let ip = this.ip;
    /** @type {number} */
    let size;

    this.chunkList.push(
      new RiffChunk(
        String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]),
        (size = this.bigEndian
          ? ((input[ip++] << 24) |
              (input[ip++] << 16) |
              (input[ip++] << 8) |
              input[ip++]) >>>
            0
          : (input[ip++] |
              (input[ip++] << 8) |
              (input[ip++] << 16) |
              (input[ip++] << 24)) >>>
            0),
        ip
      )
    );

    ip += size;

    // padding
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

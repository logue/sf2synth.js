/**
 * Riff Parser class
 *
 * This class implements a parser for the Resource Interchange File Format (RIFF),
 * which is a generic file container format for storing data in tagged chunks.
 *
 * @author imaya
 */
export class Riff {
  /**
   * Creates a new Riff parser instance
   *
   * @param {ArrayBuffer} input Input buffer containing RIFF data
   * @param {Object} [optParams] Optional parameters
   * @param {number} [optParams.index=0] Starting index in the input buffer
   * @param {number} [optParams.length] Length of data to parse (defaults to remaining buffer length)
   * @param {boolean} [optParams.padding=true] Whether to handle padding bytes
   * @param {boolean} [optParams.bigEndian=false] Whether the data is in big-endian format
   * @throws {Error} If input is not a valid ArrayBuffer or has insufficient length
   */
  constructor(input, optParams = {}) {
    if (!(input instanceof ArrayBuffer)) {
      throw new Error('Input must be an ArrayBuffer');
    }

    if (input.byteLength === 0) {
      throw new Error('Input buffer is empty');
    }

    const index = optParams.index || 0;
    if (index < 0 || index >= input.byteLength) {
      throw new Error('Invalid start index');
    }

    /** @type {ArrayBuffer} */
    this.input = input;
    /** @type {number} */
    this.ip = index;
    /** @type {number} */
    this.length = optParams.length || input.byteLength - this.ip;
    /** @type {RiffChunk[]} */
    this.chunkList = [];
    /** @type {number} */
    this.offset = this.ip;
    /** @type {boolean} */
    this.padding = optParams.padding !== undefined ? optParams.padding : true;
    /** @type {boolean} */
    this.bigEndian = optParams.bigEndian !== undefined ? optParams.bigEndian : false;

    if (this.length <= 0) {
      throw new Error('Invalid length parameter');
    }
  }

  /**
   * Parses the RIFF data and populates the chunk list
   *
   * @returns {void}
   * @throws {Error} If parsing fails or invalid data is encountered
   */
  parse() {
    /** @type {number} */
    const length = this.length + this.offset;

    this.chunkList = [];

    while (this.ip < length) {
      this.parseChunk();
    }
  }

  /**
   * Parses a single RIFF chunk
   *
   * @returns {void}
   * @throws {Error} If chunk parsing fails
   * @private
   */
  parseChunk() {
    if (this.ip + 8 > this.input.byteLength) {
      throw new Error('Insufficient data for chunk header');
    }

    /** @type {ArrayBuffer} */
    const input = this.input;
    /** @type {number} */
    let ip = this.ip;
    /** @type {number} */
    let size;

    // Read chunk type (4 bytes)
    const type = String.fromCharCode(
      input[ip++],
      input[ip++],
      input[ip++],
      input[ip++]
    );

    // Read chunk size (4 bytes)
    size = this.bigEndian
      ? ((input[ip++] << 24) |
          (input[ip++] << 16) |
          (input[ip++] << 8) |
          input[ip++]) >>>
        0
      : (input[ip++] |
          (input[ip++] << 8) |
          (input[ip++] << 16) |
          (input[ip++] << 24)) >>>
        0;

    if (ip + size > this.input.byteLength) {
      throw new Error('Chunk size exceeds buffer bounds');
    }

    this.chunkList.push(new RiffChunk(type, size, ip));

    ip += size;

    // Handle padding (even-aligned chunks)
    if (this.padding && ((ip - this.offset) & 1) === 1) {
      ip++;
    }

    this.ip = ip;
  }

  /**
   * Gets a chunk by index
   *
   * @param {number} index Chunk index
   * @returns {RiffChunk | null} The chunk at the specified index, or null if not found
   */
  getChunk(index) {
    if (index < 0 || index >= this.chunkList.length) {
      return null;
    }
    return this.chunkList[index];
  }

  /**
   * Gets the total number of chunks
   *
   * @returns {number} The number of chunks
   */
  getNumberOfChunks() {
    return this.chunkList.length;
  }
}

/**
 * Represents a RIFF chunk structure
 *
 * @interface
 */
export class RiffChunk {
  /**
   * Creates a new RIFF chunk
   *
   * @param {string} type The chunk type identifier (4 characters)
   * @param {number} size The size of the chunk data in bytes
   * @param {number} offset The offset in the input buffer where the chunk data begins
   */
  constructor(type, size, offset) {
    if (type.length !== 4) {
      throw new Error('Chunk type must be exactly 4 characters');
    }
    if (size < 0) {
      throw new Error('Chunk size cannot be negative');
    }
    if (offset < 0) {
      throw new Error('Chunk offset cannot be negative');
    }

    /** @type {string} */
    this.type = type;
    /** @type {number} */
    this.size = size;
    /** @type {number} */
    this.offset = offset;
  }
}
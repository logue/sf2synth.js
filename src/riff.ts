interface RiffOptParams {
  index?: number;
  length?: number;
  padding?: boolean;
  bigEndian?: boolean;
}

/**
 * Riff Parser class
 *
 * This class implements a parser for the Resource Interchange File Format (RIFF),
 * which is a generic file container format for storing data in tagged chunks.
 *
 * @author imaya, enjikaka
 */
export class Riff {
  input: ArrayBuffer;
  ip: number;
  length: number;
  chunkList: RiffChunk[];
  offset: number;
  padding: boolean;
  bigEndian: boolean;

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
  constructor(input: ArrayBuffer, optParams: RiffOptParams = {}) {
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

    this.input = input;
    this.ip = index;
    this.length = optParams.length || input.byteLength - this.ip;
    this.chunkList = [];
    this.offset = this.ip;
    this.padding = optParams.padding !== undefined ? optParams.padding : true;
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
  type: string;
  size: number;
  offset: number;

  /**
   * Creates a new RIFF chunk
   */
  constructor(type: string, size: number, offset: number) {
    this.type = type;
    this.size = size;
    this.offset = offset;
  }
}
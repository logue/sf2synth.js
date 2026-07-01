import type { RiffOptions } from '@/interfaces/RiffOptions';
import type { RiffChunk } from './interfaces/RiffChunk';
/**
 * Riff Parser class
 *
 * @author imaya
 */
export class Riff {
  // Constants
  static readonly CHUNK_ID_SIZE = 4;
  static readonly CHUNK_SIZE_BYTES = 4;
  static readonly SHIFT_8_BITS = 8;
  static readonly SHIFT_16_BITS = 16;
  static readonly SHIFT_24_BITS = 24;
  static readonly UNSIGNED_32_BIT_MASK = 0;

  private readonly length: number;
  private readonly offset: number;
  private readonly padding: boolean = true;
  private readonly bigEndian: boolean = false;

  private ip: number = 0;

  public input: Uint8Array;
  public chunkList: RiffChunk[] = [];

  /**
   * @param input Input buffer.
   * @param Option parameters.
   */
  constructor(
    input: Uint8Array | ArrayBufferLike,
    optParams: RiffOptions = {},
  ) {
    if (input === undefined || input === null) {
      throw new TypeError(
        'Riff constructor requires a Uint8Array or ArrayBufferLike input.',
      );
    }

    this.input = input instanceof Uint8Array ? input : new Uint8Array(input);
    this.ip = optParams.index || 0;
    this.length = optParams.length ?? input.byteLength - this.ip;
    this.chunkList = [];
    this.offset = this.ip;
    this.padding = optParams.padding ?? true;
    this.bigEndian = optParams.bigEndian ?? false;
  }

  public parse(): void {
    const length: number = this.length + this.offset;

    this.chunkList = [];

    while (this.ip < length) {
      this.parseChunk();
    }
  }

  /**
   * Read 4-byte chunk ID
   * @param data Data array
   * @param offset Offset position
   * @returns Chunk ID
   */
  private readChunkId(data: Uint8Array, offset: number): string {
    return String.fromCodePoint(
      data[offset],
      data[offset + 1],
      data[offset + 2],
      data[offset + 3],
    );
  }

  /**
   * Read 32-bit unsigned integer
   * @param data Data array
   * @param offset Offset position
   * @returns 32-bit unsigned integer
   */
  private readUInt32(data: Uint8Array, offset: number): number {
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

  private parseChunk(): void {
    const input = this.input;
    let ip = this.ip;

    const type = this.readChunkId(input, ip);
    ip += Riff.CHUNK_ID_SIZE;

    const size = this.readUInt32(input, ip);
    ip += Riff.CHUNK_SIZE_BYTES;

    this.chunkList.push({ type, size, offset: ip });

    ip += size;

    // Apply padding if necessary (align to 2-byte boundary)
    if (this.padding && ((ip - this.offset) & 1) === 1) {
      ip++;
    }

    this.ip = ip;
  }

  /**
   * @param index Chunk index.
   */
  public getChunk(index: number): RiffChunk {
    return this.chunkList[index];
  }

  public getNumberOfChunks(): number {
    return this.chunkList.length;
  }
}

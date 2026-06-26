import type { RiffOptions } from '@/interfaces/RiffOptions';
import type { RiffChunk } from '@/interfaces/RiffChunk';
import type {
  InstrumentHeader,
  InstrumentZone,
  ParserOptions,
  PresetHeader,
  PresetZone,
  SampleHeader,
} from '@/interfaces/SynthesizerInterface';
import { Riff } from '@/Riff';
import { defaultGeneratorTable } from '@/types/GeneratorTable';
import type {
  AdjustedSampleData,
  GeneratorBundle,
  GeneratorEntry,
  GeneratorValue,
  InstrumentDefinition,
  ModGen,
  ModGenBundle,
  ModulatorBundle,
  PresetDefinition,
  ZoneInfo,
} from '@/types/SynthesizerTypes';
import { resolveGeneratorAmount } from '@/utility/resolveGeneratorAmount';

/**
 * SoundFont Parser Class
 *
 * @author imaya
 */
export default class Parser {
  // Constants
  static readonly CHUNK_ID_SIZE = 4;
  static readonly EXPECTED_RIFF_CHUNKS = 1;
  static readonly EXPECTED_SFBK_CHUNKS = 3;
  static readonly EXPECTED_PDTA_CHUNKS = 9;
  static readonly EXPECTED_SDTA_CHUNKS = 1;
  static readonly PRESET_HEADER_SIZE = 38;
  static readonly INSTRUMENT_HEADER_SIZE = 22;
  static readonly NAME_SIZE = 20;
  static readonly SAMPLE_HEADER_SIZE = 46;
  static readonly BAG_SIZE = 4;
  static readonly MODULATOR_SIZE = 10;
  static readonly GENERATOR_SIZE = 4;

  public input: Uint8Array | null;
  private readonly parserOption: RiffOptions;
  private readonly sampleRate: number = 22050;
  private readonly presetHeader: PresetHeader[] = [];
  private presetZone: PresetZone[] = [];
  private presetZoneModulator: GeneratorEntry[] = [];
  private presetZoneGenerator: GeneratorEntry[] = [];
  private instrument: InstrumentHeader[] = [];
  private readonly instrumentZone: InstrumentZone[] = [];
  private instrumentZoneModulator: GeneratorEntry[] = [];
  private instrumentZoneGenerator: GeneratorEntry[] = [];
  public sampleHeader: SampleHeader[] = [];
  public sample: Int16Array[] = [];
  public samplingData:
    | { type: string; size: number; offset: number }
    | undefined;
  public readonly GeneratorEnumeratorTable: string[];

  /**
   * @param input Input buffer containing SoundFont data.
   * @param optParams Optional parameters for parsing.
   */
  constructor(input: Uint8Array, optParams: Partial<ParserOptions> = {}) {
    this.input = input;
    this.parserOption = optParams.parserOption || {};
    this.sampleRate = optParams.sampleRate || 22050; // よくわからんが、OSで指定されているサンプルレートを入れないと音が切れ切れになる。

    this.presetHeader = [];
    this.presetZone = [];
    this.presetZoneModulator = [];
    this.presetZoneGenerator = [];
    this.instrument = [];
    this.instrumentZone = [];
    this.instrumentZoneModulator = [];
    this.instrumentZoneGenerator = [];
    this.sampleHeader = [];
    this.sample = [];
    this.samplingData = undefined;
    this.GeneratorEnumeratorTable = Object.keys(defaultGeneratorTable);
  }

  /**
   * Read 4-character signature from data
   * @param data Data array
   * @param offset Offset position
   * @returns Signature string
   */
  private readSignature(data: Uint8Array, offset: number): string {
    return String.fromCodePoint(
      data[offset],
      data[offset + 1],
      data[offset + 2],
      data[offset + 3]
    );
  }

  /**
   * Validate chunk type
   * @param chunk Chunk to validate
   * @param expectedType Expected chunk type
   * @throws If chunk type doesn't match
   */
  private validateChunkType(chunk: RiffChunk, expectedType: string): void {
    if (chunk.type !== expectedType) {
      throw new Error(
        `invalid chunk type: expected '${expectedType}', got '${chunk.type}'`
      );
    }
  }

  /**
   * Validate signature
   * @param signature Actual signature
   * @param expected Expected signature
   * @throws If signature doesn't match
   */
  private validateSignature(signature: string, expected: string): void {
    if (signature !== expected) {
      throw new Error(
        `invalid signature: expected '${expected}', got '${signature}'`
      );
    }
  }

  public parse() {
    const input = this.input;
    if (!input) {
      throw new Error('soundfont input buffer is missing');
    }

    const sourceBuffer =
      input instanceof Uint8Array
        ? (input.buffer as ArrayBuffer).slice(
            input.byteOffset,
            input.byteOffset + input.byteLength
          )
        : input;

    const parser = new Riff(sourceBuffer, this.parserOption);

    parser.parse();
    if (parser.chunkList.length !== Parser.EXPECTED_RIFF_CHUNKS) {
      throw new Error(
        `wrong chunk length: expected ${Parser.EXPECTED_RIFF_CHUNKS}, got ${parser.chunkList.length}`
      );
    }

    this.parseRiffChunk(parser.getChunk(0));
    // Release parsed source buffer reference after parsing.
    this.input = null;
  }

  private parseRiffChunk(chunk: RiffChunk): void {
    const data = this.input;
    let ip = chunk.offset;

    this.validateChunkType(chunk, 'RIFF');

    const signature = this.readSignature(data!, ip);
    ip += Parser.CHUNK_ID_SIZE;
    this.validateSignature(signature, 'sfbk');

    const parser = new Riff(data!, {
      index: ip,
      length: chunk.size - Parser.CHUNK_ID_SIZE,
    });
    parser.parse();
    if (parser.getNumberOfChunks() !== Parser.EXPECTED_SFBK_CHUNKS) {
      throw new Error(
        `invalid sfbk structure: expected ${Parser.EXPECTED_SFBK_CHUNKS} chunks, got ${parser.getNumberOfChunks()}`
      );
    }

    // INFO-list
    this.parseInfoList(parser.getChunk(0));
    // sdta-list
    this.parseSdtaList(parser.getChunk(1));
    // pdta-list
    this.parsePdtaList(parser.getChunk(2));
  }

  private parseInfoList(chunk: RiffChunk): void {
    const data = this.input!;
    let ip = chunk.offset;

    this.validateChunkType(chunk, 'LIST');

    const signature = this.readSignature(data, ip);
    ip += Parser.CHUNK_ID_SIZE;
    this.validateSignature(signature, 'INFO');

    const parser = new Riff(data, {
      index: ip,
      length: chunk.size - Parser.CHUNK_ID_SIZE,
    });
    parser.parse();
  }

  parseSdtaList(chunk: RiffChunk) {
    const data = this.input!;
    let ip = chunk.offset;

    this.validateChunkType(chunk, 'LIST');

    const signature = this.readSignature(data, ip);
    ip += Parser.CHUNK_ID_SIZE;
    this.validateSignature(signature, 'sdta');

    const parser = new Riff(data, {
      index: ip,
      length: chunk.size - Parser.CHUNK_ID_SIZE,
    });
    parser.parse();
    if (parser.chunkList.length !== Parser.EXPECTED_SDTA_CHUNKS) {
      throw new Error(
        `invalid sdta structure: expected ${Parser.EXPECTED_SDTA_CHUNKS} chunk, got ${parser.chunkList.length}`
      );
    }
    this.samplingData = parser.getChunk(0)!;
  }

  parsePdtaList(chunk: RiffChunk) {
    const data = this.input!;
    let ip = chunk.offset;

    this.validateChunkType(chunk, 'LIST');

    const signature = this.readSignature(data, ip);
    ip += Parser.CHUNK_ID_SIZE;
    this.validateSignature(signature, 'pdta');

    const parser = new Riff(data, {
      index: ip,
      length: chunk.size - Parser.CHUNK_ID_SIZE,
    });
    parser.parse();

    if (parser.getNumberOfChunks() !== Parser.EXPECTED_PDTA_CHUNKS) {
      throw new Error(
        `invalid pdta chunk: expected ${Parser.EXPECTED_PDTA_CHUNKS} chunks, got ${parser.getNumberOfChunks()}`
      );
    }

    this.parsePhdr(parser.getChunk(0));
    this.parsePbag(parser.getChunk(1));
    this.parsePmod(parser.getChunk(2));
    this.parsePgen(parser.getChunk(3));
    this.parseInst(parser.getChunk(4));
    this.parseIbag(parser.getChunk(5));
    this.parseImod(parser.getChunk(6));
    this.parseIgen(parser.getChunk(7));
    this.parseShdr(parser.getChunk(8));
  }

  private parsePhdr(chunk: RiffChunk) {
    this.validateChunkType(chunk, 'phdr');

    const data = this.input!;
    let ip = chunk.offset;
    const presetHeader: PresetHeader[] = this.presetHeader;
    const size = chunk.offset + chunk.size;

    while (ip < size) {
      const presetNameBytes = data.subarray(ip, (ip += 20));
      presetHeader.push({
        presetName: String.fromCodePoint(...Array.from(presetNameBytes)),
        preset: data[ip++] | (data[ip++] << 8),
        bank: data[ip++] | (data[ip++] << 8),
        presetBagIndex: data[ip++] | (data[ip++] << 8),
        library:
          (data[ip++] |
            (data[ip++] << 8) |
            (data[ip++] << 16) |
            (data[ip++] << 24)) >>>
          0,
        genre:
          (data[ip++] |
            (data[ip++] << 8) |
            (data[ip++] << 16) |
            (data[ip++] << 24)) >>>
          0,
        morphology:
          (data[ip++] |
            (data[ip++] << 8) |
            (data[ip++] << 16) |
            (data[ip++] << 24)) >>>
          0,
      });
    }
  }

  private parsePbag(chunk: RiffChunk) {
    this.validateChunkType(chunk, 'pbag');

    const data = this.input!;
    let ip = chunk.offset;
    const presetZone: PresetZone[] = (this.presetZone = []);
    const size = chunk.offset + chunk.size;

    while (ip < size) {
      presetZone.push({
        presetGeneratorIndex: data[ip++] | (data[ip++] << 8),
        presetModulatorIndex: data[ip++] | (data[ip++] << 8),
      });
    }
  }

  private parsePmod(chunk: RiffChunk) {
    this.validateChunkType(chunk, 'pmod');
    this.presetZoneModulator = this.parseModulator(chunk);
  }

  private parsePgen(chunk: RiffChunk) {
    this.validateChunkType(chunk, 'pgen');
    this.presetZoneGenerator = this.parseGenerator(chunk);
  }

  private parseInst(chunk: RiffChunk) {
    this.validateChunkType(chunk, 'inst');

    const data = this.input!;
    let ip = chunk.offset;
    const instrument: InstrumentHeader[] = (this.instrument = []);
    const size = chunk.offset + chunk.size;

    while (ip < size) {
      const nameEnd = ip + 20;
      ip = nameEnd;
      instrument.push({
        instrumentName: String.fromCodePoint(
          ...Array.from(data.subarray(ip - 20, nameEnd))
        ),
        instrumentBagIndex: data[ip++] | (data[ip++] << 8),
      });
    }
  }

  private parseIbag(chunk: RiffChunk) {
    this.validateChunkType(chunk, 'ibag');

    const data = this.input!;
    let ip = chunk.offset;
    const instrumentZone: InstrumentZone[] = this.instrumentZone;
    const size = chunk.offset + chunk.size;

    while (ip < size) {
      instrumentZone.push({
        instrumentGeneratorIndex: data[ip++] | (data[ip++] << 8),
        instrumentModulatorIndex: data[ip++] | (data[ip++] << 8),
      });
    }
  }

  private parseImod(chunk: RiffChunk) {
    this.validateChunkType(chunk, 'imod');
    this.instrumentZoneModulator = this.parseModulator(chunk);
  }

  private parseIgen(chunk: RiffChunk) {
    this.validateChunkType(chunk, 'igen');
    this.instrumentZoneGenerator = this.parseGenerator(chunk);
  }

  /**
   * Read 32-bit unsigned integer (little-endian)
   * @param data Data array
   * @param offset Offset position
   * @returns 32-bit unsigned integer
   */
  private readUInt32LE(data: Uint8Array, offset: number): number {
    return (
      ((data[offset] << 0) |
        (data[offset + 1] << 8) |
        (data[offset + 2] << 16) |
        (data[offset + 3] << 24)) >>>
      0
    );
  }

  /**
   * Read 16-bit unsigned integer (little-endian)
   * @param data Data array
   * @param offset Offset position
   * @returns 16-bit unsigned integer
   */
  private readUInt16LE(data: Uint8Array, offset: number): number {
    return data[offset] | (data[offset + 1] << 8);
  }

  parseShdr(chunk: RiffChunk) {
    this.validateChunkType(chunk, 'shdr');

    const data = this.input!;
    let ip = chunk.offset;
    const samples: Int16Array[] = this.sample;
    const sampleHeader: SampleHeader[] = this.sampleHeader;
    const size = chunk.offset + chunk.size;

    const samplingData = this.samplingData;
    if (!samplingData) {
      throw new Error('sampling data not found');
    }

    while (ip < size) {
      const sampleName = String.fromCodePoint(
        ...Array.from(data.subarray(ip, ip + Parser.NAME_SIZE))
      );
      ip += Parser.NAME_SIZE;

      const start = this.readUInt32LE(data, ip);
      ip += 4;
      const end = this.readUInt32LE(data, ip);
      ip += 4;
      let startLoop = this.readUInt32LE(data, ip);
      ip += 4;
      let endLoop = this.readUInt32LE(data, ip);
      ip += 4;
      let sampleRate = this.readUInt32LE(data, ip);
      ip += 4;

      const originalPitch = data[ip++];
      const pitchCorrection = (data[ip++] << 24) >> 24; // Sign extend
      const sampleLink = this.readUInt16LE(data, ip);
      ip += 2;
      const sampleType = this.readUInt16LE(data, ip);
      ip += 2;

      let sample: Int16Array = new Int16Array(
        new Uint8Array(
          data.subarray(
            samplingData.offset + start * 2,
            samplingData.offset + end * 2
          )
        ).buffer
      );

      startLoop -= start;
      endLoop -= start;

      if (sampleRate > 0) {
        const adjust = this.adjustSampleData(sample, sampleRate);
        sample = adjust.sample;
        sampleRate *= adjust.multiply;
        startLoop *= adjust.multiply;
        endLoop *= adjust.multiply;
      }

      samples.push(sample);

      sampleHeader.push({
        sampleName,
        start,
        end,
        startLoop,
        endLoop,
        sampleRate,
        originalPitch,
        pitchCorrection,
        sampleLink,
        sampleType,
      });
    }
  }

  private adjustSampleData(
    sample: Int16Array,
    sampleRate: number
  ): AdjustedSampleData {
    let newSample: Int16Array;
    let i: number;
    let il: number;
    let j: number;
    let multiply = 1;

    // buffer
    while (sampleRate < this.sampleRate) {
      // AudioContextのサンプルレートに変更
      newSample = new Int16Array(sample.length * 2);
      for (i = j = 0, il = sample.length; i < il; ++i) {
        newSample[j++] = sample[i];
        newSample[j++] = sample[i];
      }
      sample = newSample;
      multiply *= 2;
      sampleRate *= 2;
    }

    return {
      sample,
      multiply,
    };
  }

  parseModulator(chunk: RiffChunk): GeneratorEntry[] {
    const data = this.input!;
    let ip = chunk.offset;
    const size = chunk.offset + chunk.size;
    const output: GeneratorEntry[] = [];

    while (ip < size) {
      // Src  Oper
      // TODO
      ip += 2;

      // Dest Oper
      const code = data[ip++] | (data[ip++] << 8);
      const key = this.GeneratorEnumeratorTable[code];
      if (!key) {
        // Amount
        output.push({
          type: key ?? 'unknown',
          value: {
            code,
            amount: data[ip] | (((data[ip + 1] << 8) << 16) >> 16),
            lo: data[ip++],
            hi: data[ip++],
          },
        });
      } else {
        // Amount
        switch (key) {
          case 'keyRange':
          /* FALLTHROUGH */
          case 'velRange':
          /* FALLTHROUGH */
          case 'keynum':
          /* FALLTHROUGH */
          case 'velocity':
            output.push({
              type: key,
              value: {
                amount: null,
                lo: data[ip++],
                hi: data[ip++],
              },
            });
            break;
          default:
            output.push({
              type: key,
              value: {
                amount: data[ip++] | (((data[ip++] << 8) << 16) >> 16),
              },
            });
            break;
        }
      }

      // AmtSrcOper
      // TODO
      ip += 2;

      // Trans Oper
      // TODO
      ip += 2;
    }

    return output;
  }

  parseGenerator(chunk: RiffChunk): GeneratorEntry[] {
    const data = this.input!;
    let ip = chunk.offset;
    const size = chunk.offset + chunk.size;
    const output: GeneratorEntry[] = [];

    while (ip < size) {
      const code = data[ip++] | (data[ip++] << 8);
      const key = this.GeneratorEnumeratorTable[code];
      if (!key) {
        output.push({
          type: key ?? 'unknown',
          value: {
            code,
            amount: data[ip] | (((data[ip + 1] << 8) << 16) >> 16),
            lo: data[ip++],
            hi: data[ip++],
          },
        });
        continue;
      }

      switch (key) {
        case 'keynum':
        /* FALLTHROUGH */
        case 'keyRange':
        /* FALLTHROUGH */
        case 'velRange':
        /* FALLTHROUGH */
        case 'velocity':
          output.push({
            type: key,
            value: {
              amount: null,
              lo: data[ip++],
              hi: data[ip++],
            },
          });
          break;
        default:
          output.push({
            type: key,
            value: {
              amount: data[ip++] | (((data[ip++] << 8) << 16) >> 16),
            },
          });
          break;
      }
    }

    return output;
  }

  createInstrument(): InstrumentDefinition[] {
    const instrument: InstrumentHeader[] = this.instrument;
    const zone: InstrumentZone[] = this.instrumentZone;
    const output: InstrumentDefinition[] = [];
    let bagIndex: number;
    let bagIndexEnd: number;
    let zoneInfo: ZoneInfo[];
    let instrumentGenerator: GeneratorBundle;
    let instrumentModulator: ModulatorBundle;
    let i: number;
    let il: number;
    let j: number;
    let jl: number;

    // instrument -> instrument bag -> generator / modulator
    for (i = 0, il = instrument.length; i < il; ++i) {
      bagIndex = instrument[i].instrumentBagIndex;
      bagIndexEnd = instrument[i + 1]
        ? instrument[i + 1].instrumentBagIndex
        : zone.length;
      zoneInfo = [];

      // instrument bag
      for (j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
        instrumentGenerator = this.createInstrumentGenerator_(zone, j);
        instrumentModulator = this.createInstrumentModulator_(zone, j);

        zoneInfo.push({
          generator: instrumentGenerator.generator,
          generatorSequence: instrumentGenerator.generatorInfo,
          modulator: instrumentModulator.modulator,
          modulatorSequence: instrumentModulator.modulatorInfo,
        });
      }

      output.push({
        name: instrument[i].instrumentName,
        info: zoneInfo,
      });
    }

    return output;
  }

  createPreset(): PresetDefinition[] {
    const preset: PresetHeader[] = this.presetHeader;
    const zone: PresetZone[] = this.presetZone;
    const output: PresetDefinition[] = [];
    let bagIndex: number;
    let bagIndexEnd: number;
    let zoneInfo: ZoneInfo[];
    let instrument: number | null = null;
    let presetGenerator: GeneratorBundle;
    let presetModulator: ModulatorBundle;
    let i: number;
    let il: number;
    let j: number;
    let jl: number;

    // preset -> preset bag -> generator / modulator
    for (i = 0, il = preset.length; i < il; ++i) {
      bagIndex = preset[i].presetBagIndex;
      bagIndexEnd = preset[i + 1] ? preset[i + 1].presetBagIndex : zone.length;
      zoneInfo = [];

      // preset bag
      for (j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
        presetGenerator = this.createPresetGenerator_(zone, j);
        presetModulator = this.createPresetModulator_(zone, j);

        zoneInfo.push({
          generator: presetGenerator.generator,
          generatorSequence: presetGenerator.generatorInfo,
          modulator: presetModulator.modulator,
          modulatorSequence: presetModulator.modulatorInfo,
        });

        const genInst = presetGenerator.generator.instrument;
        const modInst = presetModulator.modulator.instrument;

        instrument =
          resolveGeneratorAmount(genInst) ?? resolveGeneratorAmount(modInst);
      }

      output.push({
        name: preset[i].presetName,
        info: zoneInfo,
        header: preset[i],
        instrument,
      });
    }

    return output;
  }

  private createInstrumentGenerator_(
    zone: InstrumentZone[],
    index: number
  ): GeneratorBundle {
    const modgen = this.createBagModGen(
      zone,
      zone[index].instrumentGeneratorIndex,
      zone[index + 1]
        ? zone[index + 1].instrumentGeneratorIndex
        : this.instrumentZoneGenerator.length,
      this.instrumentZoneGenerator
    );

    return {
      generator: modgen.modgen,
      generatorInfo: modgen.modgenInfo,
    };
  }

  private createInstrumentModulator_(
    zone: InstrumentZone[],
    index: number
  ): ModulatorBundle {
    const modgen = this.createBagModGen(
      zone,
      zone[index].instrumentModulatorIndex,
      zone[index + 1]
        ? zone[index + 1].instrumentModulatorIndex
        : this.instrumentZoneModulator.length,
      this.instrumentZoneModulator
    );

    return {
      modulator: modgen.modgen,
      modulatorInfo: modgen.modgenInfo,
    };
  }

  private createPresetGenerator_(
    zone: PresetZone[],
    index: number
  ): GeneratorBundle {
    const modgen = this.createBagModGen(
      zone,
      zone[index].presetGeneratorIndex,
      zone[index + 1]
        ? zone[index + 1].presetGeneratorIndex
        : this.presetZoneGenerator.length,
      this.presetZoneGenerator
    );

    return {
      generator: modgen.modgen,
      generatorInfo: modgen.modgenInfo,
    };
  }

  private createPresetModulator_(
    zone: PresetZone[],
    index: number
  ): ModulatorBundle {
    const modgen = this.createBagModGen(
      zone,
      zone[index].presetModulatorIndex,
      zone[index + 1]
        ? zone[index + 1].presetModulatorIndex
        : this.presetZoneModulator.length,
      this.presetZoneModulator
    );

    return {
      modulator: modgen.modgen,
      modulatorInfo: modgen.modgenInfo,
    };
  }

  private createBagModGen(
    zone: InstrumentZone[] | PresetZone[],
    indexStart: number,
    indexEnd: number,
    zoneModGen: GeneratorEntry[]
  ): ModGenBundle {
    const modgenInfo: GeneratorEntry[] = [];
    const modgen: ModGen = {
      unknown: [],
      keyRange: {
        amount: null,
        hi: 127,
        lo: 0,
      },
    }; // TODO
    let info: GeneratorEntry;
    let i: number;
    let il: number;

    for (i = indexStart, il = indexEnd; i < il; ++i) {
      info = zoneModGen[i];
      modgenInfo.push(info);

      if (info.type === 'unknown') {
        modgen.unknown.push(info.value);
      } else {
        (
          modgen as Record<
            string,
            GeneratorValue | GeneratorValue[] | undefined
          >
        )[info.type] = info.value;
      }
    }

    return {
      modgen,
      modgenInfo,
    };
  }
}

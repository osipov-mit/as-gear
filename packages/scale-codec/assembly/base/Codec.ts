import { u8aToHex } from '../utils';

export interface Codec {
  encode(): Uint8Array;
  decode(value: Uint8Array): void;
  bytesLen: u32;
  toString(): string;
  toHex(): string;
}

export class CodecClass implements Codec {
  protected _bytes: Uint8Array | null;
  protected _bytesLen: u32;

  constructor() {
    this._bytes = null;
    this._bytesLen = 0;
  }

  get bytesLen(): u32 {
    return this._bytesLen;
  }

  get bytes(): Uint8Array {
    if (this._bytes) {
      return this._bytes as Uint8Array;
    }
    return new Uint8Array(0);
  }

  toHex(): string {
    if (!this._bytes) {
      this.encode();
    }
    return u8aToHex(this._bytes!);
  }

  encode(): Uint8Array {
    throw new Error('Method not implemented.');
  }

  decode(value: Uint8Array): void {
    throw new Error('Method not implemented.');
  }

  toString(): string {
    throw new Error('Method not implemented.');
  }
}

import { Codec, CodecClass } from './Codec';
import { CompactInt } from './numbers';

export class ScaleString extends CodecClass implements Codec {
  private _value: string;

  constructor(value: string = '') {
    super();
    this._value = value;
  }

  encode(): Uint8Array {
    const encodedStr = Uint8Array.wrap(String.UTF8.encode(this._value));
    const len = new CompactInt(encodedStr.length).encode();
    const encodedLen = encodedStr.length + len.length;
    const result = new Uint8Array(encodedLen);
    result.set(len);
    result.set(encodedStr, len.length);
    this._bytesLen = encodedLen;
    this._bytes = result;
    return result;
  }

  decode(value: Uint8Array): void {
    const len = CompactInt.decode(value);
    this._bytesLen = len.bytesLen + <i32>len.value;
    const encodedStr = value.slice(len.bytesLen, len.bytesLen + <i32>len.value);
    this._value = String.UTF8.decode(encodedStr.buffer);
  }

  get value(): string {
    return this._value;
  }

  static decode(value: Uint8Array): ScaleString {
    const str = new ScaleString();
    str.decode(value);
    return str;
  }

  static from(value: string): ScaleString {
    return new ScaleString(value);
  }

  toString(): string {
    return this.value.toString();
  }

  @inline
  @operator('==')
  eq(other: ScaleString): boolean {
    return this.value == other.value;
  }

  @inline
  @operator('!=')
  notEq(other: ScaleString): boolean {
    return this.value != other.value;
  }
}

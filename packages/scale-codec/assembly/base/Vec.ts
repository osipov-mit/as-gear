import { u8aToHex } from '../utils';
import { Codec } from './Codec';
import { CompactInt } from './numbers/Compact';

function getBufLen<T extends Codec>(array: Array<T>): u64 {
  let len = <u64>0;
  for (let i = <i32>0; i < array.length; i++) {
    len += array[i].bytesLen;
  }
  return len;
}

export class Vec<T extends Codec> extends Array<T> implements Codec {
  private _bytesLen: u32;
  protected _bytes: Uint8Array | null;

  constructor(len: i32 = 0) {
    super(len);
    this._bytesLen = 0;
    this._bytes = null;
  }

  encode(): Uint8Array {
    const bufLen = getBufLen<T>(this);
    const numOfItemsU8a = new CompactInt(this.length).encode();
    const result = new Uint8Array(<i32>bufLen + numOfItemsU8a.length);
    result.set(numOfItemsU8a);
    let offset = numOfItemsU8a.length;

    for (let i = <i32>0; i < this.length; i++) {
      const encoded = this[i].encode();
      result.set(encoded, offset);
      offset += <i32>encoded.length;
    }
    this._bytesLen = result.length;
    this._bytes = result;
    return result;
  }

  decode(value: Uint8Array): void {
    const len = CompactInt.decode(value);
    value = value.slice(len.bytesLen);
    let bytesLen = len.bytesLen;
    for (let i = <u64>0; i < len.value; i++) {
      const instance = instantiate<T>();
      instance.decode(value);
      this.push(instance);
      bytesLen += instance.bytesLen;
      value = value.slice(instance.bytesLen);
    }
    this._bytesLen = bytesLen;
  }

  get bytesLen(): u32 {
    return this._bytesLen;
  }

  static decode<T extends Codec>(value: Uint8Array): Vec<T> {
    const vec = new Vec<T>();
    vec.decode(value);
    return vec;
  }

  static from<T extends Codec>(array: Array<T>): Vec<T> {
    const vec = new Vec<T>(array.length);
    for (let i = 0; i < array.length; i++) {
      vec[i] = array[i];
    }

    return vec;
  }

  toHex(): string {
    if (!this._bytes) {
      this.encode();
    }
    return u8aToHex(this._bytes!);
  }

  toString(): string {
    return this.map<string>((v) => v.toString()).join(',');
  }

  @inline
  @operator('==')
  eq(other: Vec<T>): boolean {
    if (this.length != other.length) {
      return false;
    }
    for (let i = 0; i < this.length; i++) {
      if (this[i] != other[i]) {
        return false;
      }
    }
    return true;
  }

  @inline
  @operator('!=')
  notEq(other: Vec<T>): boolean {
    if (this.length != other.length) {
      return true;
    }

    for (let i = 0; i < this.length; i++) {
      if (this[i] != other[i]) {
        return true;
      }
    }
    return false;
  }
}

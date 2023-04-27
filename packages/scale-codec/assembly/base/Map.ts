import { u8aToHex } from '../utils';
import { Codec } from './Codec';
import { ScaleString } from './String';
import { CompactInt } from './numbers';

export class ScaleMap<V extends Codec> extends Map<string, V> implements Codec {
  private _bytesLen: u32;
  private _bytes: Uint8Array | null;

  constructor() {
    super();
    this._bytesLen = 0;
    this._bytes = null;
  }

  get bytesLen(): u32 {
    return this._bytesLen;
  }

  encode(): Uint8Array {
    const keys = this.keys();
    const len = new CompactInt(keys.length).encode();
    const keyValues = this.encodeKeyAndValues();
    const u8a = new Uint8Array(len.length + keyValues.length);

    u8a.set(len);
    u8a.set(keyValues, len.length);
    this._bytesLen = u8a.byteLength;
    this._bytes = u8a;
    return u8a;
  }

  private encodeKeyAndValues(): Uint8Array {
    const keys = this.keys();
    const temp = new Array<Uint8Array>();
    let len = 0;
    for (let i = 0; i < keys.length; i++) {
      const key = new ScaleString(keys[i]).encode();
      const value = this.get(keys[i]).encode();
      temp.push(key);
      temp.push(value);
      len += key.length;
      len += value.length;
    }
    const result = new Uint8Array(len);
    let offset = 0;
    for (let i = 0; i < temp.length; i++) {
      result.set(temp[i], offset);
      offset += temp[i].length;
    }

    return result;
  }

  decode(bytes: Uint8Array): void {
    this.clear();
    this._bytesLen = bytes.length;
    const mapLen = CompactInt.decode(bytes);
    let offset = <u32>mapLen.bytesLen;
    for (let i = 0; i < <i32>mapLen.value; i++) {
      const key = ScaleString.decode(bytes.slice(offset));
      offset += key.bytesLen;
      const value = instantiate<V>();
      value.decode(bytes.slice(offset));
      offset += value.bytesLen;
      this.set(key.value, value);
    }
  }

  static decode<V extends Codec>(bytes: Uint8Array): ScaleMap<V> {
    const map = new ScaleMap<V>();
    map.decode(bytes);
    return map;
  }

  toHex(): string {
    if (!this._bytes) {
      this.encode();
    }
    return u8aToHex(this._bytes!);
  }
}

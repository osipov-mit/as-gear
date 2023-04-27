import { Codec, CodecClass } from '../Codec';

function uintToU8a<T extends number>(value: T): Uint8Array {
  const len = <i32>sizeof<T>();
  const result = new Uint8Array(sizeof<T>());
  result.set([value]);
  for (let i = 1; i < len; i++) {
    result.set([value >> (<T>i * 8)], i);
  }
  return result;
}

function uintFromU8a<T extends number>(value: Uint8Array): T {
  let result: T = <T>value[0];
  for (let i = <i32>1; i < value.length; i++) {
    result = (result + ((<T>value[i]) << (<u8>i * 8))) as T;
  }
  return result as T;
}

export class CompactInt extends CodecClass implements Codec {
  private _value: u64;

  constructor(value: u64 = 0, bytesLen: u8 = 0) {
    super();
    this._value = value;
    this._bytesLen = bytesLen;
  }

  encode(): Uint8Array {
    let result: Uint8Array;
    if (this._value < 1 << 6) {
      result = uintToU8a<u8>(<u8>(this._value << 2));
    } else if (this._value < 1 << 14) {
      result = uintToU8a<u16>(<u16>((this._value << 2) + 0b01));
    } else if (this._value < 1 << 30) {
      result = uintToU8a<u32>(<u32>((this._value << 2) + 0b10));
    } else {
      const value = uintToU8a<u64>(this._value);
      let bytesLen = <u8>value.length;

      while (value[bytesLen - 1] == 0) {
        bytesLen--;
      }

      const u8aBytesLen = uintToU8a<u8>(((bytesLen - 4) << 2) + 0b11);
      result = new Uint8Array(bytesLen + u8aBytesLen.length);
      result.set(u8aBytesLen);
      result.set(value.slice(0, bytesLen), u8aBytesLen.length);
    }

    this._bytesLen = result.length;
    this._bytes = result;
    return result;
  }

  decode(value: Uint8Array): void {
    const mode = value[0] & 0b11;

    if (mode == 0b00) {
      this._value = u64(value[0]) >> 2;
      this._bytesLen = 1;
    } else if (mode == 0b01) {
      this._value = uintFromU8a<u64>(value.slice(0, 2)) >> 2;
      this._bytesLen = 2;
    } else if (mode == 0b10) {
      this._value = uintFromU8a<u64>(value.slice(0, 3)) >> 2;
      this._bytesLen = 4;
    } else {
      this._bytesLen = (value[0] >> 2) + 5;
      this._value = uintFromU8a<u64>(value.slice(1, this.bytesLen));
    }
  }

  static decode(value: Uint8Array): CompactInt {
    const result = new CompactInt();
    result.decode(value);
    return result;
  }

  static fromArray(value: Array<u8>): CompactInt {
    const u8a = new Uint8Array(value.length);
    for (let i = 0; i < value.length; i++) {
      u8a[i] = value[i];
    }
    const result = new CompactInt();
    result.decode(u8a);
    return result;
  }

  static from(value: number): CompactInt {
    const result = new CompactInt(u64(value));
    return result;
  }

  get value(): u64 {
    return this._value;
  }

  toString(): string {
    return this.value.toString();
  }

  @inline
  @operator('==')
  eq(other: CompactInt): bool {
    return this.value == other.value;
  }

  @inline
  @operator('!=')
  notEq(other: CompactInt): bool {
    return this.value != other.value;
  }
}

import { Codec, CodecClass } from 'as-scale-codec/assembly';

export class ActorId extends CodecClass implements Codec {
  private _value: Uint8Array;

  constructor(value: Uint8Array = new Uint8Array(32).fill(0)) {
    super();
    this._value = value;
    assert(this._value.length == 32, 'ActorId length must be 32 bytes');
    this._bytesLen = 32;
  }

  get value(): Uint8Array {
    return this._value;
  }

  encode(): Uint8Array {
    return this._value;
  }

  decode(value: Uint8Array): void {
    this._value = value.slice(0, 32);
    this._bytesLen = 32;
  }

  toString(): string {
    return this._value.toString();
  }

  @inline
  @operator('==')
  eq(other: ActorId): boolean {
    if (this._value.length != other.value.length) {
      return false;
    }
    return this._value.toString() == other.value.toString();
    // for (let i = 0; i < this._value.length; i++) {
    //   if (this._value[i] != other.value[i]) {
    //     return false;
    //   }
    // }
    // return true;
  }

  @inline
  @operator('!=')
  notEq(other: ActorId): boolean {
    if (this._value.length != other.value.length) {
      return true;
    }
    for (let i = 0; i < this._value.length; i++) {
      if (this._value[i] != other.value[i]) {
        return true;
      }
    }
    return false;
  }
}

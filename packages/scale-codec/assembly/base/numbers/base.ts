// import { i128, u128, u256 } from 'as-bignum/assembly';
import { encodeNumber, decodeNumber } from '../../utils';
import { Codec, CodecClass } from '../Codec';

export class BaseInt<T extends number> extends CodecClass implements Codec {
  protected _value: T;

  constructor(value: T = <T>0) {
    super();
    this._value = value;
    this._bytesLen = sizeof<T>();
  }

  @inline
  encode(): Uint8Array {
    this._bytes = encodeNumber(this._value);
    return this._bytes!;
  }

  @inline
  decode(value: Uint8Array): void {
    this._value = decodeNumber<T>(value);
  }

  get value(): T {
    return this._value;
  }

  toString(): string {
    return this.value.toString();
  }
}

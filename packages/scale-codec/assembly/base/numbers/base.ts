// import { i128, u128, u256 } from 'as-bignum/assembly';
import { encodeNumber, decodeNumber } from '../../utils';
import { Codec, CodecClass } from '../Codec';

export class BaseInt<T extends number> extends CodecClass implements Codec {
  private _value: T;

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

  @inline
  @operator('==')
  eq(other: BaseInt<T>): bool {
    return this.value == other.value;
  }

  @inline
  @operator('!=')
  notEq(other: BaseInt<T>): bool {
    return this.value != other.value;
  }

  @inline
  @operator('+')
  add(other: BaseInt<T>): BaseInt<T> {
    return new BaseInt<T>(<T>(this._value + other.value));
  }
}

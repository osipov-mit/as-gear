import { Codec, CodecClass } from './Codec';

export class Bool extends CodecClass implements Codec {
  private _value: boolean;

  constructor(value: boolean = false) {
    super();
    this._value = value;
    this._bytesLen = 1;
  }

  encode(): Uint8Array {
    const u8a = new Uint8Array(1);
    u8a.set(this._value ? [1] : [0]);
    this._bytes = u8a;
    return u8a;
  }

  decode(value: Uint8Array): void {
    this._value = value[0] === 1;
  }

  get value(): boolean {
    return this._value;
  }

  static decode(value: Uint8Array): Bool {
    const _value = value[0] === 1;
    return new Bool(_value);
  }

  static from(value: boolean): Bool {
    return new Bool(value);
  }

  toString(): string {
    return this.value.toString();
  }

  @inline
  @operator('==')
  eq(other: Bool): boolean {
    return this.value == other.value;
  }

  @inline
  @operator('!=')
  notEq(other: Bool): boolean {
    return this.value != other.value;
  }
}

import { Codec, CodecClass } from './Codec';

export class Option<T extends Codec> extends CodecClass implements Codec {
  private _value: T;
  private _isSome: boolean;

  constructor(value: T | null = null) {
    super();
    this._value = value || instantiate<T>();
    this._isSome = !!value;
  }

  encode(): Uint8Array {
    const encodedValue = this.isSome ? this._value.encode() : new Uint8Array(0);
    const u8a = new Uint8Array(encodedValue.byteLength + 1);
    this._bytesLen = u8a.length;
    if (this.isSome) {
      u8a.set([1]);
      u8a.set(encodedValue, 1);
    } else {
      u8a.set([0]);
    }
    this._bytes = u8a;
    return u8a;
  }

  decode(value: Uint8Array): void {
    this._isSome = value.at(0) == 1;
    this._value = instantiate<T>() as T;
    if (this.isSome) {
      this._value.decode(value.slice(1));
    }
    this._bytesLen = this.isNone ? 1 : this._value.bytesLen + 1;
    this._bytes = value.slice(0, this._bytesLen);
  }

  static decode<T extends Codec>(value: Uint8Array): Option<T> {
    const option = new Option<T>();
    option.decode(value);
    return option;
  }

  expect(msg: string): T {
    assert(this.isSome, msg);
    return this._value as T;
  }

  unwrap(): T {
    assert(this.isSome, 'Option: Unwrap None');
    return this._value as T;
  }

  get isSome(): boolean {
    return this._isSome;
  }

  get isNone(): boolean {
    return !this._isSome;
  }

  static Some<T extends Codec>(value: T): Option<T> {
    return new Option(value);
  }

  static None<T extends Codec>(): Option<T> {
    return new Option<T>(null);
  }

  toString(): string {
    if (this.isNone) {
      return 'None';
    }
    return `Some(${this.unwrap().toString()})`;
  }

  @inline
  @operator('==')
  eq(other: Option<T>): bool {
    if (!(this.isSome && other.isSome) && !(this.isNone && other.isNone)) {
      return false;
    }
    if (this.isNone) {
      return true;
    }

    return this.unwrap() == other.unwrap();
  }

  @inline
  @operator('!=')
  notEq(other: Option<T>): bool {
    if (!(this.isSome && other.isSome) && !(this.isNone && other.isNone)) {
      return true;
    }
    if (this.isNone) {
      return false;
    }

    return this.unwrap() != other.unwrap();
  }
}

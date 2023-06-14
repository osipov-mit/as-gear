import { Codec, CodecClass } from './Codec';
import { Option } from './Option';

export class Result<Ok extends Codec, Err extends Codec> extends CodecClass implements Codec {
  private _ok: Ok | null;
  private _err: Err | null;
  private _isOk: boolean;

  constructor(ok: Ok | null = null, err: Err | null = null) {
    assert(ok || err, 'Unable to instatiate Result type with no arguments');
    super();
    this._isOk = !!ok;
    this._ok = ok;
    this._err = err;
    this._bytesLen = 0;
    this._bytes = null;
  }

  encode(): Uint8Array {
    const encodedValue = this.isOk ? this._ok!.encode() : this._err!.encode();
    const buf = new Uint8Array(encodedValue.byteLength + 1);
    this._bytesLen = buf.length;
    buf.set([this.isOk ? 0 : 1]);
    buf.set(encodedValue, 1);
    this._bytes = buf;
    return buf;
  }

  decode(value: Uint8Array): void {
    this._isOk = value.at(0) == 0;
    if (this.isOk) {
      this._ok = instantiate<Ok>();
      this._ok!.decode(value.slice(1));
    } else {
      this._err = instantiate<Err>();
      this._err!.decode(value.slice(1));
    }
    this._bytesLen = (this.isOk ? this._ok!.bytesLen : this._err!.bytesLen) + 1;
  }

  static decode<Ok extends Codec, Err extends Codec>(value: Uint8Array): Result<Ok, Err> {
    const result = new Result<Ok, Err>();
    result.decode(value);
    return result;
  }

  expect(msg: string): Ok {
    assert(this.isOk, msg);
    return this._ok as Ok;
  }

  unwrap(): Ok {
    assert(this.isOk, 'Result: Unwrap Err');
    return this._ok as Ok;
  }

  get isOk(): boolean {
    return this._isOk;
  }

  get isErr(): boolean {
    return !this._isOk;
  }

  err(): Option<Err> {
    return new Option(this._err);
  }

  ok(): Option<Ok> {
    return new Option(this._ok);
  }

  static Ok<Ok extends Codec, Err extends Codec>(value: Ok): Result<Ok, Err> {
    return new Result<Ok, Err>(value);
  }

  static Err<Ok extends Codec, Err extends Codec>(value: Err): Result<Ok, Err> {
    return new Result<Ok, Err>(null, value);
  }

  toString(): string {
    if (this.isOk) {
      return `Ok(${this._ok!.toString()})`;
    }
    return `Err(${this._err!.toString()})`;
  }
}

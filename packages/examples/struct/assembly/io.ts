import { CodecClass, Option, Result, ScaleString, U8 } from 'as-scale-codec/assembly';

//@ts-ignore
@codec
//@ts-ignore
@struct
class MyStruct extends CodecClass {
  field1: Option<ScaleString>;
  field2: Option<Result<U8, ScaleString>>;

  constructor(f1: ScaleString | null = null, f2: Result<U8, ScaleString> | null = null) {
    super();
    this.field1 = f1 ? Option.Some<ScaleString>(f1) : Option.None<ScaleString>();
    this.field2 = f2 ? Option.Some<Result<U8, ScaleString>>(f2) : Option.None<Result<U8, ScaleString>>();
  }

  // encode(): Uint8Array {
  //   let bytesLen = 0;
  //   let offset = 0;

  //   const field1 = this.field1.encode();
  //   bytesLen += field1.byteLength;
  //   const field2 = this.field2.encode();
  //   bytesLen += field2.byteLength;
  //   //
  //   const bytes = new Uint8Array(bytesLen);

  //   bytes.set(field1, offset);
  //   offset += field1.byteLength;
  //   bytes.set(field2, offset);

  //   this._bytesLen = bytesLen;
  //   this._bytes = bytes;
  //   return bytes;
  // }

  static decode(value: Uint8Array): MyStruct {
    const result = new MyStruct();
    result.decode(value);
    return result;
  }
}

export { MyStruct };

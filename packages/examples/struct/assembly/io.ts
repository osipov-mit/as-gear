import { CodecClass, Option, Result, ScaleString, U32, U8 } from 'as-scale-codec/assembly';
import { InOut, MetadataRepr } from 'as-gear-std/assembly';

//@ts-ignore
@codec
//@ts-ignore
@struct
//@ts-ignore
@typeInfo
class MyStruct extends CodecClass {
  field1: ScaleString | null;
  field2: Result<U8, ScaleString> | null;

  constructor(f1: ScaleString | null = null, f2: Result<U8, ScaleString> | null = null) {
    super();
    this.field1 = f1;
    this.field2 = f2;
  }

  static decode(value: Uint8Array): MyStruct {
    const result = new MyStruct();
    result.decode(value);
    return result;
  }
}

export { MyStruct };

// @ts-ignore: decorator
@metadata
export class ProgramMetadata implements MetadataRepr {
  init: InOut<MyStruct, MyStruct>;
  handle: InOut<ScaleString, U8>;
  reply: InOut<null, null>;
  others: InOut<null, null>;
  signal: null;
  state: null;
}

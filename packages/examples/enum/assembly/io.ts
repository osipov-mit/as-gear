import { CodecClass, Option, Result, ScaleString, U32, U8, Vec } from 'as-scale-codec/assembly';
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

export enum Variants {
  Action1,
  Action2,
  Action3,
  Action4,
}

class MyEnumVariants {
  Action1: MyStruct | null;
  Action2: ScaleString | null;
  Action4: Result<Option<Vec<U8>>, U32> | null;
}

// @ts-ignore: decorator
@codec
// @ts-ignore: decorator
@scaleEnum
// @ts-ignore: decorator
@typeInfo
export class MyEnum extends CodecClass {
  variantIndex: Variants;
  variants: MyEnumVariants | null;

  constructor(v: Variants = 0, variants: MyEnumVariants | null = null) {
    super();
    this.variantIndex = v || 0;
    this.variants = variants;
  }

  match(v: Variants): boolean {
    return this.variantIndex == v;
  }

  static decode(value: Uint8Array): MyEnum {
    const result = new MyEnum();
    result.decode(value);
    return result;
  }

  static Action3(): MyEnum {
    return new MyEnum(Variants.Action3);
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

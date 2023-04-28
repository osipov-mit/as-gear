import { BaseInt } from './base';

export class I8 extends BaseInt<i8> {
  static from(value: i8): I8 {
    return new BaseInt<i8>(value) as I8;
  }

  static decode(value: Uint8Array): I8 {
    const result = new BaseInt<i8>() as I8;
    result.decode(value);
    return result;
  }
}

export class I16 extends BaseInt<i16> {
  static from(value: i16): I16 {
    return new BaseInt<i16>(value) as I16;
  }

  static decode(value: Uint8Array): I16 {
    const result = new BaseInt<i16>() as I16;
    result.decode(value);
    return result;
  }
}

export class I32 extends BaseInt<i32> {
  static from(value: i32): I32 {
    return new BaseInt<i32>(value) as I32;
  }

  static decode(value: Uint8Array): I32 {
    const result = new BaseInt<i32>() as I32;
    result.decode(value);
    return result;
  }
}

export class I64 extends BaseInt<i64> {
  static from(value: i64): I64 {
    return new BaseInt<i64>(value) as I64;
  }

  static decode(value: Uint8Array): I64 {
    const result = new BaseInt<i64>() as I64;
    result.decode(value);
    return result;
  }
}

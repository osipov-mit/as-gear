import { BaseInt } from './base';

export class I8 extends BaseInt<i8> {
  static from(value: i8): I8 {
    return new BaseInt<i8>(value) as I8;
  }
}

export class I16 extends BaseInt<i16> {
  static from(value: i16): I16 {
    return new BaseInt<i16>(value) as I16;
  }
}

export class I32 extends BaseInt<i32> {
  static from(value: i32): I32 {
    return new BaseInt<i32>(value) as I32;
  }
}

export class I64 extends BaseInt<i64> {
  static from(value: i64): I64 {
    return new BaseInt<i64>(value) as I64;
  }
}

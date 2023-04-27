import { BaseInt } from './base';

export class U8 extends BaseInt<u8> {
  static from(value: u8): U8 {
    return new BaseInt<u8>(value) as U8;
  }
}

export class U16 extends BaseInt<u16> {
  static from(value: u16): U16 {
    return new BaseInt<u16>(value) as U16;
  }
}

export class U32 extends BaseInt<u32> {
  static from(value: u32): U32 {
    return new BaseInt<u32>(value) as U32;
  }
}

export class U64 extends BaseInt<u64> {
  static from(value: u64): U64 {
    return new BaseInt<u64>(value) as U64;
  }
}

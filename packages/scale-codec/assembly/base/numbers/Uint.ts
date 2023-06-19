import { BaseInt } from './base';

export class U8 extends BaseInt<u8> {
  static from(value: u8): U8 {
    return new BaseInt<u8>(value) as U8;
  }

  static decode(value: Uint8Array): U8 {
    const result = new BaseInt<u8>() as U8;
    result.decode(value);
    return result;
  }
}

export class U16 extends BaseInt<u16> {
  static from(value: u16): U16 {
    return new BaseInt<u16>(value) as U16;
  }

  static decode(value: Uint8Array): U16 {
    const result = new BaseInt<u16>() as U16;
    result.decode(value);
    return result;
  }
}

export class U32 extends BaseInt<u32> {
  static from(value: u32): U32 {
    return new BaseInt<u32>(value) as U32;
  }

  static decode(value: Uint8Array): U32 {
    const result = new BaseInt<u32>() as U32;
    result.decode(value);
    return result;
  }
}

export class U64 extends BaseInt<u64> {
  static from(value: u64): U64 {
    return new BaseInt<u64>(value) as U64;
  }

  static decode(value: Uint8Array): U64 {
    const result = new BaseInt<u64>() as U64;
    result.decode(value);
    return result;
  }

  @inline
  @operator('==')
  eq(other: U64): bool {
    return this.value == other.value;
  }

  @inline
  @operator('!=')
  notEq(other: U64): bool {
    return this.value != other.value;
  }

  @inline
  @operator('+')
  add(other: U64): U64 {
    return new U64(super._value + other.value);
  }

  @inline
  @operator('-')
  sub(other: U64): U64 {
    return new U64(super._value - other.value);
  }

  @inline
  @operator('>')
  moreThan(other: U64): bool {
    return this.value > other.value;
  }

  @inline
  @operator('<')
  lessThan(other: U64): bool {
    return this.value > other.value;
  }
}

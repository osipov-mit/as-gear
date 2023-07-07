import { BaseInt } from '../base';

export class U32 extends BaseInt<u32> {
  static from(value: u32): U32 {
    return new BaseInt<u32>(value) as U32;
  }

  static decode(value: Uint8Array): U32 {
    const result = new BaseInt<u32>() as U32;
    result.decode(value);
    return result;
  }

  @inline
  @operator('==')
  eq(other: U32): bool {
    return this.value == other.value;
  }

  @inline
  @operator('!=')
  notEq(other: U32): bool {
    return this.value != other.value;
  }

  @inline
  @operator('+')
  add(other: U32): U32 {
    return new U32(super._value + other.value);
  }

  @inline
  @operator('-')
  sub(other: U32): U32 {
    return new U32(super._value - other.value);
  }

  @inline
  @operator('>')
  moreThan(other: U32): bool {
    return this.value > other.value;
  }

  @inline
  @operator('<')
  lessThan(other: U32): bool {
    return this.value > other.value;
  }
}

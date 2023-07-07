import { BaseInt } from '../base';

export class I32 extends BaseInt<i32> {
  static from(value: i32): I32 {
    return new BaseInt<i32>(value) as I32;
  }

  static decode(value: Uint8Array): I32 {
    const result = new BaseInt<i32>() as I32;
    result.decode(value);
    return result;
  }
  @inline
  @operator('==')
  eq(other: I32): bool {
    return this.value == other.value;
  }

  @inline
  @operator('!=')
  notEq(other: I32): bool {
    return this.value != other.value;
  }

  @inline
  @operator('+')
  add(other: I32): I32 {
    return new I32(super._value + other.value);
  }

  @inline
  @operator('-')
  sub(other: I32): I32 {
    return new I32(super._value - other.value);
  }

  @inline
  @operator('>')
  moreThan(other: I32): bool {
    return this.value > other.value;
  }

  @inline
  @operator('<')
  lessThan(other: I32): bool {
    return this.value > other.value;
  }
}

import { BaseInt } from '../base';

export class I64 extends BaseInt<i64> {
  static from(value: i64): I64 {
    return new BaseInt<i64>(value) as I64;
  }

  static decode(value: Uint8Array): I64 {
    const result = new BaseInt<i64>() as I64;
    result.decode(value);
    return result;
  }

  @inline
  @operator('==')
  eq(other: I64): bool {
    return this.value == other.value;
  }

  @inline
  @operator('!=')
  notEq(other: I64): bool {
    return this.value != other.value;
  }

  @inline
  @operator('+')
  add(other: I64): I64 {
    return new I64(super._value + other.value);
  }

  @inline
  @operator('-')
  sub(other: I64): I64 {
    return new I64(super._value - other.value);
  }

  @inline
  @operator('>')
  moreThan(other: I64): bool {
    return this.value > other.value;
  }

  @inline
  @operator('<')
  lessThan(other: I64): bool {
    return this.value > other.value;
  }
}

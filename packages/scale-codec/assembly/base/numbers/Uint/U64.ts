import { BaseInt } from '../base';

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

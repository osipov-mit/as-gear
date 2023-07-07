import { BaseInt } from '../base';

export class U8 extends BaseInt<u8> {
  static from(value: u8): U8 {
    return new BaseInt<u8>(value) as U8;
  }

  static decode(value: Uint8Array): U8 {
    const result = new BaseInt<u8>() as U8;
    result.decode(value);
    return result;
  }

  @inline
  @operator('==')
  eq(other: U8): bool {
    return this.value == other.value;
  }

  @inline
  @operator('!=')
  notEq(other: U8): bool {
    return this.value != other.value;
  }

  @inline
  @operator('+')
  add(other: U8): U8 {
    return new U8(super._value + other.value);
  }

  @inline
  @operator('-')
  sub(other: U8): U8 {
    return new U8(super._value - other.value);
  }

  @inline
  @operator('>')
  moreThan(other: U8): bool {
    return this.value > other.value;
  }

  @inline
  @operator('<')
  lessThan(other: U8): bool {
    return this.value > other.value;
  }
}

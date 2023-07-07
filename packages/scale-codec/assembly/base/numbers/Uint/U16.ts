import { BaseInt } from '../base';

export class U16 extends BaseInt<u16> {
  static from(value: u16): U16 {
    return new BaseInt<u16>(value) as U16;
  }

  static decode(value: Uint8Array): U16 {
    const result = new BaseInt<u16>() as U16;
    result.decode(value);
    return result;
  }

  @inline
  @operator('==')
  eq(other: U16): bool {
    return this.value == other.value;
  }

  @inline
  @operator('!=')
  notEq(other: U16): bool {
    return this.value != other.value;
  }

  @inline
  @operator('+')
  add(other: U16): U16 {
    return new U16(super._value + other.value);
  }

  @inline
  @operator('-')
  sub(other: U16): U16 {
    return new U16(super._value - other.value);
  }

  @inline
  @operator('>')
  moreThan(other: U16): bool {
    return this.value > other.value;
  }

  @inline
  @operator('<')
  lessThan(other: U16): bool {
    return this.value > other.value;
  }
}

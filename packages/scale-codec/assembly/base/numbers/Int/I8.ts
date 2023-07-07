import { BaseInt } from '../base';

export class I8 extends BaseInt<i8> {
  static from(value: i8): I8 {
    return new BaseInt<i8>(value) as I8;
  }

  static decode(value: Uint8Array): I8 {
    const result = new BaseInt<i8>() as I8;
    result.decode(value);
    return result;
  }

  @inline
  @operator('==')
  eq(other: I8): bool {
    return this.value == other.value;
  }

  @inline
  @operator('!=')
  notEq(other: I8): bool {
    return this.value != other.value;
  }

  @inline
  @operator('+')
  add(other: I8): I8 {
    return new I8(super._value + other.value);
  }

  @inline
  @operator('-')
  sub(other: I8): I8 {
    return new I8(super._value - other.value);
  }

  @inline
  @operator('>')
  moreThan(other: I8): bool {
    return this.value > other.value;
  }

  @inline
  @operator('<')
  lessThan(other: I8): bool {
    return this.value > other.value;
  }
}

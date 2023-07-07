import { BaseInt } from '../base';

export class I16 extends BaseInt<i16> {
  static from(value: i16): I16 {
    return new BaseInt<i16>(value) as I16;
  }

  static decode(value: Uint8Array): I16 {
    const result = new BaseInt<i16>() as I16;
    result.decode(value);
    return result;
  }

  @inline
  @operator('==')
  eq(other: I16): bool {
    return this.value == other.value;
  }

  @inline
  @operator('!=')
  notEq(other: I16): bool {
    return this.value != other.value;
  }

  @inline
  @operator('+')
  add(other: I16): I16 {
    return new I16(super._value + other.value);
  }

  @inline
  @operator('-')
  sub(other: I16): I16 {
    return new I16(super._value - other.value);
  }

  @inline
  @operator('>')
  moreThan(other: I16): bool {
    return this.value > other.value;
  }

  @inline
  @operator('<')
  lessThan(other: I16): bool {
    return this.value > other.value;
  }
}

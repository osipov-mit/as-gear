import { u128 } from 'as-bignum/assembly';

export function encodeNumber<T extends number>(value: T): Uint8Array {
  const size = <u8>sizeof<T>();
  const u8a = new Uint8Array(size);
  u8a.set([value & 0xff]);
  for (let i = <u8>1; i < size; i++) {
    u8a.set([value >> (i * 8)], i);
  }
  return u8a;
}

export function decodeNumber<T extends number>(value: Uint8Array): T {
  let result: T = value.slice(0, sizeof<T>()).reduce((acc, val, index) => {
    if (index === 0) {
      return <T>val;
    }
    return (acc + ((<T>val) << (<T>index * 8))) as T;
  }, <T>0) as T;
  return result;
}

export function u128ToPtr(v: u128): i32 {
  const buf = v.toUint8Array();
  return <i32>buf.dataStart;
}

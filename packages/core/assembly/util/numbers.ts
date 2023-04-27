import { u128 } from 'as-bignum/assembly';

export function u128ToPtr(v: u128): i32 {
  const buf = v.toUint8Array();
  return <i32>buf.dataStart;
}

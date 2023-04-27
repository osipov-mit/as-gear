//@ts-ignore: decorator
@inline
export function toPtr<T>(value: T, length?: usize, buf?: Uint8Array | ArrayBuffer): i32 {
  const _buf = buf ? (buf instanceof Uint8Array ? buf : Uint8Array.wrap(buf)) : new Uint8Array(length || sizeof<T>());
  store<T>(_buf.dataStart, value, 0);
  return <i32>_buf.dataStart;
}


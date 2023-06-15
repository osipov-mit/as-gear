import { gsys, Length } from '../sys';

export function debug(payload: string): void {
  const buf = String.UTF8.encode(payload);
  const ptr = changetype<i32>(buf);
  gsys.gr_debug(ptr, buf.byteLength);
}

//TODO: decode error
export function getError(length: Length): Uint8Array {
  const buf = new Uint8Array(length);
  gsys.gr_error(<i32>buf.dataStart, length);
  return buf;
}

export function panic(data: Uint8Array): void {
  gsys.gr_panic(<i32>data.dataStart, data.length);
}

export function oomPanic(data: Uint8Array): void {
  gsys.gr_oom_panic();
}

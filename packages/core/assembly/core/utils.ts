import { gr_debug, gr_error, gr_oom_panic, gr_panic, Length } from '../sys';

export function debug(payload: string): void {
  const buf = String.UTF8.encode(payload);
  const ptr = changetype<i32>(buf);
  gr_debug(ptr, buf.byteLength);
}

//TODO: decode error
export function getError(length: Length): Uint8Array {
  const buf = new Uint8Array(length);
  gr_error(<i32>buf.dataStart, length);
  return buf;
}

export function panic(data: Uint8Array): void {
  gr_panic(<i32>data.dataStart, data.length);
}

export function oomPanic(data: Uint8Array): void {
  gr_oom_panic();
}

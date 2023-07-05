import { gsys } from '../sys';

/** Add a `data` string to the debug log. */
export function debug(data: string): void {
  const buf = String.UTF8.encode(data);
  const ptr = changetype<i32>(buf);
  gsys.gr_debug(ptr, buf.byteLength);
}

/** Panic */
export function panic(data: Uint8Array): void {
  gsys.gr_panic(<i32>data.dataStart, data.length);
}

/** Out of memory panic */
export function oomPanic(): void {
  gsys.gr_oom_panic();
}

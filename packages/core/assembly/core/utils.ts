import { gsys } from '../sys';

export function debug(payload: string): void {
  const buf = String.UTF8.encode(payload);
  const ptr = changetype<i32>(buf);
  gsys.gr_debug(ptr, buf.byteLength);
}

export function panic(data: Uint8Array): void {
  gsys.gr_panic(<i32>data.dataStart, data.length);
}

export function oomPanic(): void {
  gsys.gr_oom_panic();
}

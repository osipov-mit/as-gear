import { panic } from '../core/utils';
import './tcms';
import './tlsf';

export function panicHandler(msg: string, file: string, line: i32, column: i32): void {
  const buf = Uint8Array.wrap(String.UTF8.encode(msg));
  panic(buf);
}

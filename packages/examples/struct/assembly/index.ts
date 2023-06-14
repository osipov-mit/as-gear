import { debug, read, reply, size } from 'as-gear-core/assembly';
import { MyStruct } from './io';
import { u8aToHex } from 'as-scale-codec/assembly';

let STATE = new MyStruct();

export function init(): void {
  let bytes = new Uint8Array(size());
  read(bytes);
  // let input = MyStruct.decode(bytes);

  STATE.decode(bytes);
  // if (STATE.field1) {
  // debug(STATE.field2.toString());
  // }

  reply(STATE.encode());
}

export function handle(): void {
  debug(`(handle) start...`);
  const bytes = new Uint8Array(size());
  read(bytes);
}

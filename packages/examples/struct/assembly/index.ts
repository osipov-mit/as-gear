import { msg } from 'as-gcore/assembly';
import { MyStruct } from './io';

let STATE = new MyStruct();

export function init(): void {
  let bytes = msg.read();
  let input = MyStruct.decode(bytes);
  STATE = input;
  msg.reply(STATE.encode());
}

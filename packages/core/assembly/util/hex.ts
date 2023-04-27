import { debug } from '../core';

const HEX_CHARS = '0123456789abcdef'.split('');

// const HEX_CHARS = memory.data<u8>([
//   0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37,
//   0x38, 0x39, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46
// ]);

//@ts-ignore: decorator
@inline
export function u8aToHex(value: Uint8Array): string {
  // const res = new StaticArray<string>()
  // for (let i of value) {

  // }
  const hexArray = new StaticArray<string>(value.length * 2).fill('0');
  debug(`array: ${hexArray.toString()}`);
  for (let i = 0; i < value.length; i++) {
    let v = value[i] & 0xff;
    hexArray[i * 2] = HEX_CHARS[v >> 4 & 0x0f];
    hexArray[i * 2 + 1] = HEX_CHARS[v & 0x0f];
  }
  return hexArray.join('');
}

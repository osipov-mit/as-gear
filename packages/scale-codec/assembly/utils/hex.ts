const HEX_CHARS: string = '0123456789abcdef';

export function u8aToHex(value: Uint8Array): string {
  const hex = new Array<string>(value.length * 2);
  for (let i = <i32>0; i < value.length; i++) {
    let v = value[i] & 0xff;
    hex[i * 2] = HEX_CHARS.at(v >> 4);
    hex[i * 2 + 1] = HEX_CHARS.at(v & 0x0f);
  }
  return hex.join('');
}

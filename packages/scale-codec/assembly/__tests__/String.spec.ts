import { ScaleString } from '../base';

describe('String', () => {
  test('Encode PING', () => {
    const str = new ScaleString('PING');
    const encoded = str.encode();
    expect(str.bytesLen).toBe(5);
    expect(encoded.toString()).toBe('16,80,73,78,71');
    expect(str.toHex()).toBe('1050494e47');
    expect(str.value).toBe('PING');
  });

  test('Decode PING', () => {
    const u8a = new Uint8Array(5);
    u8a.set([16, 80, 73, 78, 71]);
    const str = ScaleString.decode(u8a);
    expect(str.bytesLen).toBe(5);
    expect(str.value).toBe('PING');
  });
});

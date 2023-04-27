import { Bool, Option, Result, ScaleMap, ScaleString, U16, U8, Vec } from '../base';

describe('Vec', () => {
  test('Encode', () => {
    const vec = new Vec<U16>();
    vec.push(U16.from(4));
    vec.push(U16.from(8));
    vec.push(U16.from(15));
    vec.push(U16.from(16));
    vec.push(U16.from(23));
    vec.push(U16.from(42));
    const encoded = vec.encode();
    expect(vec.bytesLen).toBe(13);
    expect(encoded.toString()).toBe('24,4,0,8,0,15,0,16,0,23,0,42,0');
    expect(vec.toHex()).toBe('18040008000f00100017002a00');
    expect(vec).toHaveLength(6);
  });

  test('Decode', () => {
    const u8a = new Uint8Array(13);
    u8a.set([24, 4, 0, 8, 0, 15, 0, 16, 0, 23, 0, 42, 0]);
    const vec = Vec.decode<U16>(u8a);
    expect(vec.bytesLen).toBe(13);
    expect<u16[]>(vec.map<u16>((e) => e.value)).toStrictEqual([4, 8, 15, 16, 23, 42]);
  });

  test('From Array', () => {
    const arr: Array<U16> = [U16.from(4), U16.from(8), U16.from(15), U16.from(16), U16.from(23), U16.from(42)];
    const vec = Vec.from<U16>(arr);
    expect(vec).toHaveLength(6);
    expect(vec.toString()).toBe('4,8,15,16,23,42');
    expect(vec.toHex()).toBe('18040008000f00100017002a00');
  });

  test('', () => {
    const t = new Array<Uint8Array>();

    t.push(new Uint8Array(13));
    t.push(new Uint8Array(3));

    log(
      t.reduce((acc, val, index) => {
        return acc + val.length;
      }, 0),
    );
  });
});

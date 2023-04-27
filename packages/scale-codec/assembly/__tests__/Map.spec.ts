import { Option, ScaleMap, U8 } from '../base';

describe('Map', () => {
  test('Encode', () => {
    const map = new ScaleMap<Option<U8>>();
    map.set('one', Option.Some(U8.from(1)));
    map.set('two', Option.Some(U8.from(2)));
    map.set('three', Option.None<U8>());
    map.set('four', Option.Some(U8.from(4)));
    expect(map.toHex()).toBe('100c6f6e6501010c74776f01021474687265650010666f75720104');
    expect(map.bytesLen).toBe(27);
  });

  test('Decode', () => {
    const u8a = new Uint8Array(27);
    u8a.set([
      16, 12, 111, 110, 101, 1, 1, 12, 116, 119, 111, 1, 2, 20, 116, 104, 114, 101, 101, 0, 16, 102, 111, 117, 114, 1,
      4,
    ]);
    const map = ScaleMap.decode<Option<U8>>(u8a);
    expect(map.size).toBe(4);
    expect(map.bytesLen).toBe(27);
    expect<string[]>(map.values().map<string>((v) => v.toString())).toStrictEqual([
      'Some(1)',
      'Some(2)',
      'None',
      'Some(4)',
    ]);
    expect(map.keys()).toStrictEqual(['one', 'two', 'three', 'four']);
  });
});

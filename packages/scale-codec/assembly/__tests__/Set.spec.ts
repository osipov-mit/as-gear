// import { ScaleSet, U16, U32 } from '../base';

// describe('Set', () => {
//   test('Encode', () => {
//     const set = new ScaleSet<U32>();

//     set.add(U32.from(4));
//     set.add(U32.from(4));
//     set.add(U32.from(8));
//     set.add(U32.from(15));
//     set.add(U32.from(16));
//     set.add(U32.from(23));
//     set.add(U32.from(42));
//     set.add(U32.from(42));

//     const encoded = set.encode();
//     expect(set.bytesLen).toBe(25);
//     expect(encoded.toString()).toBe('24,4,0,8,0,15,0,16,0,23,0,42,0');
//     expect(set.toHex()).toBe('1804000000080000000f00000010000000170000002a000000');
//     expect(set.size).toBe(6);
//   });

//   test('Decode', () => {
//     const u8a = new Uint8Array(25);
//     u8a.set([24, 4, 0, 0, 0, 8, 0, 0, 0, 15, 0, 0, 0, 16, 0, 0, 0, 23, 0, 0, 0, 42, 0, 0, 0]);
//     const set = ScaleSet.decode<U16>(u8a);
//     expect(set.bytesLen).toBe(25);
//     expect(set.size).toBe(6);
//     expect<u16[]>(set.values().map<u16>((e) => e.value)).toStrictEqual([4, 8, 15, 16, 23, 42]);
//   });
// });

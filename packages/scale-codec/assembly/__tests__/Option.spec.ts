import { Option, ScaleString, U16, U64, U8 } from '../base';

describe('Option', () => {
  test('Encode Some', () => {
    const option = Option.Some<U16>(U16.from(16));
    const encoded = option.encode();
    expect(option.isSome).toBeTruthy();
    expect(encoded.toString()).toBe('1,16,0');
    expect(option.toHex()).toBe('011000');
    expect(option.bytesLen).toBe(3);
  });

  test('Encode None', () => {
    const option = Option.None<U16>();
    const encoded = option.encode();
    expect(option.isNone).toBeTruthy();
    expect(encoded.toString()).toBe('0');
    expect(option.toHex()).toBe('00');
    expect(option.bytesLen).toBe(1);
  });

  test('Decode Some', () => {
    const u8a = new Uint8Array(2);
    u8a.set([1, 42]);
    const opt = Option.decode<U8>(u8a);
    expect(opt.isSome).toBeTruthy();
    expect(opt.unwrap()).toStrictEqual(U8.from(42));
    expect(opt.bytesLen).toBe(2);
  });

  test('Decode None', () => {
    const u8a = new Uint8Array(1);
    u8a.set([0]);
    const opt = Option.decode<ScaleString>(u8a);
    expect(opt.isNone).toBeTruthy();
    expect(opt.bytesLen).toBe(1);
  });

  test('Equaluty', () => {
    expect(Option.Some<U64>(U64.from(64)) == Option.Some<U64>(U64.from(64))).toBeTruthy();
    expect(Option.None<U64>() == Option.None<U64>()).toBeTruthy();
    expect(Option.Some<U64>(U64.from(1)) == Option.None<U64>()).toBeFalsy();
  });

  test('Inequaluty', () => {
    expect(Option.Some<U64>(U64.from(64)) != Option.Some<U64>(U64.from(64))).toBeFalsy();
    expect(Option.None<U64>() != Option.None<U64>()).toBeFalsy();
    expect(Option.Some<U64>(U64.from(1)) != Option.None<U64>()).toBeTruthy();
  });
});

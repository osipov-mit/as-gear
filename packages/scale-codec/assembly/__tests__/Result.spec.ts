import { Bool, Result, ScaleString, U8 } from '../base';

describe('Result', () => {
  test('Encode Ok', () => {
    const result = Result.Ok<U8, ScaleString>(U8.from(42));
    const encoded = result.encode();
    expect(encoded.toString()).toBe('0,42');
    expect(result.toHex()).toBe('002a');
  });

  test('Encode Err', () => {
    const result = Result.Err<U8, Bool>(Bool.from(false));
    const encoded = result.encode();
    expect(encoded.toString()).toBe('1,0');
    expect(result.toHex()).toBe('0100');
  });

  test('Decode Ok', () => {
    const u8a = new Uint8Array(2);
    u8a.set([0, 42]);
    const result = Result.decode<U8, ScaleString>(u8a);
    expect(result.isOk).toBeTruthy();
    expect(result.unwrap()).toStrictEqual(U8.from(42));
    expect(result.bytesLen).toBe(2);
    expect(result.ok().isSome).toBeTruthy();
    expect(result.ok().unwrap().value).toBe(42);
  });

  test('Decode Err', () => {
    const u8a = new Uint8Array(2);
    u8a.set([1, 0]);
    const result = Result.decode<U8, Bool>(u8a);
    expect(result.isErr).toBeTruthy();
    expect(result.bytesLen).toBe(2);
    expect(result.err().isSome).toBeTruthy();
    expect(result.err().unwrap().value).toBe(false);
  });
});

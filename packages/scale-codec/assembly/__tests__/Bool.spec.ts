import { Bool } from '../base';

describe('Bool', () => {
  test('Encode true', () => {
    const bool = Bool.from(true);
    const encoded = bool.encode();
    expect(bool.value).toBe(true);
    expect(encoded.toString()).toBe('1');
    expect(bool.toHex()).toBe('01');
    expect(bool.bytesLen).toBe(1);
  });

  test('Encode false', () => {
    const bool = Bool.from(false);
    const encoded = bool.encode();
    expect(bool.value).toBe(false);
    expect(encoded.toString()).toBe('0');
    expect(bool.toHex()).toBe('00');
    expect(bool.bytesLen).toBe(1);
  });

  test('Decode false', () => {
    const u8a = new Uint8Array(1);
    u8a.set([0]);
    const bool = Bool.decode(u8a);
    expect(bool.value).toBe(false);
    expect(bool.bytesLen).toBe(1);
  });

  test('Decode false', () => {
    const u8a = new Uint8Array(1);
    u8a.set([1]);
    const bool = Bool.decode(u8a);
    expect(bool.value).toBe(true);
    expect(bool.bytesLen).toBe(1);
  });

  test('Equaluty', () => {
    const bool = Bool.from(true);

    expect(bool == Bool.from(true)).toBeTruthy();
  });

  test('Inequaluty', () => {
    const bool = Bool.from(true);

    expect(bool != Bool.from(false)).toBeTruthy();
  });
});

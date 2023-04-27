import { CompactInt } from '../base';

describe('Compact', () => {
  test('Encode 0', () => {
    const compact = new CompactInt(0);
    const encoded = compact.encode();
    expect(compact.bytesLen).toBe(1);
    expect(encoded.toString()).toBe('0');
    expect(compact.toHex()).toBe('00');
    expect(compact.value).toBe(0);
  });

  test('Encode 1', () => {
    const compact = new CompactInt(1);
    const encoded = compact.encode();
    expect(compact.bytesLen).toBe(1);
    expect(encoded.toString()).toBe('4');
    expect(compact.toHex()).toBe('04');
    expect(compact.value).toBe(1);
  });

  test('Encode 42', () => {
    const compact = new CompactInt(42);
    const encoded = compact.encode();
    expect(compact.bytesLen).toBe(1);
    expect(encoded.toString()).toBe('168');
    expect(compact.toHex()).toBe('a8');
    expect(compact.value).toBe(42);
  });

  test('Encode 69', () => {
    const compact = new CompactInt(69);
    const encoded = compact.encode();
    expect(compact.bytesLen).toBe(2);
    expect(encoded.toString()).toBe('21,1');
    expect(compact.toHex()).toBe('1501');
    expect(compact.value).toBe(69);
  });

  test('Encode 65535', () => {
    const compact = new CompactInt(65535);
    const encoded = compact.encode();
    expect(compact.bytesLen).toBe(4);
    expect(encoded.toString()).toBe('254,255,3,0');
    expect(compact.toHex()).toBe('feff0300');
    expect(compact.value).toBe(65535);
  });

  test('Encode 100000000000000', () => {
    const compact = new CompactInt(100000000000000);
    const encoded = compact.encode();
    expect(compact.toHex()).toBe('0b00407a10f35a');
    expect(compact.bytesLen).toBe(7);
    expect(encoded.toString()).toBe('11,0,64,122,16,243,90');
    expect(compact.value).toBe(100000000000000);
  });

  test('Decode 0', () => {
    const u8a = new Uint8Array(1);
    u8a.set([0]);
    const compact = CompactInt.decode(u8a);
    expect(compact.bytesLen).toBe(1);
    expect(compact.toHex()).toBe('00');
    expect(compact.value).toBe(0);
  });

  test('Decode 1', () => {
    const u8a = new Uint8Array(1);
    u8a.set([4]);
    const compact = CompactInt.decode(u8a);
    expect(compact.bytesLen).toBe(1);
    expect(compact.toHex()).toBe('04');
    expect(compact.value).toBe(1);
  });

  test('Decode 42', () => {
    const u8a = new Uint8Array(1);
    u8a.set([168]);
    const compact = CompactInt.decode(u8a);
    expect(compact.bytesLen).toBe(1);
    expect(compact.toHex()).toBe('a8');
    expect(compact.value).toBe(42);
  });

  test('Decode 69', () => {
    const u8a = new Uint8Array(2);
    u8a.set([21, 1]);
    const compact = CompactInt.decode(u8a);
    expect(compact.bytesLen).toBe(2);
    expect(compact.toHex()).toBe('1501');
    expect(compact.value).toBe(69);
  });

  test('Decode 65535', () => {
    const u8a = new Uint8Array(4);
    u8a.set([254, 255, 3, 0]);
    const compact = CompactInt.decode(u8a);
    expect(compact.bytesLen).toBe(4);
    expect(compact.toHex()).toBe('feff0300');
    expect(compact.value).toBe(65535);
  });

  test('Decode 100000000000000', () => {
    const u8a = new Uint8Array(7);
    u8a.set([11, 0, 64, 122, 16, 243, 90]);
    const compact = CompactInt.decode(u8a);
    expect(compact.bytesLen).toBe(7);
    expect(compact.value).toBe(100000000000000);
    expect(compact.toHex()).toBe('0b00407a10f35a');
  });

  test('Equaluty', () => {
    expect(CompactInt.from(10) == CompactInt.from(10)).toBeTruthy();
  });

  test('Inequaluty', () => {
    expect(CompactInt.from(10) != CompactInt.from(11)).toBeTruthy();
  });
});

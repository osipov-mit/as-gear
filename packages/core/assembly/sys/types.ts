import { decodeNumber, encodeNumber } from 'as-scale-codec/assembly';
import { u128 } from 'as-bignum/assembly';

/** Represents byte type */
export type Ptr<T> = i32;

/**  Represents block number type. */
export type BlockNumber = u32;

/// Represents block number type.
export type BlockTimestamp = u64;

/// Represents gas type.
export type Gas = u64;

/// Represents handle type.
export type Handle = u32;

/// Represents hash type.
export type Hash = Uint8Array;

/// Represents index type.
export type Index = u32;

/// Represents length type.
export type Length = u32;

/// Represents status code type.
export type StatusCode = i32;

/// Represents value type.
export type Value = u128;

const SIZE_OF_LENGTH = <u8>sizeof<Length>();
const SIZE_OF_HASH = <u8>0x20;
const SIZE_OF_STATUS_CODE = <u8>sizeof<StatusCode>();
const SIZE_OF_BN = <u8>sizeof<BlockNumber>();
const SIZE_OF_VALUE = <u8>0x10;
const SIZE_OF_HANDLE = <u8>sizeof<Handle>();
const SIZE_OF_GAS = <u8>sizeof<Gas>();

export class HashWithValue {
  buf: Uint8Array;
  ptr: i32;

  constructor(hash: Hash, value: Value) {
    this.buf = new Uint8Array(SIZE_OF_HASH + SIZE_OF_VALUE);
    this.buf.set(hash);
    this.buf.set(value.toUint8Array(), SIZE_OF_HASH);
    this.ptr = <i32>this.buf.dataStart;
  }

  get value(): Value {
    const valueBuf = this.buf.slice(SIZE_OF_HASH);
    return u128.fromUint8ArrayLE(valueBuf);
  }

  get hash(): Hash {
    return this.buf.slice(0, SIZE_OF_HASH);
  }

  @inline
  static default(): HashWithValue {
    return new HashWithValue(new Uint8Array(SIZE_OF_HASH).fill(0), u128.Zero);
  }
}

export class LengthWithTwoHashes {
  buf: Uint8Array;
  ptr: i32;

  constructor(length: Length, hash1: Hash, hash2: Hash) {
    this.buf = new Uint8Array(SIZE_OF_LENGTH + SIZE_OF_HASH * 2);
    this.buf.set(encodeNumber(length));
    this.buf.set(hash1, SIZE_OF_LENGTH);
    this.buf.set(hash2, SIZE_OF_HASH + SIZE_OF_LENGTH);
    this.ptr = <i32>this.buf.dataStart;
  }

  get length(): Length {
    const lengthBuf = this.buf.slice(0, SIZE_OF_LENGTH);
    return decodeNumber<Length>(lengthBuf);
  }

  get hash1(): Hash {
    return this.buf.slice(SIZE_OF_LENGTH, SIZE_OF_HASH);
  }

  get hash2(): Hash {
    return this.buf.slice(SIZE_OF_HASH + SIZE_OF_LENGTH);
  }

  @inline
  static default(): LengthWithTwoHashes {
    return new LengthWithTwoHashes(0, new Uint8Array(SIZE_OF_HASH).fill(0), new Uint8Array(SIZE_OF_HASH).fill(0));
  }
}

export class LengthWithCode {
  buf: Uint8Array;
  ptr: i32;

  constructor(length: Length, code: StatusCode) {
    this.buf = new Uint8Array(SIZE_OF_LENGTH + SIZE_OF_STATUS_CODE);
    this.buf.set(encodeNumber(length));
    this.buf.set(encodeNumber(code), SIZE_OF_LENGTH);
    this.ptr = <i32>this.buf.dataStart;
  }

  get length(): Length {
    const lengthBuf = this.buf.slice(0, SIZE_OF_LENGTH);
    return decodeNumber<Length>(lengthBuf);
  }

  get code(): StatusCode {
    const codeBuf = this.buf.slice(SIZE_OF_LENGTH);
    return decodeNumber<StatusCode>(codeBuf);
  }

  @inline
  static default(): LengthWithCode {
    return new LengthWithCode(0, 0);
  }
}

export class BlockNumberWithHash {
  buf: Uint8Array;
  ptr: i32;

  constructor(bn: BlockNumber, hash: Hash) {
    this.buf = new Uint8Array(SIZE_OF_BN + SIZE_OF_HASH);
    this.buf.set(encodeNumber(bn));
    this.buf.set(hash, SIZE_OF_BN);
    this.ptr = <i32>this.buf.dataStart;
  }

  get bn(): BlockNumber {
    const bnBuf = this.buf.slice(0, SIZE_OF_BN);
    return decodeNumber<BlockNumber>(bnBuf);
  }

  get hash(): Hash {
    return this.buf.slice(SIZE_OF_BN);
  }

  @inline
  static default(): BlockNumberWithHash {
    return new BlockNumberWithHash(0, new Uint8Array(SIZE_OF_HASH).fill(0));
  }
}

export class TwoHashesWithValue {
  buf: Uint8Array;
  ptr: i32;

  constructor(hash1: Hash, hash2: Hash, value: Value) {
    this.buf = new Uint8Array(SIZE_OF_HASH * 2 + SIZE_OF_VALUE);
    this.buf.set(hash1);
    this.buf.set(hash2, SIZE_OF_HASH);
    this.buf.set(value.toUint8Array(), SIZE_OF_HASH * 2);
    this.ptr = <i32>this.buf.dataStart;
  }

  get value(): Value {
    const valueBuf = this.buf.slice(SIZE_OF_HASH * 2);
    return u128.fromUint8ArrayLE(valueBuf);
  }

  get hash1(): Hash {
    return this.buf.slice(0, SIZE_OF_HASH);
  }

  get hash2(): Hash {
    return this.buf.slice(SIZE_OF_HASH, SIZE_OF_HASH);
  }

  @inline
  static default(): TwoHashesWithValue {
    return new TwoHashesWithValue(
      new Uint8Array(SIZE_OF_HASH).fill(0),
      new Uint8Array(SIZE_OF_HASH).fill(0),
      u128.Zero,
    );
  }
}

export class LengthWithHandle {
  buf: Uint8Array;
  ptr: i32;

  constructor(length: Length, handle: Handle) {
    this.buf = new Uint8Array(SIZE_OF_LENGTH + SIZE_OF_HANDLE);
    this.ptr = <i32>this.buf.dataStart;
    store<Length>(this.ptr, length, 0);
    store<Handle>(this.ptr, handle, SIZE_OF_LENGTH);
  }

  get length(): Length {
    return load<Length>(this.ptr, 0);
  }

  get handle(): Handle {
    return load<Handle>(this.ptr, SIZE_OF_LENGTH);
  }

  @inline
  static default(): LengthWithHandle {
    return new LengthWithHandle(0, 0);
  }
}

export class LengthWithGas {
  buf: Uint8Array;
  ptr: i32;

  constructor(length: Length, gas: Gas) {
    this.buf = new Uint8Array(SIZE_OF_LENGTH + SIZE_OF_GAS);
    this.ptr = <i32>this.buf.dataStart;
    store<Length>(this.ptr, length, 0);
    store<Gas>(this.ptr, gas, SIZE_OF_LENGTH);
  }

  get length(): Length {
    return load<Length>(this.ptr, 0);
  }

  get gas(): Gas {
    return load<Gas>(this.ptr, SIZE_OF_LENGTH);
  }

  @inline
  static default(): LengthWithGas {
    return new LengthWithGas(0, 0);
  }
}

export class LengthWithHash {
  buf: Uint8Array;
  ptr: i32;

  constructor(length: Length, hash: Hash) {
    this.buf = new Uint8Array(SIZE_OF_LENGTH + SIZE_OF_HASH);
    this.ptr = <i32>this.buf.dataStart;
    store<Length>(this.ptr, length, 0);
    store<Hash>(this.ptr, hash, SIZE_OF_LENGTH);
  }

  get length(): Length {
    return load<Length>(this.ptr, 0);
  }

  get hash(): Hash {
    return this.buf.slice(SIZE_OF_LENGTH);
  }

  static default(): LengthWithHash {
    return new LengthWithHash(0, new Uint8Array(SIZE_OF_HASH).fill(0));
  }
}

export class LengthWithBlockNumberAndValue {
  buf: Uint8Array;
  ptr: i32;

  constructor(length: Length, bn: BlockNumber, value: Value) {
    this.buf = new Uint8Array(SIZE_OF_LENGTH + SIZE_OF_BN + SIZE_OF_VALUE);
    this.ptr = <i32>this.buf.dataStart;
    store<Length>(this.ptr, length, 0);
    store<BlockNumber>(this.ptr, bn, SIZE_OF_LENGTH);
    store<u128>(this.ptr, value, SIZE_OF_LENGTH + SIZE_OF_BN);
  }

  get length(): Length {
    return load<Length>(this.ptr, 0);
  }

  get bn(): BlockNumber {
    return load<BlockNumber>(this.ptr, SIZE_OF_LENGTH);
  }

  get value(): Value {
    return load<u128>(this.ptr, SIZE_OF_LENGTH + SIZE_OF_BN);
  }
}

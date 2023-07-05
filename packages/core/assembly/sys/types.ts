import { decodeNumber, encodeNumber } from 'as-scale-codec/assembly';
import { u128 } from 'as-bignum/assembly';

export class U8a32 extends Uint8Array {
  constructor(length: i32) {
    assert(length == 32, `Invalid length. Length must be 32`)
    super(length)
  }

  static default(): U8a32 {
    return new U8a32(32).fill(0) as U8a32
  }
}

export class U8a4 extends Uint8Array {
  constructor(length: i32) {
    assert(length == 32, `Invalid length. Length must be 32`)
    super(length)
  }

  static default(): U8a4{
    return new U8a4(4).fill(0)
  }
}

/** Represents byte type */
export type Ptr<T> = i32;

/** Represents error code type. */
export type ErrorCode = u32;

/** Represents block number type. */
export type BlockNumber = u32;

/** Represents block number type. */
export type BlockTimestamp = u64;

/** Represents gas type. */
export type Gas = u64;

/** Represents handle type. */
export type Handle = u32;

/** Represents hash type. */
export type Hash = U8a32;

/** Represents index type. */
export type Index = u32;

/** Represents length type. */
export type Length = u32;

/** Represents reply code type. */
export type ReplyCode = U8a4;

/** Represents signal code type. */
export type SignalCode = u32;

/** Represents value type. */
export type Value = u128;

// @ts-ignore: decorator
@inline
const SIZE_OF_HASH = <u8>0x20;
// @ts-ignore: decorator
@inline
const SIZE_OF_BN = <u8>sizeof<BlockNumber>();
// @ts-ignore: decorator
@inline
const SIZE_OF_VALUE = <u8>0x10;
// @ts-ignore: decorator
@inline
const SIZE_OF_HANDLE = <u8>sizeof<Handle>();
// @ts-ignore: decorator
@inline
const SIZE_OF_GAS = <u8>sizeof<Gas>();
// @ts-ignore: decorator
@inline
const SIZE_OF_REPLY_CODE = <u8>0x04
// @ts-ignore: decorator
@inline
const SIZE_OF_ERROR_CODE = <u8>sizeof<ErrorCode>()
// @ts-ignore: decorator
@inline
const SIZE_OF_SIGNAL_CODE = <u8>sizeof<SignalCode>()

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
    return new BlockNumberWithHash(0, U8a32.default());
  }
}

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
    return new HashWithValue(U8a32.default(), u128.Zero);
  }
}

/**
 * Represents type defining concatenated reply code with error code. 8 bytes.
 */
export class ErrorWithReplyCode {
  buf: Uint8Array;
  ptr: i32;

  constructor(errorCode: ErrorCode, replyCode: ReplyCode) {
    this.buf = new Uint8Array(SIZE_OF_ERROR_CODE + SIZE_OF_REPLY_CODE);
    this.ptr = <i32>this.buf.dataStart;
    store<ErrorCode>(this.ptr, errorCode, 0);
    store<ReplyCode>(this.ptr, replyCode, SIZE_OF_ERROR_CODE);
  }

  get errorCode(): ErrorCode {
    return load<ErrorCode>(this.ptr, 0);
  }

  get replyCode(): ReplyCode {
    return load<ReplyCode>(this.ptr, SIZE_OF_ERROR_CODE);
  }

  @inline
  static default(): ErrorWithReplyCode {
    return new ErrorWithReplyCode(0, U8a4.default())
  }
}

export class ErrorWithSignalCode {
  buf: Uint8Array;
  ptr: i32;

  constructor(errorCode: ErrorCode, signalCode: SignalCode) {
    this.buf = new Uint8Array(SIZE_OF_ERROR_CODE + SIZE_OF_SIGNAL_CODE);
    this.ptr = <i32>this.buf.dataStart;
    store<ErrorCode>(this.ptr, errorCode, 0);
    store<SignalCode>(this.ptr, signalCode, SIZE_OF_SIGNAL_CODE);
  }

  get errorCode(): ErrorCode {
    return load<ErrorCode>(this.ptr, 0);
  }

  get signalCode(): SignalCode {
    return load<SignalCode>(this.ptr, SIZE_OF_ERROR_CODE);
  }

  @inline
  static default(): ErrorWithSignalCode {
    return new ErrorWithSignalCode(0, 0)
  }
}

/**
 * Represents type defining concatenated error code with gas. 12 bytes.
 */
export class ErrorWithGas {
  buf: Uint8Array;
  ptr: i32;

  constructor(errorCode: ErrorCode, gas: Gas) {
    this.buf = new Uint8Array(SIZE_OF_ERROR_CODE + SIZE_OF_GAS);
    this.ptr = <i32>this.buf.dataStart;
    store<ErrorCode>(this.ptr, errorCode, 0);
    store<Gas>(this.ptr, gas, SIZE_OF_ERROR_CODE);
  }

  get errorCode(): ErrorCode {
    return load<ErrorCode>(this.ptr, 0);
  }

  get gas(): Gas {
    return load<Gas>(this.ptr, SIZE_OF_ERROR_CODE);
  }

  @inline
  static default(): ErrorWithGas {
    return new ErrorWithGas(0, 0);
  }
}

export class ErrorWithHandle {
  buf: Uint8Array;
  ptr: i32;

  constructor(errorCode: ErrorCode, handle: Handle) {
    this.buf = new Uint8Array(SIZE_OF_ERROR_CODE + SIZE_OF_HANDLE);
    this.ptr = <i32>this.buf.dataStart;
    store<ErrorCode>(this.ptr, errorCode, 0);
    store<Handle>(this.ptr, handle, SIZE_OF_ERROR_CODE);
  }

  get errorCode(): ErrorCode {
    return load<ErrorCode>(this.ptr, 0);
  }

  get handle(): Handle {
    return load<Handle>(this.ptr, SIZE_OF_ERROR_CODE);
  }

  @inline
  static default(): ErrorWithHandle {
    return new ErrorWithHandle(0, 0);
  }
}


export class ErrorWithHash {
  buf: Uint8Array;
  ptr: i32;

  constructor(errorCode: ErrorCode, hash: Hash) {
    this.buf = new Uint8Array(SIZE_OF_ERROR_CODE + SIZE_OF_HASH);
    this.ptr = <i32>this.buf.dataStart;
    store<ErrorCode>(this.ptr, errorCode, 0);
    store<Hash>(this.ptr, hash, SIZE_OF_ERROR_CODE);
  }

  get errorCode(): ErrorCode {
    return load<ErrorCode>(this.ptr, 0);
  }

  get hash(): Hash {
    return this.buf.slice(SIZE_OF_ERROR_CODE) as U8a32;
  }

  static default(): ErrorWithHash {
    return new ErrorWithHash(0, U8a32.default());
  }
}

export class ErrorWithTwoHashes {
  buf: Uint8Array;
  ptr: i32;

  constructor(errorCode: ErrorCode, hash1: Hash, hash2: Hash) {
    this.buf = new Uint8Array(SIZE_OF_ERROR_CODE + SIZE_OF_HASH * 2);
    this.ptr = <i32>this.buf.dataStart;
    store<ErrorCode>(this.ptr, errorCode, 0)
    this.buf.set(hash1, SIZE_OF_ERROR_CODE);
    this.buf.set(hash2, SIZE_OF_HASH + SIZE_OF_ERROR_CODE);
    
  }

  get errorCode(): ErrorCode {
    return load<ErrorCode>(this.ptr, 0);
  }

  get hash1(): Hash {
    return this.buf.slice(SIZE_OF_ERROR_CODE, SIZE_OF_HASH);
  }

  get hash2(): Hash {
    return this.buf.slice(SIZE_OF_HASH + SIZE_OF_ERROR_CODE);
  }

  @inline
  static default(): ErrorWithTwoHashes {
    return new ErrorWithTwoHashes(0, U8a32.default(), U8a32.default());
  }
}

export class ErrorWithBlockNumberAndValue {
  buf: Uint8Array;
  ptr: i32;

  constructor(errorCode: ErrorCode, bn: BlockNumber, value: Value) {
    this.buf = new Uint8Array(SIZE_OF_ERROR_CODE + SIZE_OF_BN + SIZE_OF_VALUE);
    this.ptr = <i32>this.buf.dataStart;
    store<ErrorCode>(this.ptr, errorCode, 0);
    store<BlockNumber>(this.ptr, bn, SIZE_OF_ERROR_CODE);
    store<u128>(this.ptr, value, SIZE_OF_ERROR_CODE + SIZE_OF_BN);
  }

  get errorCode(): ErrorCode {
    return load<ErrorCode>(this.ptr, 0);
  }

  get bn(): BlockNumber {
    return load<BlockNumber>(this.ptr, SIZE_OF_ERROR_CODE);
  }

  get value(): Value {
    return load<u128>(this.ptr, SIZE_OF_ERROR_CODE + SIZE_OF_BN);
  }

  @inline
  static default(): ErrorWithBlockNumberAndValue {
    return new ErrorWithBlockNumberAndValue(0, 0, u128.Zero);
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
      U8a32.default(),
      U8a32.default(),
      u128.Zero,
    );
  }
}

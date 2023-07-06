import { Codec } from 'as-scale-codec/assembly';

// @ts-ignore: decorator
@typeInfo
// @ts-ignore: decorator
@FixedSizeArray(u8, 32)
export class ActorId extends Uint8Array implements Codec {
  bytesLen: i32;

  constructor(value: Uint8Array = new Uint8Array(32).fill(0)) {
    assert(value.length == 32, 'ActorId: Length must be 32 bytes');
    super(32);
    this.set(value);
    this.bytesLen = 32;
  }

  toHex(): string {
    throw new Error('Method not implemented.');
  }

  encode(): Uint8Array {
    return this;
  }

  decode(value: Uint8Array): void {
    this.set(value.slice(0, 32));
  }

  @inline
  @operator('==')
  eq(other: ActorId): boolean {
    if (this.length != other.length) {
      return false;
    }
    for (let i = 0; i < this.length; i++) {
      if (this[i] != other[i]) {
        return false;
      }
    }
    return true;
  }

  @inline
  @operator('!=')
  notEq(other: ActorId): boolean {
    if (this.length != other.length) {
      return true;
    }
    for (let i = 0; i < this.length; i++) {
      if (this[i] != other[i]) {
        return true;
      }
    }
    return false;
  }
}

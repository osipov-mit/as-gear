import { u8aToHex } from 'as-scale-codec/assembly';
import { Codec, CodecClass } from 'as-scale-codec/assembly/base/Codec';

export class ActorId extends CodecClass implements Codec {
  private _value: Uint8Array;

  constructor(value: Uint8Array = new Uint8Array(32)) {
    if (value) {
      assert(value.length == 32, 'ActorId: Invalid length');
    }
    super();
    this._value = value;
  }

  get value(): Uint8Array {
    return this._value;
  }

  set value(value: Uint8Array) {
    assert(value.length == 32, 'ActorId: Invalid length');
    this._value = value;
  }

  static default(): ActorId {
    return new ActorId(new Uint8Array(32).fill(0));
  }

  toHex(): string {
    return u8aToHex(this.value);
  }

  toString(): string {
    return this._value.toString();
  }
}

export type MessageId = Uint8Array;

export type CodeId = Uint8Array;

export type ReservationId = Uint8Array;

export class MessageAndActorIds {
  messageId: MessageId;
  actorId: ActorId;

  constructor(m: MessageId, a: Uint8Array) {
    this.messageId = m;
    this.actorId = new ActorId(a);
  }
}

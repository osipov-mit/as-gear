export class ActorId extends Uint8Array {
  constructor(value: Uint8Array = new Uint8Array(32).fill(0)) {
    super(32);
    if (value) {
      assert(value.length == 32, 'ActorId: Invalid length');
      this.set(value);
    }
  }

  static default(): ActorId {
    return new ActorId(new Uint8Array(32).fill(0));
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

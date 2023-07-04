export class ActorId extends Uint8Array {
  constructor(value: Uint8Array) {
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

export class MessageId extends Uint8Array {
  constructor(value: Uint8Array) {
    super(32);
    if (value) {
      assert(value.length == 32, 'MessageId: Invalid length');
      this.set(value);
    }
  }

  static default(): ActorId {
    return new ActorId(new Uint8Array(32).fill(0));
  }
}

export class CodeId extends Uint8Array {
  constructor(value: Uint8Array) {
    super(32);
    if (value) {
      assert(value.length == 32, 'CodeId: Invalid length');
      this.set(value);
    }
  }

  static default(): ActorId {
    return new ActorId(new Uint8Array(32).fill(0));
  }
}

export class ReservationId extends Uint8Array {
  constructor(value: Uint8Array) {
    super(32);
    if (value) {
      assert(value.length == 32, 'ReservationId: Invalid length');
      this.set(value);
    }
  }

  static default(): ActorId {
    return new ActorId(new Uint8Array(32).fill(0));
  }
}

export class MessageAndActorIds {
  messageId: MessageId;
  actorId: ActorId;

  constructor(m: Uint8Array, a: Uint8Array) {
    this.messageId = new MessageId(m);
    this.actorId = new ActorId(a);
  }
}

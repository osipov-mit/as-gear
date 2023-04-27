export type ActorId = Uint8Array;

export type MessageId = Uint8Array;

export type CodeId = Uint8Array;

export type ReservationId = Uint8Array;
export class MessageAndActorIds {
  messageId: MessageId;
  actorId: ActorId;

  constructor(m: MessageId, a: ActorId) {
    this.messageId = m;
    this.actorId = a;
  }
}

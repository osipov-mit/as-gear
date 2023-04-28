import { u128 } from 'as-bignum/assembly';
import { ActorId, debug, read, send, size } from 'as-gear-core/assembly';
import { I32, Option, ScaleString, Vec } from 'as-scale-codec/assembly';

class State {
  private _sendTo: Option<ActorId>;

  constructor() {
    this._sendTo = Option.None<ActorId>();
  }

  set sendTo(value: Option<ActorId>) {
    this._sendTo = value;
  }

  get sendTo(): Option<ActorId> {
    return this._sendTo;
  }
}

// @ts-ignore: decorator
@global
const STATE = new State();

// @ts-ignore: decorator
@global
const MESSAGE_LOG = new Vec<ScaleString>();

export function init(): void {
  let bytes = new Uint8Array(size());
  read(bytes);

  const actor = new ActorId(bytes);

  STATE.sendTo = Option.Some<ActorId>(actor);
  debug(`(init) sentTo.isSome: ${STATE.sendTo.isSome}`);
}

export function handle(): void {
  const bytes = new Uint8Array(size());
  read(bytes);

  const new_msg = I32.decode(bytes);

  MESSAGE_LOG.push(ScaleString.from(`(sum) New msg: ${new_msg}`));

  const sum = new_msg.add(new_msg);

  debug(`(handle) sentTo.isSome: ${STATE.sendTo.isSome}`);

  if (STATE.sendTo.isSome) {
    send(STATE.sendTo.unwrap(), sum.encode(), u128.from(0));
  }

  debug(`${MESSAGE_LOG.length} total message stored:`);

  for (let i = 0; i < MESSAGE_LOG.length; i++) {
    debug(MESSAGE_LOG[i].value);
  }
}

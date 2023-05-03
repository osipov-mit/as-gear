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

let STATE = new State();

let MESSAGE_LOG = new Vec<ScaleString>();

export function init(): void {
  let bytes = new Uint8Array(size());
  read(bytes);

  const actor = new ActorId(bytes);

  STATE.sendTo = Option.Some<ActorId>(actor);
  debug(`(init) sentTo.isSome: ${STATE.sendTo.isSome}`);
}

export function handle(): void {
  debug(`(handle) start...`);
  const bytes = new Uint8Array(size());
  read(bytes);

  debug(`(handle) bytes: ${bytes}`);

  const new_msg = I32.decode(bytes);

  debug(`(handle) new_msg: ${new_msg}`);

  MESSAGE_LOG.push(ScaleString.from(`(sum) New msg: ${new_msg}`));

  debug(`(handle) messages length: ${MESSAGE_LOG.length}`);

  const sum = new_msg.add(new_msg);

  new Uint8Array(16).fill(0);
  debug(`(handle) sum: ${sum}`);

  debug(`(handle) sentTo.isSome: ${STATE.sendTo.isSome}`);

  if (STATE.sendTo.isSome) {
    debug(`(handle) send msg`);
    send(STATE.sendTo.unwrap(), sum.encode(), u128.Zero);
    debug('(handle) msg sent');
  }

  debug(`(handle) ${MESSAGE_LOG.length} total message stored:`);

  for (let i = 0; i < MESSAGE_LOG.length; i++) {
    debug(`(handle) ${MESSAGE_LOG[i]}`);
  }
}

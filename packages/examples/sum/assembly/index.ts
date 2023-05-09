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

let STATE = new Array<State>(1);
let MESSAGE_LOG = new Array<Vec<ScaleString>>(1);

const globStatePtr = STATE.dataStart;
const globMessageLogPtr = MESSAGE_LOG.dataStart;

store<Array<State>>(globStatePtr, STATE);
store<Array<Vec<ScaleString>>>(globMessageLogPtr, MESSAGE_LOG);

export function init(): void {
  let bytes = new Uint8Array(size());
  read(bytes);

  debug(`(init) globStatePtr: ${globStatePtr}`);
  debug(`(init) globMessageLogPtr: ${globMessageLogPtr}`);

  STATE[0] = new State();
  MESSAGE_LOG[0] = new Vec<ScaleString>();

  const actor = new ActorId(bytes);

  STATE[0].sendTo = Option.Some<ActorId>(actor);
  debug(`(init) sentTo.isSome: ${STATE[0].sendTo.isSome}`);
}

export function handle(): void {
  debug(`(handle) globStatePtr: ${globStatePtr}`);
  debug(`(handle) globMessageLogPtr: ${globMessageLogPtr}`);
  STATE = load<Array<State>>(globStatePtr);
  MESSAGE_LOG = load<Array<Vec<ScaleString>>>(globMessageLogPtr);

  const bytes = new Uint8Array(size());
  read(bytes);

  debug(`(handle) sentTo.isSome: ${STATE[0].sendTo.isSome}`);

  debug(`(handle) bytes: ${bytes}`);

  const new_msg = I32.decode(bytes);

  debug(`(handle) new_msg: ${new_msg}`);

  MESSAGE_LOG[0].push(ScaleString.from(`(sum) New msg: ${new_msg}`));

  debug(`(handle) messages length: ${MESSAGE_LOG[0].length}`);

  const sum = new_msg.add(new_msg);

  debug(`(handle) sum: ${sum}`);

  if (STATE[0].sendTo.isSome) {
    debug(`(handle) send msg`);
    send(STATE[0].sendTo.unwrap(), sum.encode(), u128.Zero);
    debug('(handle) msg sent');
  }

  debug(`(handle) total message stored: ${MESSAGE_LOG[0].length} `);
  store<Array<State>>(globStatePtr, STATE);
  store<Array<Vec<ScaleString>>>(globMessageLogPtr, MESSAGE_LOG);
  // for (let i = 0; i < MESSAGE_LOG[0].length; i++) {
  //   debug(`(handle) ${MESSAGE_LOG[0][i]}`);
  // }
}

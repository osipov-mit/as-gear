import { u128 } from 'as-bignum/assembly';

import {
  LengthWithHash,
  gr_reply,
  Hash,
  gr_size,
  gr_read,
  gr_source,
  gr_value,
  gr_message_id,
  LengthWithCode,
  gr_status_code,
  HashWithValue,
  gr_reservation_reply,
  gr_reply_wgas,
  gr_reply_commit,
  gr_reply_commit_wgas,
  gr_reservation_reply_commit,
  gr_signal_from,
  gr_reply_to,
  gr_reply_push,
  Length,
  gr_reply_input,
  gr_reply_push_input,
  gr_reply_input_wgas,
  gr_send_input,
  TwoHashesWithValue,
  gr_reservation_send,
  gr_send_push_input,
  Handle,
  gr_send_input_wgas,
  gr_reservation_send_commit,
  gr_send,
  gr_send_wgas,
  gr_send_commit,
  gr_send_commit_wgas,
  LengthWithHandle,
  gr_send_init,
  gr_send_push,
} from '../sys';
import { u128ToPtr } from '../util';
import { getError, panic } from './utils';
import { ActorId } from './types';

export function status_code(): i32 {
  const res: LengthWithCode = LengthWithCode.default();
  gr_status_code(res.ptr);

  if (res.length != 0) {
    panic(getError(res.length));
  }

  return res.code;
}

export function id(): Uint8Array {
  let buf = new Uint8Array(32).fill(0);
  gr_message_id(<i32>buf.dataStart);
  return buf;
}

export function read(buf: Uint8Array): void {
  const _size = size();

  if (_size > <u32>buf.length) {
    return; // TODO: return error
  }

  const len = <u32>0;
  const lenBuf = new Uint8Array(sizeof<u32>());
  store<u32>(lenBuf.dataStart, len, 0);

  if (_size > <u32>0) {
    return gr_read(0, _size, <i32>buf.dataStart, <u32>lenBuf.dataStart);
  }

  if (len > 0) {
    panic(getError(len));
  }
}

export function reply(payload: Uint8Array, value: u128 = u128.Zero): Hash | null {
  return replyDelayed(payload, value, 0);
}

export function replyDelayed(payload: Uint8Array, value: u128, delay: u32): Hash | null {
  const res: LengthWithHash = LengthWithHash.default();

  let valuePtr = u128ToPtr(value);

  gr_reply(<i32>payload.dataStart, payload.length, valuePtr, delay, res.ptr);

  if (res.length) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function replyBytes(payload: Uint8Array, value: u128 = u128.Zero): Hash | null {
  const valuePtr = u128ToPtr(value);
  const res = LengthWithHash.default();
  gr_reply(<i32>payload.dataStart, payload.length, valuePtr, 0, res.ptr);

  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }
  return res.hash;
}

export function replyFromReservation(id: Hash, payload: Uint8Array, value: u128): Hash | null {
  return replyDelayedFromReservation(id, payload, value, 0);
}

export function replyDelayedFromReservation(id: Hash, payload: Uint8Array, value: u128, delay: u32): Hash | null {
  const ridValue = new HashWithValue(id, value);

  const res: LengthWithHash = LengthWithHash.default();

  gr_reservation_reply(ridValue.ptr, <i32>payload.dataStart, payload.length, delay, res.ptr);

  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function replyWithGas(payload: Uint8Array, gasLimit: u64, value: u128): Hash | null {
  return replyWithGasDelayed(payload, gasLimit, value, 0);
}

export function replyWithGasDelayed(payload: Uint8Array, gasLimit: u64, value: u128, delay: u32): Hash | null {
  const res: LengthWithHash = LengthWithHash.default();

  const valuePtr = u128ToPtr(value);

  gr_reply_wgas(<i32>payload.dataStart, payload.length, gasLimit, valuePtr, delay, res.ptr);

  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function replyCommit(value: u128): Hash | null {
  return replyCommitDelayed(value, 0);
}

export function replyCommitDelayed(value: u128, delay: u32): Hash | null {
  const res: LengthWithHash = LengthWithHash.default();

  const valuePtr = u128ToPtr(value);

  gr_reply_commit(valuePtr, delay, res.ptr);

  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function replyCommitWithGas(gas_limit: u64, value: u128): Hash | null {
  return replyCommitWithGasDelayed(gas_limit, value, 0);
}

export function replyCommitWithGasDelayed(gas_limit: u64, value: u128, delay: u32): Hash | null {
  const res: LengthWithHash = LengthWithHash.default();

  const valuePtr = u128ToPtr(value);

  gr_reply_commit_wgas(gas_limit, valuePtr, delay, res.ptr);

  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function replyCommitFromReservation(id: Hash, value: u128): Hash | null {
  return replyCommitDelayedFromReservation(id, value, 0);
}

export function replyCommitDelayedFromReservation(id: Hash, value: u128, delay: u32): Hash | null {
  const ridValue = new HashWithValue(id, value);

  const res: LengthWithHash = LengthWithHash.default();

  gr_reservation_reply_commit(ridValue.ptr, delay, res.ptr);

  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function replyPush(payload: Uint8Array): void | null {
  const bufErr = new Uint8Array(sizeof<Length>());
  store<Length>(bufErr.dataStart, 0);

  gr_reply_push(<i32>payload.dataStart, payload.length, <i32>bufErr.dataStart);

  const length = load<u32>(bufErr.dataStart);

  if (length != 0) {
    panic(getError(length));
    return null;
  }
}

export function replyTo(): Hash | null {
  const res: LengthWithHash = LengthWithHash.default();

  gr_reply_to(res.ptr);
  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function signalFrom(): Hash | null {
  const res: LengthWithHash = LengthWithHash.default();

  gr_signal_from(res.ptr);

  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function replyInput(value: u128, offset: u32, len: u32): Hash | null {
  return replyInputDelayed(value, offset, len, 0);
}

export function replyInputDelayed(value: u128, offset: u32, len: u32, delay: u32): Hash | null {
  const res: LengthWithHash = LengthWithHash.default();

  const valuePtr = u128ToPtr(value);

  gr_reply_input(offset, len, valuePtr, delay, res.ptr);

  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function replyPushInput(offset: u32, len: u32): void | null {
  const bufErr = new Uint8Array(sizeof<Length>());
  store<Length>(bufErr.dataStart, 0);

  gr_reply_push_input(offset, len, <i32>bufErr.dataStart);

  const length = load<u32>(bufErr.dataStart);

  if (length != 0) {
    panic(getError(length));
    return null;
  }
}

export function replyInputWithGas(gas_limit: u64, value: u128, offset: u32, len: u32): Hash | null {
  return replyInputWithGasDelayed(gas_limit, value, offset, len, 0);
}

export function replyInputWithGasDelayed(gas_limit: u64, value: u128, offset: u32, len: u32, delay: u32): Hash | null {
  const res: LengthWithHash = LengthWithHash.default();

  const valuePtr = u128ToPtr(value);

  gr_reply_input_wgas(offset, len, gas_limit, valuePtr, delay, res.ptr);

  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function sendInput(destination: ActorId, value: u128, offset: u32, len: u32): Hash | null {
  return sendInputDelayed(destination, value, offset, len, 0);
}

export function sendInputDelayed(destination: ActorId, value: u128, offset: u32, len: u32, delay: u32): Hash | null {
  const pidValue = new HashWithValue(destination, value);

  const res: LengthWithHash = LengthWithHash.default();

  gr_send_input(pidValue.ptr, offset, len, delay, res.ptr);

  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function send(destination: ActorId, payload: Uint8Array, value: u128): Hash | null {
  return sendDelayed(destination, payload, value, 0);
}

export function sendFromReservation(
  reservation_id: Hash,
  destination: ActorId,
  payload: Uint8Array,
  value: u128,
): Hash | null {
  return sendDelayedFromReservation(reservation_id, destination, payload, value, 0);
}

export function sendDelayedFromReservation(
  reservation_id: Hash,
  destination: ActorId,
  payload: Uint8Array,
  value: u128,
  delay: u32,
): Hash | null {
  let ridPidValue = new TwoHashesWithValue(reservation_id, destination, value);

  const res: LengthWithHash = LengthWithHash.default();

  gr_reservation_send(ridPidValue.ptr, <i32>payload.dataStart, payload.length, delay, res.ptr);
  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function sendPushInput(handle: Handle, offset: u32, len: u32): void | null {
  const bufErr = new Uint8Array(sizeof<Length>());
  store<Length>(bufErr.dataStart, 0);
  gr_send_push_input(handle, offset, len, bufErr.dataStart);
  const length = load<u32>(bufErr.dataStart);

  if (length != 0) {
    panic(getError(length));
    return null;
  }
}

export function sendInputWithGas(
  destination: ActorId,
  gas_limit: u64,
  value: u128,
  offset: u32,
  len: u32,
): Hash | null {
  return sendInputWithGasDelayed(destination, gas_limit, value, offset, len, 0);
}

export function sendInputWithGasDelayed(
  destination: ActorId,
  gas_limit: u64,
  value: u128,
  offset: u32,
  len: u32,
  delay: u32,
): Hash | null {
  const pidValue = new HashWithValue(destination, value);

  const res: LengthWithHash = LengthWithHash.default();

  gr_send_input_wgas(pidValue.ptr, offset, len, gas_limit, delay, res.ptr);
  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function sendCommitFromReservation(
  reservation_id: Hash,
  handle: Handle,
  destination: ActorId,
  value: u128,
): Hash | null {
  return sendCommitDelayedFromReservation(reservation_id, handle, destination, value, 0);
}

export function sendCommitDelayedFromReservation(
  reservation_id: Hash,
  handle: Handle,
  destination: ActorId,
  value: u128,
  delay: u32,
): Hash | null {
  let ridPidValue = new TwoHashesWithValue(reservation_id, destination, value);

  const res: LengthWithHash = LengthWithHash.default();

  gr_reservation_send_commit(handle, ridPidValue.ptr, delay, res.ptr);
  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function sendDelayed(destination: ActorId, payload: Uint8Array, value: u128, delay: u32): Hash | null {
  const pidValue = new HashWithValue(destination, value);

  const res: LengthWithHash = LengthWithHash.default();

  gr_send(pidValue.ptr, <i32>payload.dataStart, payload.length, delay, res.ptr);
  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function sendWithGas(destination: ActorId, payload: Uint8Array, gas_limit: u64, value: u128): Hash | null {
  return sendWithGasDelayed(destination, payload, gas_limit, value, 0);
}

export function sendWithGasDelayed(
  destination: ActorId,
  payload: Uint8Array,
  gas_limit: u64,
  value: u128,
  delay: u32,
): Hash | null {
  const pidValue = new HashWithValue(destination, value);

  const res: LengthWithHash = LengthWithHash.default();

  gr_send_wgas(pidValue.ptr, <i32>payload.dataStart, payload.length, gas_limit, delay, res.ptr);
  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function sendCommit(handle: Handle, destination: ActorId, value: u128): Hash | null {
  return sendCommitDelayed(handle, destination, value, 0);
}

export function sendCommitDelayed(handle: Handle, destination: ActorId, value: u128, delay: u32): Hash | null {
  const pidValue = new HashWithValue(destination, value);
  const res: LengthWithHash = LengthWithHash.default();

  gr_send_commit(handle, pidValue.ptr, delay, res.ptr);
  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function sendCommitWithGas(handle: Handle, destination: ActorId, gas_limit: u64, value: u128): Hash | null {
  return sendCommitWithGasDelayed(handle, destination, gas_limit, value, 0);
}

export function sendCommitWithGasDelayed(
  handle: Handle,
  destination: ActorId,
  gas_limit: u64,
  value: u128,
  delay: u32,
): Hash | null {
  const pidValue = new HashWithValue(destination, value);

  const res: LengthWithHash = LengthWithHash.default();

  gr_send_commit_wgas(handle, pidValue.ptr, gas_limit, delay, res.ptr);
  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function sendInit(): Handle | null {
  const res: LengthWithHandle = LengthWithHandle.default();
  gr_send_init(res.ptr);

  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.handle;
}

export function sendPush(handle: Handle, payload: Uint8Array): void | null {
  const bufErr = new Uint8Array(sizeof<Length>());
  store<Length>(bufErr.dataStart, 0);

  gr_send_push(handle, <i32>payload.dataStart, payload.length, bufErr.dataStart);
  const length = load<u32>(bufErr.dataStart);

  if (length != 0) {
    panic(getError(length));
    return null;
  }
}

export function size(): u32 {
  const buf = new Uint8Array(sizeof<u32>());
  const ptr = buf.dataStart;
  store<u32>(ptr, 0);
  gr_size(<i32>ptr);
  return load<u32>(ptr);
}

export function source(): ActorId {
  const source = new Uint8Array(32);
  gr_source(<i32>source.dataStart);
  return source;
}

export function value(): u128 {
  const buf = new Uint8Array(sizeof<u128>()).fill(0);
  gr_value(<i32>buf.dataStart);
  return u128.fromUint8ArrayLE(buf);
}

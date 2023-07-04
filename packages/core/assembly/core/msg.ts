import { u128 } from 'as-bignum/assembly';

import {
  Hash,
  HashWithValue,
  TwoHashesWithValue,
  Handle,
  gsys,
  ReplyCode,
  ErrorWithReplyCode,
  SignalCode,
  ErrorWithSignalCode,
  ErrorCode,
  ErrorWithHash,
  ErrorWithHandle,
} from '../sys';
import { u128ToPtr } from '../util';
import { ActorId, MessageId, ReservationId } from './types';
import { SyscallError } from './errors';

/** Get the reply code of the message being processed.
 *
 * _This function is used in the reply handler to check whether the message was processed successfully or not._
 */
export function replyCode(): ReplyCode {
  const res = ErrorWithReplyCode.default();
  gsys.gr_reply_code(res.ptr);

  new SyscallError(res.errorCode).assert();

  return res.replyCode;
}

/** Get the signal code.
 *
 */
export function signalCode(): SignalCode {
  const res = ErrorWithSignalCode.default();
  gsys.gr_reply_code(res.ptr);

  new SyscallError(res.errorCode).assert();

  return res.signalCode;
}

/** Get an identifier of the message that is currently being processed.
 *
 * _One can get an identifier for the currently processing message; each send and reply function also returns a message identifier._
 */
export function id(): MessageId {
  let buf = MessageId.default();
  gsys.gr_message_id(<i32>buf.dataStart);
  return buf;
}

/** Get a payload of the message that is currently being processed.
 *
 * @returns
 */
export function read(): Uint8Array {
  const _size = size();
  let result = new Uint8Array(_size);

  const errorCodeU8a = new Uint8Array(sizeof<ErrorCode>());

  if (_size > <u32>0) {
    gsys.gr_read(0, _size, <i32>result.dataStart, <u32>errorCodeU8a.dataStart);
    const errorCode = load<u32>(errorCodeU8a.dataStart);
    new SyscallError(errorCode).assert();
  }

  return result;
}

// TODO: readAt function

/** Send a new message as a reply to the message that is currently being processed. */
export function reply(payload: Uint8Array, value: u128 = u128.Zero): MessageId {
  const res = ErrorWithHash.default();

  let valuePtr = u128ToPtr(value);

  gsys.gr_reply(<i32>payload.dataStart, payload.length, valuePtr, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Same as `reply`, but it spends gas from a reservation instead of borrowing it from the gas limit provided with the incoming message. */
export function replyFromReservation(id: ReservationId, payload: Uint8Array, value: u128): MessageId {
  const ridValue = new HashWithValue(id, value);

  const res = ErrorWithHash.default();

  gsys.gr_reservation_reply(ridValue.ptr, <i32>payload.dataStart, payload.length, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Same as `reply`, but with an explicit gas limit. */
export function replyWithGas(payload: Uint8Array, gasLimit: u64, value: u128): MessageId {
  const res = ErrorWithHash.default();

  const valuePtr = u128ToPtr(value);

  gsys.gr_reply_wgas(<i32>payload.dataStart, payload.length, gasLimit, valuePtr, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Finalize and send the current reply message. */
export function replyCommit(value: u128): MessageId {
  const res = ErrorWithHash.default();

  const valuePtr = u128ToPtr(value);

  gsys.gr_reply_commit(valuePtr, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Same as `reply_commit`, but with an explicit gas limit. */
export function replyCommitWithGas(gas_limit: u64, value: u128): MessageId {
  const res = ErrorWithHash.default();

  const valuePtr = u128ToPtr(value);

  gsys.gr_reply_commit_wgas(gas_limit, valuePtr, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Same as `reply_commit`, but it spends gas from a reservation instead of borrowing it from the gas limit provided with the incoming message. */
export function replyCommitFromReservation(id: Hash, value: u128): MessageId {
  const ridValue = new HashWithValue(id, value);

  const res = ErrorWithHash.default();

  gsys.gr_reservation_reply_commit(ridValue.ptr, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Push a payload part to the current reply message. */
export function replyPush(payload: Uint8Array): void {
  const errorCodeU8a = new Uint8Array(sizeof<ErrorCode>());

  gsys.gr_reply_push(<i32>payload.dataStart, payload.length, <i32>errorCodeU8a.dataStart);

  const errorCode = load<u32>(errorCodeU8a.dataStart);
  new SyscallError(errorCode).assert();
}

/** Get an identifier of the initial message on which the current `handle_reply` function is called. */
export function replyTo(): MessageId {
  const res = ErrorWithHash.default();

  gsys.gr_reply_to(res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Get an identifier of the message which issued a signal. */
export function signalFrom(): MessageId {
  const res = ErrorWithHash.default();

  gsys.gr_signal_from(res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Same as `reply`, but relays the incoming message payload. */
export function replyInput(value: u128, offset: u32, len: u32): MessageId {
  const res = ErrorWithHash.default();

  const valuePtr = u128ToPtr(value);

  gsys.gr_reply_input(offset, len, valuePtr, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Same as `reply_push` but uses the input buffer as a payload source. */
export function replyPushInput(offset: u32, len: u32): void {
  const errorCodeU8a = new Uint8Array(sizeof<ErrorCode>());

  gsys.gr_reply_push_input(offset, len, <i32>errorCodeU8a.dataStart);

  const errorCode = load<u32>(errorCodeU8a.dataStart);
  new SyscallError(errorCode).assert();
}

/** Same as `reply_input`, but with explicit gas limit. */
export function replyInputWithGas(gas_limit: u64, value: u128, offset: u32, len: u32): MessageId {
  const res = ErrorWithHash.default();

  const valuePtr = u128ToPtr(value);

  gsys.gr_reply_input_wgas(offset, len, gas_limit, valuePtr, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Same as `send` but uses the input buffer as a payload source. */
export function sendInput(destination: ActorId, value: u128, offset: u32, len: u32): MessageId {
  return sendInputDelayed(destination, value, offset, len, 0);
}

/** Same as `send_input`, but sends delayed. */
export function sendInputDelayed(destination: ActorId, value: u128, offset: u32, len: u32, delay: u32): MessageId {
  const pidValue = new HashWithValue(destination, value);

  const res = ErrorWithHash.default();

  gsys.gr_send_input(pidValue.ptr, offset, len, delay, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Send a new message to the program or user. */
export function send(destination: ActorId, payload: Uint8Array, value: u128): MessageId {
  return sendDelayed(destination, payload, value, 0);
}

/** Same as `send`, but it spends gas from a reservation instead of borrowing it from the gas limit provided with the incoming message.*/
export function sendFromReservation(
  reservation_id: Hash,
  destination: ActorId,
  payload: Uint8Array,
  value: u128,
): MessageId {
  return sendDelayedFromReservation(reservation_id, destination, payload, value, 0);
}

/** Same as `send_from_reservation`, but sends the message after the`delay` expressed in block count. */
export function sendDelayedFromReservation(
  reservation_id: Hash,
  destination: ActorId,
  payload: Uint8Array,
  value: u128,
  delay: u32,
): MessageId {
  let ridPidValue = new TwoHashesWithValue(reservation_id, destination, value);

  const res = ErrorWithHash.default();

  gsys.gr_reservation_send(ridPidValue.ptr, <i32>payload.dataStart, payload.length, delay, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Same as `send_push` but uses the input buffer as a payload source. */
export function sendPushInput(handle: Handle, offset: u32, len: u32): void {
  const errorCodeU8a = new Uint8Array(sizeof<ErrorCode>());

  gsys.gr_send_push_input(handle, offset, len, errorCodeU8a.dataStart);

  const errorCode = load<u32>(errorCodeU8a.dataStart);
  new SyscallError(errorCode).assert();
}

/** Same as `send_input`, but with explicit gas limit. */
export function sendInputWithGas(destination: ActorId, gas_limit: u64, value: u128, offset: u32, len: u32): MessageId {
  return sendInputWithGasDelayed(destination, gas_limit, value, offset, len, 0);
}

/** Same as `send_input_with_gas`, but sends delayed. */
export function sendInputWithGasDelayed(
  destination: ActorId,
  gas_limit: u64,
  value: u128,
  offset: u32,
  len: u32,
  delay: u32,
): MessageId {
  const pidValue = new HashWithValue(destination, value);

  const res = ErrorWithHash.default();

  gsys.gr_send_input_wgas(pidValue.ptr, offset, len, gas_limit, delay, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Same as `send_commit`, but it spends gas from a reservation instead of borrowing it from the gas limit provided with the incoming message. */
export function sendCommitFromReservation(
  reservation_id: Hash,
  handle: Handle,
  destination: ActorId,
  value: u128,
): MessageId {
  return sendCommitDelayedFromReservation(reservation_id, handle, destination, value, 0);
}

/** Same as `send_commit_from_reservation`, but sends the message after the `delay` expressed in block count.*/
export function sendCommitDelayedFromReservation(
  reservation_id: Hash,
  handle: Handle,
  destination: ActorId,
  value: u128,
  delay: u32,
): MessageId {
  let ridPidValue = new TwoHashesWithValue(reservation_id, destination, value);

  const res = ErrorWithHash.default();

  gsys.gr_reservation_send_commit(handle, ridPidValue.ptr, delay, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Same as `send`, but sends the message after the `delay` expressed in block count.*/
export function sendDelayed(destination: ActorId, payload: Uint8Array, value: u128, delay: u32): MessageId {
  const pidValue = new HashWithValue(destination, value);

  const res = ErrorWithHash.default();

  gsys.gr_send(pidValue.ptr, <i32>payload.dataStart, payload.length, delay, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Same as `send`, but with an explicit gas limit. */
export function sendWithGas(destination: ActorId, payload: Uint8Array, gas_limit: u64, value: u128): MessageId {
  return sendWithGasDelayed(destination, payload, gas_limit, value, 0);
}

/** Same as `send_with_gas`, but sends the message after the `delay` expressed in block count. */
export function sendWithGasDelayed(
  destination: ActorId,
  payload: Uint8Array,
  gas_limit: u64,
  value: u128,
  delay: u32,
): MessageId {
  const pidValue = new HashWithValue(destination, value);

  const res = ErrorWithHash.default();

  gsys.gr_send_wgas(pidValue.ptr, <i32>payload.dataStart, payload.length, gas_limit, delay, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Finalize and send the message formed in parts */
export function sendCommit(handle: Handle, destination: ActorId, value: u128): MessageId {
  return sendCommitDelayed(handle, destination, value, 0);
}

/** Same as `send_commit`, but sends the message after the `delay` expressed in block count. */
export function sendCommitDelayed(handle: Handle, destination: ActorId, value: u128, delay: u32): MessageId {
  const pidValue = new HashWithValue(destination, value);
  const res = ErrorWithHash.default();

  gsys.gr_send_commit(handle, pidValue.ptr, delay, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Same as `send_commit`, but with an explicit gas limit. */
export function sendCommitWithGas(handle: Handle, destination: ActorId, gas_limit: u64, value: u128): Hash | null {
  return sendCommitWithGasDelayed(handle, destination, gas_limit, value, 0);
}

/** Same as `send_commit_with_gas`, but sends the message after the `delay` expressed in block count. */
export function sendCommitWithGasDelayed(
  handle: Handle,
  destination: ActorId,
  gas_limit: u64,
  value: u128,
  delay: u32,
): Hash | null {
  const pidValue = new HashWithValue(destination, value);

  const res = ErrorWithHash.default();

  gsys.gr_send_commit_wgas(handle, pidValue.ptr, gas_limit, delay, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new MessageId(res.hash);
}

/** Initialize a message to send formed in parts. */
export function sendInit(): Handle {
  const res = ErrorWithHandle.default();

  gsys.gr_send_init(res.ptr);

  new SyscallError(res.errorCode).assert();

  return res.handle;
}

/** Push a payload part of the message to be sent in parts. */
export function sendPush(handle: Handle, payload: Uint8Array): void {
  const errorCodeU8a = new Uint8Array(sizeof<ErrorCode>());

  gsys.gr_send_push(handle, <i32>payload.dataStart, payload.length, errorCodeU8a.dataStart);

  const errorCode = load<u32>(errorCodeU8a.dataStart);
  new SyscallError(errorCode).assert();
}

/** Get the payload size of the message that is being processed. */
export function size(): u32 {
  const buf = new Uint8Array(sizeof<u32>());
  const ptr = buf.dataStart;
  store<u32>(ptr, 0);
  gsys.gr_size(<i32>ptr);
  return load<u32>(ptr);
}

/**  Get the identifier of the message source (256-bit address). */
export function source(): ActorId {
  const source = ActorId.default();
  gsys.gr_source(<i32>source.dataStart);
  return source;
}

/** Get the value associated with the message that is being processed. */
export function value(): u128 {
  const buf = new Uint8Array(sizeof<u128>()).fill(0);
  gsys.gr_value(<i32>buf.dataStart);
  return u128.fromUint8ArrayLE(buf);
}

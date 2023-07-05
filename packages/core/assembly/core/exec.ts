import { u128 } from 'as-bignum/assembly';

import {
  BlockNumberWithHash,
  Hash,
  ErrorWithGas,
  ErrorWithHash,
  gsys,
  ErrorCode,
  HashWithValue,
  ErrorWithBlockNumberAndValue,
} from '../sys';
import { u128ToPtr } from '../util';
import { ActorId, MessageId, ReservationId, ValueWithBlockNumber } from './types';
import { SyscallError } from './errors';

export function blockHeight(): u32 {
  const bn = new Uint8Array(sizeof<u32>()).fill(0);

  gsys.gr_block_height(<i32>bn.dataStart);

  return load<u32>(bn.dataStart);
}

export function blockTimestamp(): u64 {
  const timestamp = new Uint8Array(sizeof<u64>()).fill(0);
  gsys.gr_block_timestamp(<i32>timestamp.dataStart);
  return load<u64>(timestamp.dataStart);
}

export function replyDeposit(messageId: MessageId, amount: u64): void {
  const errorCodeU8a = new Uint8Array(sizeof<ErrorCode>());

  gsys.gr_reply_deposit(messageId.dataStart, amount, errorCodeU8a.dataStart);

  const errorCode = load<u32>(errorCodeU8a.dataStart);

  new SyscallError(errorCode).assert();
}

export function exit(inheritor_id: ActorId): void {
  gsys.gr_exit(<i32>inheritor_id.dataStart);
}

export function reserveGas(amount: u64, duration: u32): ReservationId {
  const res = ErrorWithHash.default();

  gsys.gr_reserve_gas(amount, duration, res.ptr);

  new SyscallError(res.errorCode).assert();

  return res.hash;
}

export function systemReserveGas(amount: u64): void {
  const errorCodeU8a = new Uint8Array(sizeof<ErrorCode>());

  gsys.gr_system_reserve_gas(amount, <i32>errorCodeU8a.dataStart);

  const errorCode = load<u32>(errorCodeU8a.dataStart);

  new SyscallError(errorCode).assert();
}

export function unreserveGas(id: ReservationId): u64 {
  const res = ErrorWithGas.default();

  gsys.gr_unreserve_gas(<i32>id.dataStart, res.ptr);

  new SyscallError(res.errorCode).assert();

  return res.gas;
}

export function gasAvailable(): u64 {
  const gas = new Uint8Array(sizeof<u64>()).fill(0);
  gsys.gr_gas_available(<i32>gas.dataStart);
  return load<u64>(gas.dataStart);
}

export function leave(): void {
  gsys.gr_leave();
}

export function valueAvailable(): u128 {
  const value = u128.Zero;
  const ptr = u128ToPtr(value);
  gsys.gr_value_available(ptr);
  const buf = load<Uint8Array>(ptr, 0, 4);

  return u128.fromUint8ArrayLE(buf);
}

export function wait(): void {
  gsys.gr_wait();
}

export function waitFor(duration: u32): void {
  gsys.gr_wait_for(duration);
}

export function waitUpTo(duration: u32): void {
  gsys.gr_wait_up_to(duration);
}

export function wake(messageId: MessageId): void {
  return wakeDelayed(messageId, 0);
}

export function wakeDelayed(messageId: MessageId, delay: u32): void {
  let errorCodeU8a = new Uint8Array(sizeof<u32>()).fill(0);

  gsys.gr_wake(<i32>messageId.dataStart, delay, <i32>errorCodeU8a.dataStart);
  const errorCode = load<u32>(errorCodeU8a.dataStart);
  new SyscallError(errorCode).assert();
}

export function programId(): ActorId {
  let program_id = new Uint8Array(32).fill(0);
  gsys.gr_program_id(<i32>program_id.dataStart);
  return new ActorId(program_id);
}

export function origin(): ActorId {
  let programId = ActorId.default();
  gsys.gr_program_id(<i32>programId.dataStart);
  return programId;
}

export function payProgramRent(programId: ActorId, value: u128): ValueWithBlockNumber {
  const rentPid = new HashWithValue(programId, value);

  let res = ErrorWithBlockNumberAndValue.default();

  gsys.gr_pay_program_rent(rentPid.ptr, res.ptr);

  new SyscallError(res.errorCode).assert();

  return new ValueWithBlockNumber(res.value, res.bn);
}

export function random(subject: Hash): BlockNumberWithHash {
  let res: BlockNumberWithHash = BlockNumberWithHash.default();

  gsys.gr_random(<i32>subject.dataStart, res.ptr);

  return res;
}

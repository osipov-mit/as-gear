import { u128 } from 'as-bignum/assembly';

import {
  BlockNumberWithHash,
  gr_block_height,
  gr_block_timestamp,
  gr_exit,
  gr_gas_available,
  gr_leave,
  gr_origin,
  gr_program_id,
  gr_random,
  gr_reserve_gas,
  gr_system_reserve_gas,
  gr_unreserve_gas,
  gr_value_available,
  gr_wait,
  gr_wait_for,
  gr_wait_up_to,
  gr_wake,
  Hash,
  Length,
  LengthWithGas,
  LengthWithHash,
} from '../sys';
import { u128ToPtr } from '../util';
import { getError, panic } from './utils';
import { ActorId, MessageId, ReservationId } from './types';

export function blockHeight(): u32 {
  const bn = new Uint8Array(sizeof<u32>()).fill(0);

  gr_block_height(<i32>bn.dataStart);

  return load<u32>(bn.dataStart);
}

export function blockTimestamp(): u64 {
  const timestamp = new Uint8Array(sizeof<u64>()).fill(0);
  gr_block_timestamp(<i32>timestamp.dataStart);
  return load<u64>(timestamp.dataStart);
}

export function exit(inheritor_id: ActorId): void {
  gr_exit(<i32>inheritor_id.value.dataStart);
}

export function reserveGas(amount: u64, duration: u32): ReservationId | null {
  const res: LengthWithHash = LengthWithHash.default();

  gr_reserve_gas(amount, duration, res.ptr);

  if (res.length) {
    panic(getError(res.length));
    return null;
  }

  return res.hash;
}

export function systemReserveGas(amount: u64): void | null {
  const len = new Uint8Array(sizeof<Length>()).fill(0);

  gr_system_reserve_gas(amount, <i32>len.dataStart);

  const length = load<u32>(len.dataStart);

  if (length != 0) {
    panic(getError(length));
    return null;
  }
}

export function unreserveGas(id: ReservationId): u64 | null {
  const res: LengthWithGas = LengthWithGas.default();

  gr_unreserve_gas(<i32>id.dataStart, res.ptr);

  if (res.length != 0) {
    panic(getError(res.length));
    return null;
  }

  return res.gas;
}

export function gasAvailable(): u64 {
  const gas = new Uint8Array(sizeof<u64>()).fill(0);
  gr_gas_available(<i32>gas.dataStart);
  return load<u64>(gas.dataStart);
}

export function leave(): void {
  gr_leave();
}

export function valueAvailable(): u128 {
  const value = u128.Zero;
  const ptr = u128ToPtr(value);
  gr_value_available(ptr);
  const buf = load<Uint8Array>(ptr, 0, 4);

  return u128.fromUint8ArrayLE(buf);
}

export function wait(): void {
  gr_wait();
}

export function waitFor(duration: u32): void {
  gr_wait_for(duration);
}

export function waitUpTo(duration: u32): void {
  gr_wait_up_to(duration);
}

export function wake(messageId: MessageId): void | null {
  return wakeDelayed(messageId, 0);
}

export function wakeDelayed(messageId: MessageId, delay: u32): void | null {
  const lenBuf = new Uint8Array(sizeof<u32>()).fill(0);

  gr_wake(<i32>messageId.dataStart, delay, <i32>lenBuf.dataStart);
  const len = load<u32>(lenBuf.dataStart);
  if (len != 0) {
    panic(getError(len));
    return null;
  }
}

export function programId(): ActorId {
  const program_id = new Uint8Array(32).fill(0);
  gr_program_id(<i32>program_id.dataStart);
  return new ActorId(program_id);
}

export function origin(): ActorId {
  const origin = new Uint8Array(32).fill(0);
  gr_origin(<i32>origin.dataStart);
  return new ActorId(origin);
}

export function random(subject: Hash): BlockNumberWithHash | null {
  const res: BlockNumberWithHash = BlockNumberWithHash.default();

  gr_random(<i32>subject.dataStart, res.ptr);

  return res;
}

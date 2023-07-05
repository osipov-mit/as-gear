import { u128 } from 'as-bignum/assembly';
import { ErrorWithTwoHashes, gsys, Hash, HashWithValue } from '../sys';
import { panic } from './utils';
import { CodeId, MessageIdWithActorId } from './types';
import { SyscallError } from './errors';

/** Create a new program and returns its address. */
export function createProgram(
  codeId: CodeId,
  salt: Uint8Array,
  payload: Uint8Array,
  value: u128,
): MessageIdWithActorId {
  return createProgramDelayed(codeId, salt, payload, value, 0);
}

/** Same as `create_program`, but with an explicit gas limit. */
export function createProgramWithGas(
  codeId: CodeId,
  salt: Uint8Array,
  payload: Uint8Array,
  gas_limit: u64,
  value: u128,
): MessageIdWithActorId {
  return createProgramWithGasDelayed(codeId, salt, payload, gas_limit, value, 0);
}

/** Same as `create_program`, but creates a new program after the `delay` expressed in block count. */
export function createProgramDelayed(
  codeId: Hash,
  salt: Uint8Array,
  payload: Uint8Array,
  value: u128,
  delay: u32,
): MessageIdWithActorId {
  let cidValue = new HashWithValue(codeId, value);

  const res = ErrorWithTwoHashes.default();

  gsys.gr_create_program(
    cidValue.ptr,
    <i32>salt.dataStart,
    salt.length,
    <i32>payload.dataStart,
    payload.length,
    delay,
    res.ptr,
  );

  new SyscallError(res.errorCode).assert();

  return new MessageIdWithActorId(res.hash1, res.hash2);
}

/** Same as `create_program_with_gas`, but creates a new program after the `delay` expressed in block count. */
export function createProgramWithGasDelayed(
  codeId: CodeId,
  salt: Uint8Array,
  payload: Uint8Array,
  gas_limit: u64,
  value: u128,
  delay: u32,
): MessageIdWithActorId {
  let cidValue = new HashWithValue(codeId, value);

  const res = ErrorWithTwoHashes.default();

  gsys.gr_create_program_wgas(
    cidValue.ptr,
    <i32>salt.dataStart,
    salt.length,
    <i32>payload.dataStart,
    payload.length,
    gas_limit,
    delay,
    res.ptr,
  );

  new SyscallError(res.errorCode).assert();

  return new MessageIdWithActorId(res.hash1, res.hash2);
}

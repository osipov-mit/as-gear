import { u128 } from 'as-bignum/assembly';
import { gr_create_program, gr_create_program_wgas, Hash, HashWithValue, LengthWithTwoHashes } from '../sys';
import { getError, panic } from './utils';
import { CodeId, MessageAndActorIds } from './types';

export function createProgram(
  codeId: CodeId,
  salt: Uint8Array,
  payload: Uint8Array,
  value: u128,
): MessageAndActorIds | null {
  return createProgramDelayed(codeId, salt, payload, value, 0);
}

export function createProgramWithGas(
  codeId: CodeId,
  salt: Uint8Array,
  payload: Uint8Array,
  gas_limit: u64,
  value: u128,
): MessageAndActorIds | null {
  return createProgramWithGasDelayed(codeId, salt, payload, gas_limit, value, 0);
}

export function createProgramDelayed(
  codeId: Hash,
  salt: Uint8Array,
  payload: Uint8Array,
  value: u128,
  delay: u32,
): MessageAndActorIds | null {
  let cidValue = new HashWithValue(codeId, value);

  const res: LengthWithTwoHashes = LengthWithTwoHashes.default();

  gr_create_program(
    cidValue.ptr,
    <i32>salt.dataStart,
    salt.length,
    <i32>payload.dataStart,
    payload.length,
    delay,
    res.ptr,
  );

  if (res.length) {
    panic(getError(res.length));
    return null;
  }

  return new MessageAndActorIds(res.hash1, res.hash2);
}

export function createProgramWithGasDelayed(
  codeId: CodeId,
  salt: Uint8Array,
  payload: Uint8Array,
  gas_limit: u64,
  value: u128,
  delay: u32,
): MessageAndActorIds | null {
  let cidValue = new HashWithValue(codeId, value);

  const res: LengthWithTwoHashes = LengthWithTwoHashes.default();

  gr_create_program_wgas(
    cidValue.ptr,
    <i32>salt.dataStart,
    salt.length,
    <i32>payload.dataStart,
    payload.length,
    gas_limit,
    delay,
    res.ptr,
  );
  if (res.length) {
    panic(getError(res.length));
    return null;
  }

  return new MessageAndActorIds(res.hash1, res.hash2);
}

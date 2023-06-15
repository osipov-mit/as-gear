import { 
  Ptr, 
  BlockNumber, 
  BlockNumberWithHash, 
  BlockTimestamp, 
  Handle, 
  Hash, 
  HashWithValue, 
  TwoHashesWithValue, 
  LengthWithTwoHashes, 
  Length, 
  LengthWithHash, 
  LengthWithHandle, 
  LengthWithGas, 
  LengthWithCode, 
  LengthWithBlockNumberAndValue,
  Gas,
  Value,
  Index,
} from './types'


/** Infallible `gr_block_height` get syscall.
  *  
  * Arguments type:
  * - `height`: `mut ptr` for `u32`.
*/
//@ts-ignore: decorator
@external("env", "gr_block_height")
export declare function gr_block_height(height: Ptr<BlockNumber>): void;

/// Infallible `gr_block_timestamp` get syscall.
///
/// Arguments type:
/// - `timestamp`: `mut ptr` for `u64`.
//@ts-ignore: decorator
@external("env", "gr_block_timestamp")
export declare function gr_block_timestamp(timestamp: Ptr<BlockTimestamp>): void;

/// Fallible `gr_create_program_wgas` send syscall.
///
/// Arguments type:
/// - `cid_value`: `const ptr` for concatenated code id and value.
/// - `salt`: `const ptr` for the begging of the salt buffer.
/// - `salt_len`: `u32` length of the salt buffer.
/// - `payload`: `const ptr` for the begging of the payload buffer.
/// - `payload_len`: `u32` length of the payload buffer.
/// - `gas_limit`: `u64` defining gas limit for sending.
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid_pid`: `mut ptr` for concatenated error length, message id
///   and program id.
//@ts-ignore: decorator
@external("env", "gr_create_program_wgas")
export declare function gr_create_program_wgas(
  cid_value: Ptr<HashWithValue>,
  salt: Ptr<Uint8Array>,
  salt_len: Length,
  payload: Ptr<Uint8Array>,
  payload_len: Length,
  gas_limit: Gas,
  delay: BlockNumber,
  err_mid_pid: Ptr<LengthWithTwoHashes>,
): void;

/** Fallible `gr_create_program` send syscall.
  *
  * Arguments type:
  * - `cid_value`: `const ptr` for concatenated code id and value.
  * - `salt`: `const ptr` for the begging of the salt buffer.
  * - `salt_len`: `u32` length of the salt buffer.
  * - `payload`: `const ptr` for the begging of the payload buffer.
  * - `payload_len`: `u32` length of the payload buffer.
  * - `gas_limit`: `u64` defining gas limit for sending.
  * - `delay`: `u32` amount of blocks to delay.
  * - `err_mid_pid`: `mut ptr` for concatenated error length, message id
  *   and program id.
 */
//@ts-ignore: decorator
@external("env", "gr_create_program")
export declare function gr_create_program(
  cid_value: Ptr<HashWithValue>,
  salt: Ptr<Uint8Array>,
  salt_len: Length,
  payload: Ptr<Uint8Array>,
  payload_len: Length,
  delay: BlockNumber,
  err_mid_pid: Ptr<LengthWithTwoHashes>,
): void;

/**  Fallible `gr_reply_deposit` syscall.
  * 
  * Arguments type:
  * - `message_id`: `const ptr` for message id.
  * - `gas`: `u64` defining gas limit to deposit.
  * - `err`: `mut ptr` for error length.
*/
//@ts-ignore: decorator
@external("env", "gr_reply_deposit")
export declare function gr_reply_deposit(message_id: Ptr<Hash>, gas: Gas, err: Ptr<Length>): void;

/// Infallible `gr_debug` info syscall.
///
/// Arguments type:
/// - `payload`: `const ptr` for the begging of the payload buffer.
/// - `len`: `u32` length of the payload buffer.
//@ts-ignore: decorator
@external("env", "gr_debug")
export declare function gr_debug(payload: Ptr<Uint8Array>, len: Length): void;
// export declare function gr_debug(payload: string, len: Length): void;

/// Infallible `gr_panic` control syscall.
///
/// Stops the execution.
///
/// Arguments type:
/// - `payload`: `const ptr` for the begging of the payload buffer.
/// - `len`: `u32` length of the payload buffer.
//@ts-ignore: decorator
@external("env", "gr_panic")
export declare function gr_panic(payload: i32, len: Length): void;

/// Infallible `gr_oom_panic` control syscall.
//@ts-ignore: decorator
@external("env", "gr_oom_panic")
export declare function gr_oom_panic(): void;

// TODO: issue #1859
/// Fallible `gr_error` get syscall.
///
/// Arguments type:
/// - `buf`: `mut ptr` for buffer to store previously occurred error.
/// - `len`: `mut ptr` for `u32` current error length.
//@ts-ignore: decorator
@external("env", "gr_error")
export declare function gr_error(buf: i32, len: Length): void;

/** Fallible `gr_status_code` get syscall.
  *
  * Arguments type:
  * - `err_code`: `mut ptr` for concatenated error length and status code.
*/
//@ts-ignore: decorator
@external("env", "gr_status_code")
export declare function gr_status_code(err_code: Ptr<LengthWithCode>): void;

/// Infallible `gr_exit` control syscall.
///
/// Arguments type:
/// - `inheritor_id`: `const ptr` for program id.
//@ts-ignore: decorator
@external("env", "gr_exit")
export declare function gr_exit(inheritor_id: Ptr<Hash>): void;

/// Infallible `gr_gas_available` get syscall.
///
/// Arguments type:
/// - `gas`: `mut ptr` for `u64`.
//@ts-ignore: decorator
@external("env", "gr_gas_available")
export declare function gr_gas_available(gas: Gas): void;

/// Infallible `gr_leave` control syscall.
//@ts-ignore: decorator
@external("env", "gr_leave")
export declare function gr_leave(): void;

/// Infallible `gr_message_id` get syscall.
///
/// Arguments type:
/// - `message_id`: `const ptr` for message id.
//@ts-ignore: decorator
@external("env", "gr_message_id")
export declare function gr_message_id(message_id: Ptr<Hash>): void;

/// Infallible `gr_origin` get syscall.
///
/// Arguments type:
/// - `program_id`: `const ptr` for program id.
//@ts-ignore: decorator
@external("env", "gr_origin")
export declare function gr_origin(program_id: Ptr<Hash>): void;

/**  Fallible `gr_reply_deposit` syscall.
  *
  * Arguments type:
  * - `rent_pid`: `ptr` for program id and rent value.
  * - `err_bn_value`: `ptr` for concatenated error length, paid block count and unused rent value.
  * - `err`: ptr for error length.
*/
//@ts-ignore: decorator
@external("env", "gr_pay_program_rent")
export declare function gr_pay_program_rent(
  rent_pid: Ptr<HashWithValue>,
  err_bn_value: Ptr<LengthWithBlockNumberAndValue>,
): void;

/// Infallible `gr_program_id` get syscall.
///
/// Arguments type:
/// - `program_id`: `const ptr` for program id.
//@ts-ignore: decorator
@external("env", "gr_program_id")
export declare function gr_program_id(program_id: Ptr<Hash>): void;

/// Infallible `gr_random` calculate syscall.
///
/// Arguments type:
/// - `subject`: `const ptr` for the begging of the payload buffer.
/// - `bn_random`: `mut ptr` for concatenated block number with hash.
//@ts-ignore: decorator
@external("env", "gr_random")
export declare function gr_random(subject: i32, bn_random: Ptr<BlockNumberWithHash>): void;

// TODO: issue #1859
/// Fallible `gr_read` get syscall.
///
/// Arguments type:
/// - `at`: `u32` defining offset to read from.
/// - `len`: `u32` length of the buffer to read.
/// - `buffer`: `mut ptr` for buffer to store requested data.
/// - `err`: `mut ptr` for `u32` error length.
//@ts-ignore: decorator
@external("env", "gr_read")
export declare function gr_read(at: Length, len: Length, buffer: Ptr<Uint8Array>, err: Ptr<Length>): void;

/// Fallible `gr_reply_commit_wgas` send syscall.
///
/// Arguments type:
/// - `gas_limit`: `u64` defining gas limit for sending.
/// - `value`: `const ptr` for `u128` defining amount of value to apply.
///   Ignored if equals u32::MAX (use this for zero value for optimization).
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_reply_commit_wgas")
export declare function gr_reply_commit_wgas(
  gas_limit: Gas,
  value: Ptr<Value>,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_reply_commit` send syscall.
///
/// Arguments type:
/// - `value`: `const ptr` for `u128` defining amount of value to apply.
///   Ignored if equals u32::MAX (use this for zero value for optimization).
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_reply_commit")
export declare function gr_reply_commit(value: Ptr<Value>, delay: BlockNumber, err_mid: Ptr<LengthWithHash>): void;

/// Fallible `gr_reply_push` send syscall.
///
/// Arguments type:
/// - `payload`: `const ptr` for the begging of the payload buffer.
/// - `len`: `u32` length of the payload buffer.
/// - `err`: `mut ptr` for error length.
//@ts-ignore: decorator
@external("env", "gr_reply_push")
export declare function gr_reply_push(payload: Ptr<Uint8Array>, len: Length, err: Length): void;

/// Fallible `gr_reply_push_input` send syscall.
///
/// Arguments type:
/// - `offset`: `u32` defining start index of the input buffer to use.
/// - `len`: `u32` defining slice length of the input buffer to use.
/// - `err`: `mut ptr` for error length.
//@ts-ignore: decorator
@external("env", "gr_reply_push_input")
export declare function gr_reply_push_input(offset: Index, len: Length, err: Length): void;

/// Fallible `gr_reply_to` get syscall.
///
/// Arguments type:
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_reply_to")
export declare function gr_reply_to(err_mid: Ptr<LengthWithHash>): void;

/// Fallible `gr_signal_from` get syscall.
///
/// Arguments type:
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_signal_from")
export declare function gr_signal_from(err_mid: Ptr<LengthWithHash>): void;

/// Fallible `gr_reply_input_wgas` send syscall.
///
/// Arguments type:
/// - `offset`: `u32` defining start index of the input buffer to use.
/// - `len`: `u32` defining slice length of the input buffer to use.
/// - `gas_limit`: `u64` defining gas limit for sending.
/// - `value`: `const ptr` for `u128` defining amount of value to apply.
///   Ignored if equals u32::MAX (use this for zero value for optimization).
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_reply_input_wgas")
export declare function gr_reply_input_wgas(
  offset: Index,
  len: Length,
  gas_limit: Gas,
  value: Ptr<Value>,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_reply_wgas` send syscall.
///
/// Arguments type:
/// - `payload`: `const ptr` for the begging of the payload buffer.
/// - `len`: `u32` length of the payload buffer.
/// - `gas_limit`: `u64` defining gas limit for sending.
/// - `value`: `const ptr` for `u128` defining amount of value to apply.
///   Ignored if equals u32::MAX (use this for zero value for optimization).
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_reply_wgas")
export declare function gr_reply_wgas(
  payload: Ptr<Uint8Array>,
  len: Length,
  gas_limit: Gas,
  value: Ptr<Value>,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_reply` send syscall.
///
/// Arguments type:
/// - `payload`: `const ptr` for the begging of the payload buffer.
/// - `len`: `u32` length of the payload buffer.
/// - `value`: `const ptr` for `u128` defining amount of value to apply.
///   Ignored if equals u32::MAX (use this for zero value for optimization).
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_reply")
export declare function gr_reply(
  payload: Ptr<Uint8Array>,
  len: Length,
  value: Ptr<Value>,
  delay: BlockNumber,
  err_mid?: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_reply_input` send syscall.
///
/// Arguments type:
/// - `offset`: `u32` defining start index of the input buffer to use.
/// - `len`: `u32` defining slice length of the input buffer to use.
/// - `value`: `const ptr` for `u128` defining amount of value to apply.
///   Ignored if equals u32::MAX (use this for zero value for optimization).
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_reply_input")
export declare function gr_reply_input(
  offset: Index,
  len: Length,
  value: Ptr<Value>,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_reservation_reply_commit` send syscall.
///
/// Arguments type:
/// - `rid_value`: `const ptr` for concatenated reservation id and value.
/// - `payload`: `const ptr` for the begging of the payload buffer.
/// - `len`: `u32` length of the payload buffer.
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_reservation_reply_commit")
export declare function gr_reservation_reply_commit(
  rid_value: Ptr<HashWithValue>,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_reservation_reply` send syscall.
///
/// Arguments type:
/// - `rid_value`: `const ptr` for concatenated reservation id and value.
/// - `payload`: `const ptr` for the begging of the payload buffer.
/// - `len`: `u32` length of the payload buffer.
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_reservation_reply")
export declare function gr_reservation_reply(
  rid_value: Ptr<HashWithValue>,
  payload: Ptr<Uint8Array>,
  len: Length,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_reservation_send_commit` send syscall.
///
/// Arguments type:
/// - `handle`: `u32` defining handle of the message to commit.
/// - `rid_pid_value`: `const ptr` for concatenated reservation id,
///   program id and value.
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_reservation_send_commit")
export declare function gr_reservation_send_commit(
  handle: Handle,
  rid_pid_value: Ptr<TwoHashesWithValue>,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_reservation_send` send syscall.
///
/// Arguments type:
/// - `rid_pid_value`: `const ptr` for concatenated reservation id,
///   program id and value.
/// - `payload`: `const ptr` for the begging of the payload buffer.
/// - `len`: `u32` length of the payload buffer.
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_reservation_send")
export declare function gr_reservation_send(
  rid_pid_value: Ptr<TwoHashesWithValue>,
  payload: i32,
  len: Length,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_reserve_gas` control syscall.
///
/// Arguments type:
/// - `gas`: `u64` defining amount of gas to reserve.
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_rid`: `mut ptr` for concatenated error length and reservation id.
//@ts-ignore: decorator
@external("env", "gr_reserve_gas")
export declare function gr_reserve_gas(gas: Gas, duration: BlockNumber, err_rid: Ptr<LengthWithHash>): void;

/// Fallible `gr_send_commit_wgas` send syscall.
///
/// Arguments type:
/// - `handle`: `u32` defining handle of the message to commit.
/// - `pid_value`: `const ptr` for concatenated program id and value.
/// - `gas_limit`: `u64` defining gas limit for sending.
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_send_commit_wgas")
export declare function gr_send_commit_wgas(
  handle: Handle,
  pid_value: Ptr<HashWithValue>,
  gas_limit: Gas,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_send_commit` send syscall.
///
/// Arguments type:
/// - `handle`: `u32` defining handle of the message to commit.
/// - `pid_value`: `const ptr` for concatenated program id and value.
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_send_commit")
export declare function gr_send_commit(
  handle: Handle,
  pid_value: Ptr<HashWithValue>,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_send_init` send syscall.
///
/// Arguments type:
/// - `err_handle`: `mut ptr` for concatenated error length and handle.
//@ts-ignore: decorator
@external("env", "gr_send_init")
export declare function gr_send_init(err_handle: Ptr<LengthWithHandle>): void;

/// Fallible `gr_send_push` send syscall.
///
/// Arguments type:
/// - `handle`: `u32` defining handle of the message to push into.
/// - `payload`: `const ptr` for the begging of the payload buffer.
/// - `len`: `u32` length of the payload buffer.
/// - `err`: `mut ptr` for error length.
//@ts-ignore: decorator
@external("env", "gr_send_push")
export declare function gr_send_push(handle: Handle, payload: Ptr<Uint8Array>, len: Length, err: Ptr<Length>): void;

/// Fallible `gr_send_push_input` send syscall.
///
/// Arguments type:
/// - `handle`: `u32` defining handle of the message to push into.
/// - `offset`: `u32` defining start index of the input buffer to use.
/// - `len`: `u32` defining slice length of the input buffer to use.
/// - `err`: `mut ptr` for error length.
//@ts-ignore: decorator
@external("env", "gr_send_push_input")
export declare function gr_send_push_input(handle: Handle, offset: Index, len: Length, err: Ptr<Length>): void;

/// Fallible `gr_send_input_wgas` send syscall.
///
/// Arguments type:
/// - `pid_value`: `const ptr` for concatenated program id and value.
/// - `offset`: `u32` defining start index of the input buffer to use.
/// - `len`: `u32` defining slice length of the input buffer to use.
/// - `gas_limit`: `u64` defining gas limit for sending.
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_send_input_wgas")
export declare function gr_send_input_wgas(
  pid_value: Ptr<HashWithValue>,
  offset: Index,
  len: Length,
  gas_limit: Gas,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_send_wgas` send syscall.
///
/// Arguments type:
/// - `pid_value`: `const ptr` for concatenated program id and value.
/// - `payload`: `const ptr` for the begging of the payload buffer.
/// - `len`: `u32` length of the payload buffer.
/// - `gas_limit`: `u64` defining gas limit for sending.
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_send_wgas")
export declare function gr_send_wgas(
  pid_value: Ptr<HashWithValue>,
  payload: i32,
  len: Length,
  gas_limit: Gas,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_send` send syscall.
///
/// Arguments type:
/// - `pid_value`: `const ptr` for concatenated program id and value.
/// - `payload`: `const ptr` for the begging of the payload buffer.
/// - `len`: `u32` length of the payload buffer.
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_send")
export declare function gr_send(
  pid_value: Ptr<HashWithValue>,
  payload: i32,
  len: Length,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Fallible `gr_send_input` send syscall.
///
/// Arguments type:
/// - `pid_value`: `const ptr` for concatenated program id and value.
/// - `payload`: `const ptr` for the begging of the payload buffer.
/// - `len`: `u32` length of the payload buffer.
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for concatenated error length and message id.
//@ts-ignore: decorator
@external("env", "gr_send_input")
export declare function gr_send_input(
  pid_value: Ptr<HashWithValue>,
  offset: Index,
  len: Length,
  delay: BlockNumber,
  err_mid: Ptr<LengthWithHash>,
): void;

/// Infallible `gr_size` get syscall.
///
/// Arguments type:
/// - `length`: `mut ptr` for length of the incoming payload.
//@ts-ignore: decorator
@external("env", "gr_size")
export declare function gr_size(length: Length): void;

/// Infallible `gr_source` get syscall.
///
/// Arguments type:
/// - `program_id`: `const ptr` for program id.
//@ts-ignore: decorator
@external("env", "gr_source")
export declare function gr_source(program_id: Ptr<Hash>): void;

/// Fallible `gr_system_reserve_gas` control syscall.
///
/// Arguments type:
/// - `gas`: `u64` defining amount of gas to reserve.
/// - `err`: `mut ptr` for error length.
//@ts-ignore: decorator
@external("env", "gr_system_reserve_gas")
export declare function gr_system_reserve_gas(gas: Gas, err: Ptr<Length>): void;

/// Fallible `gr_unreserve_gas` control syscall.
///
/// Arguments type:
/// - `reservation_id`: `const ptr` for reservation id.
/// - `err_unreserved`: `mut ptr` for concatenated error length and
///   unreserved gas amount.
//@ts-ignore: decorator
@external("env", "gr_unreserve_gas")
export declare function gr_unreserve_gas(reservation_id: Ptr<Hash>, err_unreserved: Ptr<LengthWithGas>): void;

/// Infallible `gr_value_available` get syscall.
///
/// Arguments type:
/// - `value`: `mut ptr` for total value of the program.
//@ts-ignore: decorator
@external("env", "gr_value_available")
export declare function gr_value_available(value: Ptr<Value>): void;

/// Infallible `gr_value` get syscall.
///
/// Arguments type:
/// - `value`: `mut ptr` for incoming value of the message.
//@ts-ignore: decorator
@external("env", "gr_value")
export declare function gr_value(value: Ptr<Value>): void;

/// Infallible `gr_wait_for` control syscall.
///
/// Arguments type:
/// - `duration`: `u32` defining amount of blocks to wait.
//@ts-ignore: decorator
@external("env", "gr_wait_for")
export declare function gr_wait_for(duration: BlockNumber): void;

/// Infallible `gr_wait_up_to` control syscall.
///
/// Arguments type:
/// - `duration`: `u32` defining amount of blocks to wait.
//@ts-ignore: decorator
@external("env", "gr_wait_up_to")
export declare function gr_wait_up_to(duration: BlockNumber): void;

/// Infallible `gr_wait` control syscall.
//@ts-ignore: decorator
@external("env", "gr_wait")
export declare function gr_wait(): void;

/// Fallible `gr_wake` control syscall.
///
/// Arguments type:
/// - `message_id`: `const ptr` for message id.
/// - `delay`: `u32` amount of blocks to delay.
/// - `err_mid`: `mut ptr` for error length.
//@ts-ignore: decorator
@external("env", "gr_wake")
export declare function gr_wake(message_id:Ptr< Hash>, delay: BlockNumber, err: Ptr<Length>): void;

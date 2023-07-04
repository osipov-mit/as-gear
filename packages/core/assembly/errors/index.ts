export enum ExecutionError {
  /** An error occurs in attempt to charge more gas than available for operation. */
  NotEnoughGas = 'Not enough gas for operation',

  /** The error occurs when balance is less than required by operation. */
  NotEnoughValue = 'Not enough value for operation',

  /** An error occurs in attempt to parse invalid string in `gr_debug` sys-call. */
  InvalidDebugString = 'Invalid debug string passed in `gr_debug` sys-call',

  /** Overflow in 'gr_read' */
  TooBigReadLen = 'Length is overflowed to read payload',

  /** Cannot take data in payload range */
  ReadWrongRange = 'Cannot take data in payload range from message with size',

  /** The error occurs when functions related to reply context, used without it. */
  NoReplyContext = 'Not running in reply context',

  /** The error occurs when functions related to signal context, used without it. */
  NoSignalContext = 'Not running in signal context',

  /** The error occurs when functions related to status code, used without required context. */
  NoStatusCodeContext = 'No status code in reply/signal context',

  /**  An error occurs in attempt to send or push reply while reply function is banned. */
  IncorrectEntryForReply = 'Reply sending is only allowed in `init` and `handle` functions',
}

export enum MemoryError {
  /** The error occurs, when program tries to allocate in block-chain runtime more memory than allowed. */
  RuntimeAllocOutOfBounds = 'Trying to allocate more memory in block-chain runtime than allowed',

  /** The error occurs in attempt to access memory outside wasm program memory. */
  AccessOutOfBounds = 'Trying to access memory outside wasm program memory',
}

export enum MessageError {
  /** Message has bigger then allowed one message size */
  MaxMessageSizeExceed = 'Max message size exceed',

  /** The error "Message limit exceeded" occurs when a program attempts to
   * send more than the maximum amount of messages allowed within a single
   * execution (current setting - 1024).
   */
  OutgoingMessagesAmountLimitExceeded = 'Message limit exceeded',

  /** The error occurs in case of attempt to send more than one replies. */
  DuplicateReply = 'Duplicate reply message',

  /** The error occurs in attempt to get the same message from the waitlist again (which is waked already). */
  DuplicateWaking = 'Duplicate waking message',

  /** An attempt to commit or push a payload into an already formed message. */
  LateAccess = 'An attempt to commit or push a payload into an already formed message',

  /** The error occurs in case of not valid identifier specified. */
  OutOfBounds = 'Message with given handle is not found',

  /** The error occurs in attempt to initialize the same program twice within a single execution. */
  DuplicateInit = 'Duplicated program initialization message',

  /** Everything less than existential deposit but greater than 0 is not considered as available balance and not saved in DB.
   * Value between 0 and existential deposit cannot be sent in message.
   */
  InsufficientValue = 'In case of non-zero message value must be greater than existential deposit',

  /** Everything less than mailbox threshold but greater than 0 is not considered as available gas limit and
   * not inserted in mailbox.
   *
   * Gas limit between 0 and mailbox threshold cannot be inserted in mailbox.
   */
  InsufficientGasLimit = 'In case of non-zero message gas limit must be greater than mailbox threshold',

  /** The error occurs when program tries to create reply deposit for message that already been created within the execution. */
  DuplicateReplyDeposit = 'Reply deposit already exists for given message',

  /** The error occurs when program tries to create reply deposit for message that wasn't sent within the execution or for reply. */
  IncorrectMessageForReplyDeposit = 'Reply deposit could be only created for init or handle message sent within the execution',

  /** An error occurs in attempt to charge gas for dispatch stash hold. */
  InsufficientGasForDelayedSending = 'Not enough gas to hold dispatch message',
}

export enum WaitError {
  /** An error occurs in attempt to wait for or wait up to zero blocks. */
  ZeroDuration = 'Waiting duration cannot be zero',

  /** An error occurs in attempt to wait after reply sent. */
  WaitAfterReply = '`wait()` is not allowed after reply sent',
}

export enum ReservationError {
  /** An error occurs in attempt to unreserve gas with non-existing reservation ID. */
  InvalidReservationId = 'Invalid reservation ID',

  /** An error occurs in attempt to reserve more times than allowed. */
  ReservationsLimitReached = 'Reservation limit has reached',

  /** An error occurs in attempt to create reservation for 0 blocks. */
  ZeroReservationDuration = 'Reservation duration cannot be zero',

  /** An error occurs in attempt to reserve zero gas. */
  ZeroReservationAmount = 'Reservation amount cannot be zero',

  /** An error occurs in attempt to reserve gas less than mailbox threshold. */
  ReservationBelowMailboxThreshold = 'Reservation amount cannot be below mailbox threshold',
}

import { CodecClass, ScaleString, U64, U8, Vec } from 'as-scale-codec/assembly';
import { InOut, MetadataRepr, ActorId } from 'as-gear-std/assembly';

// @ts-ignore: decorator
@codec
// @ts-ignore: decorator
@typeInfo
// @ts-ignore: decorator
@struct
export class InitConfig extends CodecClass {
  name: ScaleString | null;
  symbol: ScaleString | null;
  decimals: U8 | null;

  constructor(name: ScaleString | null = null, symbol: ScaleString | null = null, decimals: U8 | null = null) {
    super();
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimals;
  }

  static decode(bytes: Uint8Array): InitConfig {
    const result = new InitConfig();
    result.decode(bytes);
    return result;
  }
}

export enum FTActionVariants {
  Mint,
  Burn,
  Transfer,
  Approve,
  TotalSupply,
  BalanceOf,
}

// @ts-ignore: decorator
@codec
// @ts-ignore: decorator
@typeInfo
// @ts-ignore: decorator
@struct
export class FTActionTransfer extends CodecClass {
  from: ActorId | null;
  to: ActorId | null;
  amount: U64 | null;

  constructor(from: ActorId | null = null, to: ActorId | null = null, amount: U64 | null = null) {
    super();
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
}

// @ts-ignore: decorator
@codec
// @ts-ignore: decorator
@typeInfo
// @ts-ignore: decorator
@struct
export class FTActionApprove extends CodecClass {
  to: ActorId | null;
  amount: U64 | null;
  constructor(to: ActorId | null = null, amount: U64 | null = null) {
    super();
    this.to = to;
    this.amount = amount;
  }
}

export class FTActionVariantTypes {
  Mint: U64 | null;
  Burn: U64 | null;
  Transfer: FTActionTransfer | null;
  Approve: FTActionApprove | null;
  BalanceOf: ActorId | null;

  constructor(
    mint: U64 | null = null,
    burn: U64 | null = null,
    transfer: FTActionTransfer | null = null,
    approve: FTActionApprove | null = null,
    balanceOf: ActorId | null = null,
  ) {
    this.Mint = mint;
    this.Burn = burn;
    this.Transfer = transfer;
    this.Approve = approve;
    this.BalanceOf = balanceOf;
  }
}

// @ts-ignore: decorator
@codec
// @ts-ignore: decorator
@typeInfo
// @ts-ignore: decorator
@scaleEnum
export class FTAction extends CodecClass {
  variantIndex: FTActionVariants;
  variants: FTActionVariantTypes | null;

  constructor(v: FTActionVariants = 0, variants: FTActionVariantTypes | null = null) {
    super();
    this.variantIndex = v;
    this.variants = variants;
  }

  match(v: FTActionVariants): boolean {
    if (this.variantIndex != v) return false;
    return true;
  }

  asMint(): U64 {
    return this.variants!.Mint!;
  }

  asBurn(): U64 {
    return this.variants!.Burn!;
  }

  asTransfer(): FTActionTransfer {
    return this.variants!.Transfer!;
  }

  asApprove(): FTActionApprove {
    return this.variants!.Approve!;
  }

  asTotalSupply(): null {
    return null;
  }

  asBalanceOf(): ActorId {
    return this.variants!.BalanceOf!;
  }

  static decode(value: Uint8Array): FTAction {
    const result = new FTAction();
    result.decode(value);
    return result;
  }
}

export enum FTEventVariants {
  Transfer,
  Approve,
  TotalSupply,
  Balance,
}

export class FTEventVariantTypes {
  Transfer: FTActionTransfer | null;
  Approve: FTActionTransfer | null;
  TotalSupply: U64 | null;
  Balance: U64 | null;

  constructor(
    transfer: FTActionTransfer | null = null,
    approve: FTActionTransfer | null = null,
    totalSupply: U64 | null = null,
    balance: U64 | null = null,
  ) {
    this.Transfer = transfer;
    this.Approve = approve;
    this.TotalSupply = totalSupply;
    this.Balance = balance;
  }
}

// @ts-ignore: decorator
@codec
// @ts-ignore: decorator
@typeInfo
// @ts-ignore: decorator
@scaleEnum
export class FTEvent extends CodecClass {
  variantIndex: FTEventVariants;
  variants: FTEventVariantTypes | null;

  constructor(v: FTEventVariants = 0, variants: FTEventVariantTypes | null = null) {
    super();
    this.variantIndex = v;
    this.variants = variants;
  }

  static Transfer(transfer: FTActionTransfer): FTEvent {
    return new FTEvent(FTEventVariants.Transfer, new FTEventVariantTypes(transfer));
  }

  static Approve(approve: FTActionTransfer): FTEvent {
    return new FTEvent(FTEventVariants.Approve, new FTEventVariantTypes(null, approve));
  }

  static TotalSupply(totalSupply: U64): FTEvent {
    return new FTEvent(FTEventVariants.TotalSupply, new FTEventVariantTypes(null, null, totalSupply));
  }

  static Balance(balance: U64): FTEvent {
    return new FTEvent(FTEventVariants.Balance, new FTEventVariantTypes(null, null, null, balance));
  }
}

// @ts-ignore: decorator
@codec
// @ts-ignore: decorator
@typeInfo
// @ts-ignore: decorator
@struct
export class ActorIdAndAmount extends CodecClass {
  actorId: ActorId | null;
  amount: U64 | null;

  constructor(actorId: ActorId | null = null, amount: U64 | null = null) {
    super();
    this.actorId = actorId;
    this.amount = amount;
  }
}

// @ts-ignore: decorator
@codec
// @ts-ignore: decorator
@typeInfo
// @ts-ignore: decorator
@struct
export class Allowance extends CodecClass {
  actorId: ActorId | null;
  actorIdAndAmount: ActorIdAndAmount | null;

  constructor(actorId: ActorId | null = null, actorIdAndAmount: ActorIdAndAmount | null = null) {
    super();
    this.actorId = actorId;
    this.actorIdAndAmount = actorIdAndAmount;
  }
}

// @ts-ignore: decorator
@codec
// @ts-ignore: decorator
@typeInfo
// @ts-ignore: decorator
@struct
export class IoFungibleToken extends CodecClass {
  name: ScaleString | null;
  symbol: ScaleString | null;
  total_supply: U64 | null;
  balances: Vec<ActorIdAndAmount> | null;
  allowances: Vec<Allowance>;
  decimals: U8 | null;

  constructor(
    name: ScaleString | null,
    symbol: ScaleString | null,
    total_supply: U64 | null,
    balances: Vec<ActorIdAndAmount> | null,
    allowances: Vec<Allowance>,
    decimals: U8 | null,
  ) {
    super();
    this.name = name;
    this.symbol = symbol;
    this.total_supply = total_supply;
    this.balances = balances;
    this.allowances = allowances;
    this.decimals = decimals;
  }
}

// @ts-ignore: decorator
@metadata
export class ProgramMetadata implements MetadataRepr {
  init: InOut<InitConfig, null>;
  handle: InOut<FTAction, FTEvent>;
  reply: InOut<null, null>;
  others: InOut<null, null>;
  signal: null;
  state: IoFungibleToken;
}

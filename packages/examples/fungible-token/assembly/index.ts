import { ActorId, CodecClass, Option, ScaleString, U64, U8 } from 'as-scale-codec/assembly';
import { debug, msg } from 'as-gear-core/assembly';
import { FTAction, FTActionTransfer, FTActionVariants, FTEvent, InitConfig } from './io';

const ZERO_ID = new ActorId();

class FungibleToken extends CodecClass {
  name: ScaleString | null;
  symbol: ScaleString | null;
  totalSupply: U64 | null;
  balances: Map<ActorId, U64> | null;
  allowances: Map<ActorId, Map<ActorId, U64>> | null;
  decimals: U8 | null;

  constructor(
    name: ScaleString | null = null,
    symbol: ScaleString | null = null,
    totalSupply: U64 | null = null,
    balances: Map<ActorId, U64> | null = null,
    allowances: Map<ActorId, Map<ActorId, U64>> | null = null,
    decimals: U8 | null = null,
  ) {
    super();
    this.name = name;
    this.symbol = symbol;
    this.totalSupply = totalSupply;
    this.balances = balances;
    this.allowances = allowances;
    this.decimals = decimals;
  }

  mint(amount: U64): void {
    const actor = new ActorId(msg.source());
    if (this.balances!.has(actor)) {
      this.balances!.set(actor, this.balances!.get(actor).add(amount));
    } else {
      this.balances!.set(actor, amount);
    }
    this.totalSupply = this.totalSupply!.add(amount);
    msg.reply(FTEvent.Transfer(new FTActionTransfer(ZERO_ID, actor, amount)).encode());
  }

  burn(amount: U64): void {
    const actor = new ActorId(msg.source());
    const balance = this.balances!.get(actor);
    if (balance && balance < amount) {
      throw new Error('Amount exceeds account balance');
    }
    this.balances!.set(actor, balance.sub(amount));
    this.totalSupply = this.totalSupply!.sub(amount);

    msg.reply(FTEvent.Transfer(new FTActionTransfer(actor, ZERO_ID, amount)).encode());
  }

  transfer(from: ActorId, to: ActorId, amount: U64): void {
    if (from == ZERO_ID || to == ZERO_ID) {
      throw new Error('Zero addresses');
    }
    const actor = new ActorId(msg.source());
    if (!this.canTransfer(from, amount)) {
      throw new Error('Not allowed to transfer');
    }
    const balance = this.balances!.get(from) || U64.from(0);
    if (balance < amount) {
      throw new Error('Amount exceeds account balance');
    }
    this.balances!.set(from, balance.sub(amount));
    this.balances!.set(to, (this.balances!.get(to) || U64.from(0)).add(amount));
    msg.reply(FTEvent.Transfer(new FTActionTransfer(from, to, amount)).encode());
  }

  approve(to: ActorId, amount: U64): void {
    if (to == ZERO_ID) {
      throw new Error('Approve to zero address');
    }
    if (this.allowances!.has(new ActorId(msg.source()))) {
      this.allowances!.get(new ActorId(msg.source())).set(to, amount);
    } else {
      const allowance = new Map<ActorId, U64>();
      allowance.set(to, amount);
      this.allowances!.set(new ActorId(msg.source()), allowance);
      msg.reply(FTEvent.Approve(new FTActionTransfer(new ActorId(msg.source()), to, amount)).encode());
    }
  }

  canTransfer(from: ActorId, amount: U64): boolean {
    if (from == new ActorId(msg.source()) && this.balances!.has(from) && this.balances!.get(from) > amount) {
      return true;
    }
    if (this.allowances!.has(from) && this.allowances!.get(from).has(new ActorId(msg.source()))) {
      let allowedAmount = this.allowances!.get(from).get(new ActorId(msg.source()));
      if (allowedAmount) {
        this.allowances!.get(from).set(new ActorId(msg.source()), allowedAmount.sub(amount));
        return true;
      }
    }
    return false;
  }

  balanceOf(account: ActorId): void {
    const balance = this.balances!.has(account) ? this.balances!.get(account) : U64.from(0);
    msg.reply(balance.encode());
  }
}

let token: Option<FungibleToken> = Option.None<FungibleToken>();

export function init(): void {
  const bytes = msg.read();
  const input = InitConfig.decode(bytes);
  const ft = new FungibleToken(input.name!, input.symbol!, U64.from(0), new Map(), new Map(), input.decimals!);
  token = Option.Some(ft);
}

export function handle(): void {
  const bytes = msg.read();
  const action = FTAction.decode(bytes);
  const ft = token.unwrap();
  debug(action.variantIndex.toString());
  if (action.match(FTActionVariants.Mint)) {
    ft.mint(action.asMint());
  } else if (action.match(FTActionVariants.Approve)) {
    ft.approve(action.asApprove().to!, action.asApprove().amount!);
  } else if (action.match(FTActionVariants.BalanceOf)) {
    ft.balanceOf(action.asBalanceOf());
  } else if (action.match(FTActionVariants.Burn)) {
    ft.burn(action.asBurn());
  } else if (action.match(FTActionVariants.TotalSupply)) {
    msg.reply(ft.totalSupply!.encode());
  } else if (action.match(FTActionVariants.Transfer)) {
    ft.transfer(action.asTransfer().from!, action.asTransfer().to!, action.asTransfer().amount!);
  }
}

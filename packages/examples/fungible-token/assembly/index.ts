import { CodecClass, Option, ScaleString, U64, U8 } from 'as-scale-codec/assembly';
import { msg } from 'as-gear-core/assembly';
import { ActorId } from 'as-gear-std/assembly';

import { FTAction, FTActionTransfer, FTActionVariants, FTEvent, InitConfig } from './io';

const ZERO_ID = new ActorId(new Uint8Array(32).fill(0));

class FungibleToken extends CodecClass {
  name: ScaleString | null;
  symbol: ScaleString | null;
  totalSupply: U64 | null;
  balances: Map<string, U64> | null;
  allowances: Map<string, Map<string, U64>> | null;
  decimals: U8 | null;

  constructor(
    name: ScaleString | null = null,
    symbol: ScaleString | null = null,
    totalSupply: U64 | null = null,
    balances: Map<string, U64> | null = null,
    allowances: Map<string, Map<string, U64>> | null = null,
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
    const key = actor.toString();

    if (this.balances!.has(key)) {
      this.balances!.set(key, this.balances!.get(key).add(amount));
    } else {
      this.balances!.set(key, amount);
    }
    this.totalSupply = this.totalSupply!.add(amount);

    msg.reply(FTEvent.Transfer(new FTActionTransfer(ZERO_ID, actor, amount)).encode());
  }

  burn(amount: U64): void {
    const actor = new ActorId(msg.source());
    const key = actor.toString();
    const balance = this.balances!.get(key);
    if (balance && balance < amount) {
      throw new Error('Amount exceeds account balance');
    }
    this.balances!.set(key, balance.sub(amount));
    this.totalSupply = this.totalSupply!.sub(amount);

    msg.reply(FTEvent.Transfer(new FTActionTransfer(actor, ZERO_ID, amount)).encode());
  }

  transfer(from: ActorId, to: ActorId, amount: U64): void {
    const fromKey = from.toString();
    const toKey = to.toString();

    if (from == ZERO_ID || to == ZERO_ID) {
      throw new Error('Zero addresses');
    }

    if (!this.canTransfer(fromKey, amount)) {
      throw new Error('Not allowed to transfer');
    }

    const balance = this.balances!.get(fromKey);
    let toBalance: U64;

    this.balances!.set(fromKey, balance.sub(amount));

    if (!this.balances!.has(toKey)) {
      toBalance = U64.from(0);
    } else {
      toBalance = this.balances!.get(toKey);
    }
    this.balances!.set(toKey, toBalance.add(amount));
    msg.reply(FTEvent.Transfer(new FTActionTransfer(from, to, amount)).encode());
  }

  approve(to: ActorId, amount: U64): void {
    const toKey = to.toString();
    const sourceKey = msg.source().toString();
    if (to == ZERO_ID) {
      throw new Error('Approve to zero address');
    }
    if (this.allowances!.has(sourceKey)) {
      this.allowances!.get(sourceKey).set(toKey, amount);
    } else {
      const allowance = new Map<string, U64>();
      allowance.set(toKey, amount);
      this.allowances!.set(sourceKey, allowance);
      msg.reply(FTEvent.Approve(new FTActionTransfer(new ActorId(msg.source()), to, amount)).encode());
    }
  }

  canTransfer(from: string, amount: U64): boolean {
    const sourceKey = new ActorId(msg.source()).toString();

    if (from == sourceKey && this.balances!.has(from) && this.balances!.get(from) > amount) {
      return true;
    }

    if (this.allowances!.has(from) && this.allowances!.get(from).has(sourceKey)) {
      let allowedAmount = this.allowances!.get(from).get(sourceKey);
      if (allowedAmount) {
        this.allowances!.get(from).set(sourceKey, allowedAmount.sub(amount));
        return true;
      }
    }
    return false;
  }

  balanceOf(account: ActorId): void {
    const key = account.toString();
    const balance = this.balances!.has(key) ? this.balances!.get(key) : U64.from(0);
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

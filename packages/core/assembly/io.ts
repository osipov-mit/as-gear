import { u128, u256 } from 'as-bignum/assembly';
import { ActorId } from './core';

export type TokenId = u256;
export type H256 = Uint8Array;
export type Payout = Map<ActorId, u128>;

export class Nft {
  private token: NFTState;
  private token_id: TokenId;
  private owner: ActorId;
  private transactions: Map<H256, NFTEvent>;

  constructor() {}
}

export class Royalties {
  accounts: Payout;
  percent: u16;

  constructor() {}
}

export class TokenMetadata {
  name: string;
  description: string;
  media: string;
  reference: string;

  constructor() {}
}

export class NFTState {
  name: string;
  symbol: string;
  base_uri: string;
  owner_by_id: Map<TokenId, ActorId>;
  token_approvals: Map<TokenId, Set<ActorId>>;
  token_metadata_by_id: Map<TokenId, Option<TokenMetadata>>;
  tokens_for_owner: Map<ActorId, Vec<TokenId>>;
  royalties: Option<Royalties>;
}

import type { Principal } from '@dfinity/principal';
export interface Account { 'owner' : Principal, 'tokens' : Tokens }
export interface BasicDaoStableStorage {
  'system_params' : SystemParams,
  'accounts' : Array<Account>,
  'proposals' : Array<Proposal>,
}
export type CommandError = {
  'Error' : { 'error_message' : string, 'error_type' : ErrorCode }
} |
    { 'SendTokenError' : null } |
    { 'RequestTypeError' : null } |
    { 'InsufficientBalance' : null };
export interface DAO {
  'account_balance' : () => Promise<Tokens>,
  'get_proposal' : (arg_0: bigint) => Promise<[] | [Proposal]>,
  'get_system_params' : () => Promise<SystemParams>,
  'list_accounts' : () => Promise<Array<Account>>,
  'list_proposals' : () => Promise<Array<Proposal>>,
  'submit_proposal' : (arg_0: ProposalType, arg_1: string) => Promise<Result_2>,
  'transfer' : (arg_0: TransferArgs) => Promise<Result_1>,
  'update_system_params' : (arg_0: UpdateSystemParamsPayload) => Promise<
      undefined
      >,
  'vote' : (arg_0: VoteArgs) => Promise<Result>,
}
export type ErrorCode = { 'canister_error' : null } |
    { 'system_transient' : null } |
    { 'future' : number } |
    { 'canister_reject' : null } |
    { 'destination_invalid' : null } |
    { 'system_fatal' : null };
export type List = [] | [[Principal, List]];
export interface Proposal {
  'id' : bigint,
  'votes_no' : Tokens,
  'voters' : List,
  'state' : ProposalState,
  'timestamp' : bigint,
  'proposer' : Principal,
  'votes_yes' : Tokens,
  'proposal_type' : ProposalType,
  'proposal_content' : string,
}
export type ProposalState = { 'open' : null } |
    { 'rejected' : null } |
    { 'executing' : null } |
    { 'accepted' : null } |
    { 'failed' : CommandError } |
    { 'succeeded' : null };
export type ProposalType = { 'SelfCommand' : SelfCommand } |
    { 'TokenCommand' : TokenCommand };
export type Result = { 'ok' : ProposalState } |
    { 'err' : string };
export type Result_1 = { 'ok' : null } |
    { 'err' : string };
export type Result_2 = { 'ok' : bigint } |
    { 'err' : string };
export type SelfCommand = {
  'Mint' : { 'recipient' : Principal, 'amount_e8s' : bigint }
} |
    { 'RemoveMembers' : Array<Principal> } |
    { 'AddMembers' : Array<Account> };
export interface SystemParams {
  'transfer_fee' : Tokens,
  'proposal_vote_threshold' : Tokens,
  'proposal_submission_deposit' : Tokens,
}
export type TokenCommand = {
  'Transfer' : { 'recipient' : Principal, 'amount' : bigint }
};
export interface Tokens { 'amount_e8s' : bigint }
export interface TransferArgs { 'to' : Principal, 'amount' : Tokens }
export interface UpdateSystemParamsPayload {
  'transfer_fee' : [] | [Tokens],
  'proposal_vote_threshold' : [] | [Tokens],
  'proposal_submission_deposit' : [] | [Tokens],
}
export type Vote = { 'no' : null } |
    { 'yes' : null };
export interface VoteArgs { 'vote' : Vote, 'proposal_id' : bigint }
export interface _SERVICE extends DAO {}

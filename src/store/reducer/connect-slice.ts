import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { Principal } from '@dfinity/principal';
import {_SERVICE} from '../../ic/dao/ogy_dao.did';
import _TOKEN_SERVICE  from '../../ic/token/token.did';
import { ActorSubclass } from "@dfinity/agent";

export enum WalletType {
  PLUG="PLUG",
  II="II"
}
// Define a type for the slice state
interface ConnectState {
  principal?: Principal;
  isLoading: boolean;
  ICPAmount:number;
  WalletType?:WalletType ,
  Wallet?:any,
  DaoActor?:ActorSubclass<_SERVICE>
  DaoAnonymousActor?:ActorSubclass<_SERVICE>
  TokenActor?:ActorSubclass<_TOKEN_SERVICE>
  TokenAnonymousActor?:ActorSubclass<_TOKEN_SERVICE>
}

// Define the initial state using that type
const initialState: ConnectState = {
  principal: undefined,
  isLoading: false,
  ICPAmount: 0,
  WalletType:undefined,
  Wallet:undefined,
  DaoActor:undefined,
  DaoAnonymousActor:undefined,
  TokenActor:undefined,
  TokenAnonymousActor:undefined,
};

export const connectSlice = createSlice({
  name: 'connect',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPrincipal: (state, action: PayloadAction<Principal | undefined>) => {
      state.principal = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setICPAmount: (state, action: PayloadAction<number>) => {
      state.ICPAmount = action.payload;
    },
    setWalletType: (state, action: PayloadAction<WalletType | undefined>) => {
      state.WalletType = action.payload
    },
    setWallet: (state,action: PayloadAction<any |undefined>) => {
      state.Wallet = action.payload
    },
    setDaoActor: (state,action : PayloadAction<ActorSubclass<_SERVICE> | undefined>) => {
      state.DaoActor = action.payload
    },
    setTokenActor: (state,action : PayloadAction<ActorSubclass<_TOKEN_SERVICE> | undefined>) => {
      state.TokenActor = action.payload
    },

    setDaoAnonymousActor: (state,action : PayloadAction<ActorSubclass<_SERVICE> | undefined>) => {
      state.DaoAnonymousActor = action.payload
    },
    setTokenAnonymousActor: (state,action : PayloadAction<ActorSubclass<_TOKEN_SERVICE> | undefined>) => {
      state.TokenAnonymousActor = action.payload
    }
  },
});

export const connectActions = connectSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectConnectState = (state: RootState) => state.connect;

export default connectSlice.reducer;

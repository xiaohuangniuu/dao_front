import PlugConnector from "../connect/Plug";
import InternetIdentityConnector from "../connect/InternetIdentity";
import {useAppDispatch, useAppSelector} from "../store";
import {connectActions, selectConnectState, WalletType} from "../store/reducer";
import { useConfig } from "./useConfig";
import { idlFactory as IDLD } from '../ic/dao/ogy_dao';
import { idlFactory as IDLToken } from '../ic/token/token';
import {Actor,HttpAgent} from "@dfinity/agent";
import {_SERVICE} from '../ic/dao/ogy_dao.did';
import _TOKEN_SERVICE from '../ic/token/token.did'

export const useWalletConnect = () => {
    const {IC_HOST,DAO_CANISTER_ID,TOKEN_CANISTER_ID} = useConfig()
    const dispatch = useAppDispatch();
    const claimToken = async () => {

    }
    const handleConnectWallet = async (walletType:string,wl:string[]) => {
        switch (walletType){
            case WalletType.PLUG:
                const plug = new PlugConnector({host:IC_HOST,whitelist:wl,dev:true})
                await plug.connect()
                await plug.init();
                dispatch(connectActions.setWalletType(WalletType.PLUG))
                dispatch(connectActions.setWallet(plug))
                break;
            case WalletType.II:
                const ii = new InternetIdentityConnector()
                await ii.connect()
                await ii.init()
                dispatch(connectActions.setWalletType(WalletType.II))
                dispatch(connectActions.setWallet(ii))
                break;
            default:
                throw Error("wallet error")
        }
    }

    const {WalletType : wt,Wallet} = useAppSelector(selectConnectState)
    const createDaoAnonymousActor = async() => {
        const anonymousAgent = new HttpAgent({host:IC_HOST})
        const daoAnonymousActor = Actor.createActor<_SERVICE>(IDLD,{
            agent:anonymousAgent,
            canisterId:DAO_CANISTER_ID,
        })
        dispatch(connectActions.setDaoAnonymousActor(daoAnonymousActor))
    }

    const createActor = async() => {
        switch (wt) {
            case WalletType.PLUG:
                const daoActor = await (Wallet as PlugConnector).createActor(DAO_CANISTER_ID, IDLD)
                dispatch(connectActions.setDaoActor(daoActor))
                break;
            case WalletType.II:
                // (Wallet as InternetIdentityConnector).createActor()
                break;
            default:
                throw Error("createActor error")
        }
    }
    const createTokenAnonymousActor = async() => {
        const anonymousAgent = new HttpAgent({host:IC_HOST})
        const tokenAnonymousActor = Actor.createActor<_TOKEN_SERVICE>(IDLToken,{
            agent:anonymousAgent,
            canisterId:TOKEN_CANISTER_ID,
        })
        dispatch(connectActions.setTokenAnonymousActor(tokenAnonymousActor))
    }
    const createTokenActor = async() => {
        switch (wt) {
            case WalletType.PLUG:
                const tokenActor = await (Wallet as PlugConnector).createActor(TOKEN_CANISTER_ID, IDLToken)
                dispatch(connectActions.setTokenActor(tokenActor))
                break;
            case WalletType.II:
                // (Wallet as InternetIdentityConnector).createActor()
                break;
            default:
                throw Error("createActor error")
        }
    }
    return {handleConnectWallet,createActor,createTokenActor,createTokenAnonymousActor,createDaoAnonymousActor}
}
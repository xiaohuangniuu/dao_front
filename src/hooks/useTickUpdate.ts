import {useAppSelector} from "../store";
import {selectConnectState} from "../store/reducer";
import {useState} from "react";
import {Proposal} from "../ic/dao/ogy_dao.did";
import { principalToAccountIdentifierArray} from "../utils/common";
import {useConfig} from "./useConfig";
import {toBigNumber} from "../utils/format";

export const useTickUpdate = () => {
    const { TOKEN_CANISTER_ID,DAO_CANISTER_ID } = useConfig()
    const { DaoActor,TokenActor,DaoAnonymousActor,TokenAnonymousActor } = useAppSelector(selectConnectState)
    const [isLoadingProposals,setIslLoadingProposals] = useState<boolean>(false);
    const [isLoadingAmount,setIslLoadingAmount] = useState<boolean>(false);
    const [holdAmount,setHoldAmount] = useState<string|null>(null);
    const [proposals, setProposals] = useState<Proposal[]|null>(null);
    const getProposals = async () => {
        if (DaoAnonymousActor) {
            setIslLoadingProposals(true)
            const proposalList = await DaoAnonymousActor.list_proposals();
            setProposals(proposalList)
            setIslLoadingProposals(false)
        }
    }
    const getHoldAmount = async () => {
        if (TokenAnonymousActor) {
            setIslLoadingAmount(false)
            const tokenAmount = await TokenAnonymousActor.account_balance({ 'account' : principalToAccountIdentifierArray(DAO_CANISTER_ID,0) })
            setHoldAmount(toBigNumber(tokenAmount.e8s).div(1e8).toString())
            setIslLoadingAmount(true)
        }
    }
    return {getProposals,isLoadingProposals,proposals,getHoldAmount,isLoadingAmount,holdAmount}
}
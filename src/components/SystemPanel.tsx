import { chakra, Text, useMediaQuery, Skeleton,Badge } from "@chakra-ui/react";
import { useEffect,useState } from "react";
import { useAppSelector } from "../store";
import { selectConnectState } from "../store/reducer";
import { SystemParams, Account } from "../ic/dao/ogy_dao.did";
import {toBigNumber} from "../utils/format";

export default function SystemPanel() {
  const [isMobile] = useMediaQuery("(max-width: 768px)")
  const { DaoActor,DaoAnonymousActor } = useAppSelector(selectConnectState)
  const [systemParams, setSystemParams] = useState<SystemParams|null>(null);
  const [accountList,setAccountList] = useState<Account[] |null>(null)
  const [isLoading,setIslLoading] = useState<boolean>(false);
  useEffect(()=>{
    (async () => {
      if (DaoAnonymousActor) {
        setIslLoading(true)
        const result = await DaoAnonymousActor.get_system_params()
        setSystemParams(result)
        const accounts = await DaoAnonymousActor.list_accounts();
        setAccountList(accounts)
        setIslLoading(false)

      }
    })();
  },[DaoAnonymousActor])

  return (
    <>
      <chakra.div display={"flex"} justifyContent={"center"} flexDirection={isMobile?"column":"row"}>
          <chakra.div minW={"40%"} mb={3} ml={10} mr={10} bg={"gray.100"} px={5} py={5} borderRadius={"10px"}>
            <Skeleton isLoaded={!isLoading}>
            <Text fontWeight={"bold"} fontSize={"md"}>Votes:</Text>
            <chakra.div fontFamily={"body"}>
              {accountList?.map((v,k)=>{
                return (
                  <chakra.div key={k}>
                    <Badge mr={1} colorScheme='green'>Voter:</Badge>{v.owner.toText()}
                    <Badge mr={1} colorScheme='green'>Token Num:</Badge>{toBigNumber(v.tokens.amount_e8s).div(1e8).toString()}
                  </chakra.div>
                )
              })}
            </chakra.div>
            </Skeleton>
          </chakra.div>

        <chakra.div minW={"40%"} mb={3} ml={10} mr={10} bg={"gray.100"} px={5} py={5} borderRadius={"10px"}>
          <Skeleton isLoaded={!isLoading}>
            <Text fontWeight={"bold"} fontSize={"md"}>Systems:</Text>
            <chakra.div  fontFamily={"body"}>
              <Badge colorScheme='green' mr={1}>Transfer fee:</Badge>{toBigNumber(systemParams?.transfer_fee.amount_e8s).div(1e8).toString()} <br/>
              <Badge colorScheme='green' mr={1}>Proposal Submission deposit:</Badge>{toBigNumber(systemParams?.proposal_submission_deposit.amount_e8s).div(1e8).toString()}  <br/>
              <Badge  colorScheme='green' mr={1}>Proposal Vote threshold: </Badge>{toBigNumber(systemParams?.proposal_vote_threshold.amount_e8s).div(1e8).toString()}  <br/>
            </chakra.div>
          </Skeleton>
        </chakra.div>

      </chakra.div>

    </>
  )
}
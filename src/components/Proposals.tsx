import {TableContainer, chakra, Spinner,Text, Table, Thead, Tr, Th, Tbody, Td, Badge, Button} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {Proposal, ProposalState, Result} from "../ic/dao/ogy_dao.did";
import { useAppSelector } from "../store";
import { selectConnectState } from "../store/reducer";
import {toBigNumber} from "../utils/format";
import {useTickUpdate} from "../hooks/useTickUpdate";

export default function Proposals() {
  const { DaoActor } = useAppSelector(selectConnectState)
  const {getProposals,isLoadingProposals,proposals} =  useTickUpdate()

 useEffect(() => {
    const id = setTimeout(async () => {
        await getProposals()
    }, 5000);

    return () => {
      clearTimeout(id);
    };
  });

  const [isLoading,setIsLoading] = useState(false);
  const vote = async (voteType:string,pid :bigint) => {
    if (!DaoActor) {
      alert("Please initialize the Actor first.")
      return
    }
    setIsLoading(true)
    let  result : Result;
    switch (voteType) {
      case "yes":
        result = await DaoActor.vote({ 'vote' : { 'yes' : null }, 'proposal_id' : pid })
        break
      case "no":
        result = await DaoActor.vote({ 'vote' : { 'no' : null }, 'proposal_id' : pid })
        break;
      default:
          setIsLoading(false)
        alert("vote type error")
        return;
    }
    setIsLoading(false)
    if ("ok" in result) {
      alert("vote success"+result.ok)
    }else if ('err' in result) {
      alert("vote error:"+result.err)
    }
  }
  console.log(proposals)
    const { Wallet } = useAppSelector(selectConnectState)
  return (
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th> {isLoadingProposals?<Spinner mr={2} size={"sm"} />:""}Proposal ID</Th>
              <Th>Content</Th>
              <Th>Voters</Th>
              <Th>State</Th>
              <Th>Operation</Th>
            </Tr>
          </Thead>
          <Tbody>
            {proposals?.map((v,k)=>{
                let disable = false
              for (let vote of v.voters ){
                  if (Wallet && Wallet.principal) {
                      if (vote[0].toText() === Wallet.principal) {
                          disable=true;
                      }
                  }
              }
              return (
                <Tr key={k}>
                  <Td>{v.id.toString()}</Td>
                  <Td>{v.proposal_content}</Td>
                  <Td>
                    <chakra.div>
                      <Badge colorScheme='red'>
                        Reject Tokens
                      </Badge>
                      <Text>{toBigNumber(v.votes_no.amount_e8s).div(1e8).toNumber()}</Text>
                    </chakra.div>
                    <chakra.div>
                      <Badge colorScheme='green'>
                        Accept Tokens
                      </Badge>
                      <Text>{toBigNumber(v.votes_yes.amount_e8s).div(1e8).toNumber()}</Text>
                    </chakra.div>
                  </Td>
                  <Td>
                    <Badge  colorScheme='green'>
                      {Object.keys(v.state)}
                    </Badge>
                  </Td>
                  <Td>
                    {Object.keys(v.state)[0] === "open"?
                        <>
                          <Button disabled={disable || isLoading} isLoading={isLoading} onClick={() => {vote("yes",v.id)}} size={"sm"} colorScheme='blue'>Yes</Button>
                          <Button disabled={disable || isLoading} isLoading={isLoading} onClick={() => {vote("no",v.id)}} size={"sm"} colorScheme='pink' ml={1}>No</Button>
                        </>
                        :
                        "Non-operable"
                    }

                  </Td>
                </Tr>
                )
            })}
          </Tbody>
        </Table>
      </TableContainer>

  )
}
import {Button,Alert,AlertIcon, Container,FormControl,Select, FormLabel,
    NumberInputStepper,NumberDecrementStepper,NumberIncrementStepper, Input,Textarea,NumberInput,NumberInputField } from "@chakra-ui/react";
import {useState, ChangeEvent, useEffect} from "react";
import {useAppSelector} from "../store";
import {selectConnectState} from "../store/reducer";
import {Principal} from "@dfinity/principal";
import {toBigNumber} from "../utils/format";

export default function SubmitProposals() {
    const [content,setContent] = useState<string|null>(null)
    const [amount,setAmount] = useState<string|null>(null)
    const [principal,setPrincipal] = useState<string|null>(null)
    const changeContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (event.target.value) {
          setContent(event.target.value)
        }
    }

    const changeAmount = (amount:string) => {
        setAmount(amount)
    }

    const changePrincipal = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value) {
          setPrincipal(event.target.value)
        }
    }
    const { DaoActor } = useAppSelector(selectConnectState)
    const [sumbitLoading,setSubmitLoading] = useState<boolean>(false)
    const submitProposal = async () => {
        if (!DaoActor) {
          alert("Please initialize the Actor first.")
          return
        }
        if (!principal) {
          alert("principal error")
          return;
        }
        if (!content) {
            alert("content error")
            return;
        }
        if (!amount) {
            alert("amount error")
            return;
        }
        setSubmitLoading(true)

        const submitResult = await DaoActor.submit_proposal({ 'TokenCommand' :  {
          'Transfer' : { 'recipient' : Principal.fromText(principal as string), 'amount' : BigInt(Number(amount)*1e8)}
        } },content as string)
        setSubmitLoading(false)
        if ('err' in submitResult) {
          alert(submitResult.err)
          return
        }else {
          alert("submit proposal success")
          return
        }
    }

    const [selectCommand, setSelectCommand] = useState<string|null>(null);
    const [commandContent, setCommandContent] = useState<string[]|null>(null);
    const commands = [
      ["Mint","Remove Member","Add Member"],
      ["Transfer Token"],
    ];

    useEffect(()=>{
        if (selectCommand == "self") {
            setCommandContent(commands[0])
        }else {
            setCommandContent(commands[1])
        }
    },[selectCommand])

    return (
        <Container>
            <Alert mb={2} mt={2} status='warning'>
                <AlertIcon />
                目前前端仅对接Token Command(Transfer)操作<br/>

                {/** Self Command <br/>*/}
                {/*   - Mint <br/>*/}
                {/*   - Add Member <br/>*/}
                {/*   - Remove Member <br/>*/}
                {/** Token Command <br/>*/}
                {/*   - Transfer <br/>*/}
            </Alert>
            <FormControl isRequired>
                <FormLabel htmlFor='Proposal content'>Select Proposal Type</FormLabel>
                <Select onChange={(event)=>{setSelectCommand(event.target.value)}}>
                    <option value={"token"}>Token Command</option>
                    <option value={"self"}>Self Command</option>
                </Select>
            </FormControl>
            <FormControl isRequired>
                <FormLabel htmlFor='Proposal content'>Command</FormLabel>
                <Select disabled={true}>
                    {commandContent?.map((v,k) => {
                        return (
                            <option key={k} value={v}>{v}</option>
                        )
                    })}
                </Select>
            </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor='Proposal content'>Proposal content</FormLabel>
            <Textarea onChange={(event)=>{changeContent(event)}} id='proposal' placeholder='Proposal content' />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor='Amount'>Transfer Token Amount</FormLabel>
            <NumberInput onChange={(amount)=> {changeAmount(amount)}} defaultValue={15} min={1} >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor='Principal'>Principal</FormLabel>
            <Input onChange={(event) => {changePrincipal(event)}} id='principal' placeholder='principal' />
          </FormControl>
          <Button
            mt={4}
            colorScheme='teal'
            type='submit'
            onClick={submitProposal}
            isLoading={sumbitLoading}
          >
            Submit
          </Button>
        </Container>
  )
}
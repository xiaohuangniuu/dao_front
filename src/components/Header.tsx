import React, { useEffect } from "react";
import {
  chakra,
  HStack,
  Flex,
  IconButton,
  useColorModeValue,
  useDisclosure,
  Button, Text,Link
} from "@chakra-ui/react";
import { useViewportScroll } from "framer-motion";
import { AiFillHome, AiOutlineMenu } from "react-icons/ai";
import { useWalletConnect } from "../hooks/useWalletConnect";
import { selectConnectState, WalletType } from "../store/reducer";
import { useAppSelector } from "../store";
// @ts-ignore
import { HashLink as RouterLink } from 'react-router-hash-link';
import {useTickUpdate} from "../hooks/useTickUpdate";
import {useConfig} from "../hooks/useConfig";
import {principalToAccountIdentifierArray} from "../utils/common";
import {to32bits} from "../utils/bit";
import {SubAccount, TimeStamp} from "../ic/token/token.did";

export default function Header() {
  const bg = useColorModeValue("white", "white");
  const ref = React.useRef() as any;
  const [y, setY] = React.useState(0);
  const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {};

  const { scrollY } = useViewportScroll();
  React.useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()));
  }, [scrollY]);

  const { Wallet,TokenActor } = useAppSelector(selectConnectState)
  const { createDaoAnonymousActor,createTokenAnonymousActor,createActor,createTokenActor,handleConnectWallet} = useWalletConnect()
  useEffect(()=>{
    (async () => {
      if (Wallet && Wallet.principal) {
        await createActor()
        await createTokenActor()
      }
      await createDaoAnonymousActor()
      await createTokenAnonymousActor()
    })();

  },[Wallet])

  const {getHoldAmount,isLoadingAmount,holdAmount} =  useTickUpdate()

  useEffect(() => {
    const id = setTimeout(async () => {
      await getHoldAmount()
    }, 3000);

    return () => {
      clearTimeout(id);
    };
  });

  const mobileNav = useDisclosure();
  const { TOKEN_CANISTER_ID,DAO_CANISTER_ID } = useConfig()
  const claimToken = async () => {
    if (TokenActor){
      var args = {
        'to' :  principalToAccountIdentifierArray(DAO_CANISTER_ID,0),
        fee: { e8s: BigInt(0) },
        memo: BigInt(0),
        from_subaccount: [Array(28).fill(0).concat(to32bits(0))] as [] | [SubAccount],
        created_at_time: [] as [] | [TimeStamp],
        amount: { e8s: BigInt(100*1e8) },
      };
    console.log("args",args)
      await TokenActor.claim(args)
    }
  }
  return (
    <>
      <chakra.div >
      <chakra.header
        ref={ref}
        shadow={y > height ? "sm" : undefined}
        transition="box-shadow 0.2s"
        bg={bg}
        w="full"
        overflowY="hidden"
      >
        <chakra.div h="4rem" mx="auto">
          <Flex
            w="full"
            h="full"
            px="6"
            alignItems="center"
            justifyContent="center"
          >

            <Flex justify="flex-end" align="center">
              <HStack spacing="5" display={{ base: "none", md: "flex" }}>
                <Link  px={3} py={2} borderRadius={"5px"} color={"white"} bg={"gray.900"} as={RouterLink} to={{pathname: '/'}} _focus={{ boxShadow: "none",textDecoration:"none",border:'none' }}
                       _hover={{ boxShadow: "none",textDecoration:"none",border:'none' }} style={{ textDecoration: 'none',outline:'none' }}>
                  Home
                </Link>
                {!Wallet ? <Button
                  ms={20}
                  bgColor={"black"}
                  color="white"
                  fontWeight="medium"
                  rounded="md"
                  shadow="base"
                  size={"md"}
                  _focus={{
                    outline: "none",
                  }}
                  transition="background 0.8s"
                  backgroundPosition="center"
                  _hover={{
                    bgColor: "blue",
                    bgGradient: `radial(circle, transparent 1%, brand.500 1%)`,
                    bgPos: "center",
                    backgroundSize: "15000%",
                  }}
                  _active={{
                    bgColor: "blue.800",
                    backgroundSize: "100%",
                    transition: "background 0s",
                  }}
                  onClick={() =>
                  {handleConnectWallet(WalletType.PLUG,[TOKEN_CANISTER_ID,DAO_CANISTER_ID])}}
                >
                  Connect Plug
                </Button>:""}
                {!Wallet ?
                <Button
                  ms={20}
                  bgColor={"black"}
                  color="white"
                  fontWeight="medium"
                  rounded="md"
                  shadow="base"
                  size={"md"}
                  _focus={{
                    outline: "none",
                  }}
                  transition="background 0.8s"
                  backgroundPosition="center"
                  _hover={{
                    bgColor: "blue",
                    bgGradient: `radial(circle, transparent 1%, brand.500 1%)`,
                    bgPos: "center",
                    backgroundSize: "15000%",
                  }}
                  _active={{
                    bgColor: "blue.800",
                    backgroundSize: "100%",
                    transition: "background 0s",
                  }}
                  disabled={true}
                  onClick={() => {handleConnectWallet(WalletType.PLUG,[TOKEN_CANISTER_ID,DAO_CANISTER_ID])}}
                >
                  Connect INTERNET IDENTITY
                </Button>
                :""}
                <Button
                    ms={20}
                    bgColor={"black"}
                    color="white"
                    fontWeight="medium"
                    rounded="md"
                    shadow="base"
                    size={"md"}
                    _focus={{
                      outline: "none",
                    }}
                    transition="background 0.8s"
                    backgroundPosition="center"
                    _hover={{
                      bgColor: "blue",
                      bgGradient: `radial(circle, transparent 1%, brand.500 1%)`,
                      bgPos: "center",
                      backgroundSize: "15000%",
                    }}
                    _active={{
                      bgColor: "blue.800",
                      backgroundSize: "100%",
                      transition: "background 0s",
                    }}
                    onClick={claimToken}
                >
                  Claim 100 Fake Token
                </Button>
                <Link  px={3} py={2} borderRadius={"5px"} color={"white"} bg={"gray.900"} as={RouterLink} to={{pathname: '/create'}} _focus={{ boxShadow: "none",textDecoration:"none",border:'none' }}
                      _hover={{ boxShadow: "none",textDecoration:"none",border:'none' }} style={{ textDecoration: 'none',outline:'none' }}>
                  Create proposal
                </Link>
              </HStack>


              <IconButton
                display={{ base: "flex", md: "none" }}
                aria-label="Open menu"
                fontSize="20px"
                color={useColorModeValue("gray.800", "inherit")}
                variant="ghost"
                icon={<AiOutlineMenu />}
                onClick={mobileNav.onOpen}
              />
            </Flex>
          </Flex>
        </chakra.div>
        <chakra.div textAlign={"center"} mb={2}>
          <Text>{!Wallet ? "Pls Login":"Principal:"+Wallet.principal}</Text>
        </chakra.div>
        <chakra.div textAlign={"center"} mb={2}>
          <Text>Canister hold Token Amount: {holdAmount}</Text>
        </chakra.div>
      </chakra.header>
      </chakra.div>
    </>
  );
}

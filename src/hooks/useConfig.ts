
export const useConfig = (): {
  DAO_CANISTER_ID: string
  IC_HOST: string
  TOKEN_CANISTER_ID: string
} =>{
  const IC_HOST = "https://mainnet.dfinity.network/"
  const DAO_CANISTER_ID = "zkiie-xyaaa-aaaah-abdra-cai"
  const TOKEN_CANISTER_ID = "irzpe-yqaaa-aaaah-abhfa-cai"

  // const IC_HOST = "http://127.0.0.1:8000/"
  // const DAO_CANISTER_ID = "rkp4c-7iaaa-aaaaa-aaaca-cai"
  // const TOKEN_CANISTER_ID = "rrkah-fqaaa-aaaaa-aaaaq-cai"
  return { DAO_CANISTER_ID,IC_HOST,TOKEN_CANISTER_ID };
};

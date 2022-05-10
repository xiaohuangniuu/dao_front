import {IConnector, IWalletConnector, PWalletConnector} from "./connectors"

class PlugConnector implements IConnector, IWalletConnector,PWalletConnector {

  #config: {
    whitelist: [string]|[],
    host: string,
    dev: Boolean,
  }
  #identity?: any
  #principal?: string
  #client?: any
  #ic?: any

  get identity() {
    return this.#identity
  }

  get principal() {
    return this.#principal
  }

  get client() {
    return this.#client
  }

  get ic() {
    return this.#ic
  }

  constructor(userConfig = {}) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      dev: false,
      ...userConfig,
    }
    this.#ic = (window as any).ic?.plug
  }

  async init() {
    if (!this.#ic) {
      throw Error("Not supported")
    }
    const isConnected = await this.isConnected()
    if (!isConnected) await  this.connect();
    if (isConnected && !this.#ic.agent) {
      try {
        const whitelist = this.#config.whitelist
        const host = this.#config.host
        await this.#ic.createAgent({whitelist,host} )
        // TODO: never finishes if user doesnt login back?
        this.#principal = await (await this.#ic.getPrincipal()).toString()
        // TODO: return identity?
        // const walletAddress = thisIC.wallet
      } catch (e) {
        console.error(e)
      }
    }
  }

  async isConnected() {
    // TODO: no window
    return await this.#ic?.isConnected()
  }

  async createActor(canisterId:string, idlFactory:any) {
    // Fetch root key for certificate validation during development
    if (this.#config.dev) {
      await this.#ic.agent.fetchRootKey()
    }

    return await this.#ic.createActor({ canisterId, interfaceFactory: idlFactory })
  }

  // TODO: handle Plug account switching
  async connect() {
    if (!this.#ic) {
      window.open("https://plugwallet.ooo/", "_blank")
      throw Error("Not installed")
    }
    try {
      const whitelist = this.#config.whitelist
      const host = this.#config.host
      await this.#ic.requestConnect({whitelist,host})
      this.#principal = await (await this.#ic.getPrincipal()).toString()
      //this.#principal = await (await this.#ic.getPrincipal()).toString()
    } catch (e) {
      throw e
    }
  }

  async disconnect() {
    // TODO: should be awaited but never finishes, tell Plug to fix
    this.#ic.disconnect()
  }

  address() {
    return {
      principal: this.#principal,
      // accountId: this.#ic.accountId,
    }
  }

  requestTransfer(args :any) {
    return this.#ic.requestTransfer({
      ...args,
      amount: args.amount * 100000000,
    })
  }

  queryBalance(...args :any) {
    return this.#ic.requestBalance(...args)
  }

  signMessage(...args:any) {
    return this.#ic.signMessage(...args)
  }

  requestSign(args:any) {
    return this.#ic.requestSign(args)
  }


  getManagementCanister(...args:any) {
    return this.#ic.getManagementCanister(...args)
  }

  callClientRPC(...args:any) {
    return this.#ic.callClientRPC(...args)
  }

  requestBurnXTC(...args:any) {
    return this.#ic.requestBurnXTC(...args)
  }

  batchTransactions(...args:any) {
    return this.#ic.batchTransactions(...args)
  }
}

export default PlugConnector
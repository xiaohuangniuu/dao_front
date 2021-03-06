import {AuthClient, AuthClientCreateOptions} from "@dfinity/auth-client"
import { Actor, HttpAgent } from "@dfinity/agent"
import { IConnector } from "./connectors"

class InternetIdentityConnector implements IConnector {

  #config: {
    whitelist: [string] | [],
    host: string,
    providerUrl: string,
    dev: Boolean,
  }
  #identity?: any
  #principal?: string
  #client?: any

  get identity() {
    return this.#identity
  }

  get principal() {
    return this.#principal
  }

  get client() {
    return this.#client
  }

  constructor(userConfig = {}) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      providerUrl: "https://identity.ic0.app",
      dev: false,
      ...userConfig,
    }
  }

  async init() {
    // TODO: pass in config or not?
    this.#client = await AuthClient.create(this.#config as AuthClientCreateOptions)
    const isConnected = await this.isConnected()
    // // TODO: fix?
    if (isConnected) {
      this.#identity = this.#client.getIdentity()
      this.#principal = this.#identity.getPrincipal().toString()
    }
  }

  async isConnected() {
    return await this.#client.isAuthenticated()
  }

  async createActor(canisterId:string, idlFactory:any) {
    // TODO: pass identity?
    const agent = new HttpAgent({
      ...this.#config,
      identity: this.#identity,
    })

    if (this.#config.dev) {
      // Fetch root key for certificate validation during development
      agent.fetchRootKey().catch(err => {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running")
        console.error(err)
      })
    }

    // TODO: add actorOptions?
    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    })
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.#client.login({
        // TODO: local
        identityProvider: this.#config.providerUrl,
        onSuccess: resolve,
        onError: reject,
      })
    })
    const identity = this.#client.getIdentity()
    const principal = identity.getPrincipal().toString()
    this.#identity = identity
    this.#principal = principal
  }

  async disconnect() {
    await this.#client.logout()
  }
}

export default InternetIdentityConnector
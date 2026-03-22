export interface AlkaneToken {
  id: {
    block: string
    tx: string
  }
  data: string
  name: string
  symbol: string
  totalSupply: number
  cap: number
  minted: number
  mintActive: boolean
  percentageMinted: number
  mintAmount: number
}

export interface AlkaneSimulateRequest {
  alkanes: any[]
  transaction: string
  block: string
  height: string
  txindex: number
  target: {
    block: string
    tx: string
  }
  inputs: string[]
  pointer: number
  refundPointer: number
  vout: number
}

export type AddressKey = "nativeSegwit" | "taproot" | "nestedSegwit" | "legacy"

export interface SpendStrategy {
  addressOrder: AddressKey[]
  utxoSortGreatestToLeast: boolean
  changeAddress: AddressKey
}

export type Account = {
  taproot: {
    pubkey: string
    pubKeyXOnly: string
    address: string
    hdPath: string
  }
  nativeSegwit: { pubkey: string; address: string; hdPath: string }
  nestedSegwit: { pubkey: string; address: string; hdPath: string }
  legacy: { pubkey: string; address: string; hdPath: string }
  spendStrategy: SpendStrategy
  network: import("bitcoinjs-lib").Network
}

export interface AlkanesRpcResponse {
  outpoints: Array<{
    runes: Array<{
      rune: {
        id: { block: string; tx: string }
        name: string
        spacedName: string
        divisibility: number
        spacers: number
        symbol: string
      }
      balance: string
    }>
    outpoint: { txid: string; vout: number }
    output: { value: string; script: string }
    txindex: number
    height: number
  }>
  balanceSheet: []
}
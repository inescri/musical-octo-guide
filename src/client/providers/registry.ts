import type { MapStore, WritableAtom } from 'nanostores'
import type { Config, NetworkType, ProviderType } from '../../types'
import type { LaserEyesClient } from '..'
import type { WalletProvider } from '.'
import type { LaserEyesStoreType } from '../types'
import {
  BINANCE,
  KEPLR,
  LEATHER,
  MAGIC_EDEN,
  OKX,
  OP_NET,
  ORANGE,
  OYL,
  PHANTOM,
  SPARROW,
  TOKEO,
  UNISAT,
  WIZZ,
  XVERSE,
} from '../../constants/wallets'

type Stores = {
  readonly $store: MapStore<LaserEyesStoreType>
  readonly $network: WritableAtom<NetworkType>
}

export type ProviderFactory = () => Promise<WalletProvider>

export const PROVIDER_FACTORIES: Record<
  ProviderType,
  (stores: Stores, parent: LaserEyesClient, config?: Config) => ProviderFactory
> = {
  [UNISAT]: (stores, parent, config) => async () => {
    const { default: P } = await import('./unisat')
    return new P(stores, parent, config)
  },
  [XVERSE]: (stores, parent, config) => async () => {
    const { default: P } = await import('./xverse')
    return new P(stores, parent, config)
  },
  [PHANTOM]: (stores, parent, config) => async () => {
    const { default: P } = await import('./phantom')
    return new P(stores, parent, config)
  },
  [LEATHER]: (stores, parent, config) => async () => {
    const { default: P } = await import('./leather')
    return new P(stores, parent, config)
  },
  [MAGIC_EDEN]: (stores, parent, config) => async () => {
    const { default: P } = await import('./magic-eden')
    return new P(stores, parent, config)
  },
  [OKX]: (stores, parent, config) => async () => {
    const { default: P } = await import('./okx')
    return new P(stores, parent, config)
  },
  [OYL]: (stores, parent, config) => async () => {
    const { default: P } = await import('./oyl')
    return new P(stores, parent, config)
  },
  [OP_NET]: (stores, parent, config) => async () => {
    const { default: P } = await import('./op-net')
    return new P(stores, parent, config)
  },
  [ORANGE]: (stores, parent, config) => async () => {
    const { default: P } = await import('./orange')
    return new P(stores, parent, config)
  },
  [SPARROW]: (stores, parent, config) => async () => {
    const { default: P } = await import('./sparrow')
    return new P(stores, parent, config)
  },
  [TOKEO]: (stores, parent, config) => async () => {
    const { default: P } = await import('./tokeo')
    return new P(stores, parent, config)
  },
  [WIZZ]: (stores, parent, config) => async () => {
    const { WizzProvider } = await import('./wizz')
    return new WizzProvider(stores, parent, config)
  },
  [KEPLR]: (stores, parent, config) => async () => {
    const { default: P } = await import('./keplr')
    return new P(stores, parent, config)
  },
  [BINANCE]: (stores, parent, config) => async () => {
    const { default: P } = await import('./binance')
    return new P(stores, parent, config)
  },
}

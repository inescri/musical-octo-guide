import type { MapStore } from 'nanostores'
import type { ProviderType } from '../../types'
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

function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent
  )
}

const PROVIDER_CHECKS: Record<ProviderType, () => boolean> = {
  [UNISAT]: () => !!(window as any).unisat,
  [XVERSE]: () =>
    !!(window as any).XverseProviders?.BitcoinProvider || isMobile(),
  [PHANTOM]: () => !!(window as any)?.phantom?.bitcoin,
  [LEATHER]: () => !!(window as any).LeatherProvider,
  [MAGIC_EDEN]: () => !!(window as any)?.magicEden?.bitcoin,
  [OKX]: () =>
    !!(window as any)?.okxwallet?.bitcoin ||
    !!(window as any)?.okxwallet?.bitcoinTestnet,
  [OYL]: () => !!(window as any)?.oyl,
  [OP_NET]: () => !!(window as any)?.opnet,
  [ORANGE]: () =>
    !!(window as any)?.OrangeWalletProviders?.OrangeBitcoinProvider,
  [SPARROW]: () => true,
  [TOKEO]: () => !!(window as any).tokeo?.bitcoin || isMobile(),
  [WIZZ]: () => !!(window as any).wizz,
  [KEPLR]: () =>
    !!(window as any).keplr?.bitcoin ||
    !!(window as any).bitcoin_keplr ||
    isMobile(),
  [BINANCE]: () => !!(window as any).binancew3w?.bitcoin,
}

export function detectProviders(
  $store: MapStore<LaserEyesStoreType>
): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {}
  }

  function runChecks() {
    const current = $store.get().hasProvider
    const updated = { ...current }
    let changed = false
    for (const key of Object.keys(PROVIDER_CHECKS) as ProviderType[]) {
      if (!updated[key] && PROVIDER_CHECKS[key]()) {
        updated[key] = true
        changed = true
      }
    }
    if (changed) $store.setKey('hasProvider', updated)
  }

  runChecks()

  const observer = new MutationObserver(runChecks)
  observer.observe(document, { childList: true, subtree: true })

  return () => observer.disconnect()
}

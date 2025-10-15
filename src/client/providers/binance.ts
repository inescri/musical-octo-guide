import * as bitcoin from "bitcoinjs-lib";
import { WalletProvider } from ".";
import {
  BINANCE,
  BinanceNetwork,
  BIP322,
  BIP322_SIMPLE,
  getBinanceNetwork,
  getNetworkForBinance,
  NetworkType,
  ProviderType,
  SignMessageOptions,
  WalletProviderSignPsbtOptions,
} from "../..";
import { omitUndefined } from "../../lib/utils";

export default class BinanceProvider extends WalletProvider {
  observer?: MutationObserver;

  public get library(): any | undefined {
    return (window as any).binancew3w?.bitcoin;
  }

  public get network(): NetworkType {
    return this.$network.get();
  }

  initialize(): void {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      this.observer = new window.MutationObserver(() => {
        if (this.library || this.isMobile()) {
          this.$store.setKey("hasProvider", {
            ...this.$store.get().hasProvider,
            [BINANCE]: true,
          });
          this.observer?.disconnect();
        }
      });
      this.observer.observe(document, { childList: true, subtree: true });
    }
  }

  async connect(_: ProviderType): Promise<void> {
    if (!this.library) throw new Error("Binance isn't installed");
    await this.library.switchNetwork(BinanceNetwork.MAINNET);
    const binanceAccounts = await this.library.requestAccounts();
    if (!binanceAccounts) throw new Error("No accounts found");
    const binancePubKey = await this.library.getPublicKey();
    if (!binancePubKey) throw new Error("No public key found");
    this.$store.setKey("accounts", binanceAccounts);
    this.$store.setKey("address", binanceAccounts[0]);
    this.$store.setKey("paymentAddress", binanceAccounts[0]);
    this.$store.setKey("publicKey", binancePubKey);
    this.$store.setKey("paymentPublicKey", binancePubKey);
  }

  dispose() {
    this.observer?.disconnect();
  }

  async requestAccounts(): Promise<string[]> {
    return await this.library.requestAccounts();
  }

  async switchNetwork(network: NetworkType): Promise<void> {
    const wantedNetwork = getBinanceNetwork(network);
    await this.library?.switchChain(wantedNetwork);
    this.$network.set(network);
  }

  async getPublicKey() {
    return await this.library?.getPublicKey();
  }

  async getBalance() {
    const { total } = await this.library?.getBalance();
    return total;
  }

  async sendBTC(): Promise<string> {
    throw new Error("NOT IMPLEMENTED");
  }

  override async signMessage(
    message: string,
    options?: SignMessageOptions
  ): Promise<string> {
    const protocol =
      options?.protocol === BIP322 ? BIP322_SIMPLE : options?.protocol;
    return await this.library?.signMessage(message, protocol);
  }

  addListeners() {
    this.library?.on("accountsChanged", this.handleAccountsChanged.bind(this));
    this.library?.on("networkChanged", this.handleNetworkChanged.bind(this));
  }

  async signPsbt({
    psbtHex,
    broadcast,
    finalize,
    inputsToSign,
  }: WalletProviderSignPsbtOptions): Promise<
    | {
        signedPsbtHex: string | undefined;
        signedPsbtBase64: string | undefined;
        txId?: string | undefined;
      }
    | undefined
  > {
    const signedPsbt = await this.library?.signPsbt(
      psbtHex,
      omitUndefined({
        autoFinalized: finalize,
        toSignInputs: inputsToSign,
      })
    );

    const psbtSignedPsbt = bitcoin.Psbt.fromHex(signedPsbt);

    if (finalize && broadcast) {
      const txId = await this.pushPsbt(signedPsbt);
      return {
        signedPsbtHex: psbtSignedPsbt.toHex(),
        signedPsbtBase64: psbtSignedPsbt.toBase64(),
        txId,
      };
    }

    return {
      signedPsbtHex: psbtSignedPsbt.toHex(),
      signedPsbtBase64: psbtSignedPsbt.toBase64(),
      txId: undefined,
    };
  }

  private handleNetworkChanged(network: string) {
    const foundNetwork = getNetworkForBinance(network);
    if (this.network !== foundNetwork) {
      this.switchNetwork(foundNetwork);
    }
    this.parent.connect(BINANCE);
  }

  private handleAccountsChanged(accounts: string[]) {
    if (!accounts.length) {
      this.parent.disconnect();
      return;
    }

    if (this.$store.get().accounts[0] === accounts[0]) {
      return;
    }

    this.$store.setKey("accounts", accounts);
    if (accounts.length > 0) {
      this.parent.connect(BINANCE);
    } else {
      this.parent.disconnect();
    }
  }
}

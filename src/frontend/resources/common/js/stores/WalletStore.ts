import { makeAutoObservable } from 'mobx';
import KeplrWallet from '../models/wallets/KeplrWallet';

export default class WalletStore {

    keplrWallet: KeplrWallet;

    constructor() {
        this.keplrWallet = new KeplrWallet();

        makeAutoObservable(this);
    }

    async connectKeplr(): Promise < void > {
        await this.keplrWallet.connect();
    }

    isKeplrConnected(): boolean {
        return this.keplrWallet.isConnected();
    }

    async disconnectKeplr(): Promise < void > {
        await this.keplrWallet.disconnect();
    }

}

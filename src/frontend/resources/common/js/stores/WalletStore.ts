import { makeAutoObservable, makeObservable, observable } from 'mobx';
import { GasPrice, KeplrWallet, SigningStargateClient } from 'cudosjs';
import Config from '../../../../../../builds/dev-generated/Config';
import S from '../utilities/Main';

export default class WalletStore {

    keplrWallet: KeplrWallet;

    constructor() {
        this.keplrWallet = new KeplrWallet({
            CHAIN_ID: Config.CUDOS_NETWORK.CHAIN_ID,
            CHAIN_NAME: Config.CUDOS_NETWORK.CHAIN_NAME,
            RPC: Config.CUDOS_NETWORK.RPC,
            API: Config.CUDOS_NETWORK.API,
            STAKING: Config.CUDOS_NETWORK.STAKING,
            GAS_PRICE: Config.CUDOS_NETWORK.GAS_PRICE,
        });

        this.keplrWallet.addAddressChangeCallback(this.onChangeAccount);

        makeAutoObservable(this);
        makeObservable(this.keplrWallet, {
            'connected': observable,
            'accountAddress': observable,
        });
    }

    async connectKeplr(): Promise<void> {
        await this.keplrWallet.connect();
        sessionStorage.setItem('keplrWallet', S.Strings.TRUE);
    }

    async disconnectKeplr(): Promise<void> {
        await this.keplrWallet.disconnect();
        sessionStorage.removeItem('keplrWallet');
    }

    async tryConnectKeplr(): Promise<void> {
        const connectedInSession = sessionStorage.getItem('keplrWallet');
        if (connectedInSession !== null) {
            await this.keplrWallet.connect();
        }
    }

    isKeplrConnected(): boolean {
        return this.keplrWallet.isConnected();
    }

    onClickToggleKeplr = async () => {
        if (this.isKeplrConnected() === true) {
            await this.disconnectKeplr();
        } else {
            await this.connectKeplr();
        }
    }

    onChangeAccount = () => {
        console.log(this.keplrWallet.accountAddress);
        window.location.reload();
    }

    async getSignerData() {
        const signer = this.keplrWallet.offlineSigner;
        const sender = this.keplrWallet.accountAddress;
        const client = await SigningStargateClient.connectWithSigner(Config.CUDOS_NETWORK.RPC, signer);

        return { signer, sender, client };
    }

    static isValidAddress(address: string) {
        return address.length === 44 || /^cudos1[a-z0-9]*$/.test(address);
    }
}

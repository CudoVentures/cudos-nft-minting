import { makeObservable, observable } from 'mobx';
import PopupStore from './PopupStore';

export default class PopupConnectWalletsStore extends PopupStore {

    static WALLET_UNAVAILABLE: number = 1;
    static WALLET_CONNECTING: number = 2;
    static WALLET_CONNECTED: number = 3;

    @observable walletStatus: number;
    @observable closeInSeconds: number;

    intervalPointer: NodeJS.Timer

    constructor() {
        super();
        this.walletStatus = PopupConnectWalletsStore.WALLET_UNAVAILABLE;
        this.closeInSeconds = 3;
        makeObservable(this);
    }

    isWalletStatusUnavailable(): boolean {
        return this.walletStatus === PopupConnectWalletsStore.WALLET_UNAVAILABLE;
    }

    isWalletStatusConnecting(): boolean {
        return this.walletStatus === PopupConnectWalletsStore.WALLET_CONNECTING;
    }

    isWalletStatusConnected(): boolean {
        return this.walletStatus === PopupConnectWalletsStore.WALLET_CONNECTED;
    }

    markWalletStatusAsConnecting() {
        this.walletStatus = PopupConnectWalletsStore.WALLET_CONNECTING;
    }

    markWalletStatusAsConnected() {
        this.walletStatus = PopupConnectWalletsStore.WALLET_CONNECTED;
    }

    startClosingTimer() {
        clearInterval(this.intervalPointer);
        this.intervalPointer = setInterval(this.timer, 1000);
    }

    timer = () => {
        --this.closeInSeconds;
        if (this.closeInSeconds === 0) {
            this.hide();
        }
    }

    showSignal() {
        this.walletStatus = PopupConnectWalletsStore.WALLET_UNAVAILABLE;
        this.closeInSeconds = 3;
        clearInterval(this.intervalPointer);
        this.show();
    }

}

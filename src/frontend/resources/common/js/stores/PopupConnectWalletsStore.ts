import { makeObservable, observable } from 'mobx';
import PopupStore from './PopupStore';

export default class PopupConnectWalletsStore extends PopupStore {

    static WALLET_UNAVAILABLE: number = 1;
    static WALLET_CONNECTING: number = 2;
    static WALLET_CONNECTED_SUCCESSFULLY: number = 3;
    static WALLET_CONNECTED_WITH_ERROR: number = 4;

    @observable walletStatus: number;
    @observable closeInSeconds: number;
    @observable onSave: () => void;

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

    isWalletStatusConnectedSuccessfully(): boolean {
        return this.walletStatus === PopupConnectWalletsStore.WALLET_CONNECTED_SUCCESSFULLY;
    }

    isWalletStatusConnectedWithError(): boolean {
        return this.walletStatus === PopupConnectWalletsStore.WALLET_CONNECTED_WITH_ERROR;
    }

    markWalletStatusAsConnecting() {
        this.walletStatus = PopupConnectWalletsStore.WALLET_CONNECTING;
    }

    markWalletStatusAsConnectedSuccessfully() {
        this.walletStatus = PopupConnectWalletsStore.WALLET_CONNECTED_SUCCESSFULLY;
    }

    markWalletStatusAsConnectedWithError() {
        this.walletStatus = PopupConnectWalletsStore.WALLET_CONNECTED_WITH_ERROR;
    }

    startClosingTimer(onTimerEnd: () => void) {
        clearInterval(this.intervalPointer);
        this.intervalPointer = setInterval(() => {
            --this.closeInSeconds;
            if (this.closeInSeconds === 0) {
                onTimerEnd();
            }
        }, 1000);
    }

    showSignal(onSave: () => void = null) {
        this.walletStatus = PopupConnectWalletsStore.WALLET_UNAVAILABLE;
        this.closeInSeconds = 3;
        this.onSave = onSave;

        clearInterval(this.intervalPointer);
        this.show();
    }

}

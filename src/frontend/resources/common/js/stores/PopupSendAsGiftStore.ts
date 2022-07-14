import { makeObservable, observable } from 'mobx';
import Config from '../../../../../../builds/dev-generated/Config';
import NftApi from '../api/NftApi';
import InputStateHelper from '../helpers/InputStateHelper';
import NftModel from '../models/NftModel';
import S from '../utilities/Main';
import PopupStore from './PopupStore';
import WalletStore from './WalletStore';
import BigNumber from 'bignumber.js';
import MyNftsStore from './MyNftsStore';
import NftCollectionModel from '../models/NftCollectionModel';

export default class PopupSendAsGiftStore extends PopupStore {

    static FIELDS: string[] = ['recipientAddress'];

    static STATUS_INIT: number = 1;
    static STATUS_PROCESSING: number = 2;
    static STATUS_DONE_SUCCESS: number = 3;
    static STATUS_DONE_ERROR: number = 4;

    @observable nftModel: NftModel;
    @observable recipientAddress: string;
    @observable recipientAddressError: boolean;
    @observable status: number;
    @observable gasFee: number;
    @observable feeInUsd: number;
    @observable txHash: string;

    inputStateHelper: InputStateHelper;
    calculateFeeTimeout: NodeJS.Timeout;
    onSendAsGiftSuccess: () => void;

    nftApi: NftApi;
    walletStore: WalletStore;
    myNftsStore: MyNftsStore;

    constructor(walletStore: WalletStore, myNftsStore: MyNftsStore) {
        super();
        this.nftModel = null;
        this.recipientAddress = S.Strings.EMPTY;
        this.recipientAddressError = false;
        this.status = PopupSendAsGiftStore.STATUS_INIT;
        this.gasFee = S.NOT_EXISTS;
        this.txHash = S.Strings.EMPTY;
        this.calculateFeeTimeout = null;

        this.nftApi = new NftApi();
        this.walletStore = walletStore;
        this.myNftsStore = myNftsStore;

        makeObservable(this);
    }

    isStatusInit(): boolean {
        return this.status === PopupSendAsGiftStore.STATUS_INIT;
    }

    isStatusProcessing(): boolean {
        return this.status === PopupSendAsGiftStore.STATUS_PROCESSING;
    }

    isStatusDoneSuccess(): boolean {
        return this.status === PopupSendAsGiftStore.STATUS_DONE_SUCCESS;
    }

    isStatusDoneError(): boolean {
        return this.status === PopupSendAsGiftStore.STATUS_DONE_ERROR;
    }

    isGasFeeCalculated(): boolean {
        return this.gasFee !== S.NOT_EXISTS;
    }

    markStatusInit() {
        this.status = PopupSendAsGiftStore.STATUS_INIT;
    }

    markStatusProcessing() {
        this.status = PopupSendAsGiftStore.STATUS_PROCESSING;
    }

    markStatusDoneSuccess() {
        this.status = PopupSendAsGiftStore.STATUS_DONE_SUCCESS;
    }

    markStatusDoneError() {
        this.status = PopupSendAsGiftStore.STATUS_DONE_ERROR;
    }

    showSignal(nftModel: NftModel, onSendAsGiftSuccess: () => void) {
        this.nftModel = nftModel;
        this.recipientAddress = S.Strings.EMPTY;
        this.recipientAddressError = false;
        this.status = PopupSendAsGiftStore.STATUS_INIT;
        this.gasFee = S.NOT_EXISTS;
        this.inputStateHelper = new InputStateHelper(PopupSendAsGiftStore.FIELDS, (key, value) => {
            switch (key) {
                case PopupSendAsGiftStore.FIELDS[0]:
                    this.recipientAddress = value;
                    break;
                default:
            }
        });
        clearTimeout(this.calculateFeeTimeout);
        this.calculateFeeTimeout = setTimeout(() => {
            this.estimateFee();
        }, 2000);

        this.onSendAsGiftSuccess = onSendAsGiftSuccess;

        this.show();
    }

    hide = () => {
        super.hide();
        this.nftModel = null;
        this.recipientAddress = S.Strings.EMPTY;
        this.recipientAddressError = false;
        this.status = PopupSendAsGiftStore.STATUS_INIT;
        clearTimeout(this.calculateFeeTimeout);
    }

    async sendNft() {
        const { signer, sender, client } = await this.walletStore.getSignerData();

        this.txHash = await this.nftApi.sendNft(
            this.nftModel,
            this.recipientAddress,
            sender,
            client,
        );

        this.onSuccessfulNftTransfer();
        this.onSendAsGiftSuccess();
    }

    onSuccessfulNftTransfer() {
        const myNftsStore = this.myNftsStore;
        const collections = myNftsStore.nftCollectionModels;
        const nftsMap = myNftsStore.nftsInCollectionsMap;

        const nft = this.nftModel;

        let nftsInCollection = nftsMap.get(nft.denomId);

        nftsInCollection = nftsInCollection.filter((nftModel: NftModel) => nftModel.tokenId !== nft.tokenId);
        nftsMap.set(nft.denomId, nftsInCollection);

        if (nftsInCollection.length === 0) {
            collections.filter((collection: NftCollectionModel) => collection.denomId !== nft.denomId);
            nftsMap.delete(nft.denomId);
        }

        myNftsStore.nftCollectionModels = collections;
        myNftsStore.filter();
    }

    async estimateFee() {
        try {
            const { signer, sender, client } = await this.walletStore.getSignerData();

            const fee = await this.nftApi.estimateFeeSendNft(
                this.nftModel,
                sender,
                sender,
                client,
            );

            this.gasFee = Number((new BigNumber(fee.amount)).div(Config.CUDOS_NETWORK.DECIMAL_DIVIDER).toFixed(2));
        } catch (e) {
            this.gasFee = S.NOT_EXISTS;
        }
        try {
            const cudosPrice = await this.nftApi.getCudosPriceInUsd();
            this.feeInUsd = this.gasFee * cudosPrice;
        } catch (e) {
            this.feeInUsd = S.NOT_EXISTS
        }

    }

}

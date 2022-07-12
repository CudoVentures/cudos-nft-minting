import { makeObservable, observable } from 'mobx';
import InputStateHelper from '../helpers/InputStateHelper';
import NftModel from '../models/NftModel';
import S from '../utilities/Main';
import PopupStore from './PopupStore';

export default class PopupSendAsGiftStore extends PopupStore {

    static FIELDS: string[] = ['recipientAddress'];

    static STATUS_INIT: number = 1;
    static STATUS_PROCESSING: number = 2;
    static STATUS_DONE_SUCCESS: number = 3;
    static STATUS_DONE_ERROR: number = 4;

    @observable nftModel: NftModel;
    @observable recipientAddress: string;
    @observable status: number;
    @observable gasFee: number;

    inputStateHelper: InputStateHelper;
    calculateFeeTimeout: NodeJS.Timeout;

    constructor() {
        super();
        this.nftModel = null;
        this.recipientAddress = S.Strings.EMPTY;
        this.status = PopupSendAsGiftStore.STATUS_INIT;
        this.gasFee = S.NOT_EXISTS;
        this.calculateFeeTimeout = null;
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

    showSignal(nftModel: NftModel) {
        this.nftModel = nftModel;
        this.recipientAddress = S.Strings.EMPTY;
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
            this.gasFee = 5.2;
        }, 2000);

        this.show();
    }

    hide = () => {
        super.hide();
        this.nftModel = null;
        this.recipientAddress = S.Strings.EMPTY;
        this.status = PopupSendAsGiftStore.STATUS_INIT;
        clearTimeout(this.calculateFeeTimeout);
    }

}

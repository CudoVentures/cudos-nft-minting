import { makeAutoObservable } from 'mobx';

import S from '../utilities/Main';
import WorkerQueueHelper from '../helpers/WorkerQueueHelper';
import Filterable from './Filterable';
import ImagePreviewHelper from '../helpers/ImagePreviewHelper';

export default class NftModel implements Filterable {

    denomId: string;
    tokenId: string;
    name: string;
    url: string;
    data: string;
    recipient: string;
    approvedAddresses: string[];
    txHash: string;

    fileName: string;
    type: string;
    sizeBytes: number;
    previewUrl: string;

    constructor() {
        this.denomId = S.Strings.EMPTY;
        this.tokenId = S.Strings.EMPTY;
        this.name = S.Strings.EMPTY;
        this.url = S.Strings.EMPTY;
        this.data = S.Strings.EMPTY;
        this.recipient = S.Strings.EMPTY;
        this.approvedAddresses = [];
        this.txHash = S.Strings.EMPTY;

        this.fileName = S.Strings.EMPTY;
        this.type = S.Strings.EMPTY;
        this.sizeBytes = S.NOT_EXISTS;
        this.previewUrl = S.Strings.EMPTY;

        makeAutoObservable(this, {
            'type': false,
        });
    }

    static getImageSizeString(nftModel: NftModel): string {
        const size = nftModel.sizeBytes;

        const kilo = 2 << 10;
        const mega = 2 << 20;

        if (size < kilo) {
            return `${size} B`;
        }

        if (Math.floor(size / kilo) < kilo) {
            return `${(size / kilo).toFixed(2)} KB`
        }

        if (Math.floor(size / mega) < kilo) {
            return `${(size / mega).toFixed(2)} MB`
        }

        return 'File too big.'

    }

    isMimeTypeKnown(): boolean {
        return this.type !== S.Strings.EMPTY;
    }

    isValidForSubmit(): boolean {
        if (this.url === S.Strings.EMPTY) {
            return false;
        }

        if (this.recipient === S.Strings.EMPTY) {
            return false;
        }

        if (this.name === S.Strings.EMPTY) {
            return false;
        }

        return true;
    }

    setRecipient(recipient: string) {
        this.recipient = recipient;
    }

    getFilterableString(): string {
        return this.name;
    }

    getIdsUniquePair() {
        return `${this.denomId}-${this.tokenId}`;
    }

    getPreviewUrl(workerQueueHelper: WorkerQueueHelper): string {
        if (this.previewUrl !== S.Strings.EMPTY) {
            return this.previewUrl;
        }

        const imagePreviewHelper = ImagePreviewHelper.getSingletonInstance(workerQueueHelper)
        imagePreviewHelper.fetch(this.url, (mimeType, previewUrl) => {
            this.type = mimeType;
            this.previewUrl = previewUrl;
        });

        return ImagePreviewHelper.UNKNOWN_PREVIEW_URL;
    }

    updatePreviewUrlByType() {
        this.previewUrl = ImagePreviewHelper.getPreviewUrlByType(this.url, this.type);
    }

    clone(): NftModel {
        return Object.assign(new NftModel(), this);
    }

    toJSON(): any {
        return {
            'denomId': this.denomId,
            'tokenId': this.tokenId,
            'name': this.name,
            'url': this.url,
            'data': this.data,
            'recipient': this.recipient,
            'approvedAddresses': this.approvedAddresses,
        }
    }

    static fromJSON(json): NftModel {
        if (json === null) {
            return null;
        }

        const model = new NftModel();

        model.denomId = json.denomId ?? model.denomId;
        model.tokenId = json.id ?? json.tokenId ?? model.tokenId;
        model.name = json.name ?? model.name;
        model.url = json.url ?? model.url;
        model.data = json.data ?? model.data;
        model.recipient = json.recipient ?? model.recipient;
        model.approvedAddresses = json.approvedAddresses ?? model.approvedAddresses;

        return model;
    }

    static fromChain(json): NftModel {
        if (json === null) {
            return null;
        }

        const model = new NftModel();

        model.tokenId = json.id ?? model.tokenId;
        model.name = json.name ?? model.name;
        model.url = json.uri ?? model.url;
        model.data = json.data ?? model.data;
        model.recipient = json.owner ?? model.recipient;
        model.approvedAddresses = json.approvedAddresses ?? model.approvedAddresses;

        return model;
    }

    static fromHasura(json): NftModel {
        if (json === null) {
            return null;
        }

        const model = new NftModel();

        model.denomId = json.denom_id ?? model.denomId;
        model.tokenId = json.id ?? model.tokenId;
        model.name = json.name ?? model.name;
        model.url = json.uri ?? model.url;
        model.data = json.data_text ?? model.data;
        model.recipient = json.owner ?? model.recipient;
        model.approvedAddresses = model.approvedAddresses ?? [];
        model.txHash = json.transaction_hash ?? model.txHash;

        return model;
    }

}

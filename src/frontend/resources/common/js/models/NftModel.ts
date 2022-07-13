import { makeAutoObservable } from 'mobx';
import S from '../utilities/Main';
import Filterable from './Filterable';

export default class NftModel implements Filterable {

    denomId: string;
    tokenId: string;
    name: string;
    url: string;
    data: string;
    recipient: string;
    approvedAddresses: string[];

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

        this.fileName = S.Strings.EMPTY;
        this.type = S.Strings.EMPTY;
        this.sizeBytes = S.NOT_EXISTS;
        this.previewUrl = S.Strings.EMPTY;

        makeAutoObservable(this);
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

    getFilterableString(): string {
        return this.name;
    }

    getPreviewUrl(): string {
        if (this.previewUrl === S.Strings.EMPTY) {
            fetch(this.url).then((res) => {
                const contentType = res.headers.get('content-type');
            })
        }

        return this.previewUrl;
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
        model.tokenId = json.tokenId ?? model.tokenId;
        model.name = json.name ?? model.name;
        model.url = json.url ?? model.url;
        model.data = json.data ?? model.data;
        model.recipient = json.recipient ?? model.recipient;
        model.approvedAddresses = json.approvedAddresses ?? model.approvedAddresses;

        return model;
    }

}

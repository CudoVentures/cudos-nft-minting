import { makeAutoObservable } from 'mobx';
import S from '../utilities/Main';
import Filterable from './Filterable';

export default class NftModel implements Filterable {

    denomId: string;
    tokenId: string;
    name: string;
    uri: string;
    fileName: string;
    type: string;
    sizeBytes: number;
    data: string;
    recipient: string;
    approvedAddresses: string[];

    constructor() {
        this.denomId = S.Strings.EMPTY;
        this.tokenId = S.Strings.EMPTY;
        this.name = S.Strings.EMPTY;
        this.uri = S.Strings.EMPTY;
        this.fileName = S.Strings.EMPTY;
        this.type = S.Strings.EMPTY;
        this.sizeBytes = S.NOT_EXISTS;
        this.data = S.Strings.EMPTY;
        this.recipient = S.Strings.EMPTY;
        this.approvedAddresses = [];

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

    clone(): NftModel {
        return Object.assign(new NftModel(), this);
    }

    toJSON(): any {
        return {
            'denomId': this.denomId,
            'tokenId': this.tokenId,
            'name': this.name,
            'uri': this.uri,
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
        model.uri = json.uri ?? model.uri;
        model.data = json.data ?? model.data;
        model.recipient = json.recipient ?? model.recipient;
        model.approvedAddresses = json.approvedAddresses ?? model.approvedAddresses;

        return model;
    }

}

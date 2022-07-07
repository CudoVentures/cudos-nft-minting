import S from '../utilities/Main';
import Filterable from './Filterable';

export default class NftModel implements Filterable {

    tokenId: string;
    name: string;
    uri: string;
    data: string;
    owner: string;
    approvedAddresses: string[];

    constructor() {
        this.tokenId = S.Strings.EMPTY;
        this.name = S.Strings.EMPTY;
        this.uri = S.Strings.EMPTY;
        this.data = S.Strings.EMPTY;
        this.owner = S.Strings.EMPTY;
        this.approvedAddresses = [];
    }

    getFilterableString(): string {
        return this.name;
    }

    clone(): NftModel {
        return Object.assign(new NftModel(), this);
    }

    toJSON(): any {
        return {
            'id': this.tokenId,
            'name': this.name,
            'uri': this.uri,
            'data': this.data,
            'owner': this.owner,
            'approvedAddresses': this.approvedAddresses,
        }
    }

    static fromJSON(json): NftModel {
        if (json === null) {
            return null;
        }

        const model = new NftModel();

        model.tokenId = json.id ?? model.tokenId;
        model.name = json.name ?? model.name;
        model.uri = json.uri ?? model.uri;
        model.data = json.data ?? model.data;
        model.owner = json.owner ?? model.owner;
        model.approvedAddresses = json.approvedAddresses ?? model.approvedAddresses;

        return model;
    }

}

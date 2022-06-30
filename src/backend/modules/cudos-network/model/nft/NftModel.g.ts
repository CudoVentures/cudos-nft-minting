import SV from '../../../../utilities/SV';
import NftModel from './NftModel';
import NftModelH from './NftModel.h.';

export default class NftModelG extends NftModelH {

    constructor() {
        super();
        this.tokenId = SV.Strings.EMPTY;
        this.name = SV.Strings.EMPTY;
        this.uri = SV.Strings.EMPTY;
        this.data = SV.Strings.EMPTY;
        this.owner = SV.Strings.EMPTY;
        this.approvedAddresses = [];
    }

    toNetwork(): any {
        return {
            'id': this.tokenId,
            'name': this.name,
            'uri': this.uri,
            'data': this.data,
            'owner': this.owner,
            'approvedAddresses': this.approvedAddresses,
        }
    }

    static fromNetwork(json: any): NftModel {
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

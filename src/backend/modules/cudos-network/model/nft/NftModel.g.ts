import SV from '../../../../utilities/SV';
import NftModel from './NftModel';
import NftModelH from './NftModel.h.';

export default class NftModelG extends NftModelH {

    constructor() {
        super();
        this.denomId = SV.Strings.EMPTY;
        this.tokenId = SV.Strings.EMPTY;
        this.name = SV.Strings.EMPTY;
        this.uri = SV.Strings.EMPTY;
        this.data = SV.Strings.EMPTY;
        this.recipient = SV.Strings.EMPTY;
        this.approvedAddresses = [];
    }

    toNetwork(): any {
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

    static fromNetwork(json: any): NftModel {
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

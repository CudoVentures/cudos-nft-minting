import Config from '../../../../../../builds/dev-generated/Config';
import S from '../utilities/Main';
import Filterable from './Filterable';

export default class NftCollectionModel implements Filterable {

    denomId: string;
    name: string;

    constructor() {
        this.denomId = S.Strings.NOT_EXISTS;
        this.name = S.Strings.EMPTY;
    }

    getFilterableString(): string {
        return this.name;
    }

    isCudosMainCollection(): boolean {
        return this.denomId === Config.CUDOS_NETWORK.NFT_DENOM_ID;
    }

    toJson(): any {
        return {
            'denomId': this.denomId,
            'name': this.name,
        }
    }

    static fromJson(json: any): NftCollectionModel {
        if (json === null) {
            return null;
        }

        const model = new NftCollectionModel();

        model.denomId = json.denomId ?? model.denomId;
        model.name = json.name ?? model.name;

        return model;
    }

    static fromChain(json: any): NftCollectionModel {
        if (json === null) {
            return null;
        }

        const model = new NftCollectionModel();

        model.denomId = json.id ?? model.denomId;
        model.name = json.name ?? model.name;

        return model;
    }

}

import { makeAutoObservable } from 'mobx';
import Config from '../../../../../../builds/dev-generated/Config';
import S from '../utilities/Main';
import Filterable from './Filterable';

export default class NftCollectionModel implements Filterable {

    denomId: string;
    name: string;
    own: boolean;

    constructor() {
        this.denomId = S.Strings.EMPTY;
        this.name = S.Strings.EMPTY;
        this.own = false;

        makeAutoObservable(this);
    }

    static instanceCudosMainCollection() {
        const model = new NftCollectionModel();

        model.denomId = Config.CUDOS_NETWORK.NFT_DENOM_ID;
        model.name = 'Cudos one collection';

        return model;
    }

    getFilterableString(): string {
        return this.name;
    }

    isCudosMainCollection(): boolean {
        return this.denomId === Config.CUDOS_NETWORK.NFT_DENOM_ID;
    }

    isOwn(): boolean {
        return this.own;
    }

    toJson(): any {
        return {
            'denomId': this.denomId,
            'name': this.name,
            'own': this.own,
        }
    }

    static fromJson(json: any): NftCollectionModel {
        if (json === null) {
            return null;
        }

        const model = new NftCollectionModel();

        model.denomId = json.denomId ?? model.denomId;
        model.name = json.name ?? model.name;
        model.own = json.own ?? model.own;

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

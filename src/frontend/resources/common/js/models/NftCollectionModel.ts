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

}

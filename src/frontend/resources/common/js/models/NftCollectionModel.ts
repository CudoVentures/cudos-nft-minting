import S from '../utilities/Main';

export default class NftCollectionModel {

    denomId: string;
    name: string;

    constructor() {
        this.denomId = S.Strings.NOT_EXISTS;
        this.name = S.Strings.EMPTY;
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

import S from '../utilities/Main';

export default class NftCollectionModel {

    denomId: string;

    constructor() {
        this.denomId = S.Strings.NOT_EXISTS
    }

    toJson(): any {
        return {
            'denomId': this.denomId,
        }
    }

    static fromJson(json: any): NftCollectionModel {
        if (json === null) {
            return null;
        }

        const model = new NftCollectionModel();

        model.denomId = json.denomId ?? model.denomId;

        return model;
    }

}

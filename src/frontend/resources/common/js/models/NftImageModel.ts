import S from '../utilities/Main'

export default class NftImageModel {
    imageUrl: string;

    constructor() {
        this.imageUrl = S.Strings.EMPTY;
    }


    clone(): NftImageModel {
        return Object.assign(new NftImageModel(), this);
    }

    toJSON(): any {
        return {
            'imageUrl': this.imageUrl,
        }
    }

    static fromJSON(json): NftImageModel {
        if (json === null) {
            return null;
        }

        const model = new NftImageModel();

        model.imageUrl = json.imageUrl ?? model.imageUrl;

        return model;
    }
}
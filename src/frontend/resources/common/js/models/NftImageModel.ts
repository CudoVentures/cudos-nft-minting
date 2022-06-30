import S from '../utilities/Main'

export default class NftImageModel {
    imageId: string;
    imageUrl: string;
    sizeInBytes: number;

    constructor() {
        this.imageId = S.Strings.NOT_EXISTS;
        this.imageUrl = S.Strings.EMPTY;
        this.sizeInBytes = 0;
    }


    clone(): NftImageModel {
        return Object.assign(new NftImageModel(), this);
    }

    toJSON(): any {
        return {
            'imageId': this.imageId,
            'imageUrl': this.imageUrl,
            'sizeInBytes': this.sizeInBytes,
        }
    }

    static fromJSON(json): NftImageModel {
        if (json === null) {
            return null;
        }

        const model = new NftImageModel();

        model.imageId = json.imageId ?? model.imageId;
        model.imageUrl = json.imageUrl ?? model.imageUrl;
        model.sizeInBytes = Number(json.sizeInBytes) ?? model.sizeInBytes;

        return model;
    }
}
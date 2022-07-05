import S from '../utilities/Main'

export default class NftImageModel {
    imageUrl: string;
    fileName: string;
    type: string;
    sizeBytes: number;

    constructor() {
        this.imageUrl = S.Strings.EMPTY;
        this.fileName = S.Strings.EMPTY;
        this.type = S.Strings.EMPTY;
        this.sizeBytes = S.NOT_EXISTS;
    }

    clone(): NftImageModel {
        return Object.assign(new NftImageModel(), this);
    }

    toJSON(): any {
        return {
            'imageUrl': this.imageUrl,
            'fileName': this.fileName,
            'type': this.type,
            'sizeBytes': this.sizeBytes,
        }
    }

    static fromJSON(json): NftImageModel {
        if (json === null) {
            return null;
        }

        const model = new NftImageModel();

        model.imageUrl = json.imageUrl ?? model.imageUrl;
        model.fileName = json.fileName ?? model.fileName;
        model.type = json.type ?? model.type;
        model.sizeBytes = Number(json.sizeBytes) ?? model.sizeBytes;

        return model;
    }

    static getImageSizeString(imageModel: NftImageModel): string {
        const kilo = 2 << 10;

        switch (Math.floor(imageModel.sizeBytes / 2 << 10)) {
            case 0:
                return `${imageModel.sizeBytes} B`;
            case 1:
                return `${imageModel.sizeBytes / kilo} KB`;
            case 2:
                return `${imageModel.sizeBytes / kilo ** 2} MB`;
            default:
                return 'File too big.'
        }
    }
}

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
        const size = imageModel.sizeBytes;

        const kilo = 2 << 10;
        const mega = 2 << 20;

        if (size < kilo) {
            return `${size} B`;
        }

        if (Math.floor(size / kilo) < kilo) {
            return `${(size / kilo).toFixed(2)} KB`
        }

        if (Math.floor(size / mega) < kilo) {
            return `${(size / mega).toFixed(2)} MB`
        }

        return 'File too big.'

    }
}

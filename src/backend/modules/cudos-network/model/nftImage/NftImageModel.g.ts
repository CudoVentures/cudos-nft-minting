import SV from '../../../../utilities/SV';
import NftImageModel from './NftImageModel';
import NftImageModelH from './NftImageModel.h.';

export default class NftImageModelG extends NftImageModelH {
    constructor() {
        super();
        this.imageUrl = SV.Strings.EMPTY;
        this.file = SV.Strings.EMPTY;
        this.fileName = SV.Strings.EMPTY;
        this.type = SV.Strings.EMPTY;
        this.sizeBytes = SV.NOT_EXISTS;
    }

    toNetwork(): any {
        return {
            'imageUrl': this.imageUrl,
            'file': this.file,
            'fileName': this.fileName,
            'type': this.type,
            'sizeBytes': this.sizeBytes.toString(),
        }
    }

    static fromNetwork(json): NftImageModel {
        if (json === null) {
            return null;
        }

        const model = new NftImageModel();

        model.imageUrl = json.imageUrl ?? model.imageUrl;
        model.fileName = json.fileName ?? model.fileName;
        model.file = json.file ?? model.file;
        model.type = json.type ?? model.type;
        model.sizeBytes = Number(json.sizeBytes) ?? model.sizeBytes;
        return model;
    }
}

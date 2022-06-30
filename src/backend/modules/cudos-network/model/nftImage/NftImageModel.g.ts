import SV from '../../../../utilities/SV';
import NftImageModel from './NftImageModel';
import NftImageModelH from './NftImageModel.h.';

export default class NftImageModelG extends NftImageModelH {
    constructor() {
        super();
        this.imageId = SV.Strings.NOT_EXISTS;
        this.imageUrl = SV.Strings.EMPTY;
        this.sizeInBytes = 0;
    }

    toNetwork(): any {
        return {
            'imageId': this.imageId,
            'imageUrl': this.imageUrl,
            'sizeInBytes': this.sizeInBytes,
        }
    }

    static fromNetwork(json): NftImageModel {
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

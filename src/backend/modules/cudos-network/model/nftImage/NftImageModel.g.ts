import SV from '../../../../utilities/SV';
import NftImageModel from './NftImageModel';
import NftImageModelH from './NftImageModel.h.';

export default class NftImageModelG extends NftImageModelH {
    constructor() {
        super();
        this.imageUrl = SV.Strings.EMPTY;
        this.file = SV.Strings.EMPTY;
    }

    toNetwork(): any {
        return {
            'imageUrl': this.imageUrl,
            'file': this.file,
        }
    }

    static fromNetwork(json): NftImageModel {
        if (json === null) {
            return null;
        }

        const model = new NftImageModel();

        model.imageUrl = json.imageUrl ?? model.imageUrl;
        model.file = json.file ?? model.file;

        return model;
    }
}

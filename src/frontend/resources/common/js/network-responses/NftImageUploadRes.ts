import NftImageModel from '../models/NftImageModel';

export default class NftImageUploadRes {

    nftImageModel: NftImageModel;

    constructor(json) {
        this.nftImageModel = NftImageModel.fromJSON(json);
    }

}

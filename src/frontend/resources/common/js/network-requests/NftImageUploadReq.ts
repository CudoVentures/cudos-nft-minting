import NftImageModel from '../models/NftImageModel';

export default class NftImageUploadReq {

    nftImageModel: NftImageModel;

    constructor(nftImageModel_: NftImageModel) {
        this.nftImageModel = nftImageModel_.toJSON();
    }
}

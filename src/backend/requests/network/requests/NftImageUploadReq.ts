import NftImageModel from '../../../modules/cudos-network/model/nftImage/NftImageModel';

export default class NftImageUploadReq {

    nftImageModel: NftImageModel;

    constructor(json) {
        this.nftImageModel = NftImageModel.fromNetwork(json);
    }
}

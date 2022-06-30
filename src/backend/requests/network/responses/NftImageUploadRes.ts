import NftImageModel from '../../../modules/cudos-network/model/nftImage/NftImageModel';

export default class MintNftRes {

    nftImageModel: NftImageModel;

    constructor(NftImageModel_: NftImageModel) {
        this.nftImageModel = NftImageModel_.toNetwork();
    }
}

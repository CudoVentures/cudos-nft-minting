import NftModel from '../../../modules/cudos-network/model/nft/NftModel';

export default class MintNftRes {

    nftModel: NftModel;

    constructor(json) {
        this.nftModel = NftModel.fromNetwork(json);
    }

}

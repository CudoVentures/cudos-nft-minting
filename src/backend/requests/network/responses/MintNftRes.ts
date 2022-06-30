import NftModel from '../../../modules/cudos-network/model/nft/NftModel';

export default class MintNftRes {

    nftModel: NftModel;

    constructor(nftModel_: NftModel) {
        this.nftModel = nftModel_.toNetwork();
    }
}

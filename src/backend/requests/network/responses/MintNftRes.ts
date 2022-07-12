import NftModel from '../../../modules/cudos-network/model/nft/NftModel';

export default class MintNftRes {

    nftModels: NftModel[];

    constructor(nftModels_: NftModel[]) {
        this.nftModels = nftModels_.map((nftModel: NftModel) => nftModel.toNetwork());
    }
}

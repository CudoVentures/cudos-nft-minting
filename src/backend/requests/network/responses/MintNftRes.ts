import NftModel from '../../../modules/cudos-network/model/nft/NftModel';

export default class MintNftRes {

    nftModels: NftModel[];
    txhash: string;

    constructor(nftModels_: NftModel[], txHash_: string) {
        this.nftModels = nftModels_.map((nftModel: NftModel) => nftModel.toNetwork());
        this.txhash = txHash_;
    }
}

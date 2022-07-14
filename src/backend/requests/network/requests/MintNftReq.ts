import NftModel from '../../../modules/cudos-network/model/nft/NftModel';

export default class MintNftRes {

    nftModels: NftModel[];

    constructor(json) {
        this.nftModels = json.nftModels.map((modelJson: any) => NftModel.fromNetwork(modelJson));
    }

}

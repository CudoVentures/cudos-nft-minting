import NftModel from '../models/NftModel';

export default class MintNftReq {

    nftModels: NftModel[];

    constructor(nftModels_: NftModel[]) {
        this.nftModels = nftModels_.map((nftModel: NftModel) => nftModel.toJSON());
    }
}

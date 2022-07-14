import NftModel from '../models/NftModel';

export default class EstimateFeeMintNftReq {
    nftModels: NftModel[];

    constructor(nftModels_: NftModel[]) {
        this.nftModels = nftModels_.map((nftModel: NftModel) => nftModel.toJSON());
    }
}

import NftModel from '../models/NftModel';

export default class MintNftReq {

    nftModel: NftModel;

    constructor(nftModel_: NftModel) {
        this.nftModel = nftModel_.toJSON();
    }
}

import NftModel from '../models/NftModel';

export default class MintNftRes {

    nft: NftModel;

    constructor(json) {
        this.nft = NftModel.fromJSON(json);
    }

}

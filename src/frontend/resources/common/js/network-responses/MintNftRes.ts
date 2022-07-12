import NftModel from '../models/NftModel';

export default class MintNftRes {

    nfts: NftModel[];

    constructor(json) {
        this.nfts = json.map((modelJson: any) => NftModel.fromJSON(modelJson));
    }

}

import NftModel from '../models/NftModel';

export default class MintNftRes {

    nfts: NftModel[];
    txHash: string;

    constructor(json) {
        this.nfts = json.nftModels.map((modelJson: any) => NftModel.fromJSON(modelJson));
        this.txHash = json.txHash;
    }

}

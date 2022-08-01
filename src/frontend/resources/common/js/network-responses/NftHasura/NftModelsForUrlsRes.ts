import NftModel from '../../models/NftModel';

export default class NftModelsForUrlsRes {
    nftModels: NftModel[];

    constructor(json) {
        const nftJsons = json.data.nft_nft;
        this.nftModels = nftJsons.map((nftJson) => NftModel.fromHasura(nftJson));
    }
}

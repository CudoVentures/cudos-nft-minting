import NftModel from '../../models/NftModel';

export default class NftModelsPaginatedRes {
    nftModels: NftModel[];
    totalCount: number;

    constructor(json) {
        const data = json.data.nft_nft_aggregate;
        const nftJsons = data.nodes;

        this.totalCount = data.aggregate.count;
        this.nftModels = nftJsons.map((nftJson) => NftModel.fromHasura(nftJson));
    }
}

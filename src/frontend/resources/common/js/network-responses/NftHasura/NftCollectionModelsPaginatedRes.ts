import NftCollectionModel from '../../models/NftCollectionModel';

export default class NftModelsPaginatedRes {
    nftCollectionModels: NftCollectionModel[];
    totalCount: number;

    constructor(json) {
        const data = json.data.nft_denom_aggregate;
        const nftCollectionJsons = data.nodes;

        this.totalCount = data.aggregate.count;
        this.nftCollectionModels = nftCollectionJsons.map((nftJson) => NftCollectionModel.fromHasura(nftJson));
    }
}

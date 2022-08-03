export default class NftCountByDenomAndOwnerRes {
    nftCount: number;

    constructor(json) {
        this.nftCount = Number(json.data.nft_nft_aggregate.aggregate.count);
    }
}

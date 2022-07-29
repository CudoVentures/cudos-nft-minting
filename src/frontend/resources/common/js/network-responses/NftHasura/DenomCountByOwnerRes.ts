export default class DenomCountByOwnerRes {
    collectionCount: number;

    constructor(json) {
        this.collectionCount = Number(json.data.nft_nft_aggregate.aggregate.count);
    }
}

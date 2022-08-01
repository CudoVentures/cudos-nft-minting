export default class DenomCountByOwnerRes {
    collectionCount: number;

    constructor(json) {
        this.collectionCount = Number(json.data.nft_denom_aggregate.aggregate.count);
    }
}

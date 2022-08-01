import NftCollectionModel from '../../models/NftCollectionModel';

export default class NftCollectionIdsByNftOwnerRes {
    nftCollectionModelIds: string[];

    constructor(json) {

        this.nftCollectionModelIds = json.data.nft_nft.map((data) => data.denom_id);
    }
}

import Config from '../../../../../../../builds/dev-generated/Config';

export default class NftsByDenomAndOwnerReq {
    owner: string;
    nftCollectionModelIds: string[];

    constructor(owner: string, nftCollectionModelIds: string[]) {
        this.owner = owner;
        this.nftCollectionModelIds = nftCollectionModelIds;
    }

    buildRequest() {
        const data = {
            operationName: 'GetDenomCountByOwner',
            query: `query GetDenomCountByOwner {
                nft_denom_aggregate(where: {
                    _or: [
                      {owner: {_eq: "${this.owner}"}},
                      {id: {_in: ${this.nftCollectionModelIds}}}
                    ]
                    id: {_neq: "${Config.CUDOS_NETWORK.NFT_DENOM_ID}"}
                  }) {
                    aggregate {
                      count
                    }
                  }
            }`,
            variables: null,
        };

        return {
            method: 'POST',
            body: JSON.stringify(data),
        }
    }
}

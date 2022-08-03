import Config from '../../../../../../../builds/dev-generated/Config';

export default class NftsByDenomAndOwnerReq {
    owner: string;
    nftCollectionModelIds: string[];
    filterString: string;

    constructor(owner: string, filterString: string, nftCollectionModelIds: string[]) {
        this.owner = owner;
        this.filterString = filterString;
        this.nftCollectionModelIds = nftCollectionModelIds;
    }

    buildRequest() {
        const data = {
            operationName: 'GetDenomCountByOwner',
            query: `query GetDenomCountByOwner {
                nft_denom_aggregate(where: {
                    _or: [
                      {owner: {_eq: "${this.owner}"}},
                      {id: {_in: [${this.nftCollectionModelIds.map((denom) => `"${denom}"`).join(',')}]}}
                    ]

                    name: {_iregex: "${this.filterString}"},
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

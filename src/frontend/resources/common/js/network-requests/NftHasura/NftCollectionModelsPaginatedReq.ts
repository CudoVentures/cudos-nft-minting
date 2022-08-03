import Config from '../../../../../../../builds/dev-generated/Config';

export default class NftCollectionModelsPaginatedReq {
    owner: string;
    from: number;
    to: number;
    filter: string;
    denomsByNftOwnerIds: string [];

    constructor(owner: string, denomsByNftOwnerIds: string[], from: number, to: number, filter: string) {
        this.owner = owner;
        this.from = from;
        this.to = to;
        this.filter = filter;
        this.denomsByNftOwnerIds = denomsByNftOwnerIds;
    }

    buildRequest() {
        const data = {
            operationName: 'GetNftCollectionsOwnerAndFilterPaginated',
            query: `query GetNftCollectionsOwnerAndFilterPaginated {
              nft_denom_aggregate(where: {
                _or: [
                  {owner: {_eq: "${this.owner}"}},
                  {id: {_in: [${this.denomsByNftOwnerIds.map((denom) => `"${denom}"`).join(',')}]}}
                ],
                id: {_neq: "${Config.CUDOS_NETWORK.NFT_DENOM_ID}"}
                name: {_iregex: "${this.filter}"},
              },
              offset: ${this.from}, 
              limit: ${this.to - this.from}, 
              order_by: {name: asc}
              ) {
                aggregate {
                  count
                }
                nodes {
                  id
                  name
                  owner
                  schema
                  symbol
                  transaction_hash
                  contract_address_signer
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

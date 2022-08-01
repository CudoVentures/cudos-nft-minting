import Config from '../../../../../../../builds/dev-generated/Config';

export default class NftsByDenomAndOwnerReq {
    owner: string;

    constructor(owner: string) {
        this.owner = owner;
    }

    buildRequest() {
        const data = {
            operationName: 'GetDenomCountByOwner',
            query: `query GetDenomCountByOwner {
                nft_nft_aggregate(where: {_or: [
                    {
                    owner: {_eq: "${this.owner}"},
                    denom_id: {_neq: "${Config.CUDOS_NETWORK.NFT_DENOM_ID}"}
                    burned: {_eq: false}, 
                  }, 
                    {nft_denom: {owner: {_eq: "${this.owner}"}}
                }]}) {
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

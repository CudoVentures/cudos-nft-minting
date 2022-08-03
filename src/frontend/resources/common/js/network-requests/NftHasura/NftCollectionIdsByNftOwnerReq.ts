import Config from '../../../../../../../builds/dev-generated/Config';

export default class NftCollectionIdsByNftOwnerReq {
    owner: string;
    filterString: string;

    constructor(owner: string, filterString: string) {
        this.owner = owner;
        this.filterString = filterString;
    }

    buildRequest() {
        const data = {
            operationName: 'GetNftCollectionIdsByNftOwner',
            query: `query GetNftCollectionIdsByNftOwner {
              nft_nft(where: {
                owner: {_eq: "${this.owner}"}, 
                burned: {_eq: false},
                name: {_iregex: "${this.filterString}"},
                denom_id: {_neq: "${Config.CUDOS_NETWORK.NFT_DENOM_ID}"}
              }, 
                distinct_on: denom_id) {
                  denom_id
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

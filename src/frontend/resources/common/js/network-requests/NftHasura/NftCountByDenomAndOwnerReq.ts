export default class NftsByDenomAndOwnerReq {
    denomId: string;
    owner: string;
    filterString: string

    constructor(denomId: string, owner: string, filterString: string) {
        this.denomId = denomId;
        this.owner = owner;
        this.filterString = filterString;
    }

    buildRequest() {
        const data = {
            operationName: 'GetNftCountByDenomAndOwner',
            query: `query GetNftCountByDenomAndOwner {
                nft_nft_aggregate(where: {
                    denom_id: {_eq: "${this.denomId}"},
                    owner: {_eq: "${this.owner}"},
                    name: {_iregex: "${this.filterString}"},
                    burned: {_eq: false}
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

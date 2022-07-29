export default class NftsByDenomAndOwnerReq {
    owner: string;

    constructor(owner: string) {
        this.owner = owner;
    }

    buildRequest() {
        const data = {
            operationName: 'GetDenomCountByOwner',
            query: `query GetDenomCountByOwner {
                nft_nft_aggregate(where: {
                    owner: {_eq: "cudos14h7pdf8g2kkjgum5dntz80s5lhtrw3lk2uswk0"}, 
                    burned: {_eq: false},
                    nft_denom: {owner: {_eq: "cudos14h7pdf8g2kkjgum5dntz80s5lhtrw3lk2uswk0"}}
                  }, distinct_on: denom_id) {
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

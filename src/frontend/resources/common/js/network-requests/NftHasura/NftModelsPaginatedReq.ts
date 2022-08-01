export default class NftsByDenomAndOwnerReq {
    denomId: string;
    owner: string;
    from: number;
    to: number;
    filter: string;

    constructor(denomId: string, owner: string, from: number, to: number, filter: string) {
        this.denomId = denomId;
        this.owner = owner;
        this.from = from;
        this.to = to;
        this.filter = filter;
    }

    buildRequest() {
        const data = {
            operationName: 'GetNftsByDenomAndOwnerAndFilterPaginated',
            query: `query GetNftsByDenomAndOwnerAndFilterPaginated {
                nft_nft_aggregate(
                    where: {
                        denom_id: {_eq: "${this.denomId}"}, 
                        owner: {_eq: "${this.owner}"}, 
                        name: {_iregex: "${this.filter}"},
                        burned: {_eq: false}, 
                    },
                    offset: ${this.from}, 
                    limit: ${this.to - this.from}, 
                    order_by: {name: asc}
                ) {
                    nodes {
                        uri
                        transaction_hash
                        owner
                        name
                        id
                        data_text
                        denom_id
                    }
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

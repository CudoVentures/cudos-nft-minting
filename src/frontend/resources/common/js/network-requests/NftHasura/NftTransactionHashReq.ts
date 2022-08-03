export default class NftTransactionHashReq {

    denomId: string;
    tokenId: string;

    constructor(denomId: string, tokenId: string) {
        this.denomId = denomId;
        this.tokenId = tokenId;
    }

    buildRequest() {
        const data = {
            operationName: 'GetTokenTxHashQuery',
            query: `
            query GetTokenTxHashQuery {
                nft_nft(where: {
                    denom_id: {_eq: ${this.denomId}},
                    id: {_eq: ${this.tokenId}},
                    burned: {_eq: false}
                }) {
                  transaction_hash
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

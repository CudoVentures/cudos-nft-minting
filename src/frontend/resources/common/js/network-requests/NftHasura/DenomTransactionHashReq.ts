export default class DenomTransactionHashReq {

    denomId: string;

    constructor(denomId: string) {
        this.denomId = denomId;
    }

    buildRequest() {
        const data = {
            operationName: 'GetDenomTxHashQuery',
            query: `query GetDenomTxHashQuery {
                nft_denom(where: {id: {_eq: "${this.denomId}"}}) {
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

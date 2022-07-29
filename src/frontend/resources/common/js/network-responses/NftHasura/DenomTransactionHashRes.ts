export default class DenomTransactionHashRes {

    txHash: string;

    constructor(json) {
        this.txHash = json.data.nft_denom[0].transaction_hash;
    }

}

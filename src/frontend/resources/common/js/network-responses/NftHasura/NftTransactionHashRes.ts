export default class NftTransactionHashRes {

    txHash: string;

    constructor(json) {
        this.txHash = json.data.nft_nft[0].transaction_hash;
    }

}

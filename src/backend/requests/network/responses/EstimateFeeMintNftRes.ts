import { StdFee } from 'cudosjs';

export default class MintNftRes {

    fee: string;

    constructor(fee_: StdFee) {
        this.fee = JSON.stringify(fee_.amount);
    }
}

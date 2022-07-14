import { Coin } from 'cudosjs';
import NftModel from '../models/NftModel';

export default class EstimateFeeMintNftRes {

    fee: Coin[]

    constructor(json) {
        this.fee = JSON.parse(json.fee);
    }

}

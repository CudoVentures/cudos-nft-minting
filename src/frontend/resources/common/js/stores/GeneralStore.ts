import { makeAutoObservable } from 'mobx';
import KeplrWallet from '../models/KeplrWallet';

export default class GeneralStore {

    wallet: KeplrWallet | null = null;

    constructor() {
        makeAutoObservable(this);
    }

}

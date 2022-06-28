import BigNumber from 'bignumber.js';
import { makeObservable, observable } from 'mobx';

import S from '../../utilities/Main';

export default abstract class Ledger {

    @observable connected: number;
    @observable accountAddress: string;

    abstract connect(): Promise < void >;
    abstract disconnect(): Promise < void >;
    abstract getBalance(): Promise < BigNumber >;

    abstract isConnected(): boolean;

    constructor() {
        this.init();
        makeObservable(this);
    }

    init() {
        this.connected = S.INT_FALSE;
        this.accountAddress = null;
    }

}

import { makeObservable, observable } from 'mobx';

export default class NftDetailsStore {

    @observable num: number = 0;

    constructor() {
        makeObservable(this);
    }

}

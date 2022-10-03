import { makeObservable, observable } from 'mobx';

export default class FarmDetailsStore {

    @observable num: number = 0;

    constructor() {
        makeObservable(this);
    }

}

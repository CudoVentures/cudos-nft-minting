import { makeObservable, observable } from 'mobx';

export default class CollectionDetailsStore {

    @observable num: number = 0;

    constructor() {
        makeObservable(this);
    }

}

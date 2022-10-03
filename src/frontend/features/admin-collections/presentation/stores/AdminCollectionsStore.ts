import { makeObservable, observable } from 'mobx';

export default class AdminCollectionsStore {

    @observable num: number = 0;

    constructor() {
        makeObservable(this);
    }

}

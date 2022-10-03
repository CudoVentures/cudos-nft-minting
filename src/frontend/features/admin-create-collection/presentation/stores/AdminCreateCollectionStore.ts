import { makeObservable, observable } from 'mobx';

export default class AdminCreateCollectionStore {

    @observable num: number = 0;

    constructor() {
        makeObservable(this);
    }

}

import { makeObservable, observable } from 'mobx';

export default class MarketplaceCollectionsStore {

    @observable num: number = 0;

    constructor() {
        makeObservable(this);
    }

}

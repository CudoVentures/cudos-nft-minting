import { makeAutoObservable } from 'mobx';
import MarketplaceCollectionsStore from '../presentation/stores/MarketplaceCollectionsStore';

export default class MarketplaceCollectionsState {

    constructor(a: MarketplaceCollectionsStore) {
        makeAutoObservable(this);
    }

}

import { makeAutoObservable } from 'mobx';
import CollectionDetailsStore from '../presentation/stores/CollectionDetailsStore';

export default class CollectionDetailsState {

    constructor(a: CollectionDetailsStore) {
        makeAutoObservable(this);
    }

}

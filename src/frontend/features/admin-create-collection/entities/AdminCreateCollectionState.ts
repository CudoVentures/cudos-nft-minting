import { makeAutoObservable } from 'mobx';
import AdminCreateCollectionStore from '../presentation/stores/AdminCreateCollectionStore';

export default class AdminCreateCollectionState {

    constructor(a: AdminCreateCollectionStore) {
        makeAutoObservable(this);
    }

}

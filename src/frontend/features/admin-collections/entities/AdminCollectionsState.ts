import { makeAutoObservable } from 'mobx';
import AdminCollectionsStore from '../presentation/stores/AdminCollectionsStore';

export default class AdminCollectionsState {

    constructor(a: AdminCollectionsStore) {
        makeAutoObservable(this);
    }

}

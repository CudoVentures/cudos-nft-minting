import { makeAutoObservable } from 'mobx';
import NftDetailsStore from '../presentation/stores/NftDetailsStore';

export default class NftDetailsState {

    constructor(a: NftDetailsStore) {
        makeAutoObservable(this);
    }

}

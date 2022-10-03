import { makeObservable, observable } from 'mobx';

export default class LoginStore {

    @observable num: number = 0;

    constructor() {
        makeObservable(this);
    }

}

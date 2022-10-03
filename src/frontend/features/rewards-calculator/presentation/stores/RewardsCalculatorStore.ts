import { makeObservable, observable } from 'mobx';

export default class RewardsCalculatorStore {

    @observable num: number = 0;

    constructor() {
        makeObservable(this);
    }

}

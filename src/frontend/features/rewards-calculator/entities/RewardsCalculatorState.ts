import { makeAutoObservable } from 'mobx';
import RewardsCalculatorStore from '../presentation/stores/RewardsCalculatorStore';

export default class RewardsCalculatorState {

    constructor(a: RewardsCalculatorStore) {
        makeAutoObservable(this);
    }

}

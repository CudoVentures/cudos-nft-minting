import { makeAutoObservable } from 'mobx';
import WorkerQueueHelper from '../helpers/WorkerQueueHelper';

export default class AppStore {

    loadingPage: number = 0;
    disabledActionsCounter: number = 0;
    dimmer: number = 0;

    workerQueueHelper: WorkerQueueHelper;

    constructor() {
        this.workerQueueHelper = new WorkerQueueHelper();
        makeAutoObservable(this);
    }

    incrementLoading() {
        ++this.loadingPage;
    }

    decrementLoading() {
        --this.loadingPage;
    }

    disableActions = () => {
        ++this.disabledActionsCounter;
    }

    enableActions = () => {
        --this.disabledActionsCounter;
    }

    hasDisabledActions() {
        return this.disabledActionsCounter !== 0;
    }

    incremenetDimmer() {
        ++this.dimmer;
    }

    decrementDimmer() {
        --this.dimmer;
    }

    hasDimmer() {
        return this.dimmer !== 0;
    }

}

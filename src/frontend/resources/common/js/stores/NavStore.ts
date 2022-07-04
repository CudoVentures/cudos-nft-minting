import { makeObservable, observable } from 'mobx';
import S from '../utilities/Main';

export default class NavStore {
    @observable innerPage: number;
    @observable mintOption: number;
    @observable mintStep: number;

    constructor() {
        this.innerPage = S.NOT_EXISTS;
        this.mintOption = S.NOT_EXISTS;
        this.mintStep = S.NOT_EXISTS;

        makeObservable(this);
    }

    onSelectInnerPage(page: number): void {
        this.innerPage = page;
    }

    onSelectMintOption(option: number): void {
        this.mintOption = option;
    }

    onSelectStage(stage: number): void {
        this.mintStep = stage;
    }
}

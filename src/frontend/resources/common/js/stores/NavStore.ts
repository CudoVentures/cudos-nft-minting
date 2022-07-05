import { makeObservable, observable } from 'mobx';
import S from '../utilities/Main';

export default class NavStore {

    static MINT_PAGE_KEY: number = 1;
    static MY_NFTS_PAGE_KEY: number = 2;

    static MINT_OPTION_SINGLE: number = 1;
    static MINT_OPTION_MULTIPLE: number = 2;

    @observable innerPage: number;
    @observable mintOption: number;
    @observable mintStep: number;

    constructor() {
        this.innerPage = NavStore.MINT_PAGE_KEY;
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

    isMintPage(): boolean {
        return this.innerPage === NavStore.MINT_PAGE_KEY;
    }

    isMyNftPage(): boolean {
        return this.innerPage === NavStore.MY_NFTS_PAGE_KEY;
    }

    static getInnerPageName(pageKey: number): string {
        switch (pageKey) {
            case NavStore.MINT_PAGE_KEY:
                return 'My NFTs';
            case NavStore.MY_NFTS_PAGE_KEY:
                return 'Mint NFTs';
            default:
                return S.Strings.EMPTY;
        }
    }

    getInnerPageName(): string {
        return NavStore.getInnerPageName(this.innerPage);
    }

}

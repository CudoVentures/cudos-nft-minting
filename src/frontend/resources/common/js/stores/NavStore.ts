import { makeObservable, observable } from 'mobx';
import S from '../utilities/Main';

export default class NavStore {

    static MINT_PAGE_KEY: number = 1;
    static MY_NFTS_PAGE_KEY: number = 2;

    static MINT_OPTION_SINGLE: number = 1;
    static MINT_OPTION_MULTIPLE: number = 2;

    static STEP_CHOOSE_OPTION: number = 1;
    static STEP_UPLOAD_FILE: number = 2;
    static STEP_NFT_DETAILS: number = 3;
    static STEP_FINISH: number = 4;

    @observable nftPage: number;
    @observable mintOption: number;
    @observable mintStep: number;

    constructor() {
        this.nftPage = NavStore.MINT_PAGE_KEY;
        this.mintOption = S.NOT_EXISTS;
        this.mintStep = NavStore.STEP_UPLOAD_FILE;

        makeObservable(this);
    }

    onSelectNftPage(page: number): void {
        this.nftPage = page;
    }

    onSelectMintOption(option: number): void {
        this.mintOption = option;
    }

    onSelectStage(stage: number): void {
        this.mintStep = stage;
    }

    isMintPage(): boolean {
        return this.nftPage === NavStore.MINT_PAGE_KEY;
    }

    isMyNftPage(): boolean {
        return this.nftPage === NavStore.MY_NFTS_PAGE_KEY;
    }

    static getNftPageName(pageKey: number): string {
        switch (pageKey) {
            case NavStore.MY_NFTS_PAGE_KEY:
                return 'My NFTs';
            case NavStore.MINT_PAGE_KEY:
                return 'Mint NFTs';
            default:
                return S.Strings.EMPTY;
        }
    }

    getNftPageName(): string {
        return NavStore.getNftPageName(this.nftPage);
    }

}

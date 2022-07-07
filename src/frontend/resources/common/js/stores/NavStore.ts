import { makeAutoObservable } from 'mobx';
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

    nftPage: number;
    mintOption: number;
    mintStep: number;

    constructor() {
        this.nftPage = NavStore.MINT_PAGE_KEY;
        this.mintOption = NavStore.MINT_OPTION_SINGLE;
        this.mintStep = NavStore.STEP_CHOOSE_OPTION;

        makeAutoObservable(this);
    }

    // page
    selectNftPage(page: number): void {
        this.nftPage = page;
    }

    selectNftMintPage() {
        this.selectNftPage(NavStore.MINT_PAGE_KEY);
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

    // step
    selectPreviousStep = () => {
        --this.mintStep;
    }

    selectNextStep = () => {
        ++this.mintStep;
    }

    isMintStepChooseOption(): boolean {
        return this.mintStep === NavStore.STEP_CHOOSE_OPTION;
    }

    isMintStepUploadFile(): boolean {
        return this.mintStep === NavStore.STEP_UPLOAD_FILE;
    }

    isMintStepDetails(): boolean {
        return this.mintStep === NavStore.STEP_NFT_DETAILS;
    }

    isMintStepFinish(): boolean {
        return this.mintStep === NavStore.STEP_FINISH;
    }

    isFirstStep(): boolean {
        return this.isMintStepChooseOption();
    }

    isLastStep() : boolean {
        return this.isMintStepFinish();
    }

    // option
    selectMintOption(option: number): void {
        this.mintOption = option;
    }

    static getMintOptionText(mintOption: number): string {
        switch (mintOption) {
            case NavStore.MINT_OPTION_SINGLE:
                return 'Single Mint';
            case NavStore.MINT_OPTION_MULTIPLE:
                return 'Multiple Mint';
            default:
                return '';
        }
    }

    getMintOptionText(): string {
        return NavStore.getMintOptionText(this.mintOption);
    }

}

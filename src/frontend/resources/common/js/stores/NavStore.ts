import { makeAutoObservable } from 'mobx';
import NftModel from '../models/NftModel';
import ProjectUtils from '../ProjectUtils';
import S from '../utilities/Main';
import NftMintStore from './NftMintStore';

export default class NavStore {

    static MINT_PAGE_KEY: number = 1;
    static MY_NFTS_PAGE_KEY: number = 2;

    static MINT_OPTION_SINGLE: number = 1;
    static MINT_OPTION_MULTIPLE: number = 2;

    // order matters up to STEP_FINISH
    static STEP_CHOOSE_OPTION: number = 1;
    static STEP_UPLOAD_FILE: number = 2;
    static STEP_COLLECTION_DETAILS: number = 3;
    static STEP_NFT_DETAILS: number = 4;
    static STEP_FINISH: number = 5;
    // these numbers can change and new ones can be added
    static STEP_MINTING_IN_PROGRESS: number = 6;
    static STEP_MINTING_DONE: number = 7;
    static STEP_MINTING_FAILED: number = 8;

    nftPage: number;
    mintOption: number;
    mintStep: number;
    nftMintStore: NftMintStore;
    collectionMinted: boolean;

    constructor(nftMintStore: NftMintStore) {
        this.nftPage = NavStore.MY_NFTS_PAGE_KEY;
        this.mintOption = S.NOT_EXISTS;
        this.mintStep = NavStore.STEP_CHOOSE_OPTION;
        this.nftMintStore = nftMintStore;
        this.collectionMinted = false;

        // for test
        this.nftPage = NavStore.MINT_PAGE_KEY;
        this.mintOption = NavStore.MINT_OPTION_MULTIPLE;
        this.mintStep = NavStore.STEP_UPLOAD_FILE;

        makeAutoObservable(this);
    }

    // page
    selectNftPage(page: number): void {
        this.nftPage = page;
    }

    selectNftMintPage() {
        this.selectNftPage(NavStore.MINT_PAGE_KEY);
    }

    selectMyNftPage() {
        this.selectNftPage(NavStore.MY_NFTS_PAGE_KEY);
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

    selectFirstMintStep() {
        this.mintStep = NavStore.STEP_CHOOSE_OPTION;
    }

    selectFinishStep() {
        this.mintStep = NavStore.STEP_FINISH;
    }

    selectStepMintingInProgress() {
        this.mintStep = NavStore.STEP_MINTING_IN_PROGRESS;
    }

    isMintStepChooseOption(): boolean {
        return this.mintStep === NavStore.STEP_CHOOSE_OPTION;
    }

    isMintStepUploadFile(): boolean {
        return this.mintStep === NavStore.STEP_UPLOAD_FILE;
    }

    isMintStepCollectionDetails(): boolean {
        return this.mintStep === NavStore.STEP_COLLECTION_DETAILS;
    }

    isMintStepDetails(): boolean {
        return this.mintStep === NavStore.STEP_NFT_DETAILS;
    }

    isMintStepFinish(): boolean {
        return this.mintStep === NavStore.STEP_FINISH;
    }

    isMintStepMinting(): boolean {
        return this.mintStep === NavStore.STEP_MINTING_IN_PROGRESS;
    }

    isMintStepDone(): boolean {
        return this.mintStep === NavStore.STEP_MINTING_DONE;
    }

    isMintStepFailed(): boolean {
        return this.mintStep === NavStore.STEP_MINTING_FAILED;
    }

    isFirstStep(): boolean {
        return this.isMintStepChooseOption();
    }

    isLastStep(): boolean {
        return this.isMintStepFinish();
    }

    isInMintingStep(): boolean {
        return this.mintStep <= NavStore.STEP_FINISH;
    }

    shouldShowBackStep(): boolean {
        return !this.isFirstStep() && this.isInMintingStep();
    }

    shouldShowNextStep(): boolean {
        return !this.isMintStepFinish() && !this.isMintStepMinting() && !this.isMintStepFailed();
    }

    shouldShowMintStepNavMap(): boolean {
        return this.isInMintingStep();
    }

    getNextStepText(): string {
        return this.isMintStepDone() ? 'Go to My NFTs' : 'Next Step';
    }

    getPreviousStepFunction() {
        if (this.isMintStepDetails() && this.isMintOptionSingle()) {
            return () => this.mintStep = NavStore.STEP_UPLOAD_FILE;
        }

        return () => this.selectPreviousStep();
    }

    getNextStepFunction() {
        if (this.isNextStepActive()) {
            // for these cases return standard ++step
            if (this.isMintStepChooseOption()
                || (this.isMintStepUploadFile() && this.isMintOptionMultiple())
                || this.isMintStepCollectionDetails()
                || this.isMintStepDetails()) {
                return () => this.selectNextStep();
            }

            // if collection mint, this should jump to nft details
            if (this.isMintStepUploadFile() && this.isMintOptionSingle()) {
                return () => this.mintStep = NavStore.STEP_NFT_DETAILS;
            }

            // if success page text sais go to my nfts page, so do that
            if (this.isMintStepDone()) {
                return () => this.selectMyNftPage();
            }
        }

        return null;
    }

    finishMintingCollection() {
        this.collectionMinted = true;
        this.mintStep = NavStore.STEP_COLLECTION_DETAILS;
    }

    // option

    isMintOptionSingle(): boolean {
        return this.mintOption === NavStore.MINT_OPTION_SINGLE;
    }

    isMintOptionMultiple(): boolean {
        return this.mintOption === NavStore.MINT_OPTION_MULTIPLE;
    }

    isCollectionMinted(): boolean {
        return this.collectionMinted;
    }

    getMintStepShowNumber(): number {
        let showNumber = this.mintStep;

        if (this.isMintOptionSingle() && this.mintStep > NavStore.STEP_UPLOAD_FILE) {
            showNumber--;
        }

        return showNumber;
    }

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

    isNextStepActive(): boolean {
        // on first step a mint option should be selected to continue
        return (this.isMintStepChooseOption()
            && this.mintOption !== S.NOT_EXISTS)
            // on upload file step a file should be present to continue
            || (this.isMintStepUploadFile()
                && !this.nftMintStore.isNftsEmpty())
            // on collection details step a colletion should be minted
            || (this.isMintStepCollectionDetails()
                && this.collectionMinted)
            // on nft details step nft name should be entered for all pictures
            || (this.isMintStepDetails()
                && (
                    (this.isMintOptionSingle()
                        && this.nftMintStore.nfts[0].name !== S.Strings.EMPTY)
                    || (this.isMintOptionMultiple()
                        && this.nftMintStore.nfts.find((nft: NftModel) => nft.name === S.Strings.EMPTY) === undefined)
                )
            )
            // on fourth step always active
            || this.isMintStepFinish()
            // on step minting done button is always active as well
            || this.isMintStepDone()
    }
}

import { makeAutoObservable } from 'mobx';
import NftModel from '../models/NftModel';
import ProjectUtils from '../ProjectUtils';
import S from '../utilities/Main';
import MyNftsStore from './MyNftsStore';
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

    static COLLECTION_MINT_NONE: number = 1;
    static COLLECTION_MINT_SUCCESS: number = 2;
    static COLLECTION_MINT_FAIL: number = 3;

    nftPage: number;
    mintOption: number;
    mintStep: number;
    nftMintStore: NftMintStore;
    myNftsStore: MyNftsStore;
    collectionMinted: number;

    constructor(nftMintStore: NftMintStore, myNftsStore: MyNftsStore) {
        this.nftMintStore = nftMintStore;
        this.myNftsStore = myNftsStore;
        this.reset();

        makeAutoObservable(this);
    }

    reset() {
        this.nftPage = NavStore.MY_NFTS_PAGE_KEY;
        this.mintOption = S.NOT_EXISTS;
        this.mintStep = NavStore.STEP_CHOOSE_OPTION;
        this.collectionMinted = NavStore.COLLECTION_MINT_NONE;
    }

    resetToMintPage() {
        this.nftPage = NavStore.MINT_PAGE_KEY;
        this.mintOption = S.NOT_EXISTS;
        this.mintStep = NavStore.STEP_CHOOSE_OPTION;
        this.collectionMinted = NavStore.COLLECTION_MINT_NONE;
    }

    // page
    selectNftPage(page: number): void {
        if (page === NavStore.MINT_PAGE_KEY) {
            this.nftMintStore.reset();
        }

        this.reset();

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

    selectFirstMintStep = () => {
        this.nftMintStore.reset();
        this.mintStep = NavStore.STEP_CHOOSE_OPTION;
    }

    selectFinishStep = () => {
        this.mintStep = NavStore.STEP_FINISH;
    }

    selectStepMintingInProgress = () => {
        this.mintStep = NavStore.STEP_MINTING_IN_PROGRESS;
    }

    selectStepMintingSucceeeded = () => {
        this.mintStep = NavStore.STEP_MINTING_DONE;
    }

    selectStepMintingFailed = () => {
        this.mintStep = NavStore.STEP_MINTING_FAILED;
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
            return () => { this.mintStep = NavStore.STEP_UPLOAD_FILE };
        }

        return this.selectPreviousStep;
    }

    getNextStepFunction() {
        if (this.isNextStepActive()) {

            // for these cases return standard ++step
            // choose option step standard function
            if (this.isMintStepChooseOption()
                // upload files step standard function
                || (this.isMintStepUploadFile() && this.isMintOptionMultiple())
                // collection details step standard function
                || this.isMintStepCollectionDetails()
                // details step standard function
                || this.isMintStepDetails()) {
                return this.selectNextStep;
            }

            // on single nft mint option, jump pass collection details directly to mint details
            if (this.isMintStepUploadFile() && this.isMintOptionSingle()) {
                return () => { this.mintStep = NavStore.STEP_NFT_DETAILS };
            }

            // on mint success jump to my nfts
            if (this.isMintStepDone()) {
                return () => {
                    this.selectMyNftPage();
                    this.nftMintStore.reset();
                }
            }
        }

        return null;
    }

    // option
    isMintOptionSingle(): boolean {
        return this.mintOption === NavStore.MINT_OPTION_SINGLE;
    }

    isMintOptionMultiple(): boolean {
        return this.mintOption === NavStore.MINT_OPTION_MULTIPLE;
    }

    getMintStepShowNumber(): number {
        let showNumber = this.mintStep;

        if (this.isMintOptionSingle() && this.mintStep > NavStore.STEP_UPLOAD_FILE) {
            showNumber--;
        }

        return showNumber;
    }

    selectSingleMintOption(): void {
        this.mintOption = NavStore.MINT_OPTION_SINGLE;
        this.nftMintStore.selectSingleMintOption();
    }

    selectMultipleMintOption(): void {
        this.mintOption = NavStore.MINT_OPTION_MULTIPLE;
        this.nftMintStore.selectMultipleMintOption();
    }

    static getMintOptionText(mintOption: number): string {
        switch (mintOption) {
            case NavStore.MINT_OPTION_SINGLE:
                return 'Single Mint';
            case NavStore.MINT_OPTION_MULTIPLE:
                return 'Create Collection';
            default:
                return '';
        }
    }

    static getMintTypeText(mintOption: number): string {
        switch (mintOption) {
            case NavStore.MINT_OPTION_SINGLE:
                return 'Single Mint';
            case NavStore.MINT_OPTION_MULTIPLE:
                return 'Collection';
            default:
                return '';
        }
    }

    getMintOptionText(): string {
        return NavStore.getMintOptionText(this.mintOption);
    }

    isCollectionMintedSuccess(): boolean {
        return this.collectionMinted === NavStore.COLLECTION_MINT_SUCCESS;
    }

    isCollectionMintedNone(): boolean {
        return this.collectionMinted === NavStore.COLLECTION_MINT_NONE;
    }

    isCollectionMintedFail(): boolean {
        return this.collectionMinted === NavStore.COLLECTION_MINT_FAIL;
    }

    collectionMintSuccess = () => {
        this.mintStep = NavStore.STEP_COLLECTION_DETAILS;
        this.collectionMinted = NavStore.COLLECTION_MINT_SUCCESS;
    }

    collectionMintFail = () => {
        this.mintStep = NavStore.STEP_COLLECTION_DETAILS;
        this.collectionMinted = NavStore.COLLECTION_MINT_FAIL;
    }

    collectionMintNone() {
        this.collectionMinted = NavStore.COLLECTION_MINT_NONE;
    }

    isNextStepActive(): boolean {
        // on first step a mint option should be selected to continue
        if (this.isMintStepChooseOption() && this.mintOption !== S.NOT_EXISTS) {
            return true;
        }

        // on upload file step a file should be present to continue
        if (this.isMintStepUploadFile() && !this.nftMintStore.isNftsEmpty()) {
            return true;
        }

        // on collection details step a colletion should be minted
        if (this.isMintStepCollectionDetails() && this.isCollectionMintedSuccess()) {
            return true;
        }

        // on nft details step nft name should be entered for all pictures
        if (this.isMintStepDetails() && this.nftMintStore.isValidNftModels()) {
            return true;
        }

        // on fourth step always active
        if (this.isMintStepFinish()) {
            return true;
        }

        // on step minting done button is always active as well
        if (this.isMintStepDone()) {
            return true;
        }

        return false;
    }
}

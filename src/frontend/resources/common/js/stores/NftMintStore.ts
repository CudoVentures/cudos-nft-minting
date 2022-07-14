import { makeAutoObservable, makeObservable, observable } from 'mobx';
import { SigningStargateClient, estimateFee, Coin } from 'cudosjs';
import { NftInfo } from 'cudosjs/build/stargate/modules/nft/module';
import BigNumber from 'bignumber.js';

import S from '../utilities/Main';
import Config from '../../../../../../builds/dev-generated/Config';

import NftApi from '../api/NftApi';
import NftModel from '../models/NftModel';
import WalletStore from './WalletStore';
import NftCollectionModel from '../models/NftCollectionModel';
import AppStore from './AppStore';

export default class NftMintStore {

    static LOWER_ALPHANUMERIC_START_WITH_LETTER_REGEX = /^[a-z][a-z0-9]*$/;

    static MINT_MODE_LOCAL: number = 1;
    static MINT_MODE_BACKEND: number = 2;

    static INPUT_NFT_NAME: number = 3;
    static INPUT_NFT_RECIPIENT: number = 4;

    nftApi: NftApi;
    appStore: AppStore;
    walletStore: WalletStore;
    navMintStore: NavMintStore;

    imageUrlInputValue: string;

    nftCollection: NftCollectionModel;
    nfts: NftModel[];
    selectedNfts: number[];

    collectionInputError: string;
    nftsInputErrors: boolean[];

    transactionHash: string;

    constructor(appStore: AppStore, walletStore: WalletStore) {
        this.nftApi = new NftApi();
        this.appStore = appStore;
        this.walletStore = walletStore;
        this.navMintStore = new NavMintStore(this);

        this.reset(false);

        makeAutoObservable(this);
    }

    // utils
    getTxHashLink(): string {
        return `${Config.CUDOS_NETWORK.EXPLORER}/transactions/${this.transactionHash}`
    }

    reset(resetNavStore: boolean) {
        this.imageUrlInputValue = S.Strings.EMPTY;

        this.nftCollection = null;
        this.nfts = [];
        this.selectedNfts = [];

        this.transactionHash = S.Strings.EMPTY;

        this.collectionInputError = S.Strings.EMPTY;

        this.nftsInputErrors = [];

        if (resetNavStore === true) {
            this.navMintStore.reset();
        }
    }

    // mint option
    selectSingleMintOption() {
        this.reset(false);
        this.nftCollection = NftCollectionModel.instanceCudosMainCollection();
    }

    selectMultipleMintOption() {
        this.reset(false);
        this.nftCollection = new NftCollectionModel();
    }

    // estimate
    async esimateMintFees(local: number, callback: (fee: BigNumber) => void) {
        try {
            if (local === NftMintStore.MINT_MODE_LOCAL) {
                const { signer, sender, client } = await this.walletStore.getSignerData();

                const nftInfos = this.nfts.map((nftModel: NftModel) => new NftInfo(nftModel.denomId, nftModel.name, nftModel.url.substring(0, Math.min(nftModel.url.length, 256)), nftModel.data, sender));

                const { msgs, fee } = await client.nftModule.msgMintMultipleNFT(
                    nftInfos,
                    sender,
                    '',
                    NftApi.getGasPrice(),
                )

                callback(new BigNumber(fee.amount[0].amount));
            } if (local === NftMintStore.MINT_MODE_BACKEND) {
                this.nftApi.estimateFeeMintNft(this.nfts, (fee: Coin[]) => {
                    callback(new BigNumber(fee[0].amount));
                })
            }
        } catch (e) {
            console.log(e);
            throw new Error('Failed to connect signing client');
        }
    }

    // minting
    mintCollection = async () => {
        this.navMintStore.selectStepMintingInProgress();

        this.appStore.disableActions();

        try {
            const client = await SigningStargateClient.connectWithSigner(Config.CUDOS_NETWORK.RPC, this.walletStore.keplrWallet.offlineSigner);
            const txRes = await client.nftIssueDenom(
                this.walletStore.keplrWallet.accountAddress,
                this.nftCollection.denomId,
                this.nftCollection.name,
                S.Strings.EMPTY,
                // TODO: do correct symbol
                this.nftCollection.denomId,
                NftApi.getGasPrice(),
            );

            const log = JSON.parse(txRes.rawLog);
            const attributeEvent = log[0].events.find((event: any) => event.type === 'issue_denom');

            if (attributeEvent === undefined) {
                throw Error('Failed to get event from tx response');
            }

            const tokenIdAttr = attributeEvent.attributes.find((attr) => attr.key === 'denom_id');
            if (tokenIdAttr === undefined) {
                throw Error('Failed to get token id attribute from attribute event.');
            }

            this.nftCollection.denomId = tokenIdAttr.value;
            this.nfts.forEach((nftModel) => {
                nftModel.denomId = this.nftCollection.denomId;
            })
            this.transactionHash = txRes.transactionHash;

            this.navMintStore.collectionMintSuccess();
        } catch (e) {
            console.log(e);
            this.navMintStore.collectionMintFail();
        } finally {
            this.appStore.enableActions();
        }
    }

    mintNfts = async (): Promise<void> => {
        if (!this.isValidNftModels()) {
            this.navMintStore.selectStepMintingFailed();
            return;
        }

        this.navMintStore.selectStepMintingInProgress();

        try {
            this.appStore.disableActions();
            if (this.navMintStore.isMintOptionSingle() === true) {
                await this.mintSingleNftInCudosCollection();
            } else if (this.navMintStore.isMintOptionMultiple() === true) {
                await this.mintNftsInOwnCollection();
            }
            this.navMintStore.selectStepMintingSucceeeded();
        } catch (e) {
            this.navMintStore.selectStepMintingFailed();
        } finally {
            this.appStore.enableActions();
        }
    }

    private async mintSingleNftInCudosCollection() {
        this.transactionHash = await this.nftApi.mintNftsInCudosCollection(this.nfts);
    }

    private async mintNftsInOwnCollection() {
        const nfts = this.nfts;

        let client: SigningStargateClient;

        try {
            client = await SigningStargateClient.connectWithSigner(Config.CUDOS_NETWORK.RPC, this.walletStore.keplrWallet.offlineSigner);
        } catch (e) {
            throw new Error('Failed to connect signing client');
        }

        const urls = nfts.map((nft: NftModel) => nft.url);
        const imageUrls = await this.nftApi.uploadFilesToIpfs(urls);
        for (let i = 0; i < nfts.length; i++) {
            if (nfts[i].url.includes(';base64,')) {
                nfts[i].url = imageUrls[i];
            }
        }
        const nftInfos = nfts.map((nftModel: NftModel) => new NftInfo(nftModel.denomId, nftModel.name, nftModel.url, nftModel.data, nftModel.recipient));
        const mintRes = await client.nftMintMultipleTokens(nftInfos, this.walletStore.keplrWallet.accountAddress, NftApi.getGasPrice());

        // get the token ids from the mint transaction result
        // each log represents one message in the transaction
        const log = JSON.parse(mintRes.rawLog);
        for (let i = 0; i < log.length; i++) {
            // each message has a few events, the get the one with the correct type
            const attributeEvent = log[i].events.find((event: any) => event.type === 'mint_nft');

            if (attributeEvent === undefined) {
                throw Error('Failed to get event from tx response');
            }

            // get token id from the event attributes
            const tokenIdAttr = attributeEvent.attributes.find((attr) => attr.key === 'token_id');
            if (tokenIdAttr === undefined) {
                throw Error('Failed to get token id attribute from attribute event.');
            }

            nfts[i].tokenId = tokenIdAttr.value;
        }
    }

    isValidNftModels(): boolean {
        for (let i = this.nfts.length; i-- > 0;) {
            if (this.nfts[i].isValidForSubmit() === false) {
                return false;
            }
        }

        return true;
    }

    // images
    async addNftFromUpload(url: string, fileName: string, type: string, sizeBytes: number): Promise<void> {
        const searchFor = 'base64,';
        const binaryString = window.atob(url.substring(url.indexOf(searchFor) + searchFor.length));
        const bytes = new Uint8Array(binaryString.length);
        for (let i = binaryString.length; i-- > 0;) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        await this.addNftModel(url, fileName, type, sizeBytes, bytes.buffer);
    }

    async addNftFromLink(): Promise<void> {
        let url = this.imageUrlInputValue;
        this.imageUrlInputValue = S.Strings.EMPTY;

        if (!url.startsWith('http')) {
            url = `http://${url}`;
        }

        try {
            const imageRes = await fetch(url);
            let contentType = imageRes.headers.get('Content-Type');
            contentType = contentType.slice(contentType.indexOf('/') + 1);
            const contentLength = Number(imageRes.headers.get('Content-Length'));

            await this.addNftModel(url, `NFT-${Date.now()}`, contentType, contentLength, await imageRes.arrayBuffer());
        } catch (e) {
            throw Error('Could not fetch file.');
        }
    }

    private async addNftModel(url: string, fileName: string, type: string, sizeBytes: number, arrayBuffer: ArrayBuffer): Promise<void> {
        const nft = new NftModel();

        nft.url = url;
        nft.recipient = this.walletStore.keplrWallet.accountAddress;

        nft.denomId = this.nftCollection.denomId;
        nft.fileName = fileName;
        nft.type = type;
        nft.sizeBytes = sizeBytes;
        nft.updatePreviewUrl();

        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        nft.data = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

        this.nfts.push(nft);
    }

    // credit
    removeNft(indexToRemove: number): void {
        this.nfts = this.nfts.filter((image: NftModel, index: number) => index !== indexToRemove);
        this.selectedNfts = [];
    }

    removeSelectedNfts(): void {
        this.nfts = this.nfts.filter(
            (v: NftModel, i: number) => this.selectedNfts.find((value: number) => value === i) === undefined,
        );
        this.selectedNfts = [];
    }

    onSelectNft(index: number): void {
        if (this.isNftSelected(index) === S.INT_TRUE) {
            this.selectedNfts = this.selectedNfts.filter((i: number) => i !== index);
        } else {
            this.selectedNfts.push(index);
        }
    }

    onSelectAllNfts(): void {
        const result = [];

        if (this.areAllNftsSelected() === S.INT_FALSE) {
            for (let i = 0; i < this.nfts.length; i++) {
                result.push(i);
            }
        }

        this.selectedNfts = result;
    }

    areAnyNftsSelected(): boolean {
        return this.selectedNfts.length > 0;
    }

    areAllNftsSelected(): number {
        return this.nfts.length === this.selectedNfts.length && this.nfts.length !== 0 ? S.INT_TRUE : S.INT_FALSE;
    }

    isNftSelected(index: number): number {
        return this.selectedNfts.find((i: number) => i === index) !== undefined ? S.INT_TRUE : S.INT_FALSE;
    }

    isNftsEmpty(): boolean {
        return this.nfts.length === 0;
    }

}

export class NavMintStore {

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

    mintOption: number;
    mintStep: number;
    collectionMinted: number;
    nftMintStore: NftMintStore;

    constructor(nftMintStore: NftMintStore) {
        this.nftMintStore = nftMintStore;
        this.reset();

        makeAutoObservable(this);
    }

    reset() {
        this.mintOption = S.NOT_EXISTS;
        this.mintStep = NavMintStore.STEP_CHOOSE_OPTION;
        this.collectionMinted = NavMintStore.COLLECTION_MINT_NONE;
    }

    // step
    selectPreviousStep = () => {
        --this.mintStep;
    }

    selectNextStep = () => {
        ++this.mintStep;
    }

    selectNftDetailsStep = () => {
        this.mintStep = NavMintStore.STEP_NFT_DETAILS;
    }

    selectFinishStep = () => {
        this.mintStep = NavMintStore.STEP_FINISH;
    }

    selectStepMintingInProgress = () => {
        this.mintStep = NavMintStore.STEP_MINTING_IN_PROGRESS;
    }

    selectStepMintingSucceeeded = () => {
        this.mintStep = NavMintStore.STEP_MINTING_DONE;
    }

    selectStepMintingFailed = () => {
        this.mintStep = NavMintStore.STEP_MINTING_FAILED;
    }

    isMintStepChooseOption(): boolean {
        return this.mintStep === NavMintStore.STEP_CHOOSE_OPTION;
    }

    isMintStepUploadFile(): boolean {
        return this.mintStep === NavMintStore.STEP_UPLOAD_FILE;
    }

    isMintStepCollectionDetails(): boolean {
        return this.mintStep === NavMintStore.STEP_COLLECTION_DETAILS;
    }

    isMintStepDetails(): boolean {
        return this.mintStep === NavMintStore.STEP_NFT_DETAILS;
    }

    isMintStepFinish(): boolean {
        return this.mintStep === NavMintStore.STEP_FINISH;
    }

    isMintStepMinting(): boolean {
        return this.mintStep === NavMintStore.STEP_MINTING_IN_PROGRESS;
    }

    isMintStepDone(): boolean {
        return this.mintStep === NavMintStore.STEP_MINTING_DONE;
    }

    isMintStepFailed(): boolean {
        return this.mintStep === NavMintStore.STEP_MINTING_FAILED;
    }

    isFirstStep(): boolean {
        return this.isMintStepChooseOption();
    }

    isLastStep(): boolean {
        return this.isMintStepFinish();
    }

    isInMintingStep(): boolean {
        return this.mintStep <= NavMintStore.STEP_FINISH;
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

    getPreviousStepFunction() {
        if (this.isMintStepDetails() && this.isMintOptionSingle()) {
            return () => { this.mintStep = NavMintStore.STEP_UPLOAD_FILE };
        }

        return this.selectPreviousStep;
    }

    // option
    isMintOptionSingle(): boolean {
        return this.mintOption === NavMintStore.MINT_OPTION_SINGLE;
    }

    isMintOptionMultiple(): boolean {
        return this.mintOption === NavMintStore.MINT_OPTION_MULTIPLE;
    }

    getMintStepShowNumber(): number {
        let showNumber = this.mintStep;

        if (this.isMintOptionSingle() && this.mintStep > NavMintStore.STEP_UPLOAD_FILE) {
            showNumber--;
        }

        return showNumber;
    }

    selectSingleMintOption(): void {
        this.mintOption = NavMintStore.MINT_OPTION_SINGLE;
        this.nftMintStore.selectSingleMintOption();
    }

    selectMultipleMintOption(): void {
        this.mintOption = NavMintStore.MINT_OPTION_MULTIPLE;
        this.nftMintStore.selectMultipleMintOption();
    }

    static getMintOptionText(mintOption: number): string {
        switch (mintOption) {
            case NavMintStore.MINT_OPTION_SINGLE:
                return 'Single Mint';
            case NavMintStore.MINT_OPTION_MULTIPLE:
                return 'Create Collection';
            default:
                return S.Strings.EMPTY;
        }
    }

    static getMintTypeText(mintOption: number): string {
        switch (mintOption) {
            case NavMintStore.MINT_OPTION_SINGLE:
                return 'Single Mint';
            case NavMintStore.MINT_OPTION_MULTIPLE:
                return 'Collection';
            default:
                return S.Strings.EMPTY;
        }
    }

    getMintOptionText(): string {
        return NavMintStore.getMintOptionText(this.mintOption);
    }

    isCollectionMintedSuccess(): boolean {
        return this.collectionMinted === NavMintStore.COLLECTION_MINT_SUCCESS;
    }

    isCollectionMintedNone(): boolean {
        return this.collectionMinted === NavMintStore.COLLECTION_MINT_NONE;
    }

    isCollectionMintedFail(): boolean {
        return this.collectionMinted === NavMintStore.COLLECTION_MINT_FAIL;
    }

    collectionMintSuccess = () => {
        this.mintStep = NavMintStore.STEP_COLLECTION_DETAILS;
        this.collectionMinted = NavMintStore.COLLECTION_MINT_SUCCESS;
    }

    collectionMintFail = () => {
        this.mintStep = NavMintStore.STEP_COLLECTION_DETAILS;
        this.collectionMinted = NavMintStore.COLLECTION_MINT_FAIL;
    }

    collectionMintNone() {
        this.collectionMinted = NavMintStore.COLLECTION_MINT_NONE;
    }

}

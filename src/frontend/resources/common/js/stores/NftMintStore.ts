import { makeObservable, observable } from 'mobx';
import InfuraApi from '../api/InfuraApi';
import NftApi from '../api/NftApi';
import NftImageModel from '../models/NftImageModel';
import NftModel from '../models/NftModel';
import S from '../utilities/Main';
import { GasPrice, SigningStargateClient, StargateClient } from 'cudosjs';
import WalletStore from './WalletStore';
import Config from '../../../../../../builds/dev-generated/Config';

export default class NftMintStore {

    nftApi: NftApi;
    infuraApi: InfuraApi;
    walletStore: WalletStore;

    @observable isImageLinkValid: boolean;
    @observable imageUrlInputValue: string;
    @observable isAddressFieldActive: number;

    @observable collectionName: string;
    @observable nfts: NftModel[];
    @observable mintedNfts: number[];
    @observable selectedNfts: number[];

    @observable transactionHash: string;

    constructor(walletStore: WalletStore) {
        this.nftApi = new NftApi();
        this.infuraApi = new InfuraApi();
        this.walletStore = walletStore;

        this.nfts = [];
        this.collectionName = S.Strings.EMPTY;
        this.mintedNfts = [];
        this.selectedNfts = [];
        this.isAddressFieldActive = S.INT_FALSE;
        this.imageUrlInputValue = S.Strings.EMPTY;
        this.transactionHash = S.Strings.EMPTY;

        makeObservable(this);
    }

    async init(): Promise<void> {
        // await this.nftApi.init();
    }

    async getAllNfts(): Promise<void> {
        this.nftApi.fetchAllNfts((nfts: NftModel[]) => {
            this.nfts = nfts;
        });
    }

    async getUserNfts(owner: string): Promise<void> {
        this.nftApi.fetchAllNfts((nfts: NftModel[]) => {
            this.nfts = nfts.filter((nft: NftModel) => nft.owner === owner);
        })
    }

    async mintCollection(callBefore: () => void, callback: () => void) {
        callBefore();

        const client = await SigningStargateClient.connectWithSigner(Config.CUDOS_NETWORK.RPC, this.walletStore.keplrWallet.offlineSigner);
        // TODO: check if denom id exists
        const txRes = await client.nftIssueDenom(
            this.walletStore.keplrWallet.accountAddress,
            this.collectionName,
            this.collectionName,
            this.collectionName,
            this.collectionName,
            GasPrice.fromString(Config.CUDOS_NETWORK.GAS_PRICE + Config.CUDOS_NETWORK.DENOM),
        );

        this.transactionHash = txRes.transactionHash;

        callback();
    }

    async mintNft(): Promise<void> {
        console.log('MINT NFTTTTTT')

        // this.nftApi.mintNft(this.nftForm, (nft: NftModel) => {
        //     this.nfts.push(nft);
        // })
    }

    getTxHashLink(): string {
        return `${Config.CUDOS_NETWORK.EXPLORER}/transactions/${this.transactionHash}`
    }

    nftImageStartUpload(): NftImageModel {
        const nft = new NftModel();
        nft.nftImage = new NftImageModel();
        this.nfts.push(nft);

        return nft.nftImage;
    }

    addNewImageModel(nftImageModel: NftImageModel): void {
        const nft = new NftModel();
        nft.nftImage = nftImageModel;
        this.nfts.push(nft);
    }

    onImageUrlChange(value: string): void {
        this.imageUrlInputValue = value;
    }

    async getImageFromUrl(): Promise<void> {
        let url = this.imageUrlInputValue;

        this.imageUrlInputValue = '';

        try {
            if (!url.startsWith('http')) {
                url = `http://${url}`;
            }
            const imageRes = await fetch(url);
            let contentType = imageRes.headers.get('Content-Type');
            contentType = contentType.slice(contentType.indexOf('/') + 1);
            const contentLength = imageRes.headers.get('Content-Length');
            const nftImage = NftImageModel.fromJSON({
                imageUrl: url,
                fileName: 'linkedImage',
                type: contentType,
                sizeBytes: contentLength,
            })
            this.nftImages.push(nftImage);

        } catch (e) {
            throw Error('Could not fetch file.');
        }

    }

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
        return this.nfts.length === this.selectedNfts.length
            && this.nfts.length !== 0
            ? S.INT_TRUE : S.INT_FALSE;
    }

    isNftSelected(index: number): number {
        return this.selectedNfts.find((i: number) => i === index) !== undefined ? S.INT_TRUE : S.INT_FALSE;
    }

    isNftsEmpty(): boolean {
        return this.nfts.length === 0;
    }

    onChangeCollectionName(value: string): void {
        this.collectionName = value;
    }

    onChangeNftFormName(nft: NftModel, value: string): void {
        nft.name = value;
    }

    onChangeNftFormAddress(nft: NftModel, value: string): void {
        nft.owner = value;
    }

    toggleAddressFieldActive(): void {
        this.isAddressFieldActive = this.isAddressFieldActive === S.INT_TRUE ? S.INT_FALSE : S.INT_TRUE;
    }
}

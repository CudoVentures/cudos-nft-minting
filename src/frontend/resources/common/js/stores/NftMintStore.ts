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

    @observable nftImages: NftImageModel[];
    @observable selectedImages: number[];
    @observable isImageLinkValid: boolean;
    @observable imageUrlInputValue: string;
    @observable isAddressFieldActive: number;

    @observable collectionName: string;
    @observable nftForm: NftModel;
    @observable nfts: NftModel[];
    @observable mintedNfts: number[];

    constructor(walletStore: WalletStore) {
        this.nftApi = new NftApi();
        this.infuraApi = new InfuraApi();
        this.walletStore = walletStore;

        this.nfts = [];
        this.nftForm = new NftModel();
        this.collectionName = '';
        this.nftImages = [];
        this.mintedNfts = [];
        this.selectedImages = [];
        this.isAddressFieldActive = S.INT_FALSE;
        this.imageUrlInputValue = S.Strings.EMPTY;

        const nft = NftModel.fromJSON({
            uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/800px-Image_created_with_a_mobile_phone.png',
            name: 'In Da Jungl',
        })

        this.nfts.push(nft);
        this.mintedNfts.push(this.nfts.length - 1);

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
        // TODO: check if denom id exists
        // const queryClient = await StargateClient.connect(Config.CUDOS_NETWORK.RPC);
        // await queryClient.getNftDenom(this.collectionName);

        const client = await SigningStargateClient.connectWithSigner(Config.CUDOS_NETWORK.RPC, this.walletStore.keplrWallet.offlineSigner);

        await client.nftIssueDenom(
            this.walletStore.keplrWallet.accountAddress,
            this.collectionName,
            this.collectionName,
            this.collectionName,
            this.collectionName,
            GasPrice.fromString(Config.CUDOS_NETWORK.GAS_PRICE + Config.CUDOS_NETWORK.DENOM),
        );

        callback();
    }

    async mintNft(): Promise<void> {
        console.log('MINT NFTTTTTT')

        // this.nftApi.mintNft(this.nftForm, (nft: NftModel) => {
        //     this.nfts.push(nft);
        // })
    }

    nftImageStartUpload(): NftImageModel {
        const nftImage = new NftImageModel();
        this.nftImages.push(nftImage);
        return nftImage;
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

    removeNftImage(indexToRemove: number): void {
        this.nftImages = this.nftImages.filter((image: NftImageModel, index: number) => index !== indexToRemove);
        this.selectedImages = this.selectedImages.filter((i: number) => i !== indexToRemove);
    }

    onSelectImage(index: number): void {
        if (this.isNftImageSelected(index) === S.INT_TRUE) {
            this.selectedImages = this.selectedImages.filter((i: number) => i !== index);
        } else {
            this.selectedImages.push(index);
        }
    }

    onSelectAllImages(): void {
        const result = [];

        if (this.areAllImagesSelected() === S.INT_FALSE) {
            for (let i = 0; i < this.nftImages.length; i++) {
                result.push(i);
            }
        }

        this.selectedImages = result;
    }

    areAllImagesSelected(): number {
        return this.nftImages.length === this.selectedImages.length
            && this.nftImages.length !== 0
            ? S.INT_TRUE : S.INT_FALSE;
    }

    isNftImageSelected(index: number): number {
        return this.selectedImages.find((i: number) => i === index) !== undefined ? S.INT_TRUE : S.INT_FALSE;
    }

    onChangeCollectionName(value: string): void {
        this.collectionName = value;
    }

    onChangeNftFormName(value: string): void {
        this.nftForm.name = value;
    }

    onChangeNftFormAddress(value: string): void {
        this.nftForm.owner = value;
    }

    toggleAddressFieldActive(): void {
        this.isAddressFieldActive = this.isAddressFieldActive === S.INT_TRUE ? S.INT_FALSE : S.INT_TRUE;
    }

    isNftImagesEmpty(): boolean {
        return this.nftImages.length !== 0;
    }
}

import { makeObservable, observable } from 'mobx';
import InfuraApi from '../api/InfuraApi';
import NftApi from '../api/NftApi';
import NftImageModel from '../models/NftImageModel';
import NftModel from '../models/NftModel';
import S from '../utilities/Main';

export default class NftMintStore {
    URL_REGEX = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

    nftApi: NftApi;
    infuraApi: InfuraApi;

    @observable nftImages: NftImageModel[];
    @observable selectedImages: number[];
    @observable isImageLinkValid: boolean;
    @observable imageUrlInputValue: string;

    @observable nftForm: NftModel;
    @observable nfts: NftModel[];

    constructor() {
        this.nftApi = new NftApi();
        this.infuraApi = new InfuraApi();
        this.nfts = [];
        this.nftForm = new NftModel();
        this.nftImages = [];
        this.selectedImages = [];
        this.isImageLinkValid = false;
        this.imageUrlInputValue = S.Strings.EMPTY;

        makeObservable(this);
    }

    async init(): Promise<void> {
        await this.nftApi.init();
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

    async mintNft(): Promise<void> {
        this.nftApi.mintNft(this.nftForm, (nft: NftModel) => {
            this.nfts.push(nft);
        })
    }

    nftImageStartUpload(): NftImageModel {
        const nftImage = new NftImageModel();
        this.nftImages.push(nftImage);
        return nftImage;
    }

    onImageUrlChange(): void {
        this.isImageLinkValid = this.URL_REGEX.test(this.imageUrlInputValue);
    }

    onClickAddImageLink(): Promise<void> {
        const url = this.imageUrlInputValue;

        // TODO: get valid image data
        // const nftImage = new NftImageModel({
        //     imageUrl: link,
        // })
        // this.nftImages.push(nftImage);

        // TODO: clear url input
        return true;
    }

    removeNftImage(indexToRemove: number): void {
        this.nftImages = this.nftImages.filter((image: NftImageModel, index: number) => index !== indexToRemove);
    }
}

import { makeObservable, observable } from 'mobx';
import InfuraApi from '../api/InfuraApi';
import NftApi from '../api/NftApi';
import NftImageModel from '../models/NftImageModel';
import NftModel from '../models/NftModel';
import S from '../utilities/Main';

export default class NftMintStore {

    nftApi: NftApi;
    infuraApi: InfuraApi;

    @observable nftImages: NftImageModel[];
    @observable selectedImages: number[];
    @observable isImageLinkValid: boolean;
    @observable imageUrlInputValue: string;
    @observable isAddressFieldActive: number;

    @observable nftForm: NftModel;
    @observable nfts: NftModel[];

    constructor() {
        this.nftApi = new NftApi();
        this.infuraApi = new InfuraApi();
        this.nfts = [];
        this.nftForm = new NftModel();
        this.nftImages = [];
        this.selectedImages = [];
        this.isAddressFieldActive = S.INT_FALSE;
        this.imageUrlInputValue = S.Strings.EMPTY;

        this.nftImages.push(NftImageModel.fromJSON({
            name: 'wegwegweg',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/800px-Image_created_with_a_mobile_phone.png',
            sizeBytes: 123123123,
            type: 'jpeg',
        }))

        this.nftForm.name = 'test nftii';
        this.nftForm.data = 'aerger erahaerhaer arehaerh';
        this.nftForm.owner = 'cudos1aerhaerhaerhaerharhaerhaerhaerhaerh'

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

    onChangeNftFormName(value: string): void {
        this.nftForm.name = value;
    }

    onChangeNftFormDescription(value: string): void {
        this.nftForm.data = value;
    }

    onChangeNftFormAddress(value: string): void {
        this.nftForm.owner = value;
    }

    toggleAddressFieldActive(): void {
        this.isAddressFieldActive = this.isAddressFieldActive === S.INT_TRUE ? S.INT_FALSE : S.INT_TRUE;
    }

}

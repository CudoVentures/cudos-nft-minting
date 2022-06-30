
import { makeObservable, observable } from 'mobx';
import InfuraApi from '../api/InfuraApi';
import NftApi from '../api/NftApi';
import NftImageModel from '../models/NftImageModel';
import NftModel from '../models/NftModel';


export default class NftStore {
    nftApi: NftApi;
    infuraApi: InfuraApi;

    @observable nftImage: NftImageModel;
    @observable nftForm: NftModel;
    @observable nfts: NftModel[];

    constructor() {
        this.nftApi = new NftApi();
        this.infuraApi = new InfuraApi();
        this.nfts = [];
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
        this.infuraApi.uploadImage(this.nftImage, (nftImage: NftImageModel) => {
            this.nftImage = nftImage;
            this.nftForm.uri = this.nftImage.imageUrl;

            this.nftApi.mintNft(this.nftForm, (nft: NftModel) => {
                this.nfts.push(nft);
            })
        });

    }
}

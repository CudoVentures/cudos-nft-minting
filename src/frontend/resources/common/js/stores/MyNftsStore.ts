import { makeAutoObservable } from 'mobx';
import NftCollectionModel from '../models/NftCollectionModel';
import NftModel from '../models/NftModel';

export default class MyNftsStore {

    nftModels: NftModel[];
    nftCollectionModels: NftCollectionModel[];

    constructor() {
        this.nftModels = [1];
        this.nftCollectionModels = [2, 3];
        makeAutoObservable(this);
    }

    hasNfts(): boolean {
        return this.nftModels.length !== 0 || this.nftCollectionModels.length !== 0;
    }

    async fetchNfts() {
        // To do: this methos read from the chail all the nfts then splits the nfts to collections and single nfts
    }

}

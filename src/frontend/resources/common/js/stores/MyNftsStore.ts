import { makeAutoObservable } from 'mobx';
import NftCollectionModel from '../models/NftCollectionModel';
import NftModel from '../models/NftModel';
import S from '../utilities/Main';

export default class MyNftsStore {

    static FILTER_PAGE_SINGLE_NFTS: number = 1;
    static FILTER_PAGE_COLLECTION: number = 2;

    nftModels: NftModel[];
    nftCollectionModels: NftCollectionModel[];

    filterString: string;
    filterPage: number;

    constructor() {
        this.nftModels = [1];
        this.nftCollectionModels = [2, 3];

        this.filterString = S.Strings.EMPTY;
        this.filterPage = MyNftsStore.FILTER_PAGE_SINGLE_NFTS;

        makeAutoObservable(this);
    }

    hasNfts(): boolean {
        return this.nftModels.length !== 0 || this.nftCollectionModels.length !== 0;
    }

    isFilterredSingleNftsPage(): boolean {
        return this.filterPage === MyNftsStore.FILTER_PAGE_SINGLE_NFTS;
    }

    isFilterredCollectionsPage(): boolean {
        return this.filterPage === MyNftsStore.FILTER_PAGE_COLLECTION;
    }

    markSingleNftsFilterPage = () => {
        this.filterPage = MyNftsStore.FILTER_PAGE_SINGLE_NFTS;
    }

    markCollectionFilterPage = () => {
        this.filterPage = MyNftsStore.FILTER_PAGE_COLLECTION;
    }

    async fetchNfts() {
        // To do: this methos read from the chail all the nfts then splits the nfts to collections and single nfts
    }

}

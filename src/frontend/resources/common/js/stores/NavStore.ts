import { makeAutoObservable } from 'mobx';

import S from '../utilities/Main';
import MyNftsStore from './MyNftsStore';
import NftMintStore from './NftMintStore';

export default class NavStore {

    static MINT_PAGE_KEY: number = 1;
    static MY_NFTS_PAGE_KEY: number = 2;

    nftPage: number;
    nftMintStore: NftMintStore;
    myNftsStore: MyNftsStore;

    constructor(nftMintStore: NftMintStore, myNftsStore: MyNftsStore) {
        this.nftMintStore = nftMintStore;
        this.myNftsStore = myNftsStore;
        this.reset();

        makeAutoObservable(this);
    }

    reset = () => {
        this.nftPage = NavStore.MY_NFTS_PAGE_KEY;
    }

    selectNftPage(page: number): void {
        if (page === NavStore.MINT_PAGE_KEY) {
            this.nftMintStore.reset(true);
        }

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
}

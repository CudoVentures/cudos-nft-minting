import { makeAutoObservable } from 'mobx';
import Config from '../../../../../../builds/dev-generated/Config';
import FilterHelper from '../helpers/FilterHelper';
import TimeoutHelper from '../helpers/TimeoutHelper';
import NftCollectionModel from '../models/NftCollectionModel';
import NftModel from '../models/NftModel';
import NftApi from '../api/NftApi';
import S from '../utilities/Main';
import WalletStore from './WalletStore';
import AppStore from './AppStore';

const emptyStore = false;

export default class MyNftsStore {

    static PAGE_SINGLE_NFTS: number = 1;
    static PAGE_NFT_COLLECTIONS: number = 2;

    nftApi: NftApi;
    appStore: AppStore;
    walletStore: WalletStore;

    nftModels: NftModel[];
    nftCollectionModels: NftCollectionModel[];
    nftsInCollectionsMap: Map<string, NftModel[]>;

    viewPage: number;
    viewNftModel: NftModel;
    viewNftCollectionModel: NftCollectionModel;

    filterString: string;
    filterredNftModels: NftModel[];
    filteredNftCollectionModels: NftCollectionModel[];

    initialized: boolean;
    timeoutHelper: TimeoutHelper;

    constructor(appStore: AppStore, walletStore: WalletStore) {
        this.nftApi = new NftApi();
        this.appStore = appStore;
        this.walletStore = walletStore;

        this.nftModels = [];
        this.nftCollectionModels = [];
        this.nftsInCollectionsMap = new Map();

        this.viewPage = MyNftsStore.PAGE_SINGLE_NFTS;
        this.viewNftModel = null;
        this.viewNftCollectionModel = null;

        this.filterString = S.Strings.EMPTY;

        this.initialized = false;
        this.timeoutHelper = new TimeoutHelper();

        makeAutoObservable(this);
    }

    isInitialized(): boolean {
        return this.initialized === true;
    }

    isViewSingleNfts(): boolean {
        return this.viewPage === MyNftsStore.PAGE_SINGLE_NFTS;
    }

    isViewNftCollections(): boolean {
        return this.viewPage === MyNftsStore.PAGE_NFT_COLLECTIONS;
    }

    hasViewNft(): boolean {
        return this.viewNftModel !== null;
    }

    hasViewCollection(): boolean {
        return this.viewNftCollectionModel !== null;
    }

    hasNfts(): boolean {
        return this.nftModels.length !== 0 || this.nftCollectionModels.length !== 0;
    }

    markViewSingleNfts = () => {
        this.viewPage = MyNftsStore.PAGE_SINGLE_NFTS;
        this.viewNftModel = null;
        this.viewNftCollectionModel = null;
    }

    markViewNftCollections = () => {
        this.viewPage = MyNftsStore.PAGE_NFT_COLLECTIONS;
        this.viewNftModel = null;
        this.viewNftCollectionModel = null;
    }

    markNft(nftModel: NftModel) {
        this.viewNftModel = nftModel;
    }

    markNftCollection(nftCollectionModel: NftCollectionModel) {
        this.viewNftCollectionModel = nftCollectionModel;
    }

    invalidateFilterSignal() {
        this.timeoutHelper.signal(this.filter);
    }

    getNftsInCollection(denomId: string): NftModel[] {
        return this.nftsInCollectionsMap.get(denomId) ?? [];
    }

    filter = () => {
        this.filterredNftModels = FilterHelper.filter(this.getNftsInCollection(Config.CUDOS_NETWORK.NFT_DENOM_ID), this.filterString) as NftModel[];
        this.filteredNftCollectionModels = FilterHelper.filter(this.nftCollectionModels, this.filterString) as NftCollectionModel[];
    }

    onMintNft(nftCollectionModel: NftCollectionModel, nftModels: NftModel[]) {
        if (nftCollectionModel !== null) {
            this.nftCollectionModels.pushIfNotExist(nftCollectionModel, (t1, t2) => {
                return t1.denomId === t2.denomId;
            })
        }

        if (nftModels !== null) {
            nftModels.forEach((nftModel) => {
                this.nftModels.pushIfNotExist(nftModel, (t1, t2) => {
                    return t1.tokenId === t2.tokenId;
                })
            });
        }

        this.updateNftsInCollectionsMap();
    }

    async fetchNfts() {
        await new Promise<void>((resolve, reject) => {
            this.nftApi.fetchNftCollections(this.walletStore.keplrWallet.accountAddress, (nftCollectionModels_: NftCollectionModel[], nftModels_: NftModel[]) => {
                this.nftCollectionModels = nftCollectionModels_.filter((nftCollectioModel) => {
                    return nftCollectioModel.isCudosMainCollection() === false;
                });
                this.nftModels = this.nftModels.concat(nftModels_);
                resolve();
            });
        });

        this.initializeNftsInCollectionsMap();
        this.filter();

        this.initialized = true;
    }

    initializeNftsInCollectionsMap() {
        this.nftsInCollectionsMap.clear();
        this.updateNftsInCollectionsMap();
    }

    updateNftsInCollectionsMap() {
        const cache = this.nftsInCollectionsMap;
        this.nftsInCollectionsMap = null;

        this.nftModels.forEach((nftModel) => {
            let pointer = cache.get(nftModel.denomId);
            if (pointer === undefined) {
                cache.set(nftModel.denomId, pointer = []);
            }
            pointer.push(nftModel);
        });

        this.nftCollectionModels.forEach((nftCollectionModel) => {
            if (cache.has(nftCollectionModel.denomId) === false) {
                cache.set(nftCollectionModel.denomId, []);
            }
        });

        this.nftsInCollectionsMap = cache;
    }

}

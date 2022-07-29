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
import WorkerQueueHelper from '../helpers/WorkerQueueHelper';
import StorageHelper from '../helpers/StorageHelper';
import NftHasuraApi from '../api/NftHasuraApi';

export default class MyNftsStore {

    static PAGE_SINGLE_NFTS: number = 1;
    static PAGE_NFT_COLLECTIONS: number = 2;

    nftApi: NftApi;
    nftHasuraApi: NftHasuraApi;
    appStore: AppStore;
    walletStore: WalletStore;

    nftCollectionModels: NftCollectionModel[];
    nftsInCollectionsMap: Map<string, NftModel[]>;

    viewPage: number;
    viewNftModel: NftModel;
    viewNftCollectionModel: NftCollectionModel;

    filterString: string;
    nftsCount: number;
    collectionsCount: number;

    filterredNftModels: NftModel[];
    filteredNftCollectionModels: NftCollectionModel[];

    initialized: boolean;
    timeoutHelper: TimeoutHelper;

    constructor(appStore: AppStore, walletStore: WalletStore) {
        this.nftApi = new NftApi();
        this.nftHasuraApi = new NftHasuraApi();
        this.appStore = appStore;
        this.walletStore = walletStore;

        this.nftsCount = S.NOT_EXISTS;
        this.collectionsCount = S.NOT_EXISTS;
        this.filterString = S.Strings.EMPTY;

        this.filterredNftModels = [];

        this.nftCollectionModels = []; // does not hold the cudos default collection
        this.nftsInCollectionsMap = new Map(); // holds denom ids to nfts map for all collections

        this.reset();

        this.initialized = false;
        this.timeoutHelper = new TimeoutHelper();

        makeAutoObservable(this);
    }

    reset() {
        this.viewPage = MyNftsStore.PAGE_SINGLE_NFTS;
        this.viewNftModel = null;
        this.viewNftCollectionModel = null;

        this.filterString = S.Strings.EMPTY;
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
        return this.getNftsInCudosMainCollection().length !== 0 || this.nftCollectionModels.length !== 0;
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

    getNftsInCudosMainCollection() {
        return this.getNftsInCollection(Config.CUDOS_NETWORK.NFT_DENOM_ID);
    }

    getPreviewUrl(denomId: string, workerQueueHelper: WorkerQueueHelper) {
        const nftModels = this.getNftsInCollection(denomId);
        if (nftModels.length > 0) {
            return nftModels[0].getPreviewUrl(workerQueueHelper);
        }

        return NftModel.UNKNOWN_PREVIEW_URL;
    }

    async getNftTxHash(nft: NftModel): Promise<string> {
        return this.nftHasuraApi.getTokenTxHash(nft);
    }

    async getNftCollectionTxHash(collection: NftCollectionModel): Promise<string> {
        return this.nftHasuraApi.getCollectionTxHash(collection.denomId);
    }

    filter = () => {
        this.filterredNftModels = FilterHelper.filter(this.getNftsInCudosMainCollection(), this.filterString) as NftModel[];
        this.filteredNftCollectionModels = FilterHelper.filter(this.nftCollectionModels, this.filterString) as NftCollectionModel[];
    }

    async fetchNftCounts() {
        this.nftsCount = await this.nftHasuraApi.getNftsTotalCountByDenomAndOwner(Config.CUDOS_NETWORK.NFT_DENOM_ID, this.walletStore.keplrWallet.accountAddress);
        this.collectionsCount = await this.nftHasuraApi.getColelctionsTotalCountByOwner(this.walletStore.keplrWallet.accountAddress);
    }

    async fetchNfts(from: number, to: number, callback: (totalCount: number) => void) {
        let denomId = Config.CUDOS_NETWORK.NFT_DENOM_ID;

        if (this.viewNftCollectionModel !== null) {
            denomId = this.viewNftCollectionModel.denomId;
        }

        const { nftModels, totalCount } = await this.nftHasuraApi.getNftModels(denomId, this.walletStore.keplrWallet.accountAddress, from, to, this.filterString);

        this.filterredNftModels = nftModels;

        callback(totalCount);
    }

    // async fetchNfts() {
    //     const storageHelper = StorageHelper.getSingletonInstance();
    //     const address = this.walletStore.keplrWallet.accountAddress;
    //     // fetch what is in storage first
    //     this.nftCollectionModels = storageHelper.getCollections().filter((nftCollectionModel: NftCollectionModel) => {
    //         return nftCollectionModel.isOwn(address);
    //     });
    //     let nftModels = storageHelper.getNfts().filter((nft: NftModel) => {
    //         return nft.recipient === address
    //     });

    //     this.invalidateNftsInCollectionsMap(nftModels);
    //     this.filter();

    //     this.initialized = true;

    //     // then fetch from chain
    //     setTimeout(async () => {
    //         await new Promise<void>((resolve, reject) => {
    //             this.nftApi.fetchNftCollections(this.walletStore.keplrWallet.accountAddress, (nftCollectionModels_: NftCollectionModel[], nftModels_: NftModel[]) => {
    //                 this.nftCollectionModels = nftCollectionModels_.filter((nftCollectionModel) => {
    //                     return nftCollectionModel.isCudosMainCollection() === false;
    //                 });
    //                 nftModels = nftModels_;
    //                 resolve();
    //             });
    //         });

    //         // save newly fetched data to storage
    //         storageHelper.saveCollections(this.nftCollectionModels);
    //         storageHelper.saveNfts(nftModels);

    //         this.invalidateNftsInCollectionsMap(nftModels);
    //         this.filter();
    //     });
    // }

    removeNftModel(nftModel: NftModel) {
        const nftModels = this.getNftsInCollection(nftModel.denomId);

        const cache = this.nftsInCollectionsMap;
        this.nftsInCollectionsMap = null;

        nftModels.removeElement(nftModel, (t1, t2) => {
            return t1.tokenId === t2.tokenId;
        });
        cache.set(nftModel.denomId, nftModels);

        this.nftsInCollectionsMap = cache;

        this.filter();
    }

    invalidateNftsInCollectionsMap(nftModels: NftModel[]) {
        this.nftsInCollectionsMap.clear();
        this.updateNftsInCollectionsMap(nftModels);
    }

    updateNftsInCollectionsMap(nftModels: NftModel[]) {
        const cache = this.nftsInCollectionsMap;
        this.nftsInCollectionsMap = null;

        if (cache.has(Config.CUDOS_NETWORK.NFT_DENOM_ID) === false) {
            cache.set(Config.CUDOS_NETWORK.NFT_DENOM_ID, []);
        }
        this.nftCollectionModels.forEach((nftCollectionModel) => {
            if (cache.has(nftCollectionModel.denomId) === false) {
                cache.set(nftCollectionModel.denomId, []);
            }
        });

        nftModels.forEach((nftModel) => {
            let pointer = cache.get(nftModel.denomId);
            if (pointer === undefined) {
                pointer = [];
            }
            pointer.push(nftModel);
            cache.set(nftModel.denomId, pointer);
        });

        this.nftsInCollectionsMap = cache;
    }

}

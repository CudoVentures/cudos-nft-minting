import { makeAutoObservable } from 'mobx';
import Config from '../../../../../../builds/dev-generated/Config';
import TimeoutHelper from '../helpers/TimeoutHelper';
import NftCollectionModel from '../models/NftCollectionModel';
import NftModel from '../models/NftModel';
import NftApi from '../api/NftApi';
import S from '../utilities/Main';
import WalletStore from './WalletStore';
import AppStore from './AppStore';
import WorkerQueueHelper from '../helpers/WorkerQueueHelper';
import NftHasuraApi from '../api/NftHasuraApi';
import TableHelper from '../helpers/TableHelper';

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
    tableHelper: TableHelper;

    constructor(appStore: AppStore, walletStore: WalletStore) {
        this.nftApi = new NftApi();
        this.nftHasuraApi = new NftHasuraApi();
        this.appStore = appStore;
        this.walletStore = walletStore;

        this.nftsCount = S.NOT_EXISTS;
        this.collectionsCount = S.NOT_EXISTS;
        this.filterString = S.Strings.EMPTY;

        this.filterredNftModels = [];
        this.filteredNftCollectionModels = [];

        this.nftCollectionModels = []; // does not hold the cudos default collection
        this.nftsInCollectionsMap = new Map(); // holds denom ids to nfts map for all collections

        this.reset();

        this.initialized = false;
        this.timeoutHelper = new TimeoutHelper();
        this.tableHelper = new TableHelper(S.NOT_EXISTS, [], () => { }, 5);

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
        return this.filteredNftCollectionModels.length !== 0;
    }

    shouldRenderCollection(): boolean {
        return this.hasViewNft() === false && this.hasViewCollection() === true;
    }

    shouldRenderSingleNfts(): boolean {
        return this.hasViewNft() === false && this.hasViewCollection() === false && this.isViewSingleNfts() === true;
    }

    shouldRenderNftCollections(): boolean {
        return this.hasViewNft() === false && this.hasViewCollection() === false && this.isViewNftCollections() === true;
    }

    markViewSingleNfts = () => {
        this.viewPage = MyNftsStore.PAGE_SINGLE_NFTS;
        this.viewNftModel = null;
        this.viewNftCollectionModel = null;

        this.timeoutHelper.signal(() => this.fetchViewingModels());
    }

    markViewNftCollections = () => {
        this.viewPage = MyNftsStore.PAGE_NFT_COLLECTIONS;
        this.viewNftModel = null;
        this.viewNftCollectionModel = null;

        this.timeoutHelper.signal(() => this.fetchViewingModels());
    }

    markNft(nftModel: NftModel) {
        this.viewNftModel = nftModel;
    }

    markNftCollection(nftCollectionModel: NftCollectionModel) {
        this.viewNftCollectionModel = nftCollectionModel;
    }

    getNftsInCollection(denomId: string): NftModel[] {
        return this.nftsInCollectionsMap.get(denomId) ?? [];
    }

    getPreviewUrl(denomId: string, workerQueueHelper: WorkerQueueHelper) {
        const nftModels = this.getNftsInCollection(denomId);
        if (nftModels.length > 0) {
            return nftModels[0].getPreviewUrl(workerQueueHelper);
        }

        return NftModel.UNKNOWN_PREVIEW_URL;
    }

    async fetchNftCounts() {
        this.nftsCount = await this.nftHasuraApi.getNftsTotalCountByDenomAndOwner(Config.CUDOS_NETWORK.NFT_DENOM_ID, this.walletStore.keplrWallet.accountAddress);
        this.collectionsCount = await this.nftHasuraApi.getColelctionsTotalCountByOwner(this.walletStore.keplrWallet.accountAddress);
    }

    fetchViewingModels() {
        if (this.shouldRenderSingleNfts()) {
            this.fetchNfts();
        }

        if (this.shouldRenderCollection()) {
            this.fetchNfts();
        }

        if (this.shouldRenderNftCollections()) {
            this.fetchCollections();
        }
    }

    async fetchCollections() {
        const tableState = this.tableHelper.tableState;

        const { nftCollectionModels, totalCount } = await this.nftHasuraApi.getCollections(this.walletStore.keplrWallet.accountAddress, tableState.from, tableState.to(), this.filterString);

        this.filteredNftCollectionModels = nftCollectionModels;

        tableState.total = totalCount;
    }

    async fetchNfts() {
        const tableState = this.tableHelper.tableState;

        let denomId = Config.CUDOS_NETWORK.NFT_DENOM_ID;

        if (this.viewNftCollectionModel !== null) {
            denomId = this.viewNftCollectionModel.denomId;
        }

        const { nftModels, totalCount } = await this.nftHasuraApi.getNftModels(denomId, this.walletStore.keplrWallet.accountAddress, tableState.from, tableState.to(), this.filterString);

        this.filterredNftModels = nftModels;

        tableState.total = totalCount;
    }

    onChangeFilterString = (value) => {
        this.filterString = value;

        this.timeoutHelper.signal(() => {
            this.fetchViewingModels();
        })
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

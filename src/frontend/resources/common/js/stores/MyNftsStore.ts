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

    viewPage: number;
    viewNftModel: NftModel;
    viewNftCollectionModel: NftCollectionModel;

    filterString: string;
    nftsCount: number;
    collectionsCount: number;

    filterredNftModels: NftModel[];
    filteredNftCollectionModels: NftCollectionModel[];

    // holding just 1 nft model per collection with only denom id and url
    nftModelsForUrls: NftModel[];

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

        this.nftModelsForUrls = [];
        this.filterredNftModels = [];
        this.filteredNftCollectionModels = [];

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

    getPreviewUrl(denomId: string, workerQueueHelper: WorkerQueueHelper) {
        const nftModel = this.nftModelsForUrls.find((nftModelForUrl: NftModel) => nftModelForUrl.denomId === denomId);

        if (nftModel !== undefined) {
            return nftModel.getPreviewUrl(workerQueueHelper);
        }

        return NftModel.UNKNOWN_PREVIEW_URL;
    }

    async fetchNftCounts() {
        this.nftsCount = await this.nftHasuraApi.getNftsTotalCountByDenomAndOwner(Config.CUDOS_NETWORK.NFT_DENOM_ID, this.walletStore.keplrWallet.accountAddress);
        this.collectionsCount = await this.nftHasuraApi.getColelctionsTotalCountByOwner(this.walletStore.keplrWallet.accountAddress);
    }

    async fetchViewingModels(callback: () => void) {
        if (this.shouldRenderSingleNfts()) {
            await this.fetchNfts();
        }

        if (this.shouldRenderCollection()) {
            await this.fetchNfts();
        }

        if (this.shouldRenderNftCollections()) {
            await this.fetchCollections();
        }

        callback();
    }

    async fetchCollections() {
        const tableState = this.tableHelper.tableState;

        const { nftCollectionModels, totalCount } = await this.nftHasuraApi.getCollections(this.walletStore.keplrWallet.accountAddress, tableState.from, tableState.to(), this.filterString);

        this.filteredNftCollectionModels = nftCollectionModels;

        tableState.total = totalCount;

        const denomIds = this.filteredNftCollectionModels.map((collectionModel: NftCollectionModel) => collectionModel.denomId);

        // just to get a picture for each collection
        this.nftModelsForUrls = await this.nftHasuraApi.getNftModelsForUrls(denomIds);
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
}

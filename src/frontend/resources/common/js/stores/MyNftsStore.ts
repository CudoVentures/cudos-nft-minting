import { makeAutoObservable, runInAction } from 'mobx';
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
import ImagePreviewHelper from '../helpers/ImagePreviewHelper';

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

    denomIdToUrlMap: Map < string, string >;

    timeoutHelper: TimeoutHelper;
    tableHelper: TableHelper;

    constructor(appStore: AppStore, walletStore: WalletStore) {
        this.nftApi = new NftApi();
        this.nftHasuraApi = new NftHasuraApi();
        this.appStore = appStore;
        this.walletStore = walletStore;

        this.reset();

        this.nftsCount = S.NOT_EXISTS;
        this.collectionsCount = S.NOT_EXISTS;

        this.denomIdToUrlMap = new Map();
        this.filterredNftModels = null;
        this.filteredNftCollectionModels = null;

        this.timeoutHelper = new TimeoutHelper();
        this.tableHelper = new TableHelper(S.NOT_EXISTS, [], () => { this.fetchViewingModels() }, 6);

        makeAutoObservable(this);
    }

    reset() {
        this.viewPage = MyNftsStore.PAGE_SINGLE_NFTS;
        this.viewNftModel = null;
        this.viewNftCollectionModel = null;

        this.filterString = S.Strings.EMPTY;
    }

    areCountsFetched(): boolean {
        return this.nftsCount !== S.NOT_EXISTS && this.collectionsCount !== S.NOT_EXISTS;
    }

    isDataFetched(): boolean {
        if (this.shouldRenderSingleNfts()) {
            return this.filterredNftModels !== null;
        }

        if (this.shouldRenderCollection()) {
            return this.filterredNftModels !== null;
        }

        if (this.shouldRenderNftCollections()) {
            return this.filteredNftCollectionModels !== null;
        }

        return false;
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
        return this.nftsCount > 0 || this.collectionsCount > 0;
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

    getCollectionPreviewUrl(nftCollectionModel: NftCollectionModel, workerQueueHelper: WorkerQueueHelper) {
        const url = this.denomIdToUrlMap.get(nftCollectionModel.denomId);
        if (url === undefined) {
            return nftCollectionModel.hasPreviewUrl() === true ? nftCollectionModel.previewUrl : ImagePreviewHelper.UNKNOWN_PREVIEW_URL;
        }

        return nftCollectionModel.getPreviewUrl(url, workerQueueHelper);
    }

    async fetchNftCounts() {
        const nftsCount = await this.nftHasuraApi.getNftsTotalCountByDenomAndOwner(Config.CUDOS_NETWORK.NFT_DENOM_ID, this.walletStore.keplrWallet.accountAddress);
        const collectionsCount = await this.nftHasuraApi.getColelctionsTotalCountByOwner(this.walletStore.keplrWallet.accountAddress);

        runInAction(() => {
            this.nftsCount = nftsCount;
            this.collectionsCount = collectionsCount;
        });
    }

    fetchViewingModels = async () => {
        if (this.shouldRenderSingleNfts()) {
            await this.fetchNfts();
        }

        if (this.shouldRenderCollection()) {
            await this.fetchNfts();
        }

        if (this.shouldRenderNftCollections()) {
            await this.fetchCollections();
        }
    }

    async fetchCollections() {
        const tableState = this.tableHelper.tableState;
        const { nftCollectionModels } = await this.nftHasuraApi.getCollections(this.walletStore.keplrWallet.accountAddress, tableState.from, tableState.to(), this.filterString);
        const denomIds = nftCollectionModels.map((collectionModel: NftCollectionModel) => collectionModel.denomId);
        const denomIdToUrlMap = await this.nftHasuraApi.getNftModelsForUrls(denomIds);

        runInAction(() => {
            this.filteredNftCollectionModels = nftCollectionModels;
            this.denomIdToUrlMap = denomIdToUrlMap;
        });
    }

    async fetchNfts() {
        const tableState = this.tableHelper.tableState;
        const denomId = this.viewNftCollectionModel !== null ? this.viewNftCollectionModel.denomId : Config.CUDOS_NETWORK.NFT_DENOM_ID;
        const { nftModels } = await this.nftHasuraApi.getNftModels(denomId, this.walletStore.keplrWallet.accountAddress, tableState.from, tableState.to(), this.filterString);
        runInAction(() => {
            this.filterredNftModels = nftModels;
        });
    }

    onChangeFilterString = (value) => {
        this.filterString = value;

        this.timeoutHelper.signal(this.fetchViewingModels);
    }
}

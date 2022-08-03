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
import TableHelper, { TableState } from '../helpers/TableHelper';
import ImagePreviewHelper from '../helpers/ImagePreviewHelper';

export default class MyNftsStore {

    static PAGE_SINGLE_NFTS: number = 1;
    static PAGE_NFT_COLLECTIONS: number = 2;

    nftApi: NftApi;
    nftHasuraApi: NftHasuraApi;
    appStore: AppStore;
    walletStore: WalletStore;

    fetchingNftModels: number;
    fetchingNftCollectionModels: number;

    viewPage: number;
    viewNftModel: NftModel;
    viewNftCollectionModel: NftCollectionModel;

    filterString: string;
    nftsCount: number;
    collectionsCount: number;

    denomIdToUrlMap: Map < string, string >;
    nftCollectionModels: NftCollectionModel[]
    denomIdToNftModelsMap: Map < string, NftModel[] >;
    denomIdToNftModelsCount: Map < string, number >;

    tableHelperSingleNfts: TableHelper;
    tableHelperNftCollections: TableHelper;
    tableHelperNftCollection: TableHelper;

    timeoutHelper: TimeoutHelper;

    constructor(appStore: AppStore, walletStore: WalletStore) {
        this.nftApi = new NftApi();
        this.nftHasuraApi = new NftHasuraApi();
        this.appStore = appStore;
        this.walletStore = walletStore;

        this.fetchingNftModels = 0;
        this.fetchingNftCollectionModels = 0;

        this.tableHelperSingleNfts = new TableHelper(S.NOT_EXISTS, [], this.fetchViewingModels, 1);
        this.tableHelperNftCollections = new TableHelper(S.NOT_EXISTS, [], this.fetchViewingModels, 1);
        this.tableHelperNftCollection = new TableHelper(S.NOT_EXISTS, [], this.fetchViewingModels, 1);

        this.reset();

        this.denomIdToUrlMap = new Map();

        this.timeoutHelper = new TimeoutHelper();

        makeAutoObservable(this);
    }

    reset() {
        this.viewPage = MyNftsStore.PAGE_SINGLE_NFTS;
        this.viewNftModel = null;
        this.viewNftCollectionModel = null;

        this.filterString = S.Strings.EMPTY;
        this.nftsCount = S.NOT_EXISTS;
        this.collectionsCount = S.NOT_EXISTS;

        this.resetData();
    }

    resetData() {
        this.nftCollectionModels = [];
        this.denomIdToNftModelsMap = new Map();
        this.denomIdToNftModelsCount = new Map();

        this.tableHelperSingleNfts.tableState.pageZero();
        this.tableHelperNftCollection.tableState.pageZero();
        this.tableHelperNftCollections.tableState.pageZero();
    }

    areCountsFetched(): boolean {
        return this.nftsCount !== S.NOT_EXISTS && this.collectionsCount !== S.NOT_EXISTS;
    }

    isFetchingNftModels(): boolean {
        return this.fetchingNftModels !== 0;
    }

    isFetchingNftCollectionModels(): boolean {
        return this.fetchingNftCollectionModels !== 0;
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

        this.tableHelperSingleNfts.tableState.pageZero();

        this.fetchViewingModels();
    }

    markViewNftCollections = () => {
        this.viewPage = MyNftsStore.PAGE_NFT_COLLECTIONS;
        this.viewNftModel = null;
        this.viewNftCollectionModel = null;

        this.tableHelperNftCollections.tableState.pageZero();

        this.fetchViewingModels();
    }

    markNft(nftModel: NftModel) {
        this.viewNftModel = nftModel;
    }

    markNftCollection(nftCollectionModel: NftCollectionModel) {
        this.viewNftCollectionModel = nftCollectionModel;

        this.tableHelperNftCollection.tableState.pageZero();

        this.fetchViewingModels();
    }

    onChangeFilterString = (value) => {
        this.filterString = value;
        this.timeoutHelper.signal(() => {
            this.resetData();
            this.fetchViewingModels();
        });
    }

    getCollectionPreviewUrl(nftCollectionModel: NftCollectionModel, workerQueueHelper: WorkerQueueHelper) {
        const url = this.denomIdToUrlMap.get(nftCollectionModel.denomId);
        if (url === undefined) {
            return nftCollectionModel.hasPreviewUrl() === true ? nftCollectionModel.previewUrl : ImagePreviewHelper.UNKNOWN_PREVIEW_URL;
        }

        return nftCollectionModel.getPreviewUrl(url, workerQueueHelper);
    }

    getNftModelsInDefaultCollection(): NftModel[] {
        return this.getNftModels(Config.CUDOS_NETWORK.NFT_DENOM_ID, this.tableHelperSingleNfts.tableState);
    }

    getNftModelsViewingCollection(): NftModel[] {
        return this.getNftModels(this.viewNftCollectionModel.denomId, this.tableHelperNftCollection.tableState);
    }

    private getNftModels(denomId: string, tableState: TableState): NftModel[] {
        const nftModels = this.denomIdToNftModelsMap.get(denomId) ?? [];
        const from = tableState.from;
        const to = tableState.to();

        return nftModels.slice(Math.min(nftModels.length, from), Math.min(nftModels.length, to)).filter((m) => m !== null);
    }

    getNftCollectionModels(): NftCollectionModel[] {
        const nftCollectionModels = this.nftCollectionModels ?? [];
        const tableState = this.tableHelperNftCollections.tableState;
        const from = tableState.from;
        const to = tableState.to();

        return nftCollectionModels.slice(Math.min(nftCollectionModels.length, from), Math.min(nftCollectionModels.length, to)).filter((m) => m !== null);
    }

    removeNftModel(nftModel: NftModel) {
        const nftModels = this.denomIdToNftModelsMap.get(nftModel.denomId);
        nftModels.removeElement(nftModel, (t1, t2) => {
            return t1.tokenId === t2.tokenId;
        });

        const cacheDataMap = this.denomIdToNftModelsMap;
        this.denomIdToNftModelsMap = null;
        cacheDataMap.set(nftModel.denomId, nftModels);
        this.denomIdToNftModelsMap = cacheDataMap;

        const count = this.denomIdToNftModelsCount.get(nftModel.denomId);
        if (count !== undefined) {
            const cacheCountsMap = this.denomIdToNftModelsCount;
            this.denomIdToNftModelsCount = null;
            cacheCountsMap.set(nftModel.denomId, count - 1);
            this.denomIdToNftModelsCount = cacheCountsMap;
        }
    }

    fetchViewingModels = async () => {
        if (this.shouldRenderSingleNfts() === true) {
            await this.fetchDataCounts();
            await this.fetchNftModels(Config.CUDOS_NETWORK.NFT_DENOM_ID, this.tableHelperSingleNfts.tableState, this.filterString);

            this.tableHelperSingleNfts.tableState.total = this.nftsCount;
        }

        if (this.shouldRenderNftCollections() === true) {
            await this.fetchDataCounts();
            await this.fetchNftCollectionModels(this.tableHelperNftCollections.tableState, this.filterString);

            this.tableHelperNftCollections.tableState.total = this.collectionsCount;
        }

        if (this.shouldRenderCollection() === true) {
            const denomId = this.viewNftCollectionModel.denomId

            await this.fetchDataCounts();
            await this.fetchNftModelsCount(denomId, S.Strings.EMPTY);
            await this.fetchNftModels(denomId, this.tableHelperNftCollection.tableState, S.Strings.EMPTY);

            this.tableHelperNftCollection.tableState.total = this.denomIdToNftModelsCount.get(denomId);
        }
    }

    async fetchDataCounts(): Promise < void > {
        const filterString = this.filterString;
        const nftsCount = await this.fetchNftModelsCount(Config.CUDOS_NETWORK.NFT_DENOM_ID, filterString);
        const collectionsCount = await this.fetchNftCollectionModelsCount(this.walletStore.keplrWallet.accountAddress, filterString);

        runInAction(() => {
            this.nftsCount = nftsCount;
            this.collectionsCount = collectionsCount;
        });
    }

    private async fetchNftModelsCount(denomId: string, filterString: string): Promise < number > {
        const count = await this.nftHasuraApi.getNftsTotalCountByDenomAndOwner(denomId, this.walletStore.keplrWallet.accountAddress, filterString);

        const cacheMap = this.denomIdToNftModelsCount;
        this.denomIdToNftModelsCount = null;

        cacheMap.set(denomId, count);

        this.denomIdToNftModelsCount = cacheMap;

        return count;
    }

    private async fetchNftCollectionModelsCount(walletAddress: string, filterString: string): Promise < number > {
        return this.nftHasuraApi.getCollectionsTotalCountByOwner(walletAddress, filterString);
    }

    private async fetchNftCollectionModels(tableState: TableState, filterString: string): Promise < void > {
        const from = tableState.from;
        const to = tableState.to();

        let fetch = true;
        if (to < this.nftCollectionModels.length) {
            for (let i = from; i < to; ++i) {
                fetch = fetch && this.nftCollectionModels[i] !== null;
            }
        }

        if (fetch === false) {
            return;
        }

        ++this.fetchingNftCollectionModels;
        const { nftCollectionModels } = await this.nftHasuraApi.getCollections(this.walletStore.keplrWallet.accountAddress, from, to, filterString);
        const denomIds = nftCollectionModels.map((collectionModel: NftCollectionModel) => collectionModel.denomId);
        const denomIdToUrlMap = await this.nftHasuraApi.getNftModelsForUrls(denomIds);

        runInAction(() => {
            while (this.nftCollectionModels.length < to) {
                this.nftCollectionModels.push(null);
            }

            for (let i = nftCollectionModels.length; i-- > 0;) {
                this.nftCollectionModels[from + i] = nftCollectionModels[i];
            }

            const cacheMap = this.denomIdToUrlMap;
            this.denomIdToUrlMap = null;
            denomIdToUrlMap.forEach((url, denomId) => {
                cacheMap.set(denomId, url);
            })
            this.denomIdToUrlMap = cacheMap;

            --this.fetchingNftCollectionModels;
        });
    }

    private async fetchNftModels(denomId: string, tableState: TableState, filterString: string) : Promise < void > {
        const from = tableState.from;
        const to = tableState.to();

        let fetch = true;
        let cacheNftModels = this.denomIdToNftModelsMap.get(denomId);
        if (to < (cacheNftModels ?? []).length) {
            for (let i = from; i < to; ++i) {
                fetch = fetch && cacheNftModels[i] !== null;
            }
        }

        if (fetch === false) {
            return;
        }

        ++this.fetchingNftModels;
        const { nftModels } = await this.nftHasuraApi.getNftModels(denomId, this.walletStore.keplrWallet.accountAddress, from, to, filterString);
        runInAction(() => {
            const cacheDataMap = this.denomIdToNftModelsMap;
            this.denomIdToNftModelsMap = null;

            cacheNftModels = cacheDataMap.get(denomId) ?? [];
            while (cacheNftModels.length < to) {
                cacheNftModels.push(null);
            }

            for (let i = nftModels.length; i-- > 0;) {
                cacheNftModels[from + i] = nftModels[i];
            }

            cacheDataMap.set(denomId, cacheNftModels);
            this.denomIdToNftModelsMap = cacheDataMap;

            --this.fetchingNftModels;
        });
    }
}

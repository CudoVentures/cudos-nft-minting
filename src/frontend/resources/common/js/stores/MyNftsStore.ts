import { makeAutoObservable } from 'mobx';
import Config from '../../../../../../builds/dev-generated/Config';
import FilterHelper from '../helpers/FilterHelper';
import TimeoutHelper from '../helpers/TimeoutHelper';
import NftCollectionModel from '../models/NftCollectionModel';
import NftModel from '../models/NftModel';
import S from '../utilities/Main';

const emptyStore = false;

export default class MyNftsStore {

    static PAGE_SINGLE_NFTS: number = 1;
    static PAGE_NFT_COLLECTIONS: number = 2;

    nftModels: NftModel[];
    nftCollectionModels: NftCollectionModel[];
    nftsInCollectionsMap: Map < string, NftModel[] >;

    viewPage: number;
    viewNftModel: NftModel;
    viewNftCollectionModel: NftCollectionModel;

    filterString: string;
    filterredNftModels: NftModel[];
    filteredNftCollectionModels: NftCollectionModel[];

    initialized: boolean;
    timeoutHelper: TimeoutHelper;

    constructor() {
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
        this.filterredNftModels = FilterHelper.filter(this.nftModels, this.filterString) as NftModel[];
        this.filteredNftCollectionModels = FilterHelper.filter(this.nftCollectionModels, this.filterString) as NftCollectionModel[];
    }

    async fetchNfts() {
        const singleNfts = emptyStore === true ? [] : [
            {
                'id': '1',
                'name': 'In Da Jungl',
                'uri': `${Config.URL.RESOURCES}/common/img/tmp/nft.png`,
                'data': '',
                'owner': '',
                'approvedAddresses': [],
            }, {
                'id': '2',
                'name': 'In Da Jungl #2',
                'uri': `${Config.URL.RESOURCES}/common/img/tmp/nft.png`,
                'data': '',
                'owner': '',
                'approvedAddresses': [],
            }, {
                'id': '3',
                'name': 'In Da Jungl #3',
                'uri': `${Config.URL.RESOURCES}/common/img/tmp/nft.png`,
                'data': '',
                'owner': '',
                'approvedAddresses': [],
            }, {
                'id': '4',
                'name': 'In Da Jungl #4',
                'uri': `${Config.URL.RESOURCES}/common/img/tmp/nft.png`,
                'data': '',
                'owner': '',
                'approvedAddresses': [],
            }, {
                'id': '5',
                'name': 'In Da Jungl #5',
                'uri': `${Config.URL.RESOURCES}/common/img/tmp/nft.png`,
                'data': '',
                'owner': '',
                'approvedAddresses': [],
            },
        ];

        const collections = emptyStore === true ? [] : [
            {
                'denomId': 'C1',
                'name': 'AI generated witches',
                'nfts': [
                    {
                        'id': '6',
                        'name': 'In Da Jungl #6',
                        'uri': `${Config.URL.RESOURCES}/common/img/tmp/nft.png`,
                        'data': '',
                        'owner': '',
                        'approvedAddresses': [],
                    }, {
                        'id': '7',
                        'name': 'In Da Jungl #7',
                        'uri': `${Config.URL.RESOURCES}/common/img/tmp/nft.png`,
                        'data': '',
                        'owner': '',
                        'approvedAddresses': [],
                    },
                ],
            },
        ]

        const cache = this.nftsInCollectionsMap
        this.nftsInCollectionsMap = null;
        cache.clear();

        this.nftModels = singleNfts.map((m) => NftModel.fromJSON(m));
        this.nftCollectionModels = collections.map((collection) => {
            const nftCollectionModel = NftCollectionModel.fromJson(collection);
            cache.set(nftCollectionModel.denomId, collection.nfts.map((m) => NftModel.fromJSON(m)));
            return nftCollectionModel;
        });

        this.nftsInCollectionsMap = cache;

        this.filter();

        this.initialized = true;
    }

}

// import NftCollectionModel from '../models/NftCollectionModel';
// import NftModel from '../models/NftModel';
import NftImageCacheModel from '../models/NftImageCacheModel';

const LOCAL_STORAGE_KEY = 'cudos_minting_ui_storage';
const VERSION = 3;

export default class StorageHelper {

    static singleton = null;

    constructor() {
        this.version = VERSION;
        // this.nftCollectionsModels = [];
        // this.nftModels = [];
        this.nftImageCacheModelsMap = {};
    }

    static getSingletonInstance() {
        if (StorageHelper.singleton === null) {
            StorageHelper.singleton = new StorageHelper();
            StorageHelper.singleton.open();
        }

        return StorageHelper.singleton;
    }

    cloneWeak() {
        return Object.assign(new StorageHelper(), this);
    }

    open() {
        const json = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (json !== null) {
            const storage = JSON.parse(json);
            if (storage.version === VERSION) {
                Object.assign(this, storage);
                // this.nftCollectionsModels = this.nftCollectionsModels.map((collectionJson) => NftCollectionModel.fromJson(collectionJson));
                // this.nftModels = this.nftModels.map((nftJson) => NftModel.fromJSON(nftJson));
                Object.keys(this.nftImageCacheModelsMap).forEach((url) => {
                    this.nftImageCacheModelsMap[url] = NftImageCacheModel.fromJson(this.nftImageCacheModelsMap[url]);
                })
            } else {
                this.save();
            }
        }
        return this;
    }

    // static open() {
    //     const result = new StorageHelper();
    //     const json = localStorage.getItem(LOCAL_STORAGE_KEY);
    //     if (json !== null) {
    //         const storage = JSON.parse(json);
    //         if (storage.version === VERSION) {
    //             Object.assign(result, storage);
    //             result.nftCollectionsModels = result.nftCollectionsModels.map((collectionJson) => NftCollectionModel.fromJson(collectionJson));
    //             result.nftModels = result.nftModels.map((nftJson) => NftModel.fromJSON(nftJson));
    //             Object.keys(result.nftImageCacheModelsMap).forEach((url) => {
    //                 result.nftImageCacheModelsMap[url] = NftImageCacheModel.fromJson(result.nftImageCacheModelsMap[url]);
    //             })
    //         } else {
    //             result.save();
    //         }
    //     }
    //     return result;
    // }

    save() {
        const json = this.cloneWeak();
        // json.nftCollectionsModels = json.nftCollectionsModels.map((collectionModel) => collectionModel.toJson());
        // json.nftModels = json.nftModels.map((nftModel) => nftModel.toJSON());
        json.nftImageCacheModelsMap = {};
        Object.keys(this.nftImageCacheModelsMap).forEach((url) => {
            json.nftImageCacheModelsMap[url] = this.nftImageCacheModelsMap[url].toJson();
        })
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json));
    }

    // getCollections() {
    //     return this.nftCollectionsModels;
    // }

    // saveCollections(collectionModels) {
    //     this.nftCollectionsModels = collectionModels;
    //     this.save();
    // }

    // getNfts() {
    //     return this.nftModels
    // }

    // saveNfts(nftModels) {
    //     this.nftModels = nftModels;
    //     this.save();
    // }

    getNftImageCache(url) {
        return this.nftImageCacheModelsMap[btoa(url)] ?? null;
    }

    addNftImageCache(url, mimeType, previewUrl) {
        this.nftImageCacheModelsMap[btoa(url)] = NftImageCacheModel.instance(mimeType, previewUrl);
        this.save();
    }

}

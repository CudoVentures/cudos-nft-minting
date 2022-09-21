import NftImageCacheModel from '../models/NftImageCacheModel';

const LOCAL_STORAGE_KEY = 'cudos_minting_ui_storage';
const VERSION = 3;

export default class StorageHelper {

    static singleton = null;

    constructor() {
        this.version = VERSION;
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
                Object.keys(this.nftImageCacheModelsMap).forEach((url) => {
                    this.nftImageCacheModelsMap[url] = NftImageCacheModel.fromJson(this.nftImageCacheModelsMap[url]);
                })
            } else {
                this.save();
            }
        }
        return this;
    }

    save() {
        const json = this.cloneWeak();
        json.nftImageCacheModelsMap = {};
        Object.keys(this.nftImageCacheModelsMap).forEach((url) => {
            json.nftImageCacheModelsMap[url] = this.nftImageCacheModelsMap[url].toJson();
        })
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json));
    }

    getNftImageCache(url) {
        return this.nftImageCacheModelsMap[btoa(url)] ?? null;
    }

    addNftImageCache(url, mimeType, previewUrl) {
        this.nftImageCacheModelsMap[btoa(url)] = NftImageCacheModel.instance(mimeType, previewUrl);
        this.save();
    }

}

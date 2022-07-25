import NftCollectionModel from '../models/NftCollectionModel';
import NftModel from '../models/NftModel';

const LOCAL_STORAGE_KEY = 'cudos_minting_ui_storage';
const VERSION = 1;

class StorageHelper {

    constructor() {
        this.version = VERSION;
    }

    static open() {
        const result = new StorageHelper();
        const json = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (json !== null) {
            const storage = JSON.parse(json);
            if (storage.version === VERSION) {
                Object.assign(result, storage);
            } else {
                result.save();
            }
        }
        return result;
    }

    save() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this));
    }

    getCollections() {
        const storagecollections = this['nftCollections'] ?? [];
        return storagecollections.map((collectionJson) => NftCollectionModel.fromJson(collectionJson));
    }

    saveCollections(collectionModels) {
        this['nftCollections'] = collectionModels.map((collectionModel) => collectionModel.toJson());
        this.save();
    }

    getNfts() {
        const storageNfts = this['nftModels'] ?? [];

        return storageNfts.map((nftJson) => NftModel.fromJSON(nftJson));
    }

    saveNfts(nftModels) {
        this['nftModels'] = nftModels.map((nftModel) => nftModel.toJSON());
        this.save();
    }

    getImages() {
        return this.images ?? {};
    }

    saveImages(images) {
        this.images = images;
        this.save();
    }

}

const storageHelper = StorageHelper.open();
export default storageHelper;

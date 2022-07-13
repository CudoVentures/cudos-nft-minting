import NftModel from '../models/NftModel';

export default class UploadImagesRes {

    urls: string[];

    constructor(json) {
        this.urls = json.urls;
    }
}

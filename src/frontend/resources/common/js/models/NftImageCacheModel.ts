import S from '../utilities/Main';
import NftModel from './NftModel';

export default class NftImageCacheModel {

    mimeType: string;
    previewUrl: string

    constructor() {
        this.mimeType = S.Strings.EMPTY;
        this.previewUrl = NftModel.UNKNOWN_PREVIEW_URL;
    }

    static instance(mimeType: string, previewUrl: string) {
        const model = new NftImageCacheModel();

        model.mimeType = mimeType;
        model.previewUrl = previewUrl;

        return model;
    }

    toJson(): any {
        return {
            'mimeType': this.mimeType,
            'previewUrl': this.previewUrl,
        }
    }

    static fromJson(json): NftImageCacheModel {
        if (json === null) {
            return null;
        }

        const model = new NftImageCacheModel();

        model.mimeType = json.mimeType ?? model.mimeType;
        model.previewUrl = json.previewUrl ?? model.previewUrl;

        return model;
    }

}

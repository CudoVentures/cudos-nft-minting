import NftModel from '../models/NftModel';

export default class MintNftReq {

    nftModels: NftModel[];
    recaptchaToken: string;

    constructor(nftModels_: NftModel[], recaptchaToken: string) {
        this.nftModels = nftModels_.map((nftModel: NftModel) => nftModel.toJSON());
        this.recaptchaToken = recaptchaToken;
    }
}

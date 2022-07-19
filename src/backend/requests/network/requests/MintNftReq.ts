import NftModel from '../../../modules/cudos-network/model/nft/NftModel';

export default class MintNftRes {

    nftModels: NftModel[];
    recaptchaToken: string;

    constructor(json) {
        this.nftModels = json.nftModels.map((modelJson: any) => NftModel.fromNetwork(modelJson));
        this.recaptchaToken = json.recaptchaToken;
    }

}

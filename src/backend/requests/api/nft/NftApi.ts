import NftApiH from './NftApi.h';
import Context from '../../../utilities/network/Context';
import NftController from '../../../controllers/NftController';

export default class NftApi extends NftApiH {

    nftController: NftController;

    constructor() {
        super();
        this.nftController = new NftController();
    }

    async processRequest(context: Context) {
        switch (context.payload.action) {
            case NftApiH.Actions.MINT:
                await this.nftController.mintNft(context);
                break;
            case NftApiH.Actions.IMAGES_UPLOAD:
                await this.nftController.imagesUpload(context);
                break;
            case NftApiH.Actions.ESTIMATE_FEE_MINT_NFT:
                await this.nftController.estimateFeeMintNft(context);
                break;
            default:
                break;
        }
    }
}

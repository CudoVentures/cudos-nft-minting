
import MintNftReq from '../requests/network/requests/MintNftReq';
import NftImageUploadReq from '../requests/network/requests/NftImageUploadReq';
import MintNftRes from '../requests/network/responses/MintNftRes';
import NftImageUploadRes from '../requests/network/responses/NftImageUploadRes';
import Context from '../utilities/network/Context';

export default class NftController {

    async mintNft(context: Context) {
        const servicesFactory = context.servicesFactory;
        const payload = context.payload;

        const req = new MintNftReq(payload.params.nftModel);

        const nftService = servicesFactory.getNftService();
        const productModel = await nftService.mintNft(req.nftModel);

        context.res.set(new MintNftRes(productModel));
    }

    async imageUpload(context: Context) {
        const servicesFactory = context.servicesFactory;
        const payload = context.payload;

        const req = new NftImageUploadReq(payload.params.nftImageModel);

        const nftService = servicesFactory.getNftService();
        const productModel = await nftService.imageUpload(req.nftImageModel);

        context.res.set(new NftImageUploadRes(productModel));
    }

}

import MintNftReq from '../requests/network/requests/MintNftReq';
import MintNftRes from '../requests/network/responses/MintNftRes';
import Context from '../utilities/network/Context';

export default class NftController {

    async mintNft(context: Context) {
        const servicesFactory = context.servicesFactory;
        const payload = context.payload;

        const req = new MintNftReq(payload.params.nftModels);

        const nftService = servicesFactory.getNftService();
        const { nftModels, txHash } = await nftService.mintNft(req.nftModels);

        context.res.set(new MintNftRes(nftModels, txHash));
    }

}

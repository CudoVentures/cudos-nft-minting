import EstimateFeeMintNftReq from '../requests/network/requests/EstimateFeeMintNftReq';
import MintNftReq from '../requests/network/requests/MintNftReq';
import UploadImagesReq from '../requests/network/requests/UploadImagesReq';
import EstimateFeeMintNftRes from '../requests/network/responses/EstimateFeeMintNftRes';
import MintNftRes from '../requests/network/responses/MintNftRes';
import UploadImagesRes from '../requests/network/responses/UploadImagesRes';
import Context from '../utilities/network/Context';
import axios from 'axios';
import Config from '../../../config/config';
import StateException from '../utilities/network/StateException';
import Response from '../utilities/network/Response';

export default class NftController {

    async mintNft(context: Context) {
        const servicesFactory = context.servicesFactory;
        const payload = context.payload;

        const req = new MintNftReq(payload.params);

        let captchaPassed = false;

        try {
            const res = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${Config.Server.CAPTCHA_SECRET_KEY}&response=${req.recaptchaToken}`);
            if (res.data.success === true) {
                captchaPassed = true;
            }
        } catch (e) {
            console.log(e);
        }

        if (!captchaPassed) {
            throw new StateException(Response.S_STATUS_RUNTIME_ERROR, 'Captcha failed.');
        }

        const nftService = servicesFactory.getNftService();
        const { nftModels, txHash } = await nftService.mintNft(req.nftModels);

        context.res.set(new MintNftRes(nftModels, txHash));
    }

    async estimateFeeMintNft(context: Context) {
        const servicesFactory = context.servicesFactory;
        const payload = context.payload;

        const req = new EstimateFeeMintNftReq(payload.params);

        const nftService = servicesFactory.getNftService();
        const fee = await nftService.estimateFeeMintNft(req.nftModels);

        context.res.set(new EstimateFeeMintNftRes(fee));
    }

    async imagesUpload(context: Context) {
        const servicesFactory = context.servicesFactory;
        const payload = context.payload;

        const req = new UploadImagesReq(payload.params);

        const nftService = servicesFactory.getNftService();

        const urls = req.files;
        for (let i = 0; i < urls.length; i++) {
            if (urls[i].includes(';base64,')) {
                urls[i] = await nftService.imageUpload(urls[i]);
            }
        }
        context.res.set(new UploadImagesRes(urls));
    }
}

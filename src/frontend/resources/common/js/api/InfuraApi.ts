import Actions from '../../../../../../builds/dev-generated/Actions';
import Api from '../utilities/Api';
import AbsApi from './AbsApi';
import NftImageModel from '../models/NftImageModel';
import NftImageUploadReq from '../network-requests/NftImageUploadReq';
import NftImageUploadRes from '../network-responses/NftImageUploadRes';
import Apis from '../../../../../../builds/dev-generated/Apis';

export default class NftApi extends AbsApi {
    api: Api
    constructor() {
        super();
        this.api = new Api(Apis.NFT, this.enableActions, this.disableActions);
    }

    async uploadImage(nftImageModelToUpload: NftImageModel, callback: (nftImageModelResult: NftImageModel) => void) {
        const req = new NftImageUploadReq(nftImageModelToUpload);

        this.api.req(Actions.NFT.IMAGE_UPLOAD, req, (json: any) => {
            const res = new NftImageUploadRes(json.obj.nftImageModel);
            callback(res.nftImageModel);
        });
    }
}

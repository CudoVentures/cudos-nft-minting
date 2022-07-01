import Actions from '../../../../../../builds/dev-generated/Actions';
import Api from '../utilities/Api';
import AbsApi from './AbsApi';
import NftImageModel from '../models/NftImageModel';
import NftImageUploadRes from '../network-responses/NftImageUploadRes';
import Apis from '../../../../../../builds/dev-generated/Apis';

export default class NftApi extends AbsApi {
    api: Api
    constructor() {
        super();
        this.api = new Api(Apis.NFT, this.enableActions, this.disableActions);
    }

}

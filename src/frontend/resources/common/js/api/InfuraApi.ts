import Api from '../utilities/Api';
import AbsApi from './AbsApi';
import Apis from '../../../../../../builds/dev-generated/Apis';

export default class NftApi extends AbsApi {
    api: Api
    constructor() {
        super();
        this.api = new Api(Apis.NFT, this.enableActions, this.disableActions);
    }

}

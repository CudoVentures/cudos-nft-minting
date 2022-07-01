import Actions from '../../../../../builds/dev-generated/Actions';
import Apis from '../../../../../builds/dev-generated/Apis';
import Params from '../../../../../builds/dev-generated/Params';

export default class CGeneralContext {

    static urlShipmentDocumentUploadData() {
        return `${Apis.NFT}?${Params.ACTION}=${Actions.NFT.IMAGE_UPLOAD}`;
    }
}

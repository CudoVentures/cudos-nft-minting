import Actions from '../../../../../../builds/dev-generated/Actions';
import Apis from '../../../../../../builds/dev-generated/Apis';
import Params from '../../../../../../builds/dev-generated/Params';
import Response from '../../../../../../builds/dev-generated/utilities/network/ResponseConsts';
import DownloadReq from '../network-requests/DownloadReq';
import Ajax from '../utilities/Ajax';
import AbsApi from './AbsApi';

export default class GeneralApi extends AbsApi {

    async download(url: string): Promise < Ajax > {
        try {
            return await new Promise < Ajax >((resolve, reject) => {
                const req = new DownloadReq(url)

                const ajax = new Ajax();

                ajax.addParam(Params.ACTION, Actions.GENERAL.DOWNLOAD);
                ajax.addParam(Params.PAYLOAD, JSON.stringify(req));

                ajax.open(Ajax.POST, Apis.GENERAL, true);
                ajax.setResponseType('arraybuffer');
                ajax.onResponse = (arrayBuffer: ArrayBuffer) => {
                    if (arrayBuffer.byteLength < 64) { // it might be a json
                        const decodedResponse = new TextDecoder().decode(arrayBuffer);
                        try {
                            const jsonResponse = JSON.parse(decodedResponse);
                            reject(new Error(jsonResponse.status.toString()));
                        } catch (e) {
                            reject(new Error(Response.S_STATUS_ERROR.toString()));
                        }
                    }
                    resolve(ajax);
                }
                ajax.onError = (status) => {
                    reject(new Error(Response.S_STATUS_ERROR.toString()));
                }
                ajax.send();
            });
        } catch (e) {
            switch (e.message) {
                case Response.S_STATUS_WRONG_URL.toString():
                    this.showAlert('The URL must starts with http/https');
                    break;
                default:
                    this.showAlert('There was a problem download the file. Please, download it manually and upload it.');
            }
            throw e;
        }
    }

}

import https from 'https';
import http from 'http';
import DownloadReq from '../requests/network/requests/DownloadReq';
import Context from '../utilities/network/Context';
import StateException from '../utilities/network/StateException';
import Response from '../utilities/network/Response';

export default class GeneralController {

    download(context: Context) {
        return new Promise < void >((resolve, reject) => {
            const payload = context.payload;
            const req = new DownloadReq(payload.params);

            let handler;
            if (req.url.startsWith('https') === true) {
                handler = https.request;
            } else if (req.url.startsWith('http') === true) {
                handler = http.request;
            } else {
                reject(new StateException(Response.S_STATUS_WRONG_URL, 'The url must start with http/https'));
            }

            const r = handler(req.url, (res) => {
                Object.keys(res.headers).forEach((header) => {
                    payload.ctx.set(header, res.headers[header]);
                })
                context.res = res;
                resolve();
            });
            r.on('error', reject);
            r.end();
        });

    }

}

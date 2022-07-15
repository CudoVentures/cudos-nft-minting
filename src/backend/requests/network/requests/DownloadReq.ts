export default class DownloadReq {

    url: string;

    constructor(json) {
        this.url = json.url;
    }

}

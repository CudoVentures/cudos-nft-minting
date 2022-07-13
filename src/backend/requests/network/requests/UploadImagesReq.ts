export default class UploadImagesReq {

    files: string[];

    constructor(json) {
        this.files = json.files;
    }
}

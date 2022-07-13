export default class UploadImagesReq {

    files: string[];

    constructor(files: string[]) {
        this.files = files;
    }
}

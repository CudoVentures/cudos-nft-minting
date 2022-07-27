import { makeAutoObservable, runInAction } from 'mobx';
import Config from '../../../../../../builds/dev-generated/Config';
import WorkerQueueHelper, { Runnable } from '../helpers/WorkerQueueHelper';
import S from '../utilities/Main';
import Filterable from './Filterable';
import StorageHelper from '../helpers/StorageHelper';

export default class NftModel implements Filterable {

    static UNKNOWN_PREVIEW_URL = `${Config.URL.RESOURCES}/common/img/file-preview/unknown.svg`;

    denomId: string;
    tokenId: string;
    name: string;
    url: string;
    data: string;
    recipient: string;
    approvedAddresses: string[];

    fileName: string;
    type: string;
    sizeBytes: number;
    previewUrl: string;

    constructor() {
        this.denomId = S.Strings.EMPTY;
        this.tokenId = S.Strings.EMPTY;
        this.name = S.Strings.EMPTY;
        this.url = S.Strings.EMPTY;
        this.data = S.Strings.EMPTY;
        this.recipient = S.Strings.EMPTY;
        this.approvedAddresses = [];

        this.fileName = S.Strings.EMPTY;
        this.type = S.Strings.EMPTY;
        this.sizeBytes = S.NOT_EXISTS;
        this.previewUrl = NftModel.UNKNOWN_PREVIEW_URL;

        makeAutoObservable(this, {
            'type': false,
        });
    }

    static getImageSizeString(nftModel: NftModel): string {
        const size = nftModel.sizeBytes;

        const kilo = 2 << 10;
        const mega = 2 << 20;

        if (size < kilo) {
            return `${size} B`;
        }

        if (Math.floor(size / kilo) < kilo) {
            return `${(size / kilo).toFixed(2)} KB`
        }

        if (Math.floor(size / mega) < kilo) {
            return `${(size / mega).toFixed(2)} MB`
        }

        return 'File too big.'

    }

    isMimeTypeKnown(): boolean {
        return this.type !== S.Strings.EMPTY;
    }

    isValidForSubmit(): boolean {
        if (this.url === S.Strings.EMPTY) {
            return false;
        }

        if (this.recipient === S.Strings.EMPTY) {
            return false;
        }

        if (this.name === S.Strings.EMPTY) {
            return false;
        }

        return true;
    }

    setRecipient(recipient: string) {
        this.recipient = recipient;
    }

    getFilterableString(): string {
        return this.name;
    }

    getIdsUniquePair() {
        return `${this.denomId}-${this.tokenId}`;
    }

    getPreviewUrl(workerQueueHelper: WorkerQueueHelper): string {
        // if in local storage - get it from there
        const storageHelper = StorageHelper.getSingletonInstance();
        const nftImageCacheModel = storageHelper.getNftImageCache(this.url);

        if (nftImageCacheModel !== null) {
            runInAction(() => {
                this.type = nftImageCacheModel.mimeType;
                this.previewUrl = nftImageCacheModel.previewUrl;
            })
        } else if (this.previewUrl === NftModel.UNKNOWN_PREVIEW_URL && this.isMimeTypeKnown() === false) {
            workerQueueHelper.pushAndExecute(new Runnable(async () => {
                const res = await fetch(this.url);
                return res.headers.get('content-type');
            }, (type: string | null) => {
                // save to local storage
                this.type = type ?? 'null';
                this.updatePreviewUrlByType();

                storageHelper.addNftImageCache(this.url, this.type, this.previewUrl);
            }));
        }

        this.type = 'null';

        return this.previewUrl;
    }

    updatePreviewUrlByType() {
        if (this.type.indexOf('svg') !== -1) {
            this.previewUrl = `${Config.URL.RESOURCES}/common/img/file-preview/svg.svg`
        } else if (this.type.indexOf('mpeg') !== -1 || this.type.indexOf('mp3') !== -1 || this.type.indexOf('wav') !== -1 || this.type.indexOf('ogg') !== -1) {
            this.previewUrl = `${Config.URL.RESOURCES}/common/img/file-preview/music.svg`
        } else if (this.type.indexOf('mp4') !== -1 || this.type.indexOf('webm') !== -1 || this.type.indexOf('webp') !== -1) {
            this.previewUrl = `${Config.URL.RESOURCES}/common/img/file-preview/video.svg`
        } else if (this.type.indexOf('application') !== -1 || this.type.indexOf('gltf') !== -1 || this.type.indexOf('glb') !== -1) {
            this.previewUrl = `${Config.URL.RESOURCES}/common/img/file-preview/gl.svg`
        } else if (this.type.indexOf('jpeg') !== -1 || this.type.indexOf('jpg') !== -1 || this.type.indexOf('png') !== -1 || this.type.indexOf('gif') !== -1) {
            this.previewUrl = this.url
        } else {
            this.previewUrl = NftModel.UNKNOWN_PREVIEW_URL;
        }
    }

    clone(): NftModel {
        return Object.assign(new NftModel(), this);
    }

    toJSON(): any {
        return {
            'denomId': this.denomId,
            'tokenId': this.tokenId,
            'name': this.name,
            'url': this.url,
            'data': this.data,
            'recipient': this.recipient,
            'approvedAddresses': this.approvedAddresses,
        }
    }

    static fromJSON(json): NftModel {
        if (json === null) {
            return null;
        }

        const model = new NftModel();

        model.denomId = json.denomId ?? model.denomId;
        model.tokenId = json.id ?? json.tokenId ?? model.tokenId;
        model.name = json.name ?? model.name;
        model.url = json.url ?? model.url;
        model.data = json.data ?? model.data;
        model.recipient = json.recipient ?? model.recipient;
        model.approvedAddresses = json.approvedAddresses ?? model.approvedAddresses;

        return model;
    }

    static fromChain(json): NftModel {
        if (json === null) {
            return null;
        }

        const model = new NftModel();

        model.tokenId = json.id ?? model.tokenId;
        model.name = json.name ?? model.name;
        model.url = json.uri ?? model.url;
        model.data = json.data ?? model.data;
        model.recipient = json.owner ?? model.recipient;
        model.approvedAddresses = json.approvedAddresses ?? model.approvedAddresses;

        return model;
    }

}

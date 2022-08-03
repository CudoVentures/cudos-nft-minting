import { makeAutoObservable } from 'mobx';
import Config from '../../../../../../builds/dev-generated/Config';
import WorkerQueueHelper from '../helpers/WorkerQueueHelper';
import S from '../utilities/Main';
import Filterable from './Filterable';
import ImagePreviewHelper from '../helpers/ImagePreviewHelper';

export default class NftCollectionModel implements Filterable {

    denomId: string;
    name: string;
    creator: string;
    txHash: string;

    previewUrl: string;

    constructor() {
        this.denomId = S.Strings.EMPTY;
        this.name = S.Strings.EMPTY;
        this.txHash = S.Strings.EMPTY;

        this.previewUrl = S.Strings.EMPTY;

        makeAutoObservable(this);
    }

    static instanceCudosMainCollection() {
        const model = new NftCollectionModel();

        model.denomId = Config.CUDOS_NETWORK.NFT_DENOM_ID;
        model.name = 'Cudos one collection';
        model.creator = S.Strings.EMPTY;

        return model;
    }

    getFilterableString(): string {
        return this.name;
    }

    isCudosMainCollection(): boolean {
        return this.denomId === Config.CUDOS_NETWORK.NFT_DENOM_ID;
    }

    isOwn(walletAddress: string): boolean {
        return this.creator === walletAddress;
    }

    hasPreviewUrl(): boolean {
        return this.previewUrl !== S.Strings.EMPTY;
    }

    getPreviewUrl(url: string, workerQueueHelper: WorkerQueueHelper): string {
        if (this.hasPreviewUrl() === true) {
            return this.previewUrl;
        }

        const imagePreviewHelper = ImagePreviewHelper.getSingletonInstance(workerQueueHelper)
        imagePreviewHelper.fetch(url, (mimeType, previewUrl) => {
            this.previewUrl = previewUrl;
        });

        return ImagePreviewHelper.UNKNOWN_PREVIEW_URL;
    }

    toJson(): any {
        return {
            'denomId': this.denomId,
            'name': this.name,
            'creator': this.creator,
        }
    }

    static fromJson(json: any): NftCollectionModel {
        if (json === null) {
            return null;
        }

        const model = new NftCollectionModel();

        model.denomId = json.denomId ?? model.denomId;
        model.name = json.name ?? model.name;
        model.creator = json.creator ?? model.creator;

        return model;
    }

    static fromChain(json: any): NftCollectionModel {
        if (json === null) {
            return null;
        }

        const model = new NftCollectionModel();

        model.denomId = json.id ?? model.denomId;
        model.name = json.name ?? model.name;
        model.creator = json.creator ?? model.creator;

        return model;
    }

    static fromHasura(json: any): NftCollectionModel {
        if (json === null) {
            return null;
        }

        const model = new NftCollectionModel();

        model.denomId = json.id ?? model.denomId;
        model.name = json.name ?? model.name;
        model.creator = json.owner ?? model.creator;
        model.txHash = json.transaction_hash ?? model.txHash;

        return model;
    }

    validate(): boolean {
        return this.denomId !== S.Strings.EMPTY && this.name !== S.Strings.EMPTY;
    }
}

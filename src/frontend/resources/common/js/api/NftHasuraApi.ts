import Apis from '../../../../../../builds/dev-generated/Apis';
import Config from '../../../../../../builds/dev-generated/Config';
import NftCollectionModel from '../models/NftCollectionModel';
import NftModel from '../models/NftModel';
import DenomCountByOwnerReq from '../network-requests/NftHasura/DenomCountByOwnerReq';
import DenomTransactionHashReq from '../network-requests/NftHasura/DenomTransactionHashReq';
import NftCollectionModelsPaginatedReq from '../network-requests/NftHasura/NftCollectionModelsPaginatedReq';
import NftCountByDenomAndOwnerReq from '../network-requests/NftHasura/NftCountByDenomAndOwnerReq';
import NftModelsPaginatedReq from '../network-requests/NftHasura/NftModelsPaginatedReq';
import NftTransactionHashReq from '../network-requests/NftHasura/NftTransactionHashReq';
import DenomCountByOwnerRes from '../network-responses/NftHasura/DenomCountByOwnerRes';
import DenomTransactionHashRes from '../network-responses/NftHasura/DenomTransactionHashRes';
import NftCollectionModelsPaginatedRes from '../network-responses/NftHasura/NftCollectionModelsPaginatedRes';
import NftCountByDenomAndOwnerRes from '../network-responses/NftHasura/NftCountByDenomAndOwnerRes';
import NftModelsPaginatedRes from '../network-responses/NftHasura/NftModelsPaginatedRes';
import NftTransactionHashRes from '../network-responses/NftHasura/NftTransactionHashRes';
import Api from '../utilities/Api';
import AbsApi from './AbsApi';

export default class NftApi extends AbsApi {
    api: Api

    defaultDenomId: string

    constructor() {
        super();

        this.api = new Api(Apis.NFT, this.enableActions, this.disableActions);

        this.defaultDenomId = Config.CUDOS_NETWORK.NFT_DENOM_ID;
    }

    async getTokenTxHash(nftModel: NftModel): Promise<string> {
        const req = new NftTransactionHashReq(nftModel.denomId, nftModel.tokenId);

        const resJson = await (await fetch(Config.CUDOS_NETWORK.GRAPHQL, req.buildRequest())).json();

        const res = new NftTransactionHashRes(resJson);

        return res.txHash;
    }

    async getCollectionTxHash(denomId: string): Promise<string> {
        const req = new DenomTransactionHashReq(denomId);

        const resJson = await (await fetch(Config.CUDOS_NETWORK.GRAPHQL, req.buildRequest())).json();

        const res = new DenomTransactionHashRes(resJson);

        return res.txHash;
    }

    async getNftsTotalCountByDenomAndOwner(denomId: string, owner: string) {
        const req = new NftCountByDenomAndOwnerReq(denomId, owner);

        const resJson = await (await fetch(Config.CUDOS_NETWORK.GRAPHQL, req.buildRequest())).json();

        const res = new NftCountByDenomAndOwnerRes(resJson);

        return res.nftCount;
    }

    async getColelctionsTotalCountByOwner(owner: string) {
        const req = new DenomCountByOwnerReq(owner);

        const resJson = await (await fetch(Config.CUDOS_NETWORK.GRAPHQL, req.buildRequest())).json();

        const res = new DenomCountByOwnerRes(resJson);

        return res.collectionCount;
    }

    async getNftModels(denomId: string, owner: string, from: number, to: number, filter: string): Promise<{nftModels: NftModel[], totalCount: number}> {

        const req = new NftModelsPaginatedReq(denomId, owner, from, to, filter);

        const resJson = await (await fetch(Config.CUDOS_NETWORK.GRAPHQL, req.buildRequest())).json();

        const res = new NftModelsPaginatedRes(resJson);

        return { nftModels: res.nftModels, totalCount: res.totalCount };
    }

    async getCollections(owner: string, from: number, to: number, filter: string): Promise<{nftCollectionModels: NftCollectionModel[], totalCount: number}> {
        const req = new NftCollectionModelsPaginatedReq(owner, from, to, filter);
        const resJson = await (await fetch(Config.CUDOS_NETWORK.GRAPHQL, req.buildRequest())).json();

        const res = new NftCollectionModelsPaginatedRes(resJson);

        return { nftCollectionModels: res.nftCollectionModels, totalCount: res.totalCount };
    }
}

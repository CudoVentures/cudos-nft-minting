import Apis from '../../../../../../builds/dev-generated/Apis';
import Config from '../../../../../../builds/dev-generated/Config';
import NftCollectionModel from '../models/NftCollectionModel';
import NftModel from '../models/NftModel';
import DenomCountByOwnerReq from '../network-requests/NftHasura/DenomCountByOwnerReq';
import DenomTransactionHashReq from '../network-requests/NftHasura/DenomTransactionHashReq';
import NftCollectionIdsByNftOwnerReq from '../network-requests/NftHasura/NftCollectionIdsByNftOwnerReq';
import NftCollectionModelsPaginatedReq from '../network-requests/NftHasura/NftCollectionModelsPaginatedReq';
import NftCountByDenomAndOwnerReq from '../network-requests/NftHasura/NftCountByDenomAndOwnerReq';
import NftModelsForUrlsReq from '../network-requests/NftHasura/NftModelsForUrlsReq';
import NftModelsPaginatedReq from '../network-requests/NftHasura/NftModelsPaginatedReq';
import NftTransactionHashReq from '../network-requests/NftHasura/NftTransactionHashReq';
import TotalNumberOfNftsInColletionReq from '../network-requests/NftHasura/TotalNumberOfNftsInColletionReq';
import DenomCountByOwnerRes from '../network-responses/NftHasura/DenomCountByOwnerRes';
import DenomTransactionHashRes from '../network-responses/NftHasura/DenomTransactionHashRes';
import NftCollectionIdsByNftOwnerRes from '../network-responses/NftHasura/NftCollectionIdsByNftOwnerRes';
import NftCollectionModelsPaginatedRes from '../network-responses/NftHasura/NftCollectionModelsPaginatedRes';
import NftCountByDenomAndOwnerRes from '../network-responses/NftHasura/NftCountByDenomAndOwnerRes';
import NftModelsForUrlsRes from '../network-responses/NftHasura/NftModelsForUrlsRes';
import NftModelsPaginatedRes from '../network-responses/NftHasura/NftModelsPaginatedRes';
import NftTransactionHashRes from '../network-responses/NftHasura/NftTransactionHashRes';
import TotalNumberOfNftsInColletionRes from '../network-responses/NftHasura/TotalNumberOfNftsInColletionRes';
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

    async getCollectionsTotalCountByOwner(owner: string) {
        // first get denom ids where a user is owner of at least one nft
        const reqDenomsByNftOwner = new NftCollectionIdsByNftOwnerReq(owner);

        const rresDenomsByNftOwnerJson = await (await fetch(Config.CUDOS_NETWORK.GRAPHQL, reqDenomsByNftOwner.buildRequest())).json();

        const resDenomsByNftOwner = new NftCollectionIdsByNftOwnerRes(rresDenomsByNftOwnerJson);

        // get denoms by owner or if the id is in the above
        const req = new DenomCountByOwnerReq(owner, resDenomsByNftOwner.nftCollectionModelIds);

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

    async getNftModelsForUrls(denomIds: string[]): Promise<Map<string, string>> {

        const req = new NftModelsForUrlsReq(denomIds);

        const resJson = await (await fetch(Config.CUDOS_NETWORK.GRAPHQL, req.buildRequest())).json();

        const res = new NftModelsForUrlsRes(resJson);

        return res.denomIdToUrlMap;
    }

    async getCollections(owner: string, from: number, to: number, filter: string): Promise<{nftCollectionModels: NftCollectionModel[], totalCount: number}> {
        // first get denom ids where a user is owner of at least one nft
        const reqDenomsByNftOwner = new NftCollectionIdsByNftOwnerReq(owner);

        const rresDenomsByNftOwnerJson = await (await fetch(Config.CUDOS_NETWORK.GRAPHQL, reqDenomsByNftOwner.buildRequest())).json();

        const resDenomsByNftOwner = new NftCollectionIdsByNftOwnerRes(rresDenomsByNftOwnerJson);

        // get denoms by owner or if the id is in the above
        const req = new NftCollectionModelsPaginatedReq(owner, resDenomsByNftOwner.nftCollectionModelIds, from, to, filter);
        const resJson = await (await fetch(Config.CUDOS_NETWORK.GRAPHQL, req.buildRequest())).json();

        const res = new NftCollectionModelsPaginatedRes(resJson);

        return { nftCollectionModels: res.nftCollectionModels, totalCount: res.totalCount };
    }

    async getTotalNumberOfNftsInCollection(denomId: string): Promise<number> {
        // first get denom ids where a user is owner of at least one nft
        const req = new TotalNumberOfNftsInColletionReq(denomId);

        const resJson = await (await fetch(Config.CUDOS_NETWORK.GRAPHQL, req.buildRequest())).json();

        const res = new TotalNumberOfNftsInColletionRes(resJson);

        return res.nftCount;
    }
}

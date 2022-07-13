import { StargateClient } from 'cudosjs';
import { BaseNFT } from 'cudosjs/stargate/modules/nft/proto-types/nft';
import Apis from '../../../../../../builds/dev-generated/Apis';
import Actions from '../../../../../../builds/dev-generated/Actions';
import Config from '../../../../../../builds/dev-generated/Config';
import NftModel from '../models/NftModel';
import MintNftReq from '../network-requests/MintNftReq';
import Api from '../utilities/Api';
import AbsApi from './AbsApi';
import MintNftRes from '../network-responses/MintNftRes';

export default class NftApi extends AbsApi {
    api: Api

    queryClient: StargateClient
    denomId: string

    constructor() {
        super();

        this.denomId = Config.CUDOS_NETWORK.NFT_DENOM_ID;
        this.api = new Api(Apis.NFT, this.enableActions, this.disableActions);
    }

    async init() {
        this.queryClient = await StargateClient.connect(Config.CUDOS_NETWORK.RPC);
    }

    async fetchAllNfts(callback: (nfts: NftModel[]) => void) {
        const collectionRes = await this.queryClient.getNftCollection(this.denomId);
        if (collectionRes.collection !== undefined) {
            callback(
                collectionRes.collection.nfts
                    .map((nft: BaseNFT) => NftModel.fromJSON(nft.toJSON())),
            );
        }
    }

    async fetchUserTokenIds(owner: string, callback: (tokenIds: string[]) => void) {
        const collectionRes = await this.queryClient.getNftOwner(owner, this.denomId);
        if (collectionRes.owner !== undefined) {
            callback(
                collectionRes.owner.idCollections
                    .find((collection) => collection.denomId === this.denomId)
                    .tokenIds,
            );
        }
    }

    async mintNfts(nftModels: NftModel[], callback: (nfts: NftModel[], txHash: string) => void, error: () => void) {
        const req = new MintNftReq(nftModels);

        this.api.req(Actions.NFT.MINT, req, (json: any) => {
            console.log(json);
            if (json.status !== 0) {
                error();
                return;
            }

            const res = new MintNftRes(json.obj);
            callback(res.nfts, res.txHash);
        });
    }

}

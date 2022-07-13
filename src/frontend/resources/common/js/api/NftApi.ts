import { StargateClient } from 'cudosjs';
import Apis from '../../../../../../builds/dev-generated/Apis';
import Actions from '../../../../../../builds/dev-generated/Actions';
import Config from '../../../../../../builds/dev-generated/Config';
import NftModel from '../models/NftModel';
import MintNftReq from '../network-requests/MintNftReq';
import Api from '../utilities/Api';
import AbsApi from './AbsApi';
import MintNftRes from '../network-responses/MintNftRes';
import NftCollectionModel from '../models/NftCollectionModel';
import { IDCollection } from 'cudosjs/build/stargate/modules/nft/proto-types/nft';
import UploadImagesReq from '../network-requests/UploadImagesReq';
import UploadImagesRes from '../network-responses/UploadImagesRes';

export default class NftApi extends AbsApi {
    api: Api

    queryClient: StargateClient
    denomId: string

    constructor() {
        super();

        this.api = new Api(Apis.NFT, this.enableActions, this.disableActions);

        this.queryClient = null;
        this.denomId = Config.CUDOS_NETWORK.NFT_DENOM_ID;
    }

    async init() {
        this.queryClient = await StargateClient.connect(Config.CUDOS_NETWORK.RPC);
    }

    async fetchNftCollection(denomId: string, callback: (a_: NftCollectionModel | null, b_: NftModel[] | null) => void): Promise < void > {
        console.log('invoke', denomId);
        let nftCollectionModel = null;
        let nftModels = null;

        if (this.queryClient === null) {
            await this.init();
        }

        try {
            const resCollection = await this.queryClient.getNftCollection(denomId);
            if (resCollection.collection !== undefined) {
                if (resCollection.collection.denom !== undefined) {
                    console.log(resCollection.collection.denom);
                    nftCollectionModel = NftCollectionModel.fromJson(resCollection.collection.denom);
                    nftModels = resCollection.collection.nfts.map((nftJson) => {
                        const nftModel = NftModel.fromJSON(nftJson);
                        nftModel.denomId = nftCollectionModel.denomId;
                        return nftModel;
                    });
                }
            }

            if (nftModels?.length === 0) {
                nftCollectionModel = null;
                nftModels = null;
            }
        } catch (e) {
            console.error(e);
        }

        callback(nftCollectionModel, nftModels);
    }

    async fetchNftCollections(walletAddress: string, callback: (a_: NftCollectionModel[] | null, b_: NftModel[] | null) => void): Promise < void > {
        const resNftCollectionModels = [];
        let resNftModels = [];

        if (this.queryClient === null) {
            await this.init();
        }

        try {
            const resOwner = await this.queryClient.getNftOwner(walletAddress);
            if (resOwner.owner !== undefined) {
                if (resOwner.owner.idCollections !== undefined) {
                    const denomIds = resOwner.owner.idCollections.map((idCollection: IDCollection) => {
                        return idCollection.denomId
                    });

                    for (let i = 0; i < denomIds.length; ++i) {
                        // eslint-disable-next-line no-loop-func
                        await new Promise < void >((resolve, reject) => {
                            const run = async () => {
                                this.fetchNftCollection(denomIds[i], (nftCollectionModel, nftModels) => {
                                    if (nftCollectionModel !== null) {
                                        resNftCollectionModels.push(nftCollectionModel);
                                        resNftModels = resNftModels.concat(nftModels);
                                    }

                                    resolve();
                                });
                            }

                            run();
                        })
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }

        callback(resNftCollectionModels, resNftModels);
    }

    async mintNfts(nftModels: NftModel[], callback: (txHash: string) => void, error: () => void) {
        const req = new MintNftReq(nftModels);

        this.api.req(Actions.NFT.MINT, req, (json: any) => {
            if (json.status !== 0) {
                error();
                return;
            }

            const res = new MintNftRes(json.obj);
            nftModels.forEach((nftModel, i) => {
                nftModel.tokenId = res.nfts[i].tokenId;
                nftModel.url = res.nfts[i].url;
            });
            callback(res.txHash);
        });
    }

    async uploadFiles(files: string[], callback: (urls: string[]) => void, error: () => void) {
        const req = new UploadImagesReq(files);
        this.api.req(Actions.NFT.IMAGES_UPLOAD, req, (json: any) => {
            if (json.status !== 0) {
                error();
                return;
            }
            const res = new UploadImagesRes(json.obj);

            callback(res.urls);
        });
    }
}

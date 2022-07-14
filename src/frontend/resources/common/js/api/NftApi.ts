import { Coin, StargateClient, SigningStargateClient, GasPrice, StdFee } from 'cudosjs';
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
import EstimateFeeMintNftReq from '../network-requests/EstimateFeeMintNftReq';
import EstimateFeeMintNftRes from '../network-responses/EstimateFeeMintNftRes';

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
    static getGasPrice() {
        return GasPrice.fromString(Config.CUDOS_NETWORK.GAS_PRICE + Config.CUDOS_NETWORK.DENOM);
    }

    private async init() {
        this.queryClient = await StargateClient.connect(Config.CUDOS_NETWORK.RPC);
    }

    async fetchNftCollection(owner: string, denomId: string, callback: (a_: NftCollectionModel | null, b_: NftModel[] | null) => void): Promise<void> {
        let nftCollectionModel = null;
        let nftModels = null;

        try {
            if (this.queryClient === null) {
                await this.init();
            }

            const resCollection = await this.queryClient.getNftCollection(denomId);
            if (resCollection.collection !== undefined) {
                if (resCollection.collection.denom !== undefined) {
                    nftCollectionModel = NftCollectionModel.fromChain(resCollection.collection.denom);
                    nftModels = resCollection.collection.nfts.map((nftJson) => {
                        const nftModel = NftModel.fromChain(nftJson);
                        nftModel.denomId = nftCollectionModel.denomId;
                        return nftModel;
                    }).filter((nft: NftModel) => {
                        return nft.recipient === owner
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

    async fetchNftCollections(walletAddress: string, callback: (a_: NftCollectionModel[] | null, b_: NftModel[] | null) => void): Promise<void> {
        const resNftCollectionModels = [];
        let resNftModels = [];

        try {
            if (this.queryClient === null) {
                await this.init();
            }

            const resOwner = await this.queryClient.getNftOwner(walletAddress);
            if (resOwner.owner !== undefined) {
                if (resOwner.owner.idCollections !== undefined) {
                    const denomIds = resOwner.owner.idCollections.map((idCollection: IDCollection) => {
                        return idCollection.denomId
                    });

                    for (let i = 0; i < denomIds.length; ++i) {
                        // eslint-disable-next-line no-loop-func
                        await new Promise<void>((resolve, reject) => {
                            const run = async () => {
                                this.fetchNftCollection(walletAddress, denomIds[i], (nftCollectionModel, nftModels) => {
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

    mintNfts(nftModels: NftModel[], callback: (txHash: string) => void, error: () => void) {
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

    async sendNft(nft: NftModel, recipientAddress: string, senderAddress: string, client: SigningStargateClient): Promise<string> {
        const txRes = await client.nftTransfer(senderAddress, nft.denomId, nft.tokenId, senderAddress, recipientAddress, NftApi.getGasPrice());
        return txRes.transactionHash;
    }
    async estimateFeeSendNft(nft: NftModel, recipientAddress: string, senderAddress: string, client: SigningStargateClient): Promise<Coin> {
        const { msgs, fee } = await client.nftModule.msgTransferNft(nft.denomId, nft.tokenId, senderAddress, recipientAddress, senderAddress, '', NftApi.getGasPrice());
        return fee.amount[0];
    }

    async estimateFeeMintNft(nftModels: NftModel[], callback: (fee: Coin[]) => void) {
        const req = new EstimateFeeMintNftReq(nftModels);

        this.api.req(Actions.NFT.ESTIMATE_FEE_MINT_NFT, req, (json: any) => {
            const res = new EstimateFeeMintNftRes(json.obj);

            callback(res.fee);
        });
    }

    async getCudosPriceInUsd(): Promise<number> {
        const now = new Date();
        now.setMinutes(0);
        const coinId = 'cudos';
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`;
        const res = await fetch(url);
        const data = await res.json();
        const price = Number(data[coinId].usd);

        return price;
    }

    uploadFiles(files: string[], callback: (urls: string[]) => void, error: () => void) {
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

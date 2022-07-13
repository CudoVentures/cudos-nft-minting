import NftModel from '../modules/cudos-network/model/nft/NftModel';
import { GasPrice, DirectSecp256k1HdWallet, SigningStargateClient } from 'cudosjs';
import Config from '../../../config/config';
import { NftInfo } from 'cudosjs/build/stargate/modules/nft/module';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import StateException from '../utilities/network/StateException';
import Response from '../utilities/network/Response';
import SV from '../utilities/SV';

const MEMO = 'Minted by Cudos NFT Minter';

export default class NftService {
    denomId: string;
    gasPrice: GasPrice;

    constructor() {
        this.denomId = Config.CUDOS_NETWORK.NFT_DENOM_ID;
        this.gasPrice = GasPrice.fromString(Config.CUDOS_NETWORK.GAS_PRICE + Config.CUDOS_NETWORK.DENOM);
    }

    async mintNft(nftModels: NftModel[]): Promise<any> {
        const missingUrl = nftModels.find((nft: NftModel) => nft.url === '' || !nft.url);
        const missingDenom = nftModels.find((nft: NftModel) => nft.denomId === '' || !nft.denomId);
        const missingName = nftModels.find((nft: NftModel) => nft.name === '' || !nft.name);
        const missingRecipient = nftModels.find((nft: NftModel) => nft.recipient === '' || !nft.recipient);

        if (missingUrl !== undefined) {
            throw new StateException(Response.S_STATUS_RUNTIME_ERROR, `NFT image url is invalid: ${missingUrl.url}`);
        }

        if (missingDenom !== undefined) {
            throw new StateException(Response.S_STATUS_RUNTIME_ERROR, `NFT denomId is invalid: ${missingDenom.denomId}`);
        }

        if (missingName !== undefined) {
            throw new StateException(Response.S_STATUS_RUNTIME_ERROR, `NFT name is invalid: ${missingName.name}`);
        }

        if (missingRecipient !== undefined) {
            throw new StateException(Response.S_STATUS_RUNTIME_ERROR, `NFT recipient is invalid: ${missingRecipient.recipient}`);
        }

        let wallet = null;
        let sender = SV.Strings.EMPTY;
        let client: SigningStargateClient;

        try {
            wallet = await DirectSecp256k1HdWallet.fromMnemonic(Config.CUDOS_SIGNER.MNEMONIC);
            sender = (await wallet.getAccounts())[0].address;
        } catch (e) {
            throw new StateException(Response.S_STATUS_RUNTIME_ERROR, 'Failed to create wallet');
        }

        // TODO: set the env rpc value
        try {
            client = await SigningStargateClient.connectWithSigner('http://host.docker.internal:36657', wallet);
            // client = await SigningStargateClient.connectWithSigner(Config.CUDOS_NETWORK.RPC, wallet);
        } catch (e) {
            throw new StateException(Response.S_STATUS_CUDOS_NETWORK_ERROR, 'Failed to connect signing client');
        }

        let mintRes: any;

        for (let i = 0; i < nftModels.length; ++i) {
            const nft = nftModels[i];
            if (nft.url.includes(';base64,')) {
                nft.url = await this.imageUpload(nft.url);
            }
        }

        const nftInfos = nftModels.map((nftModel: NftModel) => new NftInfo(nftModel.denomId, nftModel.name, nftModel.url, nftModel.data, nftModel.recipient));

        try {
            mintRes = await client.nftMintMultipleTokens(
                nftInfos,
                sender,
                this.gasPrice,
                MEMO,
            )
        } catch (e) {
            throw new StateException(Response.S_STATUS_CUDOS_NETWORK_ERROR, `Failed to mint nfts: ${e}`);
        }

        const log = JSON.parse(mintRes.rawLog);
        // TODO: get token ids
        // const attributeEvent = log[0].events.find((event: any) => event.type === 'mint_nft');

        // if (attributeEvent === undefined) {
        //     throw Error('Failed to get event from tx response');
        // }

        // const tokenIdAttr = attributeEvent.attributes.find((attr) => attr.key === 'token_id');
        // if (tokenIdAttr === undefined) {
        //     throw Error('Failed to get token id attribute from attribute event.');
        // }

        // const tokenId = tokenIdAttr.value;
        // nftModel.tokenId = tokenId;

        return { nftModels, txHash: mintRes.transactionHash };
    }

    async imageUpload(file: string): Promise<string> {
        try {
            const base64Buffer = file.substring(file.indexOf(',') + 1);
            const documentBuffer = Buffer.from(base64Buffer, 'base64');
            const authorization = `Basic ${Buffer.from(`${Config.INFURA.ID}:${Config.INFURA.SECRET}`).toString('base64')}`;

            const ipfs: IPFSHTTPClient = create({
                url: Config.INFURA.HOST,
            });

            const added = await ipfs.add(documentBuffer, {
                pin: true,
                headers: {
                    authorization,
                },
            });
            const url = `https://ipfs.infura.io/ipfs/${added.path}`

            return url;
        } catch (error) {
            throw new StateException(Response.S_STATUS_INFURA_ERROR, 'Failed to upload image to infura');
        }

    }
}

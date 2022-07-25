import NftModel from '../modules/cudos-network/model/nft/NftModel';
import { GasPrice, DirectSecp256k1HdWallet, SigningStargateClient, StdFee } from 'cudosjs';
import Config from '../../../config/config';
import { NftInfo } from 'cudosjs/build/stargate/modules/nft/module';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import StateException from '../utilities/network/StateException';
import Response from '../utilities/network/Response';
import SV from '../utilities/SV';
import Logger from '../utilities/Logger';

const MEMO = 'Minted by Cudos NFT Minter';

export default class NftService {
    denomId: string;
    gasPrice: GasPrice;

    constructor() {
        this.denomId = Config.CUDOS_NETWORK.NFT_DENOM_ID;
        this.gasPrice = GasPrice.fromString(Config.CUDOS_NETWORK.GAS_PRICE + Config.CUDOS_NETWORK.DENOM);
    }

    private async getSigner() {
        let wallet = null;
        let sender = SV.Strings.EMPTY;
        let client: SigningStargateClient;

        try {
            wallet = await DirectSecp256k1HdWallet.fromMnemonic(Config.CUDOS_SIGNER.MNEMONIC);
            sender = (await wallet.getAccounts())[0].address;
        } catch (e) {
            Logger.error(`Failed to get wallet from signer mnemonic: ${e}`);
            throw new StateException(Response.S_STATUS_RUNTIME_ERROR, 'Failed to create wallet');
        }

        try {
            client = await SigningStargateClient.connectWithSigner(Config.CUDOS_NETWORK.RPC_BACKEND, wallet);
        } catch (e) {
            Logger.error(`Failed to connect signing client with signer: ${e}`);
            throw new StateException(Response.S_STATUS_CUDOS_NETWORK_ERROR, 'Failed to connect signing client');
        }

        return { wallet, sender, client }
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

        let mintRes: any;

        for (let i = 0; i < nftModels.length; ++i) {
            const nft = nftModels[i];
            if (nft.url.includes(';base64,')) {
                nft.url = await this.imageUpload(nft.url);
            }
        }

        const nftInfos = nftModels.map((nftModel: NftModel) => new NftInfo(nftModel.denomId, nftModel.name, nftModel.url, nftModel.data, nftModel.recipient));

        try {
            const { wallet, sender, client } = await this.getSigner();

            mintRes = await client.nftMintMultipleTokens(
                nftInfos,
                sender,
                this.gasPrice,
                MEMO,
            )
        } catch (e) {
            Logger.error(`Failed to mint NFTs: ${e}`);
            throw new StateException(Response.S_STATUS_CUDOS_NETWORK_ERROR, `Failed to mint nfts: ${e}`);
        }

        // get the token ids from the mint transaction result
        // each log represents one message in the transaction
        const log = JSON.parse(mintRes.rawLog);
        for (let i = 0; i < log.length; i++) {
            // each message has a few events, the get the one with the correct type
            const attributeEvent = log[i].events.find((event: any) => event.type === 'mint_nft');
            try {
                if (attributeEvent === undefined) {
                    throw Error('Failed to get event from tx response');
                }

                // get token id from the event attributes
                const tokenIdAttr = attributeEvent.attributes.find((attr) => attr.key === 'token_id');
                if (tokenIdAttr === undefined) {
                    throw Error('Failed to get token id attribute from attribute event.');
                }

                nftModels[i].tokenId = tokenIdAttr.value;
            } catch (e) {
                Logger.error(`Failed to get NFT tokenId from TX event: ${e}`);
                throw new StateException(Response.S_STATUS_CUDOS_NETWORK_ERROR, `Failed to get NFT tokenId from TX event: ${e}`);
            }
        }

        return { nftModels, txHash: mintRes.transactionHash };
    }

    async estimateFeeMintNft(nftModels: NftModel[]): Promise<StdFee> {
        // dont upload images, just replace huge string so validates pass
        for (let i = 0; i < nftModels.length; ++i) {
            const nft = nftModels[i];
            if (nft.url.includes(';base64,')) {
                nft.url = 'a'.repeat(100);
            }
        }

        const nftInfos = nftModels.map((nftModel: NftModel) => new NftInfo(Config.CUDOS_NETWORK.NFT_DENOM_ID, nftModel.name, nftModel.url, nftModel.data, nftModel.recipient));

        try {

            const { wallet, sender, client } = await this.getSigner();

            const { msgs, fee } = await client.nftModule.msgMintMultipleNFT(
                nftInfos,
                sender,
                '',
                this.gasPrice,
            )

            return fee;
        } catch (e) {
            Logger.error(`Failed to estimate fee mint NFTs: ${e}`);
            throw new StateException(Response.S_STATUS_CUDOS_NETWORK_ERROR, `Failed to estimate fee nfts: ${e}`);
        }
    }

    async imageUpload(file: string): Promise<string> {
        try {
            if (!file.includes(';base64,')) {
                throw new StateException(Response.S_STATUS_RUNTIME_ERROR, 'File not in base 64 format');
            }

            const base64Buffer = file.substring(file.indexOf(',') + 1);
            const documentBuffer = Buffer.from(base64Buffer, 'base64');
            const authorization = `Basic ${Buffer.from(`${Config.INFURA.ID}:${Config.INFURA.SECRET}`).toString('base64')}`;

            if (base64Buffer.length > (2 << 20)) {
                throw new StateException(Response.S_STATUS_RUNTIME_ERROR, `File too big: ${base64Buffer.length} bytes`);
            }

            const ipfs: IPFSHTTPClient = create({
                url: Config.INFURA.HOST,
            });

            const added = await ipfs.add(documentBuffer, {
                pin: true,
                headers: {
                    authorization,
                },
            });
            const url = `https://ipfs.io/ipfs/${added.path}`

            return url;
        } catch (e) {
            Logger.error(`Failed to upload image to infura: ${e}`);
            throw new StateException(Response.S_STATUS_INFURA_ERROR, `Failed to upload image to infura: ${e}`);
        }

    }
}

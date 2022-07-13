import NftModel from '../modules/cudos-network/model/nft/NftModel';
import { GasPrice, DirectSecp256k1HdWallet, SigningStargateClient } from 'cudosjs';
import Config from '../../../config/config';
import { NftInfo } from 'cudosjs/build/stargate/modules/nft/module';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import StateException from '../utilities/network/StateException';
import Response from '../utilities/network/Response';

const MEMO = 'Minted by Cudos NFT Minter';

export default class NftService {
    denomId: string;
    gasPrice: GasPrice;

    constructor() {
        this.denomId = Config.CUDOS_NETWORK.NFT_DENOM_ID;
        this.gasPrice = GasPrice.fromString(Config.CUDOS_NETWORK.GAS_PRICE + Config.CUDOS_NETWORK.DENOM);
    }

    async mintNft(nftModels: NftModel[]): Promise<any> {

        let wallet = null;
        let sender = SV.Strings.EMPTY;
        let client: SigningStargateClient;

        try {
            wallet = await DirectSecp256k1HdWallet.fromMnemonic(Config.CUDOS_SIGNER.MNEMONIC);
            sender = (await wallet.getAccounts())[0].address;
        } catch (e) {
            throw new StateException(Response.S_STATUS_CUDOS_NETWORK_ERROR, 'Failed to create wallet');
        }

        try {
            client = await SigningStargateClient.connectWithSigner('http://host.docker.internal:36657', wallet);
        } catch (e) {
            throw new StateException(Response.S_STATUS_CUDOS_NETWORK_ERROR, 'Failed to connect signing client');
        }

        let mintRes: any;

        if (!nftModels[0].uri) {
            throw new StateException(Response.S_STATUS_INVALID_NFT_ERROR, 'NFT image uri is invalid');
        }
        // TODO: upload images first
        try {
            if (nftModels[0].uri.includes(';base64,')) {
                await imageUpload(nftModels[0].uri);
            }
        } catch (e) {

        }

        const nftInfos = nftModels.map((nftModel: NftModel) => new NftInfo(nftModel.denomId, nftModel.name, nftModel.uri, nftModel.data, nftModel.recipient));

        try {
            mintRes = await client.nftMintMultipleTokens(
                nftInfos,
                sender,
                this.gasPrice,
                MEMO,
            )
        } catch (e) {
            throw Error(`Failed to mint token. Reason: ${e}`);
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
            const uri = `https://ipfs.infura.io/ipfs/${added.path}`

            return uri;
        } catch (error) {
            throw ()
            console.error('IPFS error ', error);
        }

    }
}

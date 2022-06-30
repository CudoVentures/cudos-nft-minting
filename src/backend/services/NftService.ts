import NftModel from '../modules/cudos-network/model/nft/NftModel';
import { GasPrice, DirectSecp256k1HdWallet, SigningStargateClient } from 'cudosjs';
import Config from '../../../config/config';
import NftImageModel from '../modules/cudos-network/model/nftImage/NftImageModel';

const MEMO = 'Minted by Cudos NFT Minter';

export default class NftService {
    denomId: string;
    gasPrice: GasPrice;

    constructor() {
        this.denomId = Config.CUDOS_NETWORK.DENOM_ID;
        this.gasPrice = GasPrice.fromString(Config.CUDOS_NETWORK.GAS_PRICE);
    }

    async mintNft(nftModel: NftModel): Promise<NftModel> {
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(Config.CUDOS_SIGNER.MNEMONIC);
        const sender = (await wallet.getAccounts())[0].address;
        try {
            const client = await SigningStargateClient.connectWithSigner('http://host.docker.internal:36657', wallet);
        } catch (e) {
            throw Error('Failed to connect to Cudos node.');
        }
        let mintRes: any;

        try {
            mintRes = await client.nftMintToken(
                sender,
                this.denomId,
                nftModel.name,
                nftModel.uri,
                nftModel.data,
                nftModel.owner,
                this.gasPrice,
                MEMO,
            )
        } catch (e) {
            throw Error(`Failed to mint token. Reason: ${e}`);
        }

        const log = JSON.parse(mintRes.rawLog);
        const attributeEvent = log[0].events.find((event: any) => event.type === 'mint_nft');

        if (attributeEvent === undefined) {
            throw Error('Failed to get event from tx response');
        }

        const tokenIdAttr = attributeEvent.attributes.find((attr) => attr.key === 'token_id');
        if (tokenIdAttr === undefined) {
            throw Error('Failed to get token id attribute from attribute event.');
        }

        const tokenId = tokenIdAttr.value;
        nftModel.tokenId = tokenId;

        return nftModel;
    }

    async imageUpload(nftImageModel: NftImageModel): Promise<NftImageModel> {

        // TODO: upload to infura;

        return nftImageModel;
    }
}
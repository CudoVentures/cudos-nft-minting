import NftModel from '../modules/cudos-network/model/nft/NftModel';
import { GasPrice, DirectSecp256k1HdWallet, SigningStargateClient } from 'cudosjs';
import Config from '../../../config/config';
import NftImageModel from '../modules/cudos-network/model/nftImage/NftImageModel';
import { create, CID, IPFSHTTPClient } from 'ipfs-http-client';
import SV from '../utilities/SV';
import { NftInfo } from 'cudosjs/build/stargate/modules/nft/module';

const MEMO = 'Minted by Cudos NFT Minter';

export default class NftService {
    denomId: string;
    gasPrice: GasPrice;

    constructor() {
        this.denomId = Config.CUDOS_NETWORK.NFT_DENOM_ID;
        this.gasPrice = GasPrice.fromString(Config.CUDOS_NETWORK.GAS_PRICE + Config.CUDOS_NETWORK.DENOM);
    }

    async mintNft(nftModels: NftModel[]): Promise<NftModel[]> {
        // const wallet = await DirectSecp256k1HdWallet.fromMnemonic(Config.CUDOS_SIGNER.MNEMONIC);
        // const sender = (await wallet.getAccounts())[0].address;
        // let client: SigningStargateClient;

        // try {
        //     client = await SigningStargateClient.connectWithSigner('http://host.docker.internal:36657', wallet);
        // } catch (e) {
        //     throw Error('Failed to connect to Cudos node.');
        // }
        // let mintRes: any;
        // le
        // // let nftIndos: NftInfo = nftModels.map((nft: NftModel) =>
        // // new NftInfo({
        // //     denomId: nft.denomId,
        // //     name: nft.name,
        // //     uri: nft.,
        // //     data: string,
        // //     recipient: string,
        // // }));

        // try {
        //     mintRes = await client.nftMintMultipleTokens(
        //         sender,
        //         this.gasPrice,
        //         MEMO,
        //     )
        // } catch (e) {
        //     throw Error(`Failed to mint token. Reason: ${e}`);
        // }

        // const log = JSON.parse(mintRes.rawLog);
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

        return nftModels;
    }

    async imageUpload(nftImageModel: NftImageModel): Promise<NftImageModel> {
        const base64Buffer = nftImageModel.file.substring(nftImageModel.file.indexOf(',') + 1);
        const documentBuffer = Buffer.from(base64Buffer, 'base64');
        const fileSize = documentBuffer.length;
        const authorization = `Basic ${Buffer.from(`${Config.INFURA.ID}:${Config.INFURA.SECRET}`).toString('base64')}`;

        try {
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
            nftImageModel.imageUrl = url;
            nftImageModel.file = SV.Strings.EMPTY;
            nftImageModel.sizeBytes = fileSize;
        } catch (error) {
            console.error('IPFS error ', error);
        }

        return nftImageModel;
    }
}

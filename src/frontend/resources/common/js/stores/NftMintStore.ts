import { makeObservable, observable } from 'mobx';
import { GasPrice, SigningStargateClient, estimateFee, Coin } from 'cudosjs';
import { NftInfo } from 'cudosjs/build/stargate/modules/nft/module';

import S from '../utilities/Main';
import Config from '../../../../../../builds/dev-generated/Config';

import NftApi from '../api/NftApi';
import NftModel from '../models/NftModel';
import WalletStore from './WalletStore';
import MyNftsStore from './MyNftsStore';
import NftCollectionModel from '../models/NftCollectionModel';

export default class NftMintStore {

    static MINT_MODE_LOCAL: number = 1;
    static MINT_MODE_BACKEND: number = 2;

    nftApi: NftApi;
    myNftsStore: MyNftsStore;
    walletStore: WalletStore;

    @observable imageUrlInputValue: string;

    @observable nftCollection: NftCollectionModel;
    @observable nfts: NftModel[];
    @observable selectedNfts: number[];

    @observable transactionHash: string;

    constructor(myNftsStore: MyNftsStore, walletStore: WalletStore) {
        this.nftApi = new NftApi();
        this.myNftsStore = myNftsStore;
        this.walletStore = walletStore;

        this.reset();

        makeObservable(this);
    }

    // utils
    getTxHashLink(): string {
        return `${Config.CUDOS_NETWORK.EXPLORER}/transactions/${this.transactionHash}`
    }

    reset() {
        this.imageUrlInputValue = S.Strings.EMPTY;

        this.nftCollection = null;
        this.nfts = [];
        this.selectedNfts = [];

        this.transactionHash = S.Strings.EMPTY;
    }

    // nav
    selectSingleMintOption() {
        this.reset();
        this.nftCollection = NftCollectionModel.instanceCudosMainCollection();
    }

    selectMultipleMintOption() {
        this.reset();
        this.nftCollection = new NftCollectionModel();
    }

    // estimate
    async esimateMintFees(callback: (fee: number) => void): Promise<number> {
        try {
            const signer = this.walletStore.keplrWallet.offlineSigner;
            const sender = this.walletStore.keplrWallet.accountAddress;
            const client = await SigningStargateClient.connectWithSigner(Config.CUDOS_NETWORK.RPC, signer);

            const nftInfos = this.nfts.map((nftModel: NftModel) => new NftInfo(Config.CUDOS_NETWORK.NFT_DENOM_ID, nftModel.name, 'example uri', 'random', sender));

            this.nftApi.estimateFeeMintNft(this.nfts, (fee: Coin[]) => {
                callback(Number(fee[0].amount));
            })
        } catch (e) {
            console.log(e);
            throw new Error('Failed to connect signing client');
        }
    }

    // minting
    async mintCollection(callBefore: () => void, success: () => void, error: () => void) {
        callBefore();

        try {
            const client = await SigningStargateClient.connectWithSigner(Config.CUDOS_NETWORK.RPC, this.walletStore.keplrWallet.offlineSigner);
            const txRes = await client.nftIssueDenom(
                this.walletStore.keplrWallet.accountAddress,
                this.nftCollection.denomId,
                this.nftCollection.name,
                S.Strings.EMPTY,
                S.Strings.EMPTY,
                GasPrice.fromString(Config.CUDOS_NETWORK.GAS_PRICE + Config.CUDOS_NETWORK.DENOM),
            );

            const log = JSON.parse(txRes.rawLog);
            const attributeEvent = log[0].events.find((event: any) => event.type === 'issue_denom');

            if (attributeEvent === undefined) {
                throw Error('Failed to get event from tx response');
            }

            const tokenIdAttr = attributeEvent.attributes.find((attr) => attr.key === 'denom_id');
            if (tokenIdAttr === undefined) {
                throw Error('Failed to get token id attribute from attribute event.');
            }

            // this.denomId = tokenIdAttr.value;
            this.transactionHash = txRes.transactionHash;

            success();
        } catch (e) {
            console.log(e);
            error();
        }
    }

    async mintNfts(local: number, callBefore: () => void, success: () => void, error: () => void): Promise<void> {
        callBefore();
        if (!this.isValidNftModels()) {
            error();
            return;
        }

        try {
            switch (local) {
                case NftMintStore.MINT_MODE_BACKEND:
                    await this.mintBackend(success, error);
                    break;
                case NftMintStore.MINT_MODE_LOCAL:
                    await this.mintLocal(success, error);
                    break;
                default:
                    throw Error('Unknown mint type');
            }
        } catch (e) {
            error();
        }
    }

    private async mintBackend(success: () => void, error: () => void) {
        await this.nftApi.mintNfts(this.nfts, (txHash: string) => {
            this.transactionHash = txHash;
            success();
        }, error);
    }

    private async mintLocal(success: () => void, error: () => void) {
        const nfts = this.nfts;

        let client: SigningStargateClient;

        try {
            client = await SigningStargateClient.connectWithSigner(Config.CUDOS_NETWORK.RPC, this.walletStore.keplrWallet.offlineSigner);
        } catch (e) {
            throw new Error('Failed to connect signing client');
        }

        let mintRes: any;
        const urls = nfts.map((nft: NftModel) => nft.url);
        await this.nftApi.uploadFiles(
            urls,
            async (imageUrls: string[]) => {
                for (let i = 0; i < nfts.length; i++) {
                    if (nfts[i].url.includes(';base64,')) {
                        nfts[i].url = imageUrls[i];
                    }
                }
                const nftInfos = nfts.map((nftModel: NftModel) => new NftInfo(nftModel.denomId, nftModel.name, nftModel.url, nftModel.data, nftModel.recipient));
                try {
                    mintRes = await client.nftMintMultipleTokens(
                        nftInfos,
                        this.walletStore.keplrWallet.accountAddress,
                        GasPrice.fromString(Config.CUDOS_NETWORK.GAS_PRICE + Config.CUDOS_NETWORK.DENOM),
                    )
                    console.log(mintRes);
                } catch (e) {
                    console.log(e);
                    error();
                }

                // get the token ids from the mint transaction result
                // each log represents one message in the transaction
                const log = JSON.parse(mintRes.rawLog);
                for (let i = 0; i < log.length; i++) {
                    // each message has a few events, the get the one with the correct type
                    const attributeEvent = log[i].events.find((event: any) => event.type === 'mint_nft');

                    if (attributeEvent === undefined) {
                        throw Error('Failed to get event from tx response');
                    }

                    // get token id from the event attributes
                    const tokenIdAttr = attributeEvent.attributes.find((attr) => attr.key === 'token_id');
                    if (tokenIdAttr === undefined) {
                        throw Error('Failed to get token id attribute from attribute event.');
                    }

                    nfts[i].tokenId = tokenIdAttr.value;
                }
                success();
            },
            error,
        );
    }

    isValidNftModels(): boolean {
        for (let i = this.nfts.length; i-- > 0;) {
            if (this.nfts[i].isValidForSubmit() === false) {
                return false;
            }
        }

        return true;
    }

    // images
    async addNftFromUpload(url: string, fileName: string, type: string, sizeBytes: number): Promise<void> {
        const searchFor = 'base64,';
        const binaryString = window.atob(url.substring(url.indexOf(searchFor) + searchFor.length));
        const bytes = new Uint8Array(binaryString.length);
        for (let i = binaryString.length; i-- > 0;) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        await this.addNftModel(url, fileName, type, sizeBytes, bytes.buffer);
    }

    async addNftFromLink(): Promise<void> {
        let url = this.imageUrlInputValue;
        this.imageUrlInputValue = S.Strings.EMPTY;

        if (!url.startsWith('http')) {
            url = `http://${url}`;
        }

        try {
            const imageRes = await fetch(url);
            let contentType = imageRes.headers.get('Content-Type');
            contentType = contentType.slice(contentType.indexOf('/') + 1);
            const contentLength = Number(imageRes.headers.get('Content-Length'));

            await this.addNftModel(url, `NFT-${Date.now()}`, contentType, contentLength, await imageRes.arrayBuffer());
        } catch (e) {
            throw Error('Could not fetch file.');
        }
    }

    private async addNftModel(url: string, fileName: string, type: string, sizeBytes: number, arrayBuffer: ArrayBuffer): Promise<void> {
        const nft = new NftModel();

        nft.denomId = this.nftCollection.denomId;
        nft.url = url;
        nft.recipient = this.walletStore.keplrWallet.accountAddress;

        nft.fileName = fileName;
        nft.type = type;
        nft.sizeBytes = sizeBytes;
        nft.updatePreviewUrl();

        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        nft.data = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

        this.nfts.push(nft);
    }

    // credit
    removeNft(indexToRemove: number): void {
        this.nfts = this.nfts.filter((image: NftModel, index: number) => index !== indexToRemove);
        this.selectedNfts = [];
    }

    removeSelectedNfts(): void {
        this.nfts = this.nfts.filter(
            (v: NftModel, i: number) => this.selectedNfts.find((value: number) => value === i) === undefined,
        );
        this.selectedNfts = [];
    }

    onSelectNft(index: number): void {
        if (this.isNftSelected(index) === S.INT_TRUE) {
            this.selectedNfts = this.selectedNfts.filter((i: number) => i !== index);
        } else {
            this.selectedNfts.push(index);
        }
    }

    onSelectAllNfts(): void {
        const result = [];

        if (this.areAllNftsSelected() === S.INT_FALSE) {
            for (let i = 0; i < this.nfts.length; i++) {
                result.push(i);
            }
        }

        this.selectedNfts = result;
    }

    areAnyNftsSelected(): boolean {
        return this.selectedNfts.length > 0;
    }

    areAllNftsSelected(): number {
        return this.nfts.length === this.selectedNfts.length && this.nfts.length !== 0 ? S.INT_TRUE : S.INT_FALSE;
    }

    isNftSelected(index: number): number {
        return this.selectedNfts.find((i: number) => i === index) !== undefined ? S.INT_TRUE : S.INT_FALSE;
    }

    isNftsEmpty(): boolean {
        return this.nfts.length === 0;
    }

}

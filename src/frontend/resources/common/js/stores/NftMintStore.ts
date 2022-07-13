import { makeObservable, observable } from 'mobx';
import InfuraApi from '../api/InfuraApi';
import NftApi from '../api/NftApi';
import NftModel from '../models/NftModel';
import S from '../utilities/Main';
import { GasPrice, SigningStargateClient, StargateClient } from 'cudosjs';
import WalletStore from './WalletStore';
import Config from '../../../../../../builds/dev-generated/Config';

export default class NftMintStore {

    nftApi: NftApi;
    infuraApi: InfuraApi;
    walletStore: WalletStore;

    @observable isImageLinkValid: boolean;
    @observable imageUrlInputValue: string;
    @observable isAddressFieldActive: number;

    @observable collectionName: string;
    @observable nfts: NftModel[];
    @observable mintedNfts: number[];
    @observable selectedNfts: number[];

    @observable transactionHash: string;

    constructor(walletStore: WalletStore) {
        this.nftApi = new NftApi();
        this.infuraApi = new InfuraApi();
        this.walletStore = walletStore;

        this.nfts = [];
        this.collectionName = S.Strings.EMPTY;
        this.mintedNfts = [];
        this.selectedNfts = [];
        this.isAddressFieldActive = S.INT_FALSE;
        this.imageUrlInputValue = S.Strings.EMPTY;
        this.transactionHash = S.Strings.EMPTY;

        makeObservable(this);
    }

    async init(): Promise<void> {
        // await this.nftApi.init();
    }

    async getAllNfts(): Promise<void> {
        this.nftApi.fetchAllNfts((nfts: NftModel[]) => {
            this.nfts = nfts;
        });
    }

    async getUserNfts(recipient: string): Promise<void> {
        this.nftApi.fetchAllNfts((nfts: NftModel[]) => {
            this.nfts = nfts.filter((nft: NftModel) => nft.recipient === recipient);
        })
    }

    async mintCollection(callBefore: () => void, success: () => void) {
        callBefore();

        const client = await SigningStargateClient.connectWithSigner(Config.CUDOS_NETWORK.RPC, this.walletStore.keplrWallet.offlineSigner);
        // TODO: check if denom id exists
        const txRes = await client.nftIssueDenom(
            this.walletStore.keplrWallet.accountAddress,
            this.collectionName,
            this.collectionName,
            this.collectionName,
            this.collectionName,
            GasPrice.fromString(Config.CUDOS_NETWORK.GAS_PRICE + Config.CUDOS_NETWORK.DENOM),
        );

        this.transactionHash = txRes.transactionHash;

        success();
    }

    async mintNfts(
        callBefore: () => void,
        success: () => void,
        error: () => void,
    ): Promise<void> {
        callBefore();
        this.nfts.forEach((nft: NftModel) => {
            if (nft.recipient === S.Strings.EMPTY) {
                nft.recipient = this.walletStore.keplrWallet.accountAddress;
            }

            if (nft.denomId === S.Strings.EMPTY) {
                nft.denomId = Config.CUDOS_NETWORK.NFT_DENOM_ID;
            }

            // TODO: get real checksum
            nft.data = 'some checksum'
        })

        try {
            await this.nftApi.mintNfts(this.nfts, (nfts: NftModel[], txHash: string) => {
                this.nfts = nfts
                this.transactionHash = txHash;

                success();
            })

        } catch (e) {
            error();
        }
    }

    async esimateMintFees(): Promise<number> {
        // TODO: estimate fees correctly
        return 1;
    }

    getTxHashLink(): string {
        return `${Config.CUDOS_NETWORK.EXPLORER}/transactions/${this.transactionHash}`
    }

    addNewImage(url: string, fileName: string, type: string, sizeBytes: number): void {
        const nft = new NftModel();

        nft.url = url;
        nft.fileName = fileName;
        nft.type = type;
        nft.sizeBytes = sizeBytes;
        nft.updatePreviewUrl();

        this.nfts.push(nft);
    }

    async getImageFromUrl(): Promise<void> {
        let url = this.imageUrlInputValue;

        this.imageUrlInputValue = '';

        try {
            if (!url.startsWith('http')) {
                url = `http://${url}`;
            }
            const imageRes = await fetch(url);
            let contentType = imageRes.headers.get('Content-Type');
            contentType = contentType.slice(contentType.indexOf('/') + 1);
            const contentLength = Number(imageRes.headers.get('Content-Length'));

            const nft = new NftModel();

            nft.url = url;
            nft.fileName = 'linkedImage';
            nft.type = contentType;
            nft.sizeBytes = contentLength;
            nft.updatePreviewUrl();

            this.nfts.push(nft);
        } catch (e) {
            throw Error('Could not fetch file.');
        }

    }

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
        return this.nfts.length === this.selectedNfts.length
            && this.nfts.length !== 0
            ? S.INT_TRUE : S.INT_FALSE;
    }

    isNftSelected(index: number): number {
        return this.selectedNfts.find((i: number) => i === index) !== undefined ? S.INT_TRUE : S.INT_FALSE;
    }

    isNftsEmpty(): boolean {
        return this.nfts.length === 0;
    }

    onChangeCollectionName(value: string): void {
        this.collectionName = value;
    }

    onChangeNftFormName(nft: NftModel, value: string): void {
        nft.name = value;
    }

    onChangeNftFormAddress(nft: NftModel, value: string): void {
        nft.recipient = value;
    }

    toggleAddressFieldActive(): void {
        this.isAddressFieldActive = this.isAddressFieldActive === S.INT_TRUE ? S.INT_FALSE : S.INT_TRUE;
        this.onChangeNftFormAddress(this.nfts[0], '');
    }
}

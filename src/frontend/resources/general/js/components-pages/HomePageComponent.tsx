/* global TR */

import React from 'react';
import { inject, observer } from 'mobx-react';

import WalletStore from '../../../common/js/stores/WalletStore';
import NftStore from '../../../common/js/stores/NftStore';

import PageComponent from '../../../common/js/components-pages/PageComponent';
import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';
import Actions from '../../../common/js/components-inc/Actions';
import Button from '../../../common/js/components-inc/Button';

import './../../css/components-pages/page-home-component.css';
import AlertStore from '../../../common/js/stores/AlertStore';
import NftImageModel from '../../../common/js/models/NftImageModel';
import NftModel from '../../../common/js/models/NftModel';

interface Props extends ContextPageComponentProps {
    walletStore: WalletStore,
    nftStore: NftStore,
    alertStore: AlertStore,
}

export default class PageHomeComponent extends ContextPageComponent < Props > {

    static layout() {
        const MobXComponent = inject('appStore', 'walletStore', 'nftStore', 'alertStore')(observer(PageHomeComponent));
        PageComponent.layout(<MobXComponent />);
    }

    constructor(props: Props) {
        super(props);
    }

    async componentDidMount(): Promise<void> {
        super.componentDidMount();
        try {
            await this.props.nftStore.init();
        } catch (e) {
            this.props.alertStore.show('Failed to connect to node.');
        }
    }

    getPageLayoutComponentCssClassName() {
        return 'PageHome';
    }

    onClickToggleKeplr = async () => {
        const walletStore = this.props.walletStore;

        if (walletStore.isKeplrConnected() === true) {
            await walletStore.disconnectKeplr();
        } else {
            await walletStore.connectKeplr();
        }
    }

    onClickMintNft = () => {
        try {
            this.props.nftStore.nftForm = NftModel.fromJSON({
                name: 'testNft',
                uri: 'test URI',
                data: 'testData',
                owner: 'cudos15hkd2zzyug7v2cv30kq55h5zquegjwm35k9h0y',
            })

            this.props.nftStore.nftImage = NftImageModel.fromJSON({
                imageId: 'weweweg',
                imageUrl: 'wegwegwegweg',
                sizeInBytes: 42,
            })
            this.props.nftStore.mintNft();
        } catch (e) {
            console.log(e);
            this.props.alertStore.show('Failed to mint nft.');
        }
    }

    renderContent() {
        const walletStore = this.props.walletStore;
        const nftStore = this.props.nftStore;
        console.log(this.props.nftStore.nfts);
        return (
            <div style = { { 'flex': '1 1 auto' } } className = { 'FlexSingleCenter' } >
                <Actions>
                    <Button type = { Button.TYPE_ROUNDED } color = { Button.COLOR_SCHEME_1 } onClick = { this.onClickToggleKeplr } >
                        { walletStore.isKeplrConnected() === true && (
                            'Disconnect keplr'
                        ) }
                        { walletStore.isKeplrConnected() === false && (
                            'Connect keplr'
                        ) }
                    </Button>
                    <Button type = { Button.TYPE_ROUNDED } color = { Button.COLOR_SCHEME_2 } onClick = { this.onClickMintNft } > Mint nft </Button>
                </Actions>
                <div>
                    {this.props.nftStore.nfts.map((nft) => <div key={nft.tokenId}>{nft.name}</div>)}
                </div>
                { walletStore.isKeplrConnected() === true && walletStore.keplrWallet.accountAddress }
            </div>
        )
    }
}

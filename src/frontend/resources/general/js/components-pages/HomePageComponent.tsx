/* global TR */

import React from 'react';
import { inject, observer } from 'mobx-react';

import WalletStore from '../../../common/js/stores/WalletStore';

import PageComponent from '../../../common/js/components-pages/PageComponent';
import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';
import Actions from '../../../common/js/components-inc/Actions';
import Button from '../../../common/js/components-inc/Button';

import './../../css/components-pages/page-home-component.css';

interface Props extends ContextPageComponentProps {
    walletStore: WalletStore,
}

export default class PageHomeComponent extends ContextPageComponent < Props > {

    static layout() {
        const MobXComponent = inject('appStore', 'walletStore')(observer(PageHomeComponent));
        PageComponent.layout(<MobXComponent />);
    }

    constructor(props: Props) {
        super(props);
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

    }

    renderContent() {
        const walletStore = this.props.walletStore;

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

                { walletStore.isKeplrConnected() === true && walletStore.keplrWallet.accountAddress }
            </div>
        )
    }
}

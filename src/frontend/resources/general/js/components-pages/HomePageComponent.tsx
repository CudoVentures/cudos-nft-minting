/* global TR */

import React from 'react';
import { inject, observer } from 'mobx-react';

import WalletStore from '../../../common/js/stores/WalletStore';
import NftStore from '../../../common/js/stores/NftStore';

import PageComponent from '../../../common/js/components-pages/PageComponent';
import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';
import Button from '../../../common/js/components-inc/Button';

import './../../css/components-pages/page-home-component.css';
import AlertStore from '../../../common/js/stores/AlertStore';
import PageHeader from '../components-inc/PageHeader';
import PageLayoutComponent from '../../../common/js/components-pages/PageLayoutComponent';
import LayoutBlock from '../../../common/js/components-inc/LayoutBlock';
import PagesGeneral from '../../../../../../builds/dev-generated/PagesGeneral';

interface Props extends ContextPageComponentProps {
    walletStore: WalletStore,
    nftStore: NftStore,
    alertStore: AlertStore,
}
 
export default class PageHomeComponent extends ContextPageComponent < Props > {

    static layout() {
        const MobXComponent = inject('appStore', 'walletStore', 'alertStore')(observer(PageHomeComponent));
        PageComponent.layout(<MobXComponent />);
    }
    constructor(props: Props) {
        super(props);
    }

    getPageLayoutComponentCssClassName() {
        return 'PageHome';
    }

    renderContent() {
        const walletStore = this.props.walletStore;
        return (
            <div style = { { 'flex': '1 1 auto' } } className = { 'FlexSingleCenter' } >
                <LayoutBlock>
                    <PageHeader
                        connected={this.props.walletStore.keplrWallet.connected}
                        address={this.props.walletStore.keplrWallet.accountAddress}
                        onClickToggleWallet={this.props.walletStore.onClickToggleKeplr}
                    />
                    <div className={" MainContent "}>
                        <LayoutBlock className={" Left "}>
                            <h1>Start Minting NFTs On CUDOS Network</h1>
                            <span>CUDOS NFT Minet is the world's simplest NFT creation service on CUDOS Network. Try it out yourself</span>
                            <Button 
                                onClick={() => window.location.href = PagesGeneral.INNER} 
                                className={' StartMinting '} 
                                type = { Button.TYPE_ROUNDED } 
                                color = { Button.COLOR_SCHEME_1 } 
                            >
                                Start Minting
                            </Button>
                        </LayoutBlock>
                    </div>
                </LayoutBlock>
            </div>
        )
    }
}

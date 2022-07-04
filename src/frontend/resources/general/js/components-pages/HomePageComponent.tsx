/* global TR */

import React from 'react';
import { inject, observer } from 'mobx-react';

import WalletStore from '../../../common/js/stores/WalletStore';

import PageComponent from '../../../common/js/components-pages/PageComponent';
import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';
import Button from '../../../common/js/components-inc/Button';

import './../../css/components-pages/page-home-component.css';
import AlertStore from '../../../common/js/stores/AlertStore';
import PageHeader from '../components-inc/PageHeader';
import LayoutBlock from '../../../common/js/components-inc/LayoutBlock';
import PagesGeneral from '../../../../../../builds/dev-generated/PagesGeneral';
import PageFooter from '../components-inc/PageFooter';
import Config from '../../../../../../builds/dev-generated/Config';

interface Props extends ContextPageComponentProps {
    walletStore: WalletStore,
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
            <div style={{ 'flex': '1 1 auto' }} className={'FlexColumn'} >
                <PageHeader
                    connected={walletStore.keplrWallet.connected}
                    address={walletStore.keplrWallet.accountAddress}
                    onClickToggleWallet={walletStore.onClickToggleKeplr}
                />
                <div className={'MainContent FlexRow'}>
                    <LayoutBlock className={'Left'} direction={LayoutBlock.DIRECTION_COLUMN}>
                        <h1>Start Minting NFTs On CUDOS Network</h1>
                        <span>CUDOS NFT Minet is the world&apos;s simplest NFT creation service on CUDOS Network. Try it out yourself</span>
                        <Button
                            onClick={() => window.location.href = PagesGeneral.INNER}
                            className={'StartMinting'}
                            type={Button.TYPE_ROUNDED}
                            color={Button.COLOR_SCHEME_1}
                        >
                            Start Minting
                        </Button>
                    </LayoutBlock>
                    <div className={'MainImages'}>
                        <img src={`${Config.URL.RESOURCES}/common/img/home-page/blue-bubble.png`} />
                        <img src={`${Config.URL.RESOURCES}/common/img/home-page/turq-bubble.png`} />
                        <img src={`${Config.URL.RESOURCES}/common/img/home-page/orange-bubble.png`} />
                    </div>
                </div>
                <PageFooter />
            </div>
        )
    }
}

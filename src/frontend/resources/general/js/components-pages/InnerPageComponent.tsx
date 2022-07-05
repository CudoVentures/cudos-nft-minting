/* global TR */

import React, { RefObject } from 'react';
import { inject, observer } from 'mobx-react';

import WalletStore from '../../../common/js/stores/WalletStore';
import NftStore from '../../../common/js/stores/NftStore';

import PageComponent from '../../../common/js/components-pages/PageComponent';
import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';
import Actions from '../../../common/js/components-inc/Actions';
import Button from '../../../common/js/components-inc/Button';

import './../../css/components-pages/page-inner-component.css';
import AlertStore from '../../../common/js/stores/AlertStore';
import UploaderComponent from '../../../common/js/components-core/UploaderComponent';
import PageHeader from '../components-inc/PageHeader';
import PageFooter from '../components-inc/PageFooter';
import SideMenu, { MENU_ITEMS } from '../components-inc/SideMenu';
import NavStore from '../../../common/js/stores/NavStore';
import MintWindow, { MintStage } from '../components-inc/MintWindow/MintWindow';
import MintStepNav from '../components-inc/MintWindow/MintStepNav';
import MyNftsWindow from '../components-inc/MyNftsWindow';
import MeshBackground from '../../../common/js/components-inc/MeshBackground';

interface Props extends ContextPageComponentProps {
    walletStore: WalletStore,
    nftStore: NftStore,
    alertStore: AlertStore,
    navStore: NavStore,
}

export default class InnerPageComponent extends ContextPageComponent<Props> {

    static layout() {
        const MobXComponent = inject('appStore', 'walletStore', 'nftStore', 'alertStore', 'navStore')(observer(InnerPageComponent));
        PageComponent.layout(<MobXComponent />);
    }

    constructor(props: Props) {
        super(props);
    }

    async componentDidMount(): Promise<void> {
        super.componentDidMount();

        this.props.navStore.mintStep = MintStepNav.MINT_STEP.CHOOSE_OPTION;
        this.props.navStore.innerPage = SideMenu.INNER_PAGE.MY_NFTS;
        // try {
        //     await this.props.nftStore.init();
        // } catch (e) {
        //     this.props.alertStore.show('Failed to connect to node.');
        // }
    }

    getPageLayoutComponentCssClassName() {
        return 'PageInner';
    }

    renderContent() {
        return (
            <>
                <MeshBackground />
                <div className = { 'PageContent' } >
                    <div style={{ 'flex': '1 1 auto' }} className={'InnerPageComponent'}>
                        <PageHeader />
                        <div className={'MainContent FlexRow'}>
                            <SideMenu />
                            <div className={'MainContentWindow'}>
                                <h2>{this.props.navStore.innerPage === SideMenu.INNER_PAGE.MY_NFTS ? 'My NFTs' : 'Mint NFTs'}</h2>
                                <div className={'WhiteBox'}>
                                    {this.props.navStore.innerPage === SideMenu.INNER_PAGE.MY_NFTS
                                && <MyNftsWindow />}
                                    {this.props.navStore.innerPage === SideMenu.INNER_PAGE.MINT
                                && <MintWindow />}
                                </div>
                            </div>
                        </div>
                        <PageFooter />
                    </div>
                </div>
            </>
        )
    }
}

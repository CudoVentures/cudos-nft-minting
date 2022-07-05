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
import S from '../../../common/js/utilities/Main';

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
        const navStore = this.props.navStore;
        return (
            <>
                <MeshBackground />
                <div className = { 'PageContent' } >
                    <PageHeader />
                    <div className = { 'NftContentRow' } >
                        <SideMenu />
                        <div className = { 'NftContentColumn' } >
                            <h2>{navStore.getInnerPageName()}</h2>
                            <div className = { 'NftPanels' } >
                                <div className = { `NftPanel ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(navStore.isMintPage())}` } >
                                    {navStore.isMintPage() === true && <MyNftsWindow />}
                                </div>
                                <div className = { `NftPanel ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(navStore.isMyNftPage())}` } >
                                    {navStore.isMyNftPage() === true && <MintWindow />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <PageFooter />
                </div>
            </>
        )
    }
}

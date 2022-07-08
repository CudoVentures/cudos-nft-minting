import React from 'react';
import { inject, observer } from 'mobx-react';

import S from '../../../common/js/utilities/Main';
import NftMintStore from '../../../common/js/stores/NftMintStore';
import AlertStore from '../../../common/js/stores/AlertStore';
import NavStore from '../../../common/js/stores/NavStore';

import PageComponent from '../../../common/js/components-pages/PageComponent';
import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';
import PageHeader from '../components-inc/PageHeader';
import PageFooter from '../components-inc/PageFooter';
import SideMenu from '../components-inc/SideMenu';
import MintWindow from '../components-inc/MintWindow/MintWindow';
import MyNftsWindow from '../components-inc/MyNftsWindow/MyNftsWindow';
import MeshBackground from '../../../common/js/components-inc/MeshBackground';
import LoadingIndicator from '../../../common/js/components-core/LoadingIndicator';

import './../../css/components-pages/page-nft-component.css';

interface Props extends ContextPageComponentProps {
    nftMintStore: NftMintStore,
    alertStore: AlertStore,
    navStore: NavStore,
}

export default class NftPageComponent extends ContextPageComponent<Props> {

    static layout() {
        const MobXComponent = inject('appStore', 'alertStore', 'walletStore', 'nftMintStore', 'navStore')(observer(NftPageComponent));
        PageComponent.layout(<MobXComponent />);
    }

    constructor(props: Props) {
        super(props);
    }

    async componentDidMount(): Promise<void> {
        super.componentDidMount();

        try {
            await this.props.nftMintStore.init();
        } catch (e) {
            this.props.alertStore.show('Failed to connect to node.');
        }
    }

    getPageLayoutComponentCssClassName() {
        return 'PageNft';
    }

    isKeplrRequired() {
        return true;
    }

    renderContent() {
        const { navStore, walletStore } = this.props;

        if (walletStore.isKeplrConnected() === false) {
            return <LoadingIndicator margin = { 'auto' } />
        }

        return (
            <>
                <MeshBackground />
                <div className={'PageContent'} >
                    <PageHeader />
                    <div className={'NftContentRow'} >
                        <SideMenu />
                        <div className={'NftContentColumn'} >
                            <div className={'NftPanels FlexColumn'} >
                                <div className={'Heading2'}>{navStore.getNftPageName()}</div>

                                <div className={`NftPanel FlexColumn ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(navStore.isMyNftPage())}`} >
                                    {navStore.isMyNftPage() === true && <MyNftsWindow />}
                                </div>
                                <div className={`NftPanel FlexColumn ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(navStore.isMintPage())}`} >
                                    {navStore.isMintPage() === true && <MintWindow />}
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

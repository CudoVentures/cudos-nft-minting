import React from 'react';
import { inject, observer } from 'mobx-react';

import S from '../../../common/js/utilities/Main';
import WalletStore from '../../../common/js/stores/WalletStore';
import NftStore from '../../../common/js/stores/NftStore';
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

import './../../css/components-pages/page-nft-component.css';

interface Props extends ContextPageComponentProps {
    walletStore: WalletStore,
    nftStore: NftStore,
    alertStore: AlertStore,
    navStore: NavStore,
}

export default class NftPageComponent extends ContextPageComponent<Props> {

    static layout() {
        const MobXComponent = inject('appStore', 'walletStore', 'nftStore', 'alertStore', 'navStore')(observer(NftPageComponent));
        PageComponent.layout(<MobXComponent />);
    }

    constructor(props: Props) {
        super(props);
    }

    async componentDidMount(): Promise<void> {
        super.componentDidMount();

        // try {
        //     await this.props.nftStore.init();
        // } catch (e) {
        //     this.props.alertStore.show('Failed to connect to node.');
        // }
    }

    getPageLayoutComponentCssClassName() {
        return 'PageNft';
    }

    renderContent() {
        const navStore = this.props.navStore;
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

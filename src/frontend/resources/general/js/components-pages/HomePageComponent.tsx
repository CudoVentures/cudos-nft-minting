/* global TR */

import React from 'react';
import { inject, observer } from 'mobx-react';

import ProjectUtils from '../../../common/js/ProjectUtils';
import PagesGeneral from '../../../../../../builds/dev-generated/PagesGeneral';
import Config from '../../../../../../builds/dev-generated/Config';
import AlertStore from '../../../common/js/stores/AlertStore';
import PopupConnectWalletsStore from '../../../common/js/stores/PopupConnectWalletsStore';

import PageComponent from '../../../common/js/components-pages/PageComponent';
import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';
import Actions from '../../../common/js/components-inc/Actions';
import Button from '../../../common/js/components-inc/Button';
import MeshBackground from '../../../common/js/components-inc/MeshBackground';
import PageHeader from '../components-inc/PageHeader';
import PageFooter from '../components-inc/PageFooter';

import ConnectWalletsPopup from '../../js/components-popups/ConnectWalletsPopup';

import './../../css/components-pages/page-home-component.css';

interface Props extends ContextPageComponentProps {
    alertStore: AlertStore,
    popupConnectWalletsStore: PopupConnectWalletsStore,
}

export default class PageHomeComponent extends ContextPageComponent<Props> {

    static layout() {
        const MobXComponent = inject('appStore', 'alertStore', 'walletStore', 'popupConnectWalletsStore')(observer(PageHomeComponent));
        PageComponent.layout(<MobXComponent />);
    }

    getPageLayoutComponentCssClassName() {
        return 'PageHome';
    }

    onClickStartMintingWithoutWallet = () => {
        this.props.popupConnectWalletsStore.showSignal(() => {
            ProjectUtils.redirectToUrl(PagesGeneral.NFT);
        });
    }

    renderContent() {
        const walletStore = this.props.walletStore;

        return (
            <>
                <MeshBackground />
                <div className={'PageContent'} >
                    <PageHeader />
                    <div className={'HomeContent'} >
                        <div className={'IntroCnt'} >
                            <div className={'IntroBlockTitle'}>Start Minting NFTs On CUDOS Network</div>
                            <div className={'IntroBlockDesc'}>CUDOS NFT Minet is the world&apos;s simplest NFT creation service on CUDOS Network. Try it out yourself</div>
                            <Actions height={Actions.HEIGHT_60} layout={Actions.LAYOUT_ROW_LEFT} >
                                <Button
                                    className={'ButtonStartMinting'}
                                    href={walletStore.isKeplrConnected() === true ? PagesGeneral.NFT : undefined}
                                    onClick={walletStore.isKeplrConnected() === true ? undefined : this.onClickStartMintingWithoutWallet}
                                    type={Button.TYPE_ROUNDED}
                                    padding={Button.PADDING_48}
                                    radius={Button.RADIUS_MAX} >
                                    Start Minting
                                </Button>
                            </Actions>
                        </div>
                        <div className={'BubblesCnt'} >
                            <div className={'BubblesWrapper'} >
                                <img src={`${Config.URL.RESOURCES}/common/img/home-page/blue-bubble.png`} />
                                <img src={`${Config.URL.RESOURCES}/common/img/home-page/turq-bubble.png`} />
                                <img src={`${Config.URL.RESOURCES}/common/img/home-page/orange-bubble.png`} />
                            </div>
                        </div>
                    </div>
                    <PageFooter />
                </div>
            </>
        )
    }

    renderPopups(): any[] {
        return super.renderPopups().concat([
            <ConnectWalletsPopup key={1} />,
        ])
    }
}

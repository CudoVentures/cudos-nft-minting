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
import NftImageModel from '../../../common/js/models/NftImageModel';
import NftModel from '../../../common/js/models/NftModel';
import UploaderComponent from '../../../common/js/components-core/UploaderComponent';
import CGeneralContext from '../CGeneralContext';
import NftImageUploadRes from '../../../common/js/network-responses/NftImageUploadRes';
import SvgAttachment from '../../../common/svg/upload.svg';
import PageHeader from '../components-inc/PageHeader';
import PageFooter from '../components-inc/PageFooter';
import SideMenu, { InnerPage } from '../components-inc/SideMenu';
import NavStore, { MENU_ITEMS } from '../../../common/js/stores/NavStore';
import MintWindow, { MintStage } from '../components-inc/MintWindow/MintWindow';
import MintPageChooseOption from '../components-inc/MintWindow/MintPageChooseOption';
import MintPageUploadFiles from '../components-inc/MintWindow/MintPageUploadFiles';
import MintPageNftDetails from '../components-inc/MintWindow/MintPageNftDetails';
import MintPageFinish from '../components-inc/MintWindow/MintPageFinish';

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

    iNodes: {
        'uploader': RefObject<UploaderComponent>,
    };

    constructor(props: Props) {
        super(props);

        this.iNodes = {
            'uploader': React.createRef(),
        };

    }

    async componentDidMount(): Promise<void> {
        // super.componentDidMount();
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
        const walletStore = this.props.walletStore;
        return (
            <div style={{ 'flex': '1 1 auto' }} className={'FlexSingleCenter'} >
                <PageHeader
                    connected={this.props.walletStore.keplrWallet.connected}
                    address={this.props.walletStore.keplrWallet.accountAddress}
                    onClickToggleWallet={this.props.walletStore.onClickToggleKeplr}
                />
                <div className={'MainContent'}>
                    <SideMenu
                        selectedItem={this.props.navStore.selectedInnerPage}
                        menuItems={MENU_ITEMS}
                        onClickMenuItem={this.props.navStore.onSelectInnerPage}
                    />
                    <MintWindow
                        selectedMintOption={this.props.navStore.selectedMintOption}
                        stage={this.props.navStore.mintStage}
                        images={this.props.nftStore.nftImages}
                        selectedImages={this.props.nftStore.selectedImages}
                    />
                </div>
                {/* <Actions>
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
                <div className={'UploadCnt FlexColumn'} onDrop={this.onDrop} >
                    <div className={'UploadTitle FlexRow'} >
                        <div className={'SVG IconAttachment'} dangerouslySetInnerHTML={{ __html: SvgAttachment }} />
                        Drop your file here or&nbsp;<span>click here to add</span>
                    </div>
                    <div className={'UploadDesc'} > Upload anything you want. There is no limit. </div>
                    <UploaderComponent
                        ref={this.iNodes.uploader}
                        id={this.props.nftStore.nftForm}
                        params={this.makeImageUploadParams()} />
                </div>
                <div>
                    {this.props.nftStore.nfts.map((nft) => <div key={nft.tokenId}>{nft.name}</div>)}
                </div>
                { walletStore.isKeplrConnected() === true && walletStore.keplrWallet.accountAddress } */}
                <PageFooter />
            </div>
        )
    }
}

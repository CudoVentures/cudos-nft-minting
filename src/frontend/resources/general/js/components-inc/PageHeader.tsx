import React from 'react';
import { inject, observer } from 'mobx-react';

import { WEBSITE } from '../../../common/js/utilities/Links';

import PagesGeneral from '../../../../../../builds/dev-generated/PagesGeneral';
import WalletStore from '../../../common/js/stores/WalletStore';
import PopupConnectWalletsStore from '../../../common/js/stores/PopupConnectWalletsStore';

import Actions from '../../../common/js/components-inc/Actions';
import Button from '../../../common/js/components-inc/Button';
import Popover from '../../../common/js/components-inc/Popover';

import SvgCudosLogoWithText from '../../../common/svg/cudos-logo-with-text.svg';
import SvgLinkBox from '../../../common/svg/link-box.svg';
import SvgPlanet from '../../../common/svg/planet.svg';
import SvgWallet from '../../../common/svg/wallet.svg';
import SvgMenuDots from '../../../common/svg/menu-dots.svg';
import SvgCopy from '../../../common/svg/copy.svg';
import SvgOpenUrl from '../../../common/svg/open-url.svg';
import SvgClose from '../../../common/svg/close.svg';
import './../../css/components-inc/page-header.css';
import ProjectUtils from '../../../common/js/ProjectUtils';
import S from '../../../common/js/utilities/Main';
import Config from '../../../../../../builds/dev-generated/Config';

interface Props {
    walletStore: WalletStore,
    popupConnectWalletsStore: PopupConnectWalletsStore,
}

interface State {
    walletMenuOpen: boolean,
}

class PageHeader extends React.Component < Props, State > {

    nodes: any;

    constructor(props: Props) {
        super(props);

        this.state = {
            walletMenuOpen: false,
        };

        this.nodes = {
            'walletMenuAnchor': React.createRef(),
        };
    }

    onClickOpenWalletMenu = () => {
        this.setState({
            'walletMenuOpen': true,
        })
    }

    onClickCloseWalletMenu = () => {
        this.setState({
            'walletMenuOpen': false,
        })
    }

    onClickCopeWalletAddress = () => {
        ProjectUtils.copyText(this.props.walletStore.keplrWallet.accountAddress);
    }

    onClickDisconnectKeplr = async () => {
        await this.props.walletStore.disconnectKeplr();
        ProjectUtils.redirectToUrl(PagesGeneral.HOME);
    }

    onClickConnectKeplr = () => {
        this.props.popupConnectWalletsStore.showSignal();
    }

    render() {
        const keplrWallet = this.props.walletStore.keplrWallet;

        return (
            <header className={'PageHeader FlexRow FlexSplit'}>
                <a href = { PagesGeneral.HOME } className={'HeaderLogo FlexRow'}>
                    <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgCudosLogoWithText }} />
                    <div className = { 'Slogan' }>NFT Mint</div>
                </a>
                <div className={'HeaderEnd FlexRow StartRight'}>
                    {keplrWallet.connected
                        ? <>
                            <div className={'InfoBlock FlexRow'}>
                                <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgPlanet }} />
                                <div>CUDOS Mainnet</div>
                            </div>
                            <div className={'InfoBlock FlexRow'}>
                                <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgWallet }} />
                                <div className = { 'WalletAddress Dots' } title = { keplrWallet.accountAddress }>{keplrWallet.accountAddress}</div>
                            </div>
                            <div ref = { this.nodes.walletMenuAnchor } className={`InfoBlock InfoBlockOptions FlexRow Clickable ${S.CSS.getActiveClassName(this.state.walletMenuOpen)}`} onClick = { this.onClickOpenWalletMenu }>
                                { this.state.walletMenuOpen === false && (
                                    <div className={'SVG Icon IconOptions'} dangerouslySetInnerHTML={{ __html: SvgMenuDots }} />
                                ) }
                                { this.state.walletMenuOpen === true && (
                                    <div className={'SVG Icon IconOptions'} dangerouslySetInnerHTML={{ __html: SvgClose }} />
                                ) }
                            </div>
                            <Popover
                                anchorEl = { this.nodes.walletMenuAnchor.current }
                                open = { this.state.walletMenuOpen }
                                onClose = { this.onClickCloseWalletMenu }
                                classes = { {
                                    'paper': 'PopoverWalletMenu',
                                } } >

                                <>
                                    <div className={'SVG IconWallet'} dangerouslySetInnerHTML={{ __html: SvgWallet }} />
                                    <div className = { 'WalletAddress Dots' } > { keplrWallet.accountAddress } </div>
                                    <div className = { 'WalletActions' } >
                                        <div className={'SVG IconAction'} dangerouslySetInnerHTML={{ __html: SvgCopy }} onClick = { this.onClickCopeWalletAddress } />
                                        <a
                                            href = { `${Config.CUDOS_NETWORK.EXPLORER}/accounts/${keplrWallet.accountAddress}` }
                                            target = '_blank'
                                            rel = 'noreferrer'
                                            className={'SVG IconAction'} dangerouslySetInnerHTML={{ __html: SvgOpenUrl }} />
                                    </div>
                                    <Actions height = { Actions.HEIGHT_52 } layout = { Actions.LAYOUT_COLUMN_FULL } >
                                        <Button
                                            onClick = { this.onClickDisconnectKeplr }
                                            type = { Button.TYPE_ROUNDED }
                                            color = { Button.COLOR_SCHEME_1 }
                                            radius = { Button.RADIUS_MAX } >
                                            Disconnect
                                        </Button>
                                    </Actions>
                                </>

                            </Popover>
                        </>
                        : <>
                            {/* <a href={ WEBSITE } className={'NetworkLink FlexRow'} target="_blank" rel="noreferrer">
                                Check <span className = { 'Link' }>cudos.org</span>
                                <div className={'SVG IconOpenUrl'} dangerouslySetInnerHTML={{ __html: SvgLinkBox }} />
                            </a> */}
                            <Actions height = { Actions.HEIGHT_60 }>
                                <Button
                                    onClick = { this.onClickConnectKeplr }
                                    type = { Button.TYPE_ROUNDED }
                                    color = { Button.COLOR_SCHEME_1 }
                                    padding = { Button.PADDING_48 }
                                    radius = { Button.RADIUS_MAX } >
                                    Connect Wallet
                                </Button>
                            </Actions>
                        </>
                    }
                </div>
            </header>
        )
    }
}

export default inject('walletStore', 'popupConnectWalletsStore')(observer(PageHeader));

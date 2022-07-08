import React from 'react';
import { inject, observer } from 'mobx-react';

import { WEBSITE } from '../../../common/js/utilities/Links';

import WalletStore from '../../../common/js/stores/WalletStore';
import PopupConnectWalletsStore from '../../../common/js/stores/PopupConnectWalletsStore';

import Actions from '../../../common/js/components-inc/Actions';
import Button from '../../../common/js/components-inc/Button';

import SvgCudosLogoWithText from '../../../common/svg/cudos-logo-with-text.svg';
import SvgLinkBox from '../../../common/svg/link-box.svg';
import SvgPlanet from '../../../common/svg/planet.svg';
import SvgWallet from '../../../common/svg/wallet.svg';
import SvgMenuDots from '../../../common/svg/menu-dots.svg';
import './../../css/components-inc/page-header.css';
import PagesGeneral from '../../../../../../builds/dev-generated/PagesGeneral';

interface Props {
    walletStore: WalletStore,
    popupConnectWalletsStore: PopupConnectWalletsStore,
}

class PageHeader extends React.Component < Props > {

    onClickToggleKeplr = () => {
        this.props.popupConnectWalletsStore.showSignal();
    }

    render() {
        const keplrWallet = this.props.walletStore.keplrWallet;

        return (
            <header className={'PageHeader FlexRow FlexSplit'}>
                <a href = { PagesGeneral.HOME } className={'HeaderLogo FlexRow'}>
                    <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgCudosLogoWithText }}></div>
                    <div className = { 'Slogan' }>NFT Mint</div>
                </a>
                <div className={'HeaderEnd FlexRow StartRight'}>
                    {keplrWallet.connected
                        ? <>
                            <div className={'InfoBlock FlexRow'}>
                                <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgPlanet }}></div>
                                <div>CUDOS Mainnet</div>
                            </div>
                            <div className={'InfoBlock FlexRow'}>
                                <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgWallet }}></div>
                                <div className = { 'WalletAddress Dots' } title = { keplrWallet.accountAddress }>{keplrWallet.accountAddress}</div>
                            </div>
                            <div className={'InfoBlock FlexRow'}>
                                <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgMenuDots }}></div>
                            </div>
                        </>
                        : <>
                            {/* <a href={ WEBSITE } className={'NetworkLink FlexRow'} target="_blank" rel="noreferrer">
                                Check <span className = { 'Link' }>cudos.org</span>
                                <div className={'SVG IconOpenUrl'} dangerouslySetInnerHTML={{ __html: SvgLinkBox }}></div>
                            </a> */}
                            <Actions height = { Actions.HEIGHT_60 }>
                                <Button
                                    onClick = { this.onClickToggleKeplr }
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

import React from 'react';
import { inject, observer } from 'mobx-react';

import { WEBSITE } from '../../../common/js/utilities/Links';

import WalletStore from '../../../common/js/stores/WalletStore';
import Button from '../../../common/js/components-inc/Button';

import SvgCudosLogoWithText from '../../../common/svg/cudos-logo-with-text.svg';
import SvgLinkBox from '../../../common/svg/link-box.svg';
import SvgPlanet from '../../../common/svg/planet.svg';
import SvgWallet from '../../../common/svg/wallet.svg';
import SvgMenuDots from '../../../common/svg/menu-dots.svg';
import './../../css/components-inc/page-header.css';

interface Props {
    walletStore: WalletStore;
}

interface State {
}

class PageHeader extends React.Component < Props, State > {

    onClickToggleKeplr = () => {
        this.props.walletStore.onClickToggleKeplr();
    }

    render() {
        const keplrWallet = this.props.walletStore.keplrWallet;

        return (
            <header className={'PageHeader FlexRow FlexSplit'}>
                <div className={'HeaderLogo FlexRow'}>
                    <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgCudosLogoWithText }}></div>
                    <div className = { 'Slogan' }>NFT Mint</div>
                </div>
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
                            <a href={ WEBSITE } className={'NetworkLink FlexRow'} target="_blank" rel="noreferrer">
                                Check <span className = { 'Link' }>cudos.org</span>
                                <div className={'SVG IconOpenUrl'} dangerouslySetInnerHTML={{ __html: SvgLinkBox }}></div>
                            </a>
                            <Button
                                onClick = { this.onClickToggleKeplr }
                                type = { Button.TYPE_ROUNDED_LARGE }
                                color = { Button.COLOR_SCHEME_1 } >
                                Connect Wallet
                            </Button>
                        </>
                    }
                </div>
            </header>
        )
    }
}

export default inject('walletStore')(observer(PageHeader));

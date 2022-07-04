import React from 'react';
import Button from '../../../common/js/components-inc/Button';
import { WEBSITE } from '../../../common/js/utilities/Links';
import SvgCudosLogo from '../../../common/svg/cudos-logo.svg';
import SvgLinkBox from '../../../common/svg/link-box.svg';
import SvgPlanet from '../../../common/svg/planet.svg';
import SvgWallet from '../../../common/svg/wallet.svg';
import SvgMenuDots from '../../../common/svg/menu-dots.svg';

interface Props {
    connected: boolean;
    address: string;
    onClickToggleWallet: () => Promise<void>;
}

interface State {
}

export default class PageHeader extends React.Component < Props, State > {

    render() {
        return (
            <div className={' Header FlexRow FlexSplit'}>
                <div className={' HeaderLogo FlexRow'}>
                    <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgCudosLogo }}></div>
                    { !this.props.connected
                        && <span>CUDOS</span>
                    }
                    <div className={' SeparatorVLine '}></div>
                    <span className={' Bold '}>NFT Mint</span>
                </div>
                <div className={' HeaderEnd FlexRow StartRight'}>
                    {this.props.connected
                        ? <>
                            <div className={' Rounded LightGray HeaderNetwork '}>
                                <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgPlanet }}></div>
                                <span className={' Bold '}>CUDOS Mainnet</span>
                            </div>
                            <div className={' Rounded LightGray HeaderAddress '}>
                                <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgWallet }}></div>
                                <span className={' Bold '}>{this.props.address}</span>
                            </div>
                            <div className={' Rounded LightGray HeaderOptions '}>
                                <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgMenuDots }}></div>
                            </div>
                        </>
                        : <>
                            <a href={ WEBSITE } className={' NetworkLink '}>
                                <span className={' Bold '}>
                                    {'check '}
                                </span>
                                <span className={' Link '}>
                                    cudos.org
                                </span>
                                <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgLinkBox }}></div>
                            </a>
                            <Button
                                onClick={this.props.onClickToggleWallet}
                                className={' ConnectWallet '}
                                type = { Button.TYPE_ROUNDED }
                                color = { Button.COLOR_SCHEME_1 }
                            >
                                Connect Wallet
                            </Button>
                        </>
                    }
                </div>
            </div>
        )
    }
}

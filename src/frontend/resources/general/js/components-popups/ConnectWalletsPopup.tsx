import React from 'react';
import { inject, observer } from 'mobx-react';

import Config from '../../../../../../builds/dev-generated/Config';
import S from '../../../common/js/utilities/Main';
import PopupConnectWalletsStore from '../../../common/js/stores/PopupConnectWalletsStore';
import WalletStore from '../../../common/js/stores/WalletStore';

import PopupWindow, { PopupWindowProps } from '../../../common/js/components-core/PopupWindow';

import SvgLoadingWaves from '../../../common/svg/loading-waves.svg';
import SvgFinishedWaves from '../../../common/svg/finished-waves.svg';
import SvgWallet from '../../../common/svg/wallet.svg';
import SvgLighting from '../../../common/svg/lighting.svg';
import '../../css/components-popups/connect-wallets-popup.css';

interface Props extends PopupWindowProps {
    walletStore: WalletStore;
    popupStore: PopupConnectWalletsStore;
}

class ConnectWalletsPopup extends PopupWindow < Props > {

    getCssClassName() {
        return 'ConnectWalletsPopup PopupPadding PopupBox';
    }

    hasClose(): boolean {
        return this.props.popupStore.isWalletStatusUnavailable();
    }

    onClickToggleKeplr = async () => {
        const popupStore = this.props.popupStore;
        popupStore.markWalletStatusAsConnecting();

        await this.props.walletStore.onClickToggleKeplr();
        popupStore.markWalletStatusAsConnected();
        popupStore.startClosingTimer();
    }

    renderContent() {
        return (
            <div className = { 'PopupWindowContent' }>
                <div className = { 'ConnectWalletLighting FlexRow' } >
                    <div className = { 'SVG IconLighting' } dangerouslySetInnerHTML = {{ __html: SvgLighting }} />
                    Connect Wallet
                </div>

                { this.renderWalletStatusUnavailable() }
                { this.renderWalletStatusConnecting() }
                { this.renderWalletStatusConnected() }
            </div>
        )
    }

    renderWalletStatusUnavailable() {
        const popupStore = this.props.popupStore;
        if (popupStore.isWalletStatusUnavailable() !== true) {
            return null;
        }

        return (
            <div className = { 'StatusUnavailable' }>
                <div className = { 'Label' } >
                    <span>Connect</span> Your Wallet
                </div>

                <div className = { 'SubLabel' } >
                    Select your prefered wallet to connect with.
                </div>

                <div className = { 'WalletOptions' } >
                    <div className = { 'ConnectButton FlexRow Transition' } onClick = { this.onClickToggleKeplr } >
                        <img className = { 'WalletIcon' } src={`${Config.URL.RESOURCES}/common/img/home-page/keplr-wallet.png`} />
                        Connect to Keplr
                    </div>
                </div>

                <div className = { 'Footer' } >
                    <div>New to CUDOS?</div>
                    <a href = { '' }>Learn more about wallets</a>
                </div>
            </div>
        );
    }

    renderWalletStatusConnecting() {
        const popupStore = this.props.popupStore;
        if (popupStore.isWalletStatusConnecting() !== true) {
            return null;
        }

        return (
            <div className = { 'StatusConnecting' } >
                <div className = { 'SVG IconWaves' } dangerouslySetInnerHTML = {{ __html: SvgLoadingWaves }} />
                { this.renderWalletAddress() }
                <div className = { 'StatusLabel' } >Connecting...</div>
                <div className = { 'ConnectingSubLabel' } >Please don’t close this window.<br />It will be ready in a second.</div>
            </div>
        );
    }

    renderWalletStatusConnected() {
        const popupStore = this.props.popupStore;
        if (popupStore.isWalletStatusConnected() !== true) {
            return null;
        }

        return (
            <div className = { 'StatusConnected' } >
                <div className = { 'SVG IconWaves' } dangerouslySetInnerHTML = {{ __html: SvgFinishedWaves }} />
                { this.renderWalletAddress() }
                <div className = { 'StatusLabel' } >Wallet Connected!</div>
                <div className = { 'ConnectingTimer' } >This windows will close in <span>{popupStore.closeInSeconds}</span></div>
            </div>
        );
    }

    renderWalletAddress() {
        const walletStore = this.props.walletStore;
        const popupStore = this.props.popupStore;
        const walletAddress = walletStore.keplrWallet.accountAddress;

        return (
            <div className = { `WalletAddress FlexRow ActiveVisibilityHidden ${S.CSS.getActiveClassName(popupStore.isWalletStatusConnected())}` } >
                <div className = { 'SVG WalletIcon' } dangerouslySetInnerHTML = {{ __html: SvgWallet }} />
                <div className = { 'Dots' }>{ walletAddress }</div>
            </div>
        )
    }

}

export default inject((stores) => {
    return {
        walletStore: stores.walletStore,
        popupStore: stores.popupConnectWalletsStore,
    }
})(observer(ConnectWalletsPopup));

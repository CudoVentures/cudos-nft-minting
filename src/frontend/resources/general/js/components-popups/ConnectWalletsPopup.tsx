import React from 'react';
import { inject, observer } from 'mobx-react';

import Config from '../../../../../../builds/dev-generated/Config';
import S from '../../../common/js/utilities/Main';
import PopupConnectWalletsStore from '../../../common/js/stores/PopupConnectWalletsStore';
import WalletStore from '../../../common/js/stores/WalletStore';

import PopupWindow, { PopupWindowProps } from '../../../common/js/components-core/PopupWindow';

import SvgLoadingWaves from '../../../common/svg/loading-waves.svg';
import SvgFinishedWaves from '../../../common/svg/finished-waves.svg';
import SvgSuccessfulWaves from '../../../common/svg/unsuccessful-waves.svg';
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
        return this.props.popupStore.isWalletStatusUnavailable() || this.props.popupStore.isWalletStatusConnectedWithError();
    }

    isRemovable(): boolean {
        return false;
    }

    onClickToggleKeplr = async () => {
        const popupStore = this.props.popupStore;
        const walletStore = this.props.walletStore;

        try {
            popupStore.markWalletStatusAsConnecting();
            await walletStore.onClickToggleKeplr();

            if (walletStore.isKeplrConnected() === true) {
                popupStore.markWalletStatusAsConnectedSuccessfully();
                popupStore.startClosingTimer(() => {
                    if (popupStore.onSave !== null) {
                        popupStore.onSave();
                    }
                    popupStore.hide();
                });
            }
        } catch (e) {
        }

        if (walletStore.isKeplrConnected() === false) {
            popupStore.markWalletStatusAsConnectedWithError();
        }
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
                { this.renderWalletStatusConnectedSuccessfully() }
                { this.renderWalletStatusConnectedWithError() }
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
            <div className = { 'WalletConnection StatusConnecting' } >
                <div className = { 'SVG IconWaves' } dangerouslySetInnerHTML = {{ __html: SvgLoadingWaves }} />
                { this.renderWalletAddress() }
                <div className = { 'WalletConnectionStatus' } >Connecting...</div>
                <div className = { 'WalletConnectionInfo' } >Please don’t close this window.<br />It will be ready in a second.</div>
            </div>
        );
    }

    renderWalletStatusConnectedSuccessfully() {
        const popupStore = this.props.popupStore;
        if (popupStore.isWalletStatusConnectedSuccessfully() !== true) {
            return null;
        }

        return (
            <div className = { 'WalletConnection StatusConnectedSuccessfully' } >
                <div className = { 'SVG IconWaves' } dangerouslySetInnerHTML = {{ __html: SvgFinishedWaves }} />
                { this.renderWalletAddress() }
                <div className = { 'WalletConnectionStatus' } >Wallet Connected!</div>
                <div className = { 'ConnectingTimer' } >This windows will close in <span>{popupStore.closeInSeconds}</span></div>
            </div>
        );
    }

    renderWalletStatusConnectedWithError() {
        const popupStore = this.props.popupStore;
        if (popupStore.isWalletStatusConnectedWithError() !== true) {
            return null;
        }

        return (
            <div className = { 'WalletConnection StatusConnectedWithError' } >
                <div className = { 'SVG IconWaves' } dangerouslySetInnerHTML = {{ __html: SvgSuccessfulWaves }} />
                { this.renderWalletAddress() }
                <div className = { 'WalletConnectionStatus' } >Wallet Not connected!</div>
                <div className = { 'WalletConnectionInfo' } >Please, check your Keplr installation</div>
            </div>
        );
    }

    renderWalletAddress() {
        const walletStore = this.props.walletStore;
        const popupStore = this.props.popupStore;
        const walletAddress = walletStore.keplrWallet.accountAddress;

        return (
            <div className = { `WalletAddress FlexRow ActiveVisibilityHidden ${S.CSS.getActiveClassName(popupStore.isWalletStatusConnectedSuccessfully())}` } >
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

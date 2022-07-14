import React from 'react';
import { inject, observer } from 'mobx-react';

import S from '../../../../common/js/utilities/Main';
import ProjectUtils from '../../../../common/js/ProjectUtils';
import NftModel from '../../../../common/js/models/NftModel';
import NavStore from '../../../../common/js/stores/NavStore';
import NftMintStore from '../../../../common/js/stores/NftMintStore';

import Checkbox from '../../../../common/js/components-inc/Checkbox';
import Input, { InputMargin, InputType } from '../../../../common/js/components-inc/Input';
import LayoutBlock from '../../../../common/js/components-inc/LayoutBlock';
import NftSidePreview from '../NftSidePreview';
import Popover from '../../../../common/js/components-inc/Popover';
import NftStepWrapper from './NftStepWrapper';

import SvgInfo from '../../../../common/svg/info.svg';
import '../../../css/components-inc/NftMint/nft-details.css';
import InputStateHelper from '../../../../common/js/helpers/InputStateHelper';
import AppStore from '../../../../common/js/stores/AppStore';
import WalletStore from '../../../../common/js/stores/WalletStore';

interface Props {
    appStore: AppStore;
    nftMintStore: NftMintStore;
    navStore: NavStore;
    walletStore: WalletStore;
}

interface State {
    anchorEl: any;
    recipientFieldActive: number;
}

class NftDetails extends React.Component < Props, State > {

    constructor(props) {
        super(props);

        this.state = {
            'anchorEl': null,
            'recipientFieldActive': S.INT_FALSE,
        }
    }

    onChangeNftName = (nftModel: NftModel, value) => {
        nftModel.name = value;
    }

    onChangeNftRecipient = (nftModel: NftModel, value) => {
        nftModel.recipient = value;
    }

    onShowGiftInfo = (e) => {
        this.setState({
            'anchorEl': e.target,
        });
    }

    onHideGiftInfo = () => {
        this.setState({
            'anchorEl': null,
        })
    }

    onToggleRecipient = () => {
        const nftMintStore = this.props.nftMintStore;
        const nftModel = nftMintStore.nfts[0];

        if (this.state.recipientFieldActive === S.INT_TRUE) {
            nftModel.setRecipient(this.props.walletStore.keplrWallet.accountAddress);
            this.setState({
                recipientFieldActive: S.INT_FALSE,
            });
        } else {
            nftModel.setRecipient(S.Strings.EMPTY);
            this.setState({
                recipientFieldActive: S.INT_TRUE,
            });
        }
    }

    render() {
        return (
            <div className={'NftDetails'}>
                { this.renderSingleNftDetails() }
                { this.renderMultipleNftDetails() }
            </div>
        )
    }

    renderSingleNftDetails() {
        const { appStore, navStore } = this.props;
        if (navStore.isMintOptionSingle() !== true) {
            return null;
        }

        const nftMintStore = this.props.nftMintStore;
        const nftModel = nftMintStore.nfts[0];

        return (
            <NftStepWrapper
                className = { 'NftDetails' }
                stepNumber = { `Step ${navStore.getMintStepShowNumber()}` }
                stepName = { 'NFT Details' } >
                <div className={'FlexRow DetailsHolder'}>
                    <NftSidePreview
                        imageUrl={nftModel.getPreviewUrl(appStore.workerQueueHelper)}
                        name={nftModel.name} />
                    <LayoutBlock direction={LayoutBlock.DIRECTION_COLUMN} className={'NftDetailsForm'}>
                        <Input
                            className={'NftName'}
                            label={'Nft Name'}
                            placeholder={'E.g. Cool NFT'}
                            value = { nftModel.name }
                            onChange = { this.onChangeNftName.bind(this, nftModel) } />
                        <div className={'FlexRow'}>
                            <Checkbox
                                value={this.state.recipientFieldActive}
                                onChange={this.onToggleRecipient}
                                label={'I want to send this NFT as a gift'} />
                            <div className={'SVG Icon Clickable'}
                                dangerouslySetInnerHTML={{ __html: SvgInfo }}
                                onClick={ this.onShowGiftInfo } />
                            <Popover
                                anchorEl = { this.state.anchorEl }
                                open = { this.state.anchorEl !== null }
                                onClose = { this.onHideGiftInfo }
                                transformOrigin = {{
                                    'vertical': 'top',
                                    'horizontal': 'left',
                                }} >
                                This options allows you to send the minted NFT as a gift to anyone. Just add their wallet address and the Minted NFT will be received to them.
                            </Popover>
                        </div>
                        { this.state.recipientFieldActive === S.INT_TRUE && (
                            <Input
                                className={'NftRecepient'}
                                label={'Recipient Address'}
                                placeholder={'cudos1...'}
                                value = { nftModel.recipient }
                                onChange = {this.onChangeNftRecipient.bind(this, nftModel) } />
                        ) }
                    </LayoutBlock>
                </div>
            </NftStepWrapper>
        )
    }

    renderMultipleNftDetails() {
        const { appStore, navStore } = this.props;
        if (navStore.isMintOptionMultiple() !== true) {
            return null;
        }

        const nfts: NftModel[] = this.props.nftMintStore.nfts;

        return (
            <div className={'CollectionModels'} >
                {nfts.map((nft: NftModel, i: number) => (
                    <div
                        key={i}
                        className={'NftModel'}>
                        <div className={'NftImg ImgCoverNode Transition'} style={ProjectUtils.makeBgImgStyle(nft.getPreviewUrl(appStore.workerQueueHelper))} />
                        <Input
                            className={'NameInput'}
                            inputType={InputType.TEXT}
                            placeholder={'Add name...'}
                            value={nft.name}
                            margin={InputMargin.DENSE}
                            onChange={this.onChangeNftName.bind(this, nft)} />
                    </div>))
                }
            </div>
        )
    }
}

export default inject('appStore', 'navStore', 'nftMintStore', 'walletStore')((observer(NftDetails)));

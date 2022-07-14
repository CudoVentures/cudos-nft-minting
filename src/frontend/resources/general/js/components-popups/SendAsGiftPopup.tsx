import React from 'react';
import { inject, observer } from 'mobx-react';

import Config from '../../../../../../builds/dev-generated/Config';
import S from '../../../common/js/utilities/Main';
import ProjectUtils from '../../../common/js/ProjectUtils';
import PopupSendAsGiftStore from '../../../common/js/stores/PopupSendAsGiftStore';
import AppStore from '../../../common/js/stores/AppStore';

import PopupWindow, { PopupWindowProps } from '../../../common/js/components-core/PopupWindow';
import LoadingIndicator from '../../../common/js/components-core/LoadingIndicator';
import Input from '../../../common/js/components-inc/Input';
import Actions from '../../../common/js/components-inc/Actions';
import Button from '../../../common/js/components-inc/Button';

import SvgLoadingWaves from '../../../common/svg/loading-waves.svg';
import SvgFinishedWaves from '../../../common/svg/finished-waves.svg';
import SvgSuccessfulWaves from '../../../common/svg/unsuccessful-waves.svg';
import SvgOpenUrl from '../../../common/svg/open-url.svg';
import '../../css/components-popups/send-as-gift-popup.css';

interface Props extends PopupWindowProps {
    appStore: AppStore;
    popupStore: PopupSendAsGiftStore;
}

class SendAsGiftPopup extends PopupWindow<Props> {

    getCssClassName() {
        return 'SendAsGiftPopup PopupPadding PopupBox';
    }

    hasClose() {
        const popupStore = this.props.popupStore;
        return popupStore.isStatusProcessing() === false;
    }

    isRemovable(): boolean {
        return false;
    }

    onChangeRecipientAddress = (value) => {
        this.props.popupStore.recipientAddress = value;
    }

    onClickSendNft = async () => {
        const popupStore = this.props.popupStore;
        if (popupStore.inputStateHelper.getValues() === null) {
            return;
        }

        this.props.appStore.disableActions();

        try {
            popupStore.markStatusProcessing();

            await this.props.popupStore.sendNft();

            popupStore.markStatusDoneSuccess()
        } finally {
            this.props.appStore.enableActions();
        }
    }

    onClickBack = () => {
        const popupStore = this.props.popupStore;
        popupStore.markStatusInit();
    }

    renderContent() {
        return (
            <div className={'PopupWindowContent'}>
                {this.renderStatusInit()}
                {this.renderStatusProcessing()}
                {this.renderStatusDoneSuccess()}
                {this.renderStatusDoneError()}
            </div>
        )
    }

    renderStatusInit() {
        const appStore = this.props.appStore;
        const popupStore = this.props.popupStore;
        const nftModel = popupStore.nftModel;
        const display = popupStore.isStatusInit();

        const inputStateHelper = popupStore.inputStateHelper;
        inputStateHelper.updateValues([
            popupStore.recipientAddress,
        ]);

        return (
            <div className={`StepInit FlexColumn Transition ActiveDisplayHidden ${S.CSS.getActiveClassName(display)}`} >
                {display && (
                    <>
                        <div className={'Title'} >Send NFT as a GIFT</div>
                        <div className={'SubTitle'} >Enter recepient address and they will receive it in their wallet.</div>
                        <div className={'NftPreviewCnt'} >
                            <div className={'NftPreview ImgCoverNode'} style={ProjectUtils.makeBgImgStyle(nftModel.getPreviewUrl(appStore.workerQueueHelper))} />
                            <div className={'NftData FlexColumn'} >
                                <div className={'NftDataRow'} >
                                    <label>NFT Name</label>
                                    <div>{nftModel.name}</div>
                                </div>
                                <div className={'NftDataRow'} >
                                    <label>Estimated gas fee</label>
                                    {popupStore.isGasFeeCalculated() === false && (
                                        <LoadingIndicator size={'16px'} margin={'auto'} />
                                    )}
                                    {popupStore.isGasFeeCalculated() === true && (
                                        <div>
                                            <span>{popupStore.gasFee} CUDOS</span>
                                            <span className={'PrimaryColor PriceInUsd'}> $0.24 </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Input
                            label={'Recipient Address'}
                            value={inputStateHelper.values.get(PopupSendAsGiftStore.FIELDS[0])}
                            error={inputStateHelper.errors.get(PopupSendAsGiftStore.FIELDS[0])}
                            onChange={inputStateHelper.onChanges.get(PopupSendAsGiftStore.FIELDS[0])} />
                        <Actions
                            className={'StepActions'}
                            height={Actions.HEIGHT_60} >
                            <Button
                                padding={Button.PADDING_96}
                                radius={Button.RADIUS_MAX}
                                onClick={this.onClickSendNft} >
                                Send GIFT
                            </Button>
                        </Actions>
                    </>
                )}
            </div>
        )
    }

    renderStatusProcessing() {
        const popupStore = this.props.popupStore;
        const display = popupStore.isStatusProcessing();

        return (
            <div className={`StepProcessing FlexColumn Transition ActiveDisplayHidden ${S.CSS.getActiveClassName(display)}`} >
                {display && (
                    <>
                        <div className={'SVG Size SvgIconBackground'} dangerouslySetInnerHTML={{ __html: SvgLoadingWaves }} />
                        <div className={'Title'} >Processing...</div>
                        <div className={'SubTitle'} >Please don’t close this window.<br />It will be ready in a second.</div>
                    </>
                )}
            </div>
        )
    }

    renderStatusDoneSuccess() {
        const appStore = this.props.appStore;
        const popupStore = this.props.popupStore;
        const nftModel = popupStore.nftModel;

        const display = popupStore.isStatusDoneSuccess();

        return (
            <div className={`StepDoneSuccess FlexColumn Transition ActiveDisplayHidden ${S.CSS.getActiveClassName(display)}`} >
                {display && (
                    <>
                        <div className={'SVG Size SvgIconBackground'} dangerouslySetInnerHTML={{ __html: SvgLoadingWaves }} />
                        <div className={'NftPreviewCnt'} >
                            <div className={'NftPreview ImgCoverNode'} style={ProjectUtils.makeBgImgStyle(nftModel.getPreviewUrl(appStore.workerQueueHelper))} />
                            <div className={'NftName'} >{nftModel.name}</div>
                        </div>
                        <div className={'Title'} >Success!</div>
                        <div className={'SubTitle'} >NFT was gifted successfully.</div>
                        <a href={''} className={'TxLink FlexRow'} target='_blank' rel="noreferrer" >
                            Check transaction details in Explorer
                            <span className={'SVG IconOpenUrl PrimaryColor'} dangerouslySetInnerHTML={{ __html: SvgOpenUrl }} />
                        </a>
                    </>
                )}
            </div>
        )
    }

    renderStatusDoneError() {
        const popupStore = this.props.popupStore;
        const display = popupStore.isStatusDoneError();

        return (
            <div className={`StepDoneError FlexColumn Transition ActiveDisplayHidden ${S.CSS.getActiveClassName(display)}`} >
                {display && (
                    <>
                        <div className={'SVG Size SvgIconBackground'} dangerouslySetInnerHTML={{ __html: SvgFinishedWaves }} />
                        <img src={`${Config.URL.RESOURCES}/common/img/nfts/cone.png`} className={'Cone'} />
                        <div className={'Title'} >Transaction Failed!!</div>
                        <div className={'SubTitle'} >NFT was not gifted.<br />Please check the details or try again.</div>
                        <a href={''} className={'TxLink FlexRow'} target='_blank' rel="noreferrer" >
                            Check transaction details in Explorer
                            <span className={'SVG IconOpenUrl PrimaryColor'} dangerouslySetInnerHTML={{ __html: SvgOpenUrl }} />
                        </a>
                        <Actions
                            className={'StepActions'}
                            height={Actions.HEIGHT_60}
                            layout={Actions.LAYOUT_COLUMN_FULL} >
                            <Button
                                padding={Button.PADDING_96}
                                radius={Button.RADIUS_MAX}
                                onClick={this.onClickSendNft} >
                                Try again
                            </Button>
                            <Button
                                padding={Button.PADDING_96}
                                radius={Button.RADIUS_MAX}
                                color={Button.COLOR_SCHEME_3}
                                onClick={this.onClickBack} >
                                Go Back
                            </Button>
                        </Actions>
                    </>
                )}
            </div>
        )
    }

}

export default inject((stores) => {
    return {
        appStore: stores.appStore,
        popupStore: stores.popupSendAsGiftStore,
    }
})(observer(SendAsGiftPopup));

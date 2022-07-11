import React from 'react';
import { inject, observer } from 'mobx-react';

import S from '../../../../common/js/utilities/Main';
import OptionChoose from './OptionChoose';
import CollectionDetails from './CollectionDetails';
import NftDetails from './NftDetails';
import NftFinish from './NftFinish';
import UploadFiles from './UploadFiles';
import MintStepNav from './MintStepNav';

import SvgArrowLeft from '../../../../common/svg/arrow-left.svg';
import SvgArrowRight from '../../../../common/svg/arrow-right.svg';
import '../../../css/components-inc/NftMint/mint-window.css';
import NavStore from '../../../../common/js/stores/NavStore';
import NftMinting from './NftMinting';
import NftMintingDone from './NftMintingDone';
import NftMintingFailed from './NftMintingFailed';

interface Props {
    navStore: NavStore
}

class MintWindow extends React.Component<Props> {

    render() {
        return (
            <div className={'MintWindow FlexColumn'}>
                {this.renderMintStepNavMap()}
                <div className={'MintStepPage'}>
                    {this.props.navStore.isInMintingStep() ? <span className={'SmallStepSign'}>STEP {this.props.navStore.getMintStepShowNumber()}</span> : ''}
                    {this.renderStepChooseOption()}
                    {this.renderStepUploadFile()}
                    {this.renderStepCollectionDetails()}
                    {this.renderStepDetails()}
                    {this.renderStepFinish()}
                    {this.renderMintingInProgress()}
                    {this.renderMintingDone()}
                    {this.renderMintingFailed()}
                </div>
                <div className={'FlexSplit StepNav'}>
                    {this.props.navStore.shouldShowBackStep() === true && (
                        <div
                            className={'FlexRow Clickable Active'}
                            onClick={this.props.navStore.getPreviousStepFunction()} >
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgArrowLeft }}></div>
                            <span>Back</span>
                        </div>
                    )}
                    {this.props.navStore.shouldShowNextStep() === true && (
                        <div className={`FlexRow StartRight ${S.CSS.getActiveClassName(this.props.navStore.isNextStepActive())}`}
                            onClick={this.props.navStore.getNextStepFunction()} >
                            <span>{this.props.navStore.getNextStepText()}</span>
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgArrowRight }}></div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    renderMintStepNavMap() {
        const display = this.props.navStore.shouldShowMintStepNavMap();

        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <MintStepNav />}
            </div>
        )
    }

    renderStepChooseOption() {
        const display = this.props.navStore.isMintStepChooseOption();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <OptionChoose />}
            </div>
        )
    }

    renderStepUploadFile() {
        const display = this.props.navStore.isMintStepUploadFile();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <UploadFiles />}
            </div>
        )
    }

    renderStepCollectionDetails() {
        const display = this.props.navStore.isMintStepCollectionDetails();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <CollectionDetails />}
            </div>
        )
    }
    renderStepDetails() {
        const display = this.props.navStore.isMintStepDetails();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <NftDetails />}
            </div>
        )
    }

    renderStepFinish() {
        const display = this.props.navStore.isMintStepFinish();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <NftFinish />}
            </div>
        )
    }

    renderMintingInProgress() {
        const display = this.props.navStore.isMintStepMinting();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <NftMinting />}
            </div>
        )
    }

    renderMintingDone() {
        const display = this.props.navStore.isMintStepDone();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <NftMintingDone />}
            </div>
        )
    }

    renderMintingFailed() {
        const display = this.props.navStore.isMintStepFailed();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <NftMintingFailed />}
            </div>
        )
    }
}

export default inject('navStore')((observer(MintWindow)));

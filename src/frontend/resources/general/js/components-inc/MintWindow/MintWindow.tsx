import React from 'react';
import { inject, observer } from 'mobx-react';

import S from '../../../../common/js/utilities/Main';
import NavStore from '../../../../common/js/stores/NavStore';

import OptionChoose from './OptionChoose';
import NftDetails from './NftDetails';
import NftFinish from './NftFinish';
import UploadFiles from './UploadFiles';
import MintStepNav from './MintStepNav';

import SvgArrowLeft from '../../../../common/svg/arrow-left.svg';
import SvgArrowRight from '../../../../common/svg/arrow-right.svg';
import '../../../css/components-inc/NftMint/mint-window.css';

interface Props {
    navStore: NavStore
}

class MintWindow extends React.Component < Props > {

    render() {
        return (
            <div className={'MintWindow FlexColumn'}>
                <MintStepNav />
                <div className={'MintStepPage'}>
                    <span className={'SmallStepSign'}>STEP {this.props.navStore.mintStep}</span>
                    { this.renderStepChooseOption() }
                    { this.renderStepUploadFile() }
                    { this.renderStepDetails() }
                    { this.renderStepFinish() }
                </div>
                <div className={'FlexSplit StepNav'}>
                    { this.props.navStore.isFirstStep() === false && (
                        <div
                            className={'FlexRow Clickable'}
                            onClick={this.props.navStore.selectPreviousStep} >
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgArrowLeft }}></div>
                            <span>Back</span>
                        </div>
                    ) }
                    { this.props.navStore.isLastStep() === false && (
                        <div
                            className={'FlexRow StartRight Clickable'}
                            onClick={this.props.navStore.selectNextStep} >
                            <span>NextStep</span>
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgArrowRight }}></div>
                        </div>
                    ) }
                </div>
            </div>
        );
    }

    renderStepChooseOption() {
        const display = this.props.navStore.isMintStepChooseOption();
        return (
            <div className = { `ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}` } >
                { display === true && <OptionChoose /> }
            </div>
        )
    }

    renderStepUploadFile() {
        const display = this.props.navStore.isMintStepUploadFile();
        return (
            <div className = { `ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}` } >
                { display === true && <UploadFiles /> }
            </div>
        )
    }

    renderStepDetails() {
        const display = this.props.navStore.isMintStepDetails();
        return (
            <div className = { `ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}` } >
                { display === true && <NftDetails /> }
            </div>
        )
    }

    renderStepFinish() {
        const display = this.props.navStore.isMintStepFinish();
        return (
            <div className = { `ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}` } >
                { display === true && <NftFinish /> }
            </div>
        )
    }
}

export default inject('navStore')((observer(MintWindow)));

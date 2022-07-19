import React from 'react';
import { inject, observer } from 'mobx-react';

import S from '../../../../common/js/utilities/Main';
import NftMintStore, { NavMintStore } from '../../../../common/js/stores/NftMintStore';
import NavStore from '../../../../common/js/stores/NavStore';

import OptionChoose from './OptionChoose';
import CollectionDetails from './CollectionDetails';
import NftDetails from './NftDetails';
import NftFinish from './NftFinish';
import UploadFiles from './UploadFiles';
import MintStepNav from './MintStepNav';
import NftMinting from './NftMinting';
import NftMintingDone from './NftMintingDone';
import NftMintingFailed from './NftMintingFailed';

import SvgArrowLeft from '../../../../common/svg/arrow-left.svg';
import SvgArrowRight from '../../../../common/svg/arrow-right.svg';
import '../../../css/components-inc/NftMint/mint-window.css';
import CollectionPremintPreview from './CollectionPremintPreview';

interface Props {
    navStore: NavStore;
    nftMintStore: NftMintStore;
}

class MintWindow extends React.Component<Props> {

    isNextStepActive(): boolean {
        const { navStore, nftMintStore } = this.props;
        const navMintStore = nftMintStore.navMintStore;

        // on step collection preview always active
        if (navMintStore.isMintStepPremintPreview()) {
            return true;
        }

        // on first step a mint option should be selected to continue
        if (navMintStore.isMintStepChooseOption() && navMintStore.mintOption !== S.NOT_EXISTS) {
            return true;
        }

        // on upload file step a file should be present to continue
        if (navMintStore.isMintStepUploadFile() && !navMintStore.nftMintStore.isNftsEmpty()) {
            return true;
        }

        // on collection details step a colletion should be minted
        if (navMintStore.isMintStepCollectionDetails() && navMintStore.nftMintStore.nftCollection.validate()) {
            return true;
        }

        // on nft details step nft name should be entered for all pictures
        if (navMintStore.isMintStepDetails() && navMintStore.nftMintStore.isValidNftModels()) {
            return true;
        }

        // on fourth step always active
        if (navMintStore.isMintStepFinish()) {
            return true;
        }

        // on step minting done button is always active as well
        if (navMintStore.isMintStepDone()) {
            return true;
        }

        return false;
    }

    getNextStepHandler() {
        const { navStore, nftMintStore } = this.props;
        const navMintStore = nftMintStore.navMintStore;

        if (this.isNextStepActive()) {
            // for these cases return standard ++step
            // choose option step standard function
            if (navMintStore.isMintStepChooseOption()
                // upload files step standard function
                || (navMintStore.isMintStepUploadFile() && navMintStore.isMintOptionMultiple())
                // collection details step standard function
                || navMintStore.isMintStepCollectionDetails()
                // details step standard function
                || navMintStore.isMintStepDetails()) {
                return navMintStore.selectNextStep;
            }

            if (navMintStore.isMintStepPremintPreview()) {
                return navMintStore.selectUploadFilesStep;
            }
            // on single nft mint option, jump pass collection details directly to mint details
            if (navMintStore.isMintStepUploadFile()) {
                return navMintStore.selectNftDetailsStep;
            }

            // on mint success jump to my nfts
            if (navMintStore.isMintStepDone()) {
                return navStore.selectMyNftPage;
            }
        }

        return null;
    }

    getNextStepText(): string {
        const { nftMintStore } = this.props;
        const navMintStore = nftMintStore.navMintStore;

        return navMintStore.isMintStepDone() ? 'Go to My NFTs' : 'Next Step';
    }

    render() {
        const navMintStore = this.props.nftMintStore.navMintStore;

        return (
            <div className={'MintWindow FlexColumn'}>
                {this.renderMintStepNavMap()}
                <div className={'MintStepPage'}>
                    {this.renderStepCollectionPremintPreview()}
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
                    {navMintStore.shouldShowBackStep() === true && (
                        <div
                            className={'FlexRow Clickable Active'}
                            onClick={navMintStore.getPreviousStepFunction()} >
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgArrowLeft }}></div>
                            <span>Back</span>
                        </div>
                    )}
                    {navMintStore.shouldShowNextStep() === true && (
                        <div className={`FlexRow StartRight ${S.CSS.getActiveClassName(this.isNextStepActive())}`}
                            onClick={this.getNextStepHandler()} >
                            <span>{this.getNextStepText()}</span>
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgArrowRight }}></div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    renderMintStepNavMap() {
        const display = this.props.nftMintStore.navMintStore.shouldShowMintStepNavMap();

        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <MintStepNav />}
            </div>
        )
    }

    renderStepCollectionPremintPreview() {
        const display = this.props.nftMintStore.navMintStore.isMintStepPremintPreview();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <CollectionPremintPreview />}
            </div>
        )
    }

    renderStepChooseOption() {
        const display = this.props.nftMintStore.navMintStore.isMintStepChooseOption();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <OptionChoose />}
            </div>
        )
    }

    renderStepUploadFile() {
        const display = this.props.nftMintStore.navMintStore.isMintStepUploadFile();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <UploadFiles />}
            </div>
        )
    }

    renderStepCollectionDetails() {
        const display = this.props.nftMintStore.navMintStore.isMintStepCollectionDetails();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <CollectionDetails />}
            </div>
        )
    }
    renderStepDetails() {
        const display = this.props.nftMintStore.navMintStore.isMintStepDetails();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <NftDetails />}
            </div>
        )
    }

    renderStepFinish() {
        const display = this.props.nftMintStore.navMintStore.isMintStepFinish();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <NftFinish />}
            </div>
        )
    }

    renderMintingInProgress() {
        const display = this.props.nftMintStore.navMintStore.isMintStepMinting();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <NftMinting />}
            </div>
        )
    }

    renderMintingDone() {
        const display = this.props.nftMintStore.navMintStore.isMintStepDone();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <NftMintingDone />}
            </div>
        )
    }

    renderMintingFailed() {
        const display = this.props.nftMintStore.navMintStore.isMintStepFailed();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <NftMintingFailed />}
            </div>
        )
    }
}

export default inject('navStore', 'nftMintStore')((observer(MintWindow)));

import React from 'react';
import { inject, observer } from 'mobx-react';

import S from '../../../../common/js/utilities/Main';
import NftMintStore, { NavMintStore } from '../../../../common/js/stores/NftMintStore';
import NftStepWrapper from './NftStepWrapper';

import SvgUploadSingle from '../../../../common/svg/upload-single.svg';
import SvgUploadMultiple from '../../../../common/svg/upload-multiple.svg';
import SvgTickCircle from '../../../../common/svg/tick-circle.svg';
import '../../../css/components-inc/NftMint/option-choose.css'

interface Props {
    nftMintStore: NftMintStore;
}

class OptionChoose extends React.Component<Props> {

    onSelectSingleMintOption = () => {
        this.props.nftMintStore.navMintStore.selectSingleMintOption();
    }

    onSelectMultipleMintOption = () => {
        this.props.nftMintStore.navMintStore.selectMultipleMintOption();
    }

    render() {
        const navMintStore = this.props.nftMintStore.navMintStore;

        return (
            <NftStepWrapper
                className={'OptionChoose'}
                stepNumber={`Step ${navMintStore.getMintStepShowNumber()}`}
                stepName={'Choose Option'} >
                <div className={'OptionHolder FlexRow'}>
                    <div
                        // removed so it doesn't show as selected when going back from the next page
                        // this is because of CUDOS-1596
                        // className={`OptionBox FlexColumn Transition ${S.CSS.getActiveClassName(navMintStore.isMintOptionSingle())}`}
                        className={'OptionBox FlexColumn Transition'}
                        onClick={this.onSelectSingleMintOption} >
                        <div className={'FlexRow SvgBox'}>
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgUploadSingle }}></div>
                            {/* removed so it doesn't show as selected when going back from the next page
                             this is because of CUDOS-1596
                             {navMintStore.isMintOptionSingle()
                                && <div className={'SVG Icon Tick'} dangerouslySetInnerHTML={{ __html: SvgTickCircle }}></div>
                            } */}
                        </div>
                        <div className={'Heading4'}>{NavMintStore.getMintOptionText(NavMintStore.MINT_OPTION_SINGLE)}</div>
                        <div className={'OptionInfo'}>This option allows you to upload and mint only one file for NFT</div>
                    </div>
                    <div
                        // removed so it doesn't show as selected when going back from the next page
                        // this is because of CUDOS-1596
                        // className={`OptionBox FlexColumn Transition ${S.CSS.getActiveClassName(navMintStore.isMintOptionMultiple())}`}
                        className={'OptionBox FlexColumn Transition'}
                        onClick={this.onSelectMultipleMintOption} >
                        <div className={'FlexRow SvgBox'}>
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgUploadMultiple }}></div>
                            {/* // removed so it doesn't show as selected when going back from the next page
                            // this is because of CUDOS-1596
                            {navMintStore.isMintOptionMultiple()
                                && <div className={'SVG Icon Tick'} dangerouslySetInnerHTML={{ __html: SvgTickCircle }}></div>
                            } */}
                        </div>
                        <div className={'Heading4'}>{NavMintStore.getMintOptionText(NavMintStore.MINT_OPTION_MULTIPLE)}</div>
                        <div className={'OptionInfo'}>This option allows you to upload and mint multiple files in one mint</div>
                    </div>
                </div>
            </NftStepWrapper>
        )
    }
}

export default inject('nftMintStore')((observer(OptionChoose)));

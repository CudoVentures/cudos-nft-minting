import React from 'react';
import { inject, observer } from 'mobx-react';

import S from '../../../../common/js/utilities/Main';
import NavStore from '../../../../common/js/stores/NavStore';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import NftStepWrapper from './NftStepWrapper';

import SvgUploadSingle from '../../../../common/svg/upload-single.svg';
import SvgUploadMultiple from '../../../../common/svg/upload-multiple.svg';
import '../../../css/components-inc/NftMint/option-choose.css'

interface Props {
    navStore: NavStore;
    nftMintStore: NftMintStore;
}

class OptionChoose extends React.Component<Props> {

    onSelectSingleMintOption = () => {
        this.props.navStore.selectSingleMintOption();
    }

    onSelectMultipleMintOption = () => {
        this.props.navStore.selectMultipleMintOption();
    }

    render() {
        return (
            <NftStepWrapper
                className = { 'OptionChoose' }
                stepNumber = { `Step ${this.props.navStore.getMintStepShowNumber()}` }
                stepName = { 'Choose Option' } >
                <div className={'OptionHolder FlexRow'}>
                    <div
                        className={`OptionBox FlexColumn Transition ${S.CSS.getActiveClassName(this.props.navStore.isMintOptionSingle())}`}
                        onClick={this.onSelectSingleMintOption} >
                        <div className={'SvgBox'}>
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgUploadSingle }}></div>
                            <div className={'Heading4'}>{NavStore.getMintOptionText(NavStore.MINT_OPTION_SINGLE)}</div>
                            <div className={'OptionInfo'}>This option allows you to upload and mint only one file for NFT</div>
                        </div>
                    </div>
                    <div
                        className={`OptionBox FlexColumn Transition ${S.CSS.getActiveClassName(this.props.navStore.isMintOptionMultiple())}`}
                        onClick={this.onSelectMultipleMintOption} >
                        <div className={'SvgBox'}>
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgUploadMultiple }}></div>
                            <div className={'Heading4'}>{NavStore.getMintOptionText(NavStore.MINT_OPTION_SINGLE)}</div>
                            <div className={'OptionInfo'}>This option allows you to upload and mint multiple files in one mint</div>
                        </div>
                    </div>
                </div>
            </NftStepWrapper>
        )
    }
}

export default inject('nftMintStore', 'navStore')((observer(OptionChoose)));

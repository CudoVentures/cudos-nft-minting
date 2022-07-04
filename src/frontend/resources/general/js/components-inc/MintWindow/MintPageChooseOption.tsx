import { inject, observer } from 'mobx-react';
import React from 'react';
import LayoutBlock from '../../../../common/js/components-inc/LayoutBlock';
import NavStore from '../../../../common/js/stores/NavStore';
import SvgUploadSingle from '../../../../common/svg/upload-single.svg';
import SvgUploadMultiple from '../../../../common/svg/upload-multiple.svg';

interface Props {
    navStore: NavStore
}

interface State {

}

class MintPageChooseOption extends React.Component<Props, State> {

    OPTION_TYPES = {
        SINGLE: 0,
        MULTIPLE: 1,
    }

    OPTIONS: Map<number, any> = new Map<number, any>([
        [this.OPTION_TYPES.SINGLE, {
            icon: SvgUploadSingle,
            title: 'Single Mint',
            info: 'This option allows you to upload and mint only one file for NFT',
        }],
        [this.OPTION_TYPES.MULTIPLE, {
            icon: SvgUploadMultiple,
            title: 'Multiple Mint',
            info: 'This option allows you to upload and mint multiple files in one mint',
        }],
    ])

    render() {
        return (
            <div className={'ChooseOptionWindow'}>
                <h3>Choose option</h3>
                <LayoutBlock className={'OptionHolder'}>
                    {Array.from(this.OPTIONS)
                        .map(([key, option]) => <div key={key} className={`OptionBox FlexColumn ${this.props.navStore.mintOption === key ? 'Selected' : ''}`} onClick={() => this.props.navStore.onSelectMintOption(key)}>
                            <div className={'SvgBox'}>
                                <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: option.icon }}></div>
                                <h4>{option.title}</h4>
                                <span>{option.info}</span>
                            </div>
                        </div>)}
                </LayoutBlock>
            </div>
        )
    }
}

export default inject('navStore')((observer(MintPageChooseOption)));

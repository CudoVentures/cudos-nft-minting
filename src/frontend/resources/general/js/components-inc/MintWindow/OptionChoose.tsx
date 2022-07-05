import { inject, observer } from 'mobx-react';
import React from 'react';
import LayoutBlock from '../../../../common/js/components-inc/LayoutBlock';
import NavStore from '../../../../common/js/stores/NavStore';
import SvgUploadSingle from '../../../../common/svg/upload-single.svg';
import SvgUploadMultiple from '../../../../common/svg/upload-multiple.svg';
import '../../../css/components-inc/option-choose.css'
import S from '../../../../common/js/utilities/Main';

interface Props {
    navStore: NavStore
}

interface State {

}

class OptionChoose extends React.Component<Props, State> {
    OPTIONS: Array<any> = [
        {
            key: NavStore.MINT_OPTION_SINGLE,
            icon: SvgUploadSingle,
            title: 'Single Mint',
            info: 'This option allows you to upload and mint only one file for NFT',
        },
        {
            key: NavStore.MINT_OPTION_MULTIPLE,
            icon: SvgUploadMultiple,
            title: 'Multiple Mint',
            info: 'This option allows you to upload and mint multiple files in one mint',
        },
    ];

    render() {
        return (
            <div className={'OptionChoose'}>
                <div className={'Heading3'}>Choose option</div>
                <div className={'OptionHolder FlexRow'}>
                    {this.OPTIONS.map((option: any) => <div
                        key={option.key}
                        className={`OptionBox FlexColumn ${S.CSS.getActiveClassName(this.props.navStore.mintOption === option.key)}`}
                        onClick={() => this.props.navStore.onSelectMintOption(option.key)}
                    >
                        <div className={'SvgBox'}>
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: option.icon }}></div>
                            <div className={'Heading4'}>{option.title}</div>
                            <div className={'OptionInfo'}>{option.info}</div>
                        </div>
                    </div>)}
                </div>
            </div>
        )
    }
}

export default inject('navStore')((observer(OptionChoose)));

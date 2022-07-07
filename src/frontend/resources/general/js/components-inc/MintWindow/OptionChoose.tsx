import React from 'react';
import { inject, observer } from 'mobx-react';

import S from '../../../../common/js/utilities/Main';
import NavStore from '../../../../common/js/stores/NavStore';

import SvgUploadSingle from '../../../../common/svg/upload-single.svg';
import SvgUploadMultiple from '../../../../common/svg/upload-multiple.svg';
import '../../../css/components-inc/NftMint/option-choose.css'

interface Props {
    navStore: NavStore
}

class OptionChoose extends React.Component < Props > {

    static OPTIONS: Array<any> = [
        {
            key: NavStore.MINT_OPTION_SINGLE,
            icon: SvgUploadSingle,
            info: 'This option allows you to upload and mint only one file for NFT',
        },
        {
            key: NavStore.MINT_OPTION_MULTIPLE,
            icon: SvgUploadMultiple,
            info: 'This option allows you to upload and mint multiple files in one mint',
        },
    ];

    render() {
        return (
            <div className={'OptionChoose'}>
                <div className={'Heading3'}>Choose Option</div>
                <div className={'OptionHolder FlexRow'}>
                    {
                        OptionChoose.OPTIONS.map((option: any) => {
                            return (
                                <div
                                    key={option.key}
                                    className={`OptionBox FlexColumn ${S.CSS.getActiveClassName(this.props.navStore.mintOption === option.key)}`}
                                    onClick={this.props.navStore.selectMintOption.bind(this.props.navStore, option.key)} >
                                    <div className={'SvgBox'}>
                                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: option.icon }}></div>
                                        <div className={'Heading4'}>{NavStore.getMintOptionText(option.key)}</div>
                                        <div className={'OptionInfo'}>{option.info}</div>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
        )
    }
}

export default inject('navStore')((observer(OptionChoose)));

import { inject, observer } from 'mobx-react';
import React from 'react';
import NavStore from '../../../../common/js/stores/NavStore';
import SvgTick from '../../../../common/svg/tick.svg';
import S from '../../../../common/js/utilities/Main';
import '../../../css/components-inc/NftMint/mint-step-nav.css';

interface Props {
    navStore: NavStore
}

interface State {

}

// TODO: implement
class MintStepNav extends React.Component<Props, State> {

    MENU_ITEMS = [
        {
            name: 'Choose Option',
            key: NavStore.STEP_CHOOSE_OPTION,
        },
        {
            name: 'Upload File',
            key: NavStore.STEP_UPLOAD_FILE,
        },
        {
            name: 'NFT Details',
            key: NavStore.STEP_NFT_DETAILS,
        },
        {
            name: 'Finish',
            key: NavStore.STEP_FINISH,
        },
    ];

    render() {
        return (
            <>
                <div className={'HorizontalLine'}></div>
                <div className={'MintStepNav FlexRow '}>
                    {this.MENU_ITEMS.map((step: any) => (
                        <div key={step.key} className={`MintStep FlexColumn ${step.key <= this.props.navStore.mintStep ? 'BlueStep' : ''}`}>
                            <div className={'NumberBox'}>
                                {step.key < this.props.navStore.mintStep
                                    ? <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTick }}></div>
                                    : step.key
                                }
                            </div>
                            <div className={'StageName'}>{step.name}</div>
                        </div>
                    ))}
                </div>
            </>
        )
    }
}

export default inject('navStore')((observer(MintStepNav)));

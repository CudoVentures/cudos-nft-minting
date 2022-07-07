import React from 'react';
import { inject, observer } from 'mobx-react';

import NavStore from '../../../../common/js/stores/NavStore';

import SvgTick from '../../../../common/svg/tick.svg';
import '../../../css/components-inc/NftMint/mint-step-nav.css';
import S from '../../../../common/js/utilities/Main';

interface Props {
    navStore: NavStore
}

class MintStepNav extends React.Component < Props > {

    static MENU_ITEMS = [
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
            <div className={'MintStepNav FlexRow '}>
                <div className={'HorizontalLine'} />
                { MintStepNav.MENU_ITEMS.map((step: any) => (
                    <div
                        key={step.key}
                        className={`MintStep FlexColumn ${S.CSS.getClassName(step.key <= this.props.navStore.mintStep, 'BlueStep')} ${S.CSS.getClassName(step.key === this.props.navStore.mintStep, 'CurrentStep')}`}>
                        <div className={'NumberBox'} >
                            {step.key < this.props.navStore.mintStep
                                ? <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTick }}></div>
                                : step.key
                            }
                        </div>
                        <div className={'StageName'}>{step.name}</div>
                    </div>
                )) }
            </div>
        )
    }
}

export default inject('navStore')((observer(MintStepNav)));

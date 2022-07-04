import { inject, observer } from 'mobx-react';
import React from 'react';
import NavStore from '../../../../common/js/stores/NavStore';
import SvgTick from '../../../../common/svg/tick.svg';
import S from '../../../../common/js/utilities/Main';
import '../../../css/components-inc/mint-step-nav.css';

interface Props {
    navStore: NavStore
}

interface State {

}

// TODO: implement
class MintStepNav extends React.Component<Props, State> {
    static MINT_STEP = {
        CHOOSE_OPTION: 0,
        UPLOAD_FILE: 1,
        NFT_DETAILS: 2,
        FINISH: 3,
    }

    MENU_ITEMS: Map<number, string> = new Map<number, string>([
        [MintStepNav.MINT_STEP.CHOOSE_OPTION, 'Choose Option'],
        [MintStepNav.MINT_STEP.UPLOAD_FILE, 'Upload File'],
        [MintStepNav.MINT_STEP.NFT_DETAILS, 'NFT Details'],
        [MintStepNav.MINT_STEP.FINISH, 'Finish'],
    ]);

    render() {
        return (
            <div className={'MintStepNav FlexRow '}>
                {Array.from(this.MENU_ITEMS).map(([key, value]) => (
                    <div key={key} className={`MintStep FlexColumn ${key <= this.props.navStore.mintStep ? 'BlueStep' : ''}`}>
                        <div className={'NumberBox'}>
                            {key < this.props.navStore.mintStep
                                ? <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTick }}></div>
                                : key + 1
                            }
                        </div>
                        <div className={'StageName'}>{value}</div>
                    </div>
                ))}
            </div>
        )
    }
}

export default inject('navStore')((observer(MintStepNav)));

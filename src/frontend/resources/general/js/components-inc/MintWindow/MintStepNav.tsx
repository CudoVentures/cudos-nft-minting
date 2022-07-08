import React from 'react';
import { inject, observer } from 'mobx-react';

import NavStore from '../../../../common/js/stores/NavStore';

import SvgTick from '../../../../common/svg/tick.svg';
import '../../../css/components-inc/NftMint/mint-step-nav.css';
import S from '../../../../common/js/utilities/Main';

interface Props {
    navStore: NavStore
}

class MintStepNav extends React.Component<Props> {
    static TEXT_CHOOSE_OPTION = 'Choose Option';
    static TEXT_UPLOAD_FILE = 'Upload File';
    static TEXT_COLLECTION_DETAILS = 'Colection Details';
    static TEXT_NFT_DETAILS = 'NFTs Details';
    static TEXT_FINISH = 'Finish';

    getMenuItems(): any[] {
        const menuItems = [
            {
                name: MintStepNav.TEXT_CHOOSE_OPTION,
                key: NavStore.STEP_CHOOSE_OPTION,
            },
            {
                name: MintStepNav.TEXT_UPLOAD_FILE,
                key: NavStore.STEP_UPLOAD_FILE,
            }];

        if (this.props.navStore.isMintOptionMultiple()) {
            menuItems.push({
                name: MintStepNav.TEXT_COLLECTION_DETAILS,
                key: NavStore.STEP_COLLECTION_DETAILS,
            });
        }

        menuItems.push({
            name: MintStepNav.TEXT_NFT_DETAILS,
            key: this.props.navStore.isMintOptionMultiple() ? NavStore.STEP_NFT_DETAILS : NavStore.STEP_NFT_DETAILS - 1,
        })

        menuItems.push({
            name: MintStepNav.TEXT_FINISH,
            key: this.props.navStore.isMintOptionMultiple() ? NavStore.STEP_FINISH : NavStore.STEP_FINISH - 1,
        })

        return menuItems;
    }

    render() {
        return (
            <div className={'MintStepNav FlexRow '}>
                <div className={'HorizontalLine'} />
                {this.getMenuItems().map((step: any) => (
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
                ))}
            </div>
        )
    }
}

export default inject('navStore')((observer(MintStepNav)));

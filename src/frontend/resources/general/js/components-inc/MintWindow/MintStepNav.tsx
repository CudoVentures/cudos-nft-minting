import React from 'react';
import { inject, observer } from 'mobx-react';

import S from '../../../../common/js/utilities/Main';
import NftMintStore, { NavMintStore } from '../../../../common/js/stores/NftMintStore';

import SvgTick from '../../../../common/svg/tick.svg';
import '../../../css/components-inc/NftMint/mint-step-nav.css';

interface Props {
    nftMintStore: NftMintStore;
}

class MintStepNav extends React.Component<Props> {
    static TEXT_CHOOSE_OPTION = 'Choose Option';
    static TEXT_UPLOAD_FILE = 'Upload File';
    static TEXT_COLLECTION_DETAILS = 'Collection Details';
    static TEXT_NFT_DETAILS = 'NFTs Details';
    static TEXT_FINISH = 'Finish';

    getMenuItems(): any[] {
        const navMintStore = this.props.nftMintStore.navMintStore;

        const menuItems = [
            {
                name: MintStepNav.TEXT_CHOOSE_OPTION,
                showNumber: NavMintStore.STEP_CHOOSE_OPTION,
                step: NavMintStore.STEP_CHOOSE_OPTION,
            },
            {
                name: MintStepNav.TEXT_UPLOAD_FILE,
                showNumber: NavMintStore.STEP_UPLOAD_FILE,
                step: NavMintStore.STEP_UPLOAD_FILE,
            }];

        if (navMintStore.isMintOptionMultiple()) {
            menuItems.push({
                name: MintStepNav.TEXT_COLLECTION_DETAILS,
                showNumber: NavMintStore.STEP_COLLECTION_DETAILS,
                step: NavMintStore.STEP_COLLECTION_DETAILS,
            });
        }

        menuItems.push({
            name: MintStepNav.TEXT_NFT_DETAILS,
            showNumber: navMintStore.isMintOptionMultiple() ? NavMintStore.STEP_NFT_DETAILS : NavMintStore.STEP_NFT_DETAILS - 1,
            step: NavMintStore.STEP_NFT_DETAILS,
        })

        menuItems.push({
            name: MintStepNav.TEXT_FINISH,
            showNumber: navMintStore.isMintOptionMultiple() ? NavMintStore.STEP_FINISH : NavMintStore.STEP_FINISH - 1,
            step: NavMintStore.STEP_FINISH,
        })

        return menuItems;
    }

    render() {
        const navMintStore = this.props.nftMintStore.navMintStore;

        return (
            <div className={'MintStepNav FlexRow '}>
                <div className={'HorizontalLine'} />
                {this.getMenuItems().map((step: any) => (
                    <div
                        key={step.step}
                        className={`MintStep FlexColumn ${S.CSS.getClassName(step.step <= navMintStore.mintStep, 'BlueStep')} ${S.CSS.getClassName(step.showNumber === navMintStore.mintStep, 'CurrentStep')}`}>
                        <div className={'NumberBox'} >
                            {step.step < navMintStore.mintStep
                                ? <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTick }}></div>
                                : step.showNumber
                            }
                        </div>
                        <div className={'StageName'}>{step.name}</div>
                    </div>
                ))}
            </div>
        )
    }
}

export default inject('nftMintStore')((observer(MintStepNav)));

import { inject, observer } from 'mobx-react';
import React from 'react';
import NavStore from '../../../../common/js/stores/NavStore';
import NftStore from '../../../../common/js/stores/NftStore';
import S from '../../../../common/js/utilities/Main';
import MintPageChooseOption, { MintOption, MintOptionData } from './MintPageChooseOption';
import MintPageNftDetails from './MintPageNftDetails';
import MintPageNftFinish from './MintPageNftFinish';
import MintPageUploadFiles from './MintPageUploadFiles';
import MintStepNav from './MintStepNav';
import SvgArrowLeft from '../../../../common/svg/arrow-left.svg';
import SvgArrowRight from '../../../../common/svg/arrow-right.svg';

interface Props {
    navStore: NavStore
}

interface State {

}

// TODO: implement
class MintWindow extends React.Component<Props, State> {

    render() {
        return (
            <div className={'MintWindow FlexColumn'}>
                <MintStepNav />
                <span className={'SmallStepSign'}>STEP {this.props.navStore.mintStep + 1}</span>
                {
                    (this.props.navStore.mintStep === MintStepNav.MINT_STEP.CHOOSE_OPTION || this.props.navStore.mintStep === S.NOT_EXISTS)
                    && <MintPageChooseOption />
                }
                {
                    this.props.navStore.mintStep === MintStepNav.MINT_STEP.UPLOAD_FILE
                    && <MintPageUploadFiles />
                }
                {
                    this.props.navStore.mintStep === MintStepNav.MINT_STEP.NFT_DETAILS
                    && <MintPageNftDetails />
                }
                {
                    this.props.navStore.mintStep === MintStepNav.MINT_STEP.FINISH
                    && <MintPageNftFinish />
                }
                <div className={'FlexSplit StepNav'}>
                    {this.props.navStore.mintStep !== MintStepNav.MINT_STEP.CHOOSE_OPTION
                        && <div
                            className={'FlexRow StepButton'}
                            onClick={() => this.props.navStore.onSelectStage(this.props.navStore.mintStep - 1)}
                        >
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgArrowLeft }}></div>
                            <span>Back</span>
                        </div>
                    }
                    {this.props.navStore.mintStep !== MintStepNav.MINT_STEP.FINISH
                        && <div
                            className={'FlexRight StepButton'}
                            onClick={() => this.props.navStore.onSelectStage(this.props.navStore.mintStep + 1)}
                        >
                            <span>NextStep</span>
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgArrowRight }}></div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default inject('navStore')((observer(MintWindow)));

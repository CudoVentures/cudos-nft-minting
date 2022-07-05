import { inject, observer } from 'mobx-react';
import React from 'react';
import NavStore from '../../../../common/js/stores/NavStore';
import S from '../../../../common/js/utilities/Main';
import OptionChoose, { MintOption, MintOptionData } from './OptionChoose';
import MintPageNftDetails from './MintPageNftDetails';
import MintPageNftFinish from './MintPageNftFinish';
import UploadFiles from './UploadFiles';
import MintStepNav from './MintStepNav';
import SvgArrowLeft from '../../../../common/svg/arrow-left.svg';
import SvgArrowRight from '../../../../common/svg/arrow-right.svg';
import '../../../css/components-inc/mint-window.css';

interface Props {
    navStore: NavStore
}

interface State {

}

// TODO: implement
class MintWindow extends React.Component<Props, State> {
    componentDidMount() {
        this.props.navStore.mintOption = S.NOT_EXISTS
    }

    render() {
        return (
            <div className={'MintWindow FlexColumn'}>
                <MintStepNav />
                <div className={'MintStepPage'}>
                    <span className={'SmallStepSign'}>STEP {this.props.navStore.mintStep + 1}</span>
                    {
                        (this.props.navStore.mintStep === NavStore.STEP_CHOOSE_OPTION || this.props.navStore.mintStep === S.NOT_EXISTS)
                        && <OptionChoose />
                    }
                    {
                        this.props.navStore.mintStep === NavStore.STEP_UPLOAD_FILE
                        && <UploadFiles />
                    }
                    {
                        this.props.navStore.mintStep === NavStore.STEP_NFT_DETAILS
                        && <MintPageNftDetails />
                    }
                    {
                        this.props.navStore.mintStep === NavStore.STEP_FINISH
                        && <MintPageNftFinish />
                    }
                </div>
                <div className={'FlexSplit StepNav'}>
                    {this.props.navStore.mintStep !== NavStore.STEP_CHOOSE_OPTION
                        && <div
                            className={'FlexRow StepButton'}
                            onClick={() => this.props.navStore.onSelectStage(this.props.navStore.mintStep - 1)}
                        >
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgArrowLeft }}></div>
                            <span>Back</span>
                        </div>
                    }
                    {this.props.navStore.mintStep !== NavStore.STEP_FINISH
                        && this.props.navStore.mintOption !== S.NOT_EXISTS
                        && <div
                            className={'FlexRow StartRight StepButton'}
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

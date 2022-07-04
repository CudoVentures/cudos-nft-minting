import React from 'react';
import NftImageModel from '../../../../common/js/models/NftImageModel';
import MintPageChooseOption, { MintOption, MintOptionData } from './MintPageChooseOption';
import MintPageNftDetails from './MintPageNftDetails';
import MintPageNftFinish from './MintPageNftFinish';
import MintPageUploadFiles from './MintPageUploadFiles';

export enum MintStage {
    ChooseOption,
    UploadFile,
    NftDetails,
    Finish,
}

interface Props {
    selectedMintOption: MintOption;
    stage: MintStage;
    images: NftImageModel[];
    selectedImages: number[];
}

interface State {

}

// TODO: implement
export default class MintWindow extends React.Component<Props, State> {
    render() {
        return (
            <div className={'MintWindow'}>
                {/* {
                    this.props.stage === MintStage.ChooseOption
                    && <MintPageChooseOption />
                }
                {
                    this.props.stage === MintStage.UploadFile
                    && <MintPageUploadFiles />
                }
                {
                    this.props.stage === MintStage.NftDetails
                    && <MintPageNftDetails />
                }
                {
                    this.props.stage === MintStage.Finish
                    && <MintPageNftFinish />
                } */}
            </div>
        );
    }
}

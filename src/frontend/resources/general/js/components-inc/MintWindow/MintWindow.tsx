import React from "react";
import NftImageModel from "../../../../common/js/models/NftImageModel";
import { MintOption, MintOptionData } from "./MintPageChooseOption";

export enum MintStage {
    ChooseOption,
    UploadFile,
    NftDetails,
    Finish,
}

interface Props {
    selectedMintOption: MintOption;
    stage: MintStage;
    mintOptionsData: MintOptionData[];
    images: NftImageModel[];
    selectedImages: number[];
}

interface State {
    
}

export default class MintWindow extends React.Component < Props, State > {
    render() {
        return ()
    }
}
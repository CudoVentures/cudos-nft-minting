import React from "react";
import NftImageModel from "../../../../common/js/models/NftImageModel";

interface Props {
    images: NftImageModel[];
    selectedImages: number[];
    onClickSelectImage: (imageIndex: number) => void;
    onClickDeleteImage: (imageIndex: number) => void;
}

interface State {
    
}

export default class MintPageUploadFiles extends React.Component < Props, State > {
    render() {
        return ()
    }
}
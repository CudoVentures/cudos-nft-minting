import React from 'react';
import NftImageModel from '../../../../common/js/models/NftImageModel';

interface Props {
    images: NftImageModel[];
    selectedImages: number[];
    onClickSelectImage: (imageIndex: number) => void;
    onClickDeleteImage: (imageIndex: number) => void;
}

interface State {

}

// TODO: implement
export default class MintPageNftFinish extends React.Component<Props, State> {

    onDrop = (e) => {
        e.preventDefault();

        // this.props.popupStore.dragging = false;

        let files = [];
        if (e.dataTransfer.items) {
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                if (e.dataTransfer.items[i].kind === 'file') {
                    const file = e.dataTransfer.items[i].getAsFile();
                    files.push(file);
                }
            }
        } else {
            files = e.dataTransfer.files;
        }

        this.iNodes.uploader.current.upload.uploadFiles(files);
    }

    makeImageUploadParams() {
        let nftImageModel: NftImageModel = null;
        return {
            'maxSize': 1 << 20, // 1MB
            'controller': CGeneralContext.urlShipmentDocumentUploadData(),
            'progressWindow': false,
            'onExceedLimit': () => {
                this.props.alertStore.show('Max files size is 1MB');
            },
            onBeforeStart: () => {
                nftImageModel = this.props.nftStore.nftImageStartUpload();
            },
            onUpload: (base64File, response, files: any[], i: number) => {
                console.log(response);
                const res = new NftImageUploadRes(JSON.parse(response).obj.nftImageModel);
                this.props.nftStore.nftImage = res.nftImageModel;
                console.log(this.props.nftStore.nftImage);
            },
        }
    }

    // TODO: implement
    render() {
        return (<></>)
    }
}

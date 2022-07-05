import { inject, observer } from 'mobx-react';
import React from 'react';
import Button from '../../../../common/js/components-inc/Button';
import Input, { InputType } from '../../../../common/js/components-inc/Input';
import LayoutBlock from '../../../../common/js/components-inc/LayoutBlock';
import Table from '../../../../common/js/components-inc/Table';
import NftImageModel from '../../../../common/js/models/NftImageModel';
import NavStore from '../../../../common/js/stores/NavStore';
import NftStore from '../../../../common/js/stores/NftStore';
import SvgUploadFile from '../../../../common/svg/upload-file.svg';
import SvgTrash from '../../../../common/svg/trash.svg';
import TableDesktop from '../../../../common/js/components-inc/TableDesktop';

interface Props {
    navStore: NavStore
    nftStore: NftStore
}

interface State {

}

class UploadFiles extends React.Component<Props, State> {

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

    // makeImageUploadParams() {
    //     let nftImageModel: NftImageModel = null;
    //     return {
    //         'maxSize': 1 << 20, // 1MB
    //         'controller': CGeneralContext.urlShipmentDocumentUploadData(),
    //         'progressWindow': false,
    //         'onExceedLimit': () => {
    //             this.props.alertStore.show('Max files size is 1MB');
    //         },
    //         onBeforeStart: () => {
    //             nftImageModel = this.props.nftStore.nftImageStartUpload();
    //         },
    //         onUpload: (base64File, response, files: any[], i: number) => {
    //             console.log(response);
    //             const res = new NftImageUploadRes(JSON.parse(response).obj.nftImageModel);
    //             this.props.nftStore.nftImage = res.nftImageModel;
    //             console.log(this.props.nftStore.nftImage);
    //         },
    //     }
    // }

    // TODO: implement
    render() {
        return (
            <div className={'UploadFiles'}>
                <div className={'Heading3'}>Upload File</div>
                <div className={'FileAddRow FlexRow'}>
                    <div className={'UploadRileBox FlexRow'}>
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgUploadFile }}></div>
                        <div className={'BoxInfo FlexColumn'}>
                            <div className={'BoxHeading'}>
                                Drop image here or <span className={'Blue'}>Browse</span>
                            </div>
                            <div className={'BoxInfo'}>
                                Supported files: JPEG, JPG, PNG, GIF, SVG, MP4, WEBM, WEBP, MP3, WAV, OGG, GLTF, GLB
                            </div>
                        </div>
                    </div>
                    <div className={'FileFromLink FlexColumn'}>
                        <div className={'BoxHeading'}>Add file from link</div>
                        <LayoutBlock>
                            <Input
                                className={'LinkInput'}
                                inputType={InputType.TEXT}
                                placeholder={'www.mywebsite.com/item'}
                                value={this.props.nftStore.imageUrlInputValue}
                            />
                            <Button
                                disabled={this.props.nftStore.isImageLinkValid}
                                onClick={() => this.props.nftStore.onClickAddImageLink()}
                            >Upload File</Button>
                        </LayoutBlock>
                    </div>
                    <Table
                        className={'ImageFilesTable'}
                        legend={this.getTableLegend()}
                        widths={this.getTableWidths()}
                        aligns={this.getTableAligns()}
                        rows={this.renderRows()} />
                </div>
            </div>
        )
    }

    renderRows() {
        return this.props.nftStore.nftImages.map((image: NftImageModel, index: number) => [
            Table.cellString(image.imageUrl),
            Table.cellString(image.type),
            Table.cellString(NftImageModel.getImageSizeString(image)),
            Table.cell(
                <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTrash }} onClick={() => this.props.nftStore.removeNftImage(index)}></div>,
            ),
        ])
    }

    getTableLegend() {
        return ['File Name', 'Type', 'Size', 'Action'];
    }

    getTableWidths() {
        return ['40%', '10%', '40', '10'];
    }

    getTableAligns() {
        return [
            TableDesktop.ALIGN_LEFT,
            TableDesktop.ALIGN_CENTER,
            TableDesktop.ALIGN_CENTER,
            TableDesktop.ALIGN_CENTER,
        ]
    }
}

export default inject('navStore', 'nftStore')((observer(UploadFiles)));

import { inject, observer } from 'mobx-react';
import React from 'react';
import Button from '../../../../common/js/components-inc/Button';
import Input, { InputType } from '../../../../common/js/components-inc/Input';
import LayoutBlock from '../../../../common/js/components-inc/LayoutBlock';
import Table from '../../../../common/js/components-inc/Table';
import NftImageModel from '../../../../common/js/models/NftImageModel';
import NavStore from '../../../../common/js/stores/NavStore';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import SvgUploadFile from '../../../../common/svg/upload-file.svg';
import SvgTrash from '../../../../common/svg/trash.svg';
import TableDesktop from '../../../../common/js/components-inc/TableDesktop';
import TableHelper from '../../../../common/js/helpers/TableHelper';
import S from '../../../../common/js/utilities/Main';

interface Props {
    navStore: NavStore
    nftMintStore: NftMintStore
}

interface State {

}

class UploadFiles extends React.Component<Props, State> {
    tableHelper: TableHelper;

    constructor(props: Props) {
        super(props);

        this.tableHelper = new TableHelper(
            S.NOT_EXISTS,
            [],
            () => { },
        );
    }

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
    //             nftImageModel = this.props.nftMintStore.nftImageStartUpload();
    //         },
    //         onUpload: (base64File, response, files: any[], i: number) => {
    //             console.log(response);
    //             const res = new NftImageUploadRes(JSON.parse(response).obj.nftImageModel);
    //             this.props.nftMintStore.nftImage = res.nftImageModel;
    //             console.log(this.props.nftMintStore.nftImage);
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
                                value={this.props.nftMintStore.imageUrlInputValue}
                            />
                            <Button
                                disabled={this.props.nftMintStore.isImageLinkValid}
                                onClick={() => this.props.nftMintStore.onClickAddImageLink()}
                            >Upload File</Button>
                        </LayoutBlock>
                    </div>
                    <Table
                        className={'ImageFilesTable'}
                        legend={this.getTableLegend()}
                        widths={this.getTableWidths()}
                        aligns={this.getTableAligns()}
                        helper={this.tableHelper}
                        rows={this.renderRows()} />
                </div>
            </div>
        )
    }

    renderRows() {
        return this.props.nftMintStore.nftImages.map((image: NftImageModel, index: number) => [
            Table.cellString(image.imageUrl),
            Table.cellString(image.type),
            Table.cellString(NftImageModel.getImageSizeString(image)),
            Table.cell(
                <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTrash }} onClick={() => this.props.nftMintStore.removeNftImage(index)}></div>,
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

export default inject('navStore', 'nftMintStore')((observer(UploadFiles)));

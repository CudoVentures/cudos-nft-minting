import { inject, observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import Button from '../../../../common/js/components-inc/Button';
import Input, { InputType, InputMargin } from '../../../../common/js/components-inc/Input';
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
import Config from '../../../../../../../builds/dev-generated/Config';
import '../../../css/components-inc/upload-files.css';
import Actions from '../../../../common/js/components-inc/Actions';
import AlertStore from '../../../../common/js/stores/AlertStore';
import Checkbox from '../../../../common/js/components-inc/Checkbox';

interface Props {
    navStore: NavStore
    nftMintStore: NftMintStore
    alertStore: AlertStore
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

    onClickUploadFile = async () => {
        try {
            await this.props.nftMintStore.getImageFromUrl();
        } catch (e) {
            this.props.alertStore.show(e.message);
        }
    }

    render() {
        return (
            <div className={'UploadFiles'}>
                <div className={'Heading3'}>Upload File</div>
                <div className={'FileAddRow FlexRow'}>
                    <div className={'UploadFileBox FlexRow'}>
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgUploadFile }}></div>
                        <div className={'BoxInfo FlexColumn'}>
                            <div className={'BoxHeading'}>
                                Drop image here or <span className={'BrowseButton'}>Browse</span>
                            </div>
                            <div className={'BoxInfo'}>
                                Supported files: JPEG, JPG, PNG, GIF, SVG, MP4, WEBM, WEBP, MP3, WAV, OGG, GLTF, GLB
                            </div>
                        </div>
                    </div>
                    <div className={'FileFromLink FlexColumn'}>
                        <div className={'BoxHeading'}>Add file from link</div>
                        <div className={'FlexRow'}>
                            <Input
                                className={'LinkInput'}
                                inputType={InputType.TEXT}
                                placeholder={'www.mywebsite.com/item'}
                                value={this.props.nftMintStore.imageUrlInputValue}
                                margin={InputMargin.NORMAL}
                                onChange={(event: ChangeEvent) => this.props.nftMintStore.onImageUrlChange(event.toString())}
                            />

                            <Actions height={Actions.HEIGHT_52}>
                                <Button
                                    color={Button.COLOR_SCHEME_1}
                                    radius={Button.RADIUS_MAX}
                                    type={Button.TYPE_ROUNDED}
                                    padding={Button.PADDING_24}
                                    onClick={this.onClickUploadFile}
                                >Upload File</Button>
                            </Actions>
                        </div>
                    </div>
                </div>
                <Table
                    className={'ImageFilesTable'}
                    legend={this.getTableLegend()}
                    widths={this.getTableWidths()}
                    aligns={this.getTableAligns()}
                    helper={this.tableHelper}
                    rows={this.renderRows()}
                    noRowsContent={this.noRowsContent()}
                />
            </div>
        )
    }

    noRowsContent() {
        return (
            <div className={'NoRowsContent FlexColumn'} >
                <img className={'NoNftImg'} src={`${Config.URL.RESOURCES}/common/img/nfts/no-nft.png`} />
                <div className={'NoRowsContentInfo'}>No uploaded files yet</div>
            </div>
        )
    }

    renderRows() {

        return this.props.nftMintStore.nftImages.map((image: NftImageModel, index: number) => Table.row(
            [
                Table.cell(
                    <Checkbox
                        value={this.props.nftMintStore.isNftImageSelected(index)}
                        onChange={() => this.props.nftMintStore.onSelectImage(index)}
                    />,
                ),
                Table.cell(
                    <div className={'FlexRow'}>
                        <img className={'Image'} src={image.imageUrl} />
                        {image.fileName}
                    </div>,
                ),
                Table.cellString(image.type),
                Table.cellString(NftImageModel.getImageSizeString(image)),
                Table.cell(
                    <div className={'SVG Icon Remove'} dangerouslySetInnerHTML={{ __html: SvgTrash }} onClick={() => this.props.nftMintStore.removeNftImage(index)}></div>,
                ),
            ],
        ))

    }

    getTableLegend() {
        return [
            (<Checkbox
                value={this.props.nftMintStore.areAllImagesSelected()}
                onChange={() => this.props.nftMintStore.onSelectAllImages()}
            />),
            'File Name',
            'Type',
            'Size',
            'Action',
        ];
    }

    getTableWidths() {
        return ['5%', '30%', '20%', '15%', '35%'];
    }

    getTableAligns() {
        return [
            TableDesktop.ALIGN_CENTER,
            TableDesktop.ALIGN_LEFT,
            TableDesktop.ALIGN_CENTER,
            TableDesktop.ALIGN_CENTER,
            TableDesktop.ALIGN_RIGHT,
        ]
    }
}

export default inject('alertStore', 'navStore', 'nftMintStore')((observer(UploadFiles)));

import { inject, observer } from 'mobx-react';
import React from 'react';
import Button from '../../../../common/js/components-inc/Button';
import Input, { InputType, InputMargin } from '../../../../common/js/components-inc/Input';
import Table from '../../../../common/js/components-inc/Table';
import NavStore from '../../../../common/js/stores/NavStore';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import TableDesktop from '../../../../common/js/components-inc/TableDesktop';
import TableHelper from '../../../../common/js/helpers/TableHelper';
import S from '../../../../common/js/utilities/Main';
import Config from '../../../../../../../builds/dev-generated/Config';
import '../../../css/components-inc/NftMint/upload-files.css';
import Actions from '../../../../common/js/components-inc/Actions';
import AlertStore from '../../../../common/js/stores/AlertStore';
import Checkbox from '../../../../common/js/components-inc/Checkbox';
import FileUpload from '../../../../common/js/components-inc/FileUpload';
import NftModel from '../../../../common/js/models/NftModel';

import SvgUploadFile from '../../../../common/svg/upload-file.svg';
import SvgTrash from '../../../../common/svg/trash.svg';
import NftStepWrapper from './NftStepWrapper';

interface Props {
    navStore: NavStore
    nftMintStore: NftMintStore
    alertStore: AlertStore
}

class UploadFiles extends React.Component<Props> {
    tableHelper: TableHelper;

    constructor(props: Props) {
        super(props);

        this.tableHelper = new TableHelper(
            S.NOT_EXISTS,
            [],
            () => { },
        );
    }

    makeImageUploadParams() {
        return {
            'maxSize': 1 << 20, // 1MB
            'controller': '#',
            'progressWindow': false,
            'onExceedLimit': () => {
                this.props.alertStore.show('Max files size is 1MB');
            },
            onUpload: (base64File, response, files: any[], i: number) => {
                this.props.nftMintStore.addNewImage(base64File, files[i].name, files[i].type, files[i].size);
            },
        }
    }

    onClickUploadFile = async () => {
        try {
            await this.props.nftMintStore.getImageFromUrl();
        } catch (e) {
            this.props.alertStore.show(e.message);
        }
    }

    render() {
        return (
            <NftStepWrapper
                className = { 'UploadFiles' }
                stepNumber = { `Step ${this.props.navStore.getMintStepShowNumber()}` }
                stepName = { 'Upload File' } >
                <div className={`FileAddRow FlexRow ${S.CSS.getActiveClassName(!this.props.nftMintStore.isNftsEmpty() && this.props.navStore.isMintOptionSingle())}`}>
                    <FileUpload
                        uploadId={'OptionChoosePage'}
                        uploadParams={this.makeImageUploadParams()}>
                        <div className={'UploadFileBox FlexRow'}>
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgUploadFile }}></div>
                            <div className={'BoxText FlexColumn'}>
                                <div className={'BoxHeading'}>
                                    Drop image here or <span className={'BrowseButton'}>Browse</span>
                                </div>
                                <div className={'BoxInfo'}>
                                    Supported files: JPEG, JPG, PNG, GIF, SVG, MP4, WEBM, WEBP, MP3, WAV, OGG, GLTF, GLB
                                </div>
                            </div>
                            <div className={'BoxDragInfo'}>
                                Drop file here
                            </div>
                        </div>

                    </FileUpload>
                    <div className={'FileFromLink FlexColumn'}>
                        <div className={'BoxHeading'}>Add file from link</div>
                        <div className={'FlexRow'}>
                            <Input
                                className={'LinkInput'}
                                inputType={InputType.TEXT}
                                placeholder={'www.mywebsite.com/item'}
                                value={this.props.nftMintStore.imageUrlInputValue}
                                margin={InputMargin.NORMAL}
                                onChange={(event: string) => this.props.nftMintStore.onImageUrlChange(event)}
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
                {this.props.nftMintStore.areAnyNftsSelected()
                    && <Actions
                        className={'DeleteFilesButton'}
                        height={Actions.HEIGHT_75}
                        layout={Actions.LAYOUT_COLUMN_FULL}
                    >
                        <Button
                            color={Button.COLOR_SCHEME_3}
                            radius={Button.RADIUS_MAX}
                            type={Button.TYPE_ROUNDED}
                            padding={Button.PADDING_24}
                            onClick={this.props.nftMintStore.removeSelectedNfts.bind(this.props.nftMintStore)}
                        >
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTrash }} />
                            Delete Selected Items ({this.props.nftMintStore.selectedNfts.length})
                        </Button>
                    </Actions>
                }
            </NftStepWrapper>
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
        return this.props.nftMintStore.nfts.map((nft: NftModel, index: number) => {
            let cells = [];

            if (this.props.navStore.isMintOptionMultiple()) {
                cells.push(Table.cell(
                    <Checkbox
                        value={this.props.nftMintStore.isNftSelected(index)}
                        onChange={() => this.props.nftMintStore.onSelectNft(index)}
                    />,
                ));
            }

            cells = cells.concat([
                Table.cell(
                    <div className={'FlexRow'}>
                        <img className={'Image'} src={nft.url} />
                        {nft.fileName}
                    </div>,
                ),
                Table.cellString(nft.type),
                Table.cellString(NftModel.getImageSizeString(nft)),
                Table.cell(
                    <div className={'SVG Icon Remove'} dangerouslySetInnerHTML={{ __html: SvgTrash }} onClick={() => this.props.nftMintStore.removeNft(index)}></div>,
                ),
            ]);

            return Table.row(cells);
        })
    }

    getTableLegend() {
        let legends = [];

        if (this.props.navStore.isMintOptionMultiple()) {
            legends.push((<Checkbox
                value={this.props.nftMintStore.areAllNftsSelected()}
                onChange={() => this.props.nftMintStore.onSelectAllNfts()}
            />));
        }

        legends = legends.concat([
            'File Name',
            'Type',
            'Size',
            'Action',
        ]);

        return legends;
    }

    getTableWidths() {
        if (this.props.navStore.isMintOptionMultiple()) {
            return ['5%', '30%', '20%', '15%', '35%']
        }

        return ['35%', '20%', '15%', '35%'];
    }

    getTableAligns() {
        if (this.props.navStore.isMintOptionMultiple()) {
            return [
                TableDesktop.ALIGN_CENTER,
                TableDesktop.ALIGN_LEFT,
                TableDesktop.ALIGN_CENTER,
                TableDesktop.ALIGN_CENTER,
                TableDesktop.ALIGN_RIGHT,
            ]
        }

        return [
            TableDesktop.ALIGN_LEFT,
            TableDesktop.ALIGN_CENTER,
            TableDesktop.ALIGN_CENTER,
            TableDesktop.ALIGN_RIGHT,
        ]
    }
}

export default inject('alertStore', 'navStore', 'nftMintStore')((observer(UploadFiles)));

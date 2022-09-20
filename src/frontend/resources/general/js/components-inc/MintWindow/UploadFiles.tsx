import React from 'react';
import { inject, observer } from 'mobx-react';

import S from '../../../../common/js/utilities/Main';
import Config from '../../../../../../../builds/dev-generated/Config';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import AlertStore from '../../../../common/js/stores/AlertStore';
import AppStore from '../../../../common/js/stores/AppStore';
import NftModel from '../../../../common/js/models/NftModel';
import TableHelper from '../../../../common/js/helpers/TableHelper';
import InputStateHelper from '../../../../common/js/helpers/InputStateHelper';
import GeneralApi from '../../../../common/js/api/GeneralApi';

import Button from '../../../../common/js/components-inc/Button';
import Input, { InputType, InputMargin } from '../../../../common/js/components-inc/Input';
import Table from '../../../../common/js/components-inc/Table';
import TableDesktop from '../../../../common/js/components-inc/TableDesktop';
import Actions from '../../../../common/js/components-inc/Actions';
import Checkbox from '../../../../common/js/components-inc/Checkbox';
import FileUpload from '../../../../common/js/components-inc/FileUpload';
import NftStepWrapper from './NftStepWrapper';
import LayoutBlock from '../../../../common/js/components-inc/LayoutBlock';

import SvgTrash from '../../../../common/svg/trash.svg';
import SvgUploadFile from '../../../../common/svg/upload-file.svg';
import '../../../css/components-inc/NftMint/upload-files.css';

interface Props {
    appStore: AppStore;
    nftMintStore: NftMintStore;
    alertStore: AlertStore;
}

const FIELDS = ['link'];

class UploadFiles extends React.Component<Props> {

    imageUrlInputValue: string;

    nodes: any;

    tableHelper: TableHelper;
    uploadLinkInputStateHelper: InputStateHelper;

    constructor(props: Props) {
        super(props);

        this.imageUrlInputValue = S.Strings.EMPTY;

        this.nodes = {
            'fileUpload': React.createRef(),
        };

        this.tableHelper = new TableHelper(S.NOT_EXISTS, [], () => { });
        this.uploadLinkInputStateHelper = new InputStateHelper(FIELDS, (key, value) => {
            switch (key) {
                case FIELDS[0]:
                    this.imageUrlInputValue = value;
                    break;
                default:
            }
        });
    }

    makeImageUploadParams() {
        return {
            'maxSize': 1 << 20, // 1MB
            'fileExt': '.jpeg, .jpg, .png, .gif, .svg, .mp4, .mpeg, .webp, .webm, .mp3, .wav, .ogg, .gltf, .glb',
            'controller': '#',
            'multi': this.props.nftMintStore.navMintStore.isMintOptionMultiple(),
            'progressWindow': false,
            'onExceedLimit': () => {
                this.props.alertStore.show('Max files size is 1MB');
            },
            'onExtError': () => {
                this.props.alertStore.show('You have selected an unsupported file type');
            },
            'onUpload': async (base64File, response, files: any[], i: number) => {
                this.imageUrlInputValue = S.Strings.EMPTY;
                await this.props.nftMintStore.addNftFromUpload(base64File, files[i].name, files[i].type, files[i].size);
            },
            'fileSizeLimitDelegate': () => {
                return this.props.nftMintStore.getFreeNftsSlots();
            },
        }
    }

    onClickUploadFile = async () => {
        if (this.uploadLinkInputStateHelper.getValues() === null) {
            return;
        }

        try {
            this.props.appStore.disableActions();
            const ajax = await new GeneralApi(null, null, this.props.alertStore.show).download(this.imageUrlInputValue);

            const imageArrayBuffer = ajax.responseText
            const file = new File([imageArrayBuffer], `NFT-${Date.now()}`, {
                type: ajax.getResponseHeader('content-type'),
            });

            const uploader = this.nodes.fileUpload.current.getUploader();
            uploader.uploadFiles([file]);

        } catch (e) {
        } finally {
            this.props.appStore.enableActions();
        }
    }

    onChangeUploadUrl = (value: string) => {
        this.imageUrlInputValue = value;
    }

    render() {
        const navMintStore = this.props.nftMintStore.navMintStore;

        this.uploadLinkInputStateHelper.updateValues([
            this.imageUrlInputValue,
        ]);

        return (
            <NftStepWrapper
                className={'UploadFiles'}
                stepNumber={`Step ${navMintStore.getMintStepShowNumber()}`}
                stepName={'Upload File'} >
                <div className={`FileAddRow FlexRow ${S.CSS.getActiveClassName(this.props.nftMintStore.shouldProhibitMoreNfts())}`}>
                    <FileUpload
                        ref={this.nodes.fileUpload}
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
                    <LayoutBlock className={'FileFromLink'} direction={LayoutBlock.DIRECTION_ROW} >
                        <Input
                            label={'Add file from link'}
                            className={'LinkInput'}
                            inputType={InputType.TEXT}
                            placeholder={'https://www.mywebsite.com/item'}
                            value={this.uploadLinkInputStateHelper.values.get(FIELDS[0])}
                            error={this.uploadLinkInputStateHelper.errors.get(FIELDS[0])}
                            onChange={this.uploadLinkInputStateHelper.onChanges.get(FIELDS[0])}
                            margin={InputMargin.NORMAL} />
                        <Actions className={'UploadActions'} height={Actions.HEIGHT_42}>
                            <Button
                                color={Button.COLOR_SCHEME_1}
                                radius={Button.RADIUS_MAX}
                                type={Button.TYPE_ROUNDED}
                                padding={Button.PADDING_24}
                                onClick={this.onClickUploadFile}>
                                Upload File
                            </Button>
                        </Actions>
                    </LayoutBlock>
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
        const { appStore, nftMintStore } = this.props;
        const navMintStore = nftMintStore.navMintStore;

        return this.props.nftMintStore.nfts.map((nft: NftModel, index: number) => {
            let cells = [];

            if (navMintStore.isMintOptionMultiple()) {
                cells.push(Table.cell(
                    <Checkbox
                        value={this.props.nftMintStore.isNftSelected(index)}
                        onChange={() => this.props.nftMintStore.onSelectNft(index)}
                    />,
                ));
            }

            cells = cells.concat([
                Table.cell(
                    <div className={'FlexRow FileNameColumn'}>
                        <img className={'ImagePreview'} src={nft.getPreviewUrl(appStore.workerQueueHelper)} />
                        <span className ={ 'Dots' }>{nft.fileName}</span>
                    </div>,
                ),
                Table.cellString(nft.type),
                Table.cellString(NftModel.getImageSizeString(nft)),
                Table.cell(
                    <div className={'SVG IconRemove'} dangerouslySetInnerHTML={{ __html: SvgTrash }} onClick={() => this.props.nftMintStore.removeNft(index)}></div>,
                ),
            ]);

            return Table.row(cells);
        })
    }

    getTableLegend() {
        const navMintStore = this.props.nftMintStore.navMintStore;

        let legends = [];

        if (navMintStore.isMintOptionMultiple()) {
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
        const navMintStore = this.props.nftMintStore.navMintStore;

        if (navMintStore.isMintOptionMultiple()) {
            return ['5%', '30%', '20%', '15%', '35%']
        }

        return ['35%', '20%', '15%', '35%'];
    }

    getTableAligns() {
        const navMintStore = this.props.nftMintStore.navMintStore;

        if (navMintStore.isMintOptionMultiple()) {
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

export default inject('appStore', 'alertStore', 'nftMintStore')((observer(UploadFiles)));

/* global TR */

import React, { RefObject } from 'react';
import { inject, observer } from 'mobx-react';

import WalletStore from '../../../common/js/stores/WalletStore';
import NftStore from '../../../common/js/stores/NftStore';

import PageComponent from '../../../common/js/components-pages/PageComponent';
import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';
import Actions from '../../../common/js/components-inc/Actions';
import Button from '../../../common/js/components-inc/Button';

import './../../css/components-pages/page-home-component.css';
import AlertStore from '../../../common/js/stores/AlertStore';
import NftImageModel from '../../../common/js/models/NftImageModel';
import NftModel from '../../../common/js/models/NftModel';
import UploaderComponent from '../../../common/js/components-core/UploaderComponent';
import CGeneralContext from '../CGeneralContext';
import NftImageUploadRes from '../../../common/js/network-responses/NftImageUploadRes';
import SvgAttachment from '../../../common/svg/upload.svg';

interface Props extends ContextPageComponentProps {
    walletStore: WalletStore,
    nftStore: NftStore,
    alertStore: AlertStore,
}

export default class InnerPageComponent extends ContextPageComponent < Props > {

    static layout() {
        const MobXComponent = inject('appStore', 'walletStore', 'nftStore', 'alertStore')(observer(InnerPageComponent));
        PageComponent.layout(<MobXComponent />);
    }

    iNodes: {
        'uploader': RefObject<UploaderComponent>,
    };

    constructor(props: Props) {
        super(props);

        this.iNodes = {
            'uploader': React.createRef(),
        };

    }

    async componentDidMount(): Promise<void> {
        super.componentDidMount();
        try {
            await this.props.nftStore.init();
        } catch (e) {
            this.props.alertStore.show('Failed to connect to node.');
        }
    }

    getPageLayoutComponentCssClassName() {
        return 'PageInner';
    }

    onClickToggleKeplr = async () => {
        const walletStore = this.props.walletStore;

        if (walletStore.isKeplrConnected() === true) {
            await walletStore.disconnectKeplr();
        } else {
            await walletStore.connectKeplr();
        }
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


    onClickMintNft = () => {
        try {
            this.props.nftStore.nftForm = NftModel.fromJSON({
                name: 'testNft',
                uri: this.props.nftStore.nftImage.imageUrl,
                data: 'testData',
                owner: 'cudos15hkd2zzyug7v2cv30kq55h5zquegjwm35k9h0y',
            })

            console.log(this.props.nftStore.nftImage)
            console.log(this.props.nftStore.nftForm)
            this.props.nftStore.mintNft();
        } catch (e) {
            console.log(e);
            this.props.alertStore.show('Failed to mint nft.');
        }
    }

    renderContent() {
        const walletStore = this.props.walletStore;
        return (
            <div style = { { 'flex': '1 1 auto' } } className = { 'FlexSingleCenter' } >
                <Actions>
                    <Button type = { Button.TYPE_ROUNDED } color = { Button.COLOR_SCHEME_1 } onClick = { this.onClickToggleKeplr } >
                        { walletStore.isKeplrConnected() === true && (
                            'Disconnect keplr'
                        ) }
                        { walletStore.isKeplrConnected() === false && (
                            'Connect keplr'
                        ) }
                    </Button>
                    <Button type = { Button.TYPE_ROUNDED } color = { Button.COLOR_SCHEME_2 } onClick = { this.onClickMintNft } > Mint nft </Button>
                </Actions>
                <div className={`UploadCnt FlexColumn`} onDrop={this.onDrop} >
                    <div className={'UploadTitle FlexRow'} >
                        <div className={'SVG IconAttachment'} dangerouslySetInnerHTML={{ __html: SvgAttachment }} />
                        Drop your file here or&nbsp;<span>click here to add</span>
                    </div>
                    <div className={'UploadDesc'} > Upload anything you want. There is no limit. </div>
                    <UploaderComponent
                        ref={this.iNodes.uploader}
                        id={this.props.nftStore.nftForm}
                        params={this.makeImageUploadParams()} />
                </div>
                <div>
                    {this.props.nftStore.nfts.map((nft) => <div key={nft.tokenId}>{nft.name}</div>)}
                </div>
                { walletStore.isKeplrConnected() === true && walletStore.keplrWallet.accountAddress }
            </div>
        )
    }
}

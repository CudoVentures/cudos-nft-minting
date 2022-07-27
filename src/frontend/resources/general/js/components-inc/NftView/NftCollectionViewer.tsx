import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';
import WalletStore from '../../../../common/js/stores/WalletStore';
import NavStore from '../../../../common/js/stores/NavStore';

import NftCollectionModel from '../../../../common/js/models/NftCollectionModel';
import NftModelsViewer from './NftModelsViewer';
import NftViewer from './NftViewer';

import SvgArrowLeft from '../../../../common/svg/arrow-left.svg';
import SvgPlus from '../../../../common/svg/plus.svg';
import '../../../css/components-inc/NftView/nft-collection-viewer.css'

interface Props {
    myNftsStore: MyNftsStore;
    navStore: NavStore;
    nftCollectionModel: NftCollectionModel;
    walletStore: WalletStore;
}

class NftCollectionViewer extends React.Component<Props> {

    onClickBack = () => {
        this.props.myNftsStore.markNftCollection(null);
    }

    onClickAddNfts = () => {
        this.props.navStore.innitiateAddNftsToCollection(this.props.nftCollectionModel);
    }

    render() {
        const nftCollectionModel = this.props.nftCollectionModel;
        const nftModels = this.props.myNftsStore.getNftsInCollection(nftCollectionModel.denomId);
        return (
            <div className={'NftCollectionViewer'} >
                <div className={'NavigationBack FlexRow'} onClick={this.onClickBack} >
                    <div className={'SVG IconBack'} dangerouslySetInnerHTML={{ __html: SvgArrowLeft }} />
                    Back to My NFTs
                </div>
                <NftViewer
                    nftCollectionModel={nftCollectionModel}
                    onSendAsGiftSuccess={this.onClickBack} />
                <div className={'NftModelsLabel FlexRow FlexSplit'} >
                    <div className={'NftModelsLabelHeading'}>NFTs in this collection</div>
                    <div className={'NftModelsCount'}>Items {nftModels.length}</div>
                    { this.props.nftCollectionModel.isOwn(this.props.walletStore.keplrWallet.accountAddress) === true
                        && <div className={'StartRight FlexRow AddMoreButton'} onClick={this.onClickAddNfts}>
                            <div className={'SVG'} dangerouslySetInnerHTML={{ __html: SvgPlus }} />
                            <div className={'AddMoreButtonText'}>Add more NFTs to Collection</div>
                        </div>}
                </div>
                <NftModelsViewer nftModels={nftModels} />
            </div >
        )
    }

}

export default inject('navStore', 'walletStore', 'myNftsStore')(observer(NftCollectionViewer));

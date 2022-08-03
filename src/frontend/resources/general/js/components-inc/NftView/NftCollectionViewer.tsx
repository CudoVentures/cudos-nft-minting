import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';
import WalletStore from '../../../../common/js/stores/WalletStore';
import NavStore from '../../../../common/js/stores/NavStore';

import NftCollectionModel from '../../../../common/js/models/NftCollectionModel';
import NftModelsViewer from './NftModelsViewer';
import NftViewer from './NftViewer';
import TableDesktop from '../../../../common/js/components-inc/TableDesktop';
import SingleRowTable from '../../../../common/js/components-inc/SingleRowTable';
import LoadingIndicator from '../../../../common/js/components-core/LoadingIndicator';

import SvgArrowLeft from '../../../../common/svg/arrow-left.svg';
import SvgPlus from '../../../../common/svg/plus.svg';
import '../../../css/components-inc/NftView/nft-collection-viewer.css'

interface Props {
    myNftsStore?: MyNftsStore;
    navStore?: NavStore;
    walletStore?: WalletStore;
    nftCollectionModel: NftCollectionModel;
}

class NftCollectionViewer extends React.Component<Props> {

    componentDidMount(): void {
        this.props.myNftsStore.fetchViewingModels();
    }

    onClickBack = () => {
        this.props.myNftsStore.markNftCollection(null);
    }

    onClickAddNfts = () => {
        this.props.navStore.innitiateAddNftsToCollection(this.props.nftCollectionModel);
    }

    render() {
        const myNftsStore = this.props.myNftsStore;
        const nftCollectionModel = this.props.nftCollectionModel;
        const nftModels = myNftsStore.getNftModelsViewingCollection();

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
                    <div className={'NftModelsCount'}>Items {nftModels?.length}</div>
                    { this.props.nftCollectionModel.isOwn(this.props.walletStore.keplrWallet.accountAddress) === true && (
                        <div className={'StartRight FlexRow AddMoreButton'} onClick={this.onClickAddNfts}>
                            <div className={'SVG'} dangerouslySetInnerHTML={{ __html: SvgPlus }} />
                            <div className={'AddMoreButtonText'}>Add more NFTs to Collection</div>
                        </div>
                    )}
                </div>

                <SingleRowTable
                    className={'NftModelsViewerTable'}
                    legend={['']}
                    widths={['100%']}
                    aligns={[TableDesktop.ALIGN_CENTER]}
                    helper={myNftsStore.tableHelperNftCollection}
                    rows={SingleRowTable.singleCell((
                        <>
                            { nftModels.length === 0 && myNftsStore.isFetchingNftModels() === true
                                ? (
                                    <LoadingIndicator margin={'16px'}/>
                                ) : (
                                    <NftModelsViewer nftModels={nftModels} />
                                ) }
                        </>
                    ))}
                    noRowsContent={<div className={'NoNfts'}>There are no NFTs in the collection</div>} />

            </div >
        )
    }

}

export default inject('navStore', 'walletStore', 'myNftsStore')(observer(NftCollectionViewer));

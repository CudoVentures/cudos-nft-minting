import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';

import NftCollectionModel from '../../../../common/js/models/NftCollectionModel';
import NftModelsViewer from './NftModelsViewer';

import SvgArrowLeft from '../../../../common/svg/arrow-left.svg';
import '../../../css/components-inc/NftView/nft-collection-viewer.css'

interface Props {
    myNftsStore: MyNftsStore;
    nftCollectionModel: NftCollectionModel;
}

class NftCollectionViewer extends React.Component < Props > {

    render() {
        const nftCollectionModel = this.props.nftCollectionModel;
        const nftModels = this.props.myNftsStore.getNftsInCollection(nftCollectionModel.denomId);

        return (
            <div className = { 'NftCollectionViewer' } >
                <div className = { 'NavigationBack FlexRow' } >
                    <div className = { 'SVG IconBack' } dangerouslySetInnerHTML = {{ __html: SvgArrowLeft }} />
                    Back to My NFTs
                </div>
                <div className = { 'NftModelsLabel' } >NFTs in this collection</div>
                <NftModelsViewer nftModels = { nftModels } />
            </div>
        )
    }

}

export default inject('myNftsStore')(observer(NftCollectionViewer));

import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';

import NftModel from '../../../../common/js/models/NftModel';
import NftViewer from './NftViewer';

import SvgArrowLeft from '../../../../common/svg/arrow-left.svg';
import '../../../css/components-inc/NftView/nft-model-viewer.css'

interface Props {
    myNftsStore: MyNftsStore;
    nftModel: NftModel;
}

class NftModelViewer extends React.Component < Props > {

    onClickBack = () => {
        this.props.myNftsStore.markNft(null);
    }

    render() {
        const nftModel = this.props.nftModel;

        return (
            <div className = { 'NftModelViewer' } >
                <div className = { 'NavigationBack FlexRow' } onClick = { this.onClickBack } >
                    <div className = { 'SVG IconBack' } dangerouslySetInnerHTML = {{ __html: SvgArrowLeft }} />
                    Back to My NFTs
                </div>
                <NftViewer
                    img = { nftModel.uri }
                    collection = { 'collection' }
                    name = { nftModel.name }
                    txHash = { '0x123123' }
                    tokenId = { nftModel.tokenId } />
            </div>
        )
    }

}

export default inject('myNftsStore')(observer(NftModelViewer));

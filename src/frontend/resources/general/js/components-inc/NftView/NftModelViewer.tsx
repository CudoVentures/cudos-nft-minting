import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';

import NftModel from '../../../../common/js/models/NftModel';
import NftCollectionModel from '../../../../common/js/models/NftCollectionModel';
import NftViewer from './NftViewer';

import SvgArrowLeft from '../../../../common/svg/arrow-left.svg';
import '../../../css/components-inc/NftView/nft-model-viewer.css'

interface Props {
    myNftsStore: MyNftsStore;
    nftModel: NftModel;
    nftCollectionModel: NftCollectionModel | null;
}

class NftModelViewer extends React.Component < Props > {

    static defaultProps: any;

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
                    nftModel = { nftModel }
                    nftCollectionModel = { this.props.nftCollectionModel } />
            </div>
        )
    }

}

NftModelViewer.defaultProps = {
    nftCollectionModel: null,
};

export default inject('myNftsStore')(observer(NftModelViewer));

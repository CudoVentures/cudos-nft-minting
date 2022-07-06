import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';

import NftCollectionModel from '../../../../common/js/models/NftCollectionModel';
import ProjectUtils from '../../../../common/js/ProjectUtils';

import '../../../css/components-inc/NftView/nft-collections-viewer.css'

interface Props {
    myNftsStore: MyNftsStore;
    nftCollectionModels: NftCollectionModel[];
}

class NftCollectionsViewer extends React.Component < Props > {

    onClickCollection(nftCollectionModel: NftCollectionModel) {
        this.props.myNftsStore.markNftCollection(nftCollectionModel);
    }

    render() {
        return (
            <div className = { 'NftCollectionsViewer' } >
                { this.props.nftCollectionModels.map((nftCollectionModel: NftCollectionModel) => {
                    return (
                        <div
                            key = { nftCollectionModel.denomId }
                            className = { 'NftCollectionModel' }
                            onClick = { this.onClickCollection.bind(this, nftCollectionModel) } >
                            <div className = { 'NftCollectionImg ImgCoverNode' } style = { ProjectUtils.makeBgImgStyle(nftCollectionModel.uri) } />
                            <div className = { 'NftCollectionName' } > { nftCollectionModel.name } </div>
                        </div>
                    )
                }) }
            </div>
        )
    }

}

export default inject('myNftsStore')(observer(NftCollectionsViewer));

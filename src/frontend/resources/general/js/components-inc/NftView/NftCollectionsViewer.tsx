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
        const myNftsStore = this.props.myNftsStore;

        return (
            <div className = { 'NftCollectionsViewer' } >
                { this.props.nftCollectionModels.map((nftCollectionModel: NftCollectionModel) => {
                    const nftModels = myNftsStore.getNftsInCollection(nftCollectionModel.denomId);
                    return (
                        <div
                            key = { nftCollectionModel.denomId }
                            className = { 'NftCollectionModel' }
                            onClick = { this.onClickCollection.bind(this, nftCollectionModel) } >
                            <div className = { 'NftCollectionImg ImgCoverNode' } style = { ProjectUtils.makeBgImgStyle(nftModels[0].url) } />
                            <div className = { 'NftCollectionName' } title = { nftCollectionModel.name } > { nftCollectionModel.name } </div>
                        </div>
                    )
                }) }
            </div>
        )
    }

}

export default inject('myNftsStore')(observer(NftCollectionsViewer));

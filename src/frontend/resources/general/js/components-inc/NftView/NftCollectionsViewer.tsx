import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';
import AppStore from '../../../../common/js/stores/AppStore';

import NftCollectionModel from '../../../../common/js/models/NftCollectionModel';
import ProjectUtils from '../../../../common/js/ProjectUtils';

import '../../../css/components-inc/NftView/nft-collections-viewer.css'

interface Props {
    appStore: AppStore;
    myNftsStore: MyNftsStore;
    nftCollectionModels: NftCollectionModel[];
}

class NftCollectionsViewer extends React.Component < Props > {

    onClickCollection(nftCollectionModel: NftCollectionModel) {
        this.props.myNftsStore.markNftCollection(nftCollectionModel);
    }

    render() {
        const appStore = this.props.appStore;
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
                            <div className = { 'NftCollectionImg ImgCoverNode' } style = { ProjectUtils.makeBgImgStyle(myNftsStore.getPreviewUrl(nftCollectionModel.denomId, appStore.workerQueueHelper)) } />
                            <div className = { 'NftCollectionName' } title = { nftCollectionModel.name } > { nftCollectionModel.name } </div>
                        </div>
                    )
                }) }
            </div>
        )
    }

}

export default inject('appStore', 'myNftsStore')(observer(NftCollectionsViewer));

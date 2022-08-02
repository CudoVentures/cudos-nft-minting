import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';
import AppStore from '../../../../common/js/stores/AppStore';

import NftCollectionModel from '../../../../common/js/models/NftCollectionModel';
import ProjectUtils from '../../../../common/js/ProjectUtils';

import '../../../css/components-inc/NftView/nft-collections-viewer.css'
import S from '../../../../common/js/utilities/Main';

interface Props {
    appStore: AppStore;
    myNftsStore: MyNftsStore;
    nftCollectionModels: NftCollectionModel[];
}

class NftCollectionsViewer extends React.Component<Props> {

    onClickCollection(nftCollectionModel: NftCollectionModel) {
        this.props.myNftsStore.markNftCollection(nftCollectionModel);
    }

    render() {
        const appStore = this.props.appStore;
        const myNftsStore = this.props.myNftsStore;
        const nftCollectionModels = this.props.nftCollectionModels;

        return (
            <div className={`NftCollectionsViewer ${S.CSS.getClassName(nftCollectionModels.length > 0, 'HasCollections')}`} >
                {nftCollectionModels.map((nftCollectionModel: NftCollectionModel) => {
                    return (
                        <div
                            key={nftCollectionModel.denomId}
                            className={'NftCollectionModel'}
                            onClick={this.onClickCollection.bind(this, nftCollectionModel)} >
                            <div className={'NftCollectionImg ImgCoverNode'} style={ProjectUtils.makeBgImgStyle(myNftsStore.getPreviewUrl(nftCollectionModel.denomId, appStore.workerQueueHelper))} />
                            <div className={'NftCollectionName Dots'} title={nftCollectionModel.name} > {nftCollectionModel.name} </div>
                        </div>
                    )
                })}
                {nftCollectionModels.length === 0 && (
                    <div className={'NoNfts'}>There are no collections for this address.</div>
                )}
            </div>
        )
    }

}

export default inject('appStore', 'myNftsStore')(observer(NftCollectionsViewer));

import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';
import AppStore from '../../../../common/js/stores/AppStore';

import NftModel from '../../../../common/js/models/NftModel';
import ProjectUtils from '../../../../common/js/ProjectUtils';

import '../../../css/components-inc/NftView/nft-models-viewer.css'

interface Props {
    appStore: AppStore;
    myNftsStore: MyNftsStore;
    nftModels: NftModel[];
}

class NftModelsViewer extends React.Component < Props > {

    onClickNft(nftModel: NftModel) {
        this.props.myNftsStore.markNft(nftModel);
    }

    render() {
        const appStore = this.props.appStore;

        return (
            <div className = { 'NftModelsViewer' } >
                { this.props.nftModels.map((nftModel: NftModel) => {
                    return (
                        <div
                            key = { nftModel.tokenId }
                            className = { 'NftModel' }
                            onClick = { this.onClickNft.bind(this, nftModel) } >
                            <div className = { 'NftImg ImgCoverNode Transition' } style = { ProjectUtils.makeBgImgStyle(nftModel.getPreviewUrl(appStore.workerQueueHelper)) } />
                            <div className = { 'NftName' } title = { nftModel.name } > { nftModel.name } </div>
                        </div>
                    )
                }) }
            </div>
        )
    }

}

export default inject('appStore', 'myNftsStore')(observer(NftModelsViewer));

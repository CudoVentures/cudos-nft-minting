import React from 'react';
import NftModel from '../../../../common/js/models/NftModel';

import '../../../css/components-inc/NftView/nft-model-viewer.css'

interface Props {
    nftModel: NftModel;
}

export default class NftModelViewer extends React.Component < Props > {

    render() {
        return (
            <div className = { 'NftModelViewer' } >
                NftModelViewer
            </div>
        )
    }

}

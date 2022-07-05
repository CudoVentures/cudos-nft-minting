import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';

import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';

import '../../../css/components-inc/MyNftsWindow/list-nfts.css'

interface Props {
    myNftsStore: MyNftsStore;
}

class ListNfts extends React.Component < Props > {

    render() {
        const myNftsStore = this.props.myNftsStore;

        return (
            <div className = { 'ListNfts' } >
                <div className = { 'NftListFilter' } >
                    <Actions
                        height = { Actions.HEIGHT_42 } >

                        <Button
                            color = { Button.COLOR_SCHEME_3 } >
                            Single NFTs ({myNftsStore.nftModels.length})
                        </Button>

                        <Button
                            type = { Button.TYPE_TEXT_INLINE }
                            color = { Button.COLOR_SCHEME_2 } >
                            Collections ({myNftsStore.nftCollectionModels.length})
                        </Button>

                    </Actions>
                </div>
            </div>
        )
    }

}

export default inject('myNftsStore')(observer(ListNfts));

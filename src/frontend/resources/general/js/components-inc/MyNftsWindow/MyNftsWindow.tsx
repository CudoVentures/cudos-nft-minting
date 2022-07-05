import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';

import NoNfts from './NoNfts';
import ListNfts from './ListNfts';

import '../../../css/components-inc/MyNftsWindow/my-nfts-window.css';

interface Props {
    myNftsStore: MyNftsStore;
}

class MyNftsWindow extends React.Component < Props > {

    render() {
        const myNftsStore = this.props.myNftsStore;
        return (
            <div className = { 'MyNftsWindow FlexGrow FlexColumn' } >
                { myNftsStore.hasNfts() === false && <NoNfts /> }
                { myNftsStore.hasNfts() === true && <ListNfts /> }
            </div>
        )
    }

}

export default inject('myNftsStore')(observer(MyNftsWindow));

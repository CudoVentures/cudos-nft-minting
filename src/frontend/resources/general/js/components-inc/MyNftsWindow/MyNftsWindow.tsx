import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';

import ListNfts from './ListNfts';
import NoNfts from './NoNfts';
import LoadingIndicator from '../../../../common/js/components-core/LoadingIndicator';

import '../../../css/components-inc/MyNftsWindow/my-nfts-window.css';

interface Props {
    myNftsStore?: MyNftsStore;
}

class MyNftsWindow extends React.Component < Props > {

    async componentDidMount() {
        await this.props.myNftsStore.fetchNftCounts();
    }

    render() {
        const myNftsStore = this.props.myNftsStore;
        return (
            <div className = { 'MyNftsWindow FlexGrow FlexColumn' } >
                { myNftsStore.areCountsFetched() === false && <LoadingIndicator margin={'auto'}/>}
                { myNftsStore.areCountsFetched() === true && myNftsStore.hasNfts() === false && <NoNfts /> }
                { myNftsStore.areCountsFetched() === true && myNftsStore.hasNfts() === true && <ListNfts /> }
            </div>
        )
    }
}

export default inject('myNftsStore')(observer(MyNftsWindow));

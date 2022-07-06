import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';

import NoNfts from './NoNfts';
import ListNfts from './ListNfts';

import '../../../css/components-inc/MyNftsWindow/my-nfts-window.css';
import LoadingIndicator from '../../../../common/js/components-core/LoadingIndicator';

interface Props {
    myNftsStore: MyNftsStore;
}

class MyNftsWindow extends React.Component < Props > {

    async componentDidMount(): Promise < void > {
        await this.props.myNftsStore.fetchNfts();
    }

    render() {
        const myNftsStore = this.props.myNftsStore;
        return (
            <div className = { 'MyNftsWindow FlexGrow FlexColumn' } >
                { myNftsStore.isInitialized() === false && (
                    <LoadingIndicator margin = { 'auto' } />
                )}
                { myNftsStore.isInitialized() === true && (
                    <>
                        { myNftsStore.hasNfts() === false && <NoNfts /> }
                        { myNftsStore.hasNfts() === true && <ListNfts /> }
                    </>
                )}
            </div>
        )
    }
}

export default inject('myNftsStore')(observer(MyNftsWindow));

import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';

import ListNfts from './ListNfts';

import '../../../css/components-inc/MyNftsWindow/my-nfts-window.css';
import NoNfts from './NoNfts';
import LoadingIndicator from '../../../../common/js/components-core/LoadingIndicator';

interface Props {
    myNftsStore: MyNftsStore;
}

interface State {
    loadingCounts: boolean;
}

class MyNftsWindow extends React.Component < Props, State > {
    constructor(props) {
        super(props);

        this.state = {
            loadingCounts: true,
        }
    }

    componentDidMount() {
        this.props.myNftsStore.fetchNftCounts(() => this.setState({ loadingCounts: false }));
    }

    render() {
        const myNftsStore = this.props.myNftsStore;
        return (
            <div className = { 'MyNftsWindow FlexGrow FlexColumn' } >
                { this.state.loadingCounts === true && <LoadingIndicator margin={'auto'}/>}
                { this.state.loadingCounts === false && myNftsStore.hasNfts() === false && <NoNfts /> }
                { this.state.loadingCounts === false && myNftsStore.hasNfts() === true && <ListNfts /> }
            </div>
        )
    }
}

export default inject('myNftsStore')(observer(MyNftsWindow));

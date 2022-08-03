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

interface State {
    hasNfts: boolean;
}

class MyNftsWindow extends React.Component < Props, State > {

    constructor(props: Props) {
        super(props);

        this.state = {
            hasNfts: true,
        }
    }

    async componentDidMount() {
        const myNftsStore = this.props.myNftsStore;
        await myNftsStore.fetchDataCounts();
        this.setState({
            hasNfts: myNftsStore.hasNfts(),
        })
    }

    render() {
        const myNftsStore = this.props.myNftsStore;
        return (
            <div className = { 'MyNftsWindow FlexGrow FlexColumn' } >
                { myNftsStore.areCountsFetched() === false && <LoadingIndicator margin={'auto'}/>}
                { myNftsStore.areCountsFetched() === true && this.state.hasNfts === false && <NoNfts /> }
                { myNftsStore.areCountsFetched() === true && this.state.hasNfts === true && <ListNfts /> }
            </div>
        )
    }
}

export default inject('myNftsStore')(observer(MyNftsWindow));

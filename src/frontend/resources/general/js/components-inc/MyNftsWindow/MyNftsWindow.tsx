import React from 'react';
import { inject, observer } from 'mobx-react';

import ListNfts from './ListNfts';

import '../../../css/components-inc/MyNftsWindow/my-nfts-window.css';

interface Props {
}

class MyNftsWindow extends React.Component < Props > {

    render() {
        return (
            <div className = { 'MyNftsWindow FlexGrow FlexColumn' } >
                <ListNfts />
            </div>
        )
    }
}

export default inject('myNftsStore')(observer(MyNftsWindow));

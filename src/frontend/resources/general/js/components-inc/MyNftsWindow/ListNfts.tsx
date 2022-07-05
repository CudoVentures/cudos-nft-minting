import React from 'react';
import { inject, observer } from 'mobx-react';

import '../../../css/components-inc/MyNftsWindow/list-nfts.css'

class ListNfts extends React.Component {

    render() {
        return (
            <div className = { 'ListNfts' } >
                Looks like...
            </div>
        )
    }

}

export default inject('myNftsStore')(observer(ListNfts));

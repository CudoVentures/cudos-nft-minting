import React from 'react';
import { inject, observer } from 'mobx-react';

import NavStore from '../../../../common/js/stores/NavStore';

import Config from '../../../../../../../builds/dev-generated/Config';
import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';

import '../../../css/components-inc/MyNftsWindow/no-nfts.css'

interface Props {
    navStore: NavStore
}

class NoNfts extends React.Component < Props > {

    onClickMintNft = () => {
        this.props.navStore.selectNftMintPage();
    }

    render() {
        return (
            <div className = { 'NoNfts FlexGrow FlexSingleCenter' } >
                <div className = { 'ComponentContent FlexColumn' } >
                    <img className = { 'IconImg' } src={`${Config.URL.RESOURCES}/common/img/nfts/no-nft.png`} />
                    <label>Looks like you haven’t minted anything yet.</label>
                    <Actions height = { Actions.HEIGHT_60 } >
                        <Button
                            className = { 'MintButton' }
                            type = { Button.TYPE_ROUNDED }
                            padding = { Button.PADDING_96 }
                            radius = { Button.RADIUS_MAX }
                            onClick = { this.onClickMintNft } >
                            Mint NFT
                        </Button>
                    </Actions>
                </div>
            </div>
        )
    }

}

export default inject('navStore')(observer(NoNfts));

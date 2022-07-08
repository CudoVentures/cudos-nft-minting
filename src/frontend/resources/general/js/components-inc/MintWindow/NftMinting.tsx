import { inject, observer } from 'mobx-react';
import React from 'react';
import SvgMintingWaves from '../../../../common/svg/loading-waves.svg'
import '../../../css/components-inc/NftMint/nft-minting.css'

export default class NftMinting extends React.Component {
    render() {
        return (
            <div className={'NftMinting FlexColumn FlexGrow'}>
                <div className={'SVG Icon Size Background'} dangerouslySetInnerHTML={{ __html: SvgMintingWaves }}></div>
                <div className={'Heading4'} >Minting in progress...</div>
                <div className={'Description'}>Please don’t close this window. It will be ready in a second.</div>
            </div >
        )
    }
}

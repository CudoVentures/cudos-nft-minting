import React from 'react';

import S from '../../../../common/js/utilities/Main';
import ProjectUtils from '../../../../common/js/ProjectUtils';
import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';

import SvgTwitter from '../../../../common/svg/twitter.svg';
import '../../../css/components-inc/NftView/nft-viewer.css'

interface Props {
    img: string;
    collection: string;
    name: string;
    txHash: string;
    tokenId: string;
}

export default class NftViewer extends React.Component < Props > {

    render() {
        return (
            <div className = { 'NftViewer' } >
                { this.props.img !== S.Strings.EMPTY && (
                    <div>
                        <div className = { 'Img ImgCoverNode' } style = { ProjectUtils.makeBgImgStyle(this.props.img) } />
                    </div>
                ) }
                <div className = { 'NftDataCnt FlexColumn' } >
                    <div className = { 'NftHeader FlexSplit' } >
                        <div className = { 'CollectionName' } >{ this.props.collection }</div>
                        <div className = { 'StartRight FlexRow Share' } >
                            <div className = { 'SVG IconTwitter' } dangerouslySetInnerHTML = {{ __html: SvgTwitter }} />
                            Share on Twitter
                        </div>
                    </div>
                    <div className = { 'NftName' } > { this.props.name } </div>
                    <div className = { 'TxInfo FlexColumn' } >
                        <div className = { 'TxInfoRow FlexSplit' } >
                            <label>Transation Hash</label>
                            <div className = { 'TxInfoBlue StartRight' } > { this.props.txHash } </div>
                        </div>
                        <div className = { 'TxInfoRow FlexSplit' } >
                            <label>Token Standart</label>
                            <div className = { 'StartRight' } > CUDOS Network Native Token </div>
                        </div>
                        <div className = { 'TxInfoRow FlexSplit' } >
                            <label>Collection ID</label>
                            <div className = { 'TxInfoBlue StartRight' } > { this.props.tokenId } </div>
                        </div>
                    </div>
                    <Actions
                        height = { Actions.HEIGHT_60 }
                        layout = { Actions.LAYOUT_ROW_RIGHT } >
                        <Button
                            radius = { Button.RADIUS_MAX }
                            padding = { Button.PADDING_48 } >
                            View details in Explorer
                        </Button>
                    </Actions>
                </div>
            </div>
        )
    }

}

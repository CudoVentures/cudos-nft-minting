import React from 'react';
import '../../css/components-inc/nft-side-preview.css';
import ProjectUtils from '../../../common/js/ProjectUtils';
import NftModel from '../../../common/js/models/NftModel';

interface Props {
    imageUrl?: string;
    name: string;
}

export default class NftSidePreview extends React.Component < Props > {

    static defaultProps: any;

    render() {
        return (
            <div className={`FlexColumn NftPreview ${this.props.imageUrl === '' ? 'EmptyPicture' : ''}`}>
                <div className={'SquareHolder ImgCoverNode'} style = { ProjectUtils.makeBgImgStyle(this.props.imageUrl) } />
                <div className={'NftName Dots'} title = { this.props.name }>{this.props.name === '' ? 'No name' : this.props.name}</div>
            </div>
        )
    }
}

NftSidePreview.defaultProps = {
    imageUrl: NftModel.UNKNOWN_PREVIEW_URL,
};

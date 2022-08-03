import React from 'react';
import '../../css/components-inc/nft-side-preview.css';
import ProjectUtils from '../../../common/js/ProjectUtils';
import ImagePreviewHelper from '../../../common/js/helpers/ImagePreviewHelper';

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
    imageUrl: ImagePreviewHelper.UNKNOWN_PREVIEW_URL,
};

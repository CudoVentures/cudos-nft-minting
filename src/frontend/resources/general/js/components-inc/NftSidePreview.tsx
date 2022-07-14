import React from 'react';
import '../../css/components-inc/nft-side-preview.css';
import SvgEmptyPicture from '../../../common/svg/empty-picture.svg';
import S from '../../../common/js/utilities/Main';
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
                <div className={'NftName'}>{this.props.name === '' ? 'No name' : this.props.name}</div>
            </div>
        )
    }
}

NftSidePreview.defaultProps = {
    imageUrl: NftModel.UNKNOWN_PREVIEW_URL,
};

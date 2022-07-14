import React from 'react';
import '../../css/components-inc/nft-side-preview.css';
import SvgEmptyPicture from '../../../common/svg/empty-picture.svg';
import S from '../../../common/js/utilities/Main';

interface Props {
    imageUrl?: string;
    name: string;
}

export default class NftSidePreview extends React.Component < Props > {

    static defaultProps: any;

    render() {
        return (
            <div className={`FlexColumn NftPreview ${this.props.imageUrl === '' ? 'EmptyPicture' : ''}`}>
                <div className={'SquareHolder'}>
                    {this.props.imageUrl === ''
                        ? <div className={'SVG Icon Center'} dangerouslySetInnerHTML={{ __html: SvgEmptyPicture }} />
                        : <img src={this.props.imageUrl} className={'NftImage Center'} />
                    }
                </div>
                <div className={'NftName'}>{this.props.name === '' ? 'No name' : this.props.name}</div>
            </div>
        )
    }
}

NftSidePreview.defaultProps = {
    imageUrl: S.Strings.EMPTY,
};

import React from 'react';
import '../../css/components-inc/nft-side-preview.css';

interface Props {
    imageUrl: string;
    name: string;
}

interface State {

}

export default class NftSidePreview extends React.Component<Props, State> {
    render() {
        return (
            <div className={'FlexColumn NftPreview'}>
                <img src={this.props.imageUrl} className={'NftImage'} />
                <div className={'NftName'}>{this.props.name === '' ? 'No name' : this.props.name}</div>
            </div>
        )
    }
}

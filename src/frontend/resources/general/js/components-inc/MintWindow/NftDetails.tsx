import { inject, observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import Checkbox from '../../../../common/js/components-inc/Checkbox';
import Input from '../../../../common/js/components-inc/Input';
import LayoutBlock from '../../../../common/js/components-inc/LayoutBlock';
import NftImageModel from '../../../../common/js/models/NftImageModel';
import NftModel from '../../../../common/js/models/NftModel';
import NavStore from '../../../../common/js/stores/NavStore';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import S from '../../../../common/js/utilities/Main';
import '../../../css/components-inc/NftMint/nft-details.css';
import SvgInfo from '../../../../common/svg/info.svg';
import NftSidePreview from '../NftSidePreview';
import Popover from '../../../../common/js/components-inc/Popover';

interface Props {
    nftMintStore: NftMintStore;
}

interface State {

}

class NftDetails extends React.Component<Props, State> {
    anchorEl: any;

    constructor(props) {
        super(props);

        this.anchorEl = null;
    }

    render() {
        const nftImage: NftImageModel = this.props.nftMintStore.nftImages[0];
        const nftForm: NftModel = this.props.nftMintStore.nftForm;

        return (
            <div className={'NftDetails'}>
                <div className={'Heading3'}>NFT Details</div>
                <div className={'FlexRow DetailsHolder'}>
                    <NftSidePreview
                        imageUrl={nftImage.imageUrl}
                        name={nftForm.name}
                        description={nftForm.data}
                    />
                    <LayoutBlock direction={LayoutBlock.DIRECTION_COLUMN} className={'NftDetailsForm'}>
                        <Input
                            className={'NftName'}
                            label={'Nft Name'}
                            placeholder={'E.g. Cool NFT'}
                            value={nftForm.name}
                            onChange={(e: string) => this.props.nftMintStore.onChangeNftFormName(e)}
                        />
                        <div className={'FlexRow'}>
                            <Checkbox
                                value={this.props.nftMintStore.isAddressFieldActive}
                                onChange={() => this.props.nftMintStore.toggleAddressFieldActive()}
                                label={'I want to send this NFT as a gift'}
                            />
                            <div className={'SVG Icon'}
                                dangerouslySetInnerHTML={{ __html: SvgInfo }}
                                onClick={(e) => { this.anchorEl = e.target; this.setState({}); }}
                            ></div>
                            <Popover
                                anchorEl={this.anchorEl}
                                open={this.anchorEl !== null}
                                onClose={() => { this.anchorEl = null; this.setState({}) }} >
                                This options allows you to send the minted NFT as a gift to anyone. Just add their wallet address and the Minted NFT will be received to them.
                            </Popover>
                        </div>
                        {this.props.nftMintStore.isAddressFieldActive === S.INT_TRUE
                            && (<Input
                                className={'NftRecepient'}
                                label={'Recipient Address'}
                                placeholder={'cudos1...'}
                                value={nftForm.owner}
                                onChange={(e: string) => this.props.nftMintStore.onChangeNftFormAddress(e)}
                            />
                            )
                        }
                    </LayoutBlock>
                </div >
            </div >
        )
    }
}

export default inject('nftMintStore')((observer(NftDetails)));

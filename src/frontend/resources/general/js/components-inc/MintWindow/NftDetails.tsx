import { inject, observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import Checkbox from '../../../../common/js/components-inc/Checkbox';
import Input, { InputMargin, InputType } from '../../../../common/js/components-inc/Input';
import LayoutBlock from '../../../../common/js/components-inc/LayoutBlock';
import NftModel from '../../../../common/js/models/NftModel';
import NavStore from '../../../../common/js/stores/NavStore';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import S from '../../../../common/js/utilities/Main';
import '../../../css/components-inc/NftMint/nft-details.css';
import SvgInfo from '../../../../common/svg/info.svg';
import NftSidePreview from '../NftSidePreview';
import Popover from '../../../../common/js/components-inc/Popover';
import ProjectUtils from '../../../../common/js/ProjectUtils';
import NftStepWrapper from './NftStepWrapper';

interface Props {
    nftMintStore: NftMintStore;
    navStore: NavStore;
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
        return (
            <div className={'NftDetails'}>
                {this.props.navStore.isMintOptionSingle()
                    ? this.renderSingleNftDetails()
                    : this.renderMultipleNftDetails()}
            </div>
        )
    }

    renderMultipleNftDetails() {
        const nfts: NftModel[] = this.props.nftMintStore.nfts;
        return (
            <div className={'CollectionModels'} >
                {nfts.map((nft: NftModel, i: number) => (
                    <div
                        key={i}
                        className={'NftModel'}>
                        <div className={'NftImg ImgCoverNode Transition'} style={ProjectUtils.makeBgImgStyle(nft.uri)} />
                        <Input
                            className={'NameInput'}
                            inputType={InputType.TEXT}
                            placeholder={'Add name...'}
                            value={nft.name}
                            margin={InputMargin.DENSE}
                            onChange={this.props.nftMintStore.onChangeNftFormName.bind(this.props.nftMintStore, nft)}
                        />
                    </div>))
                }
            </div>
        )
    }

    renderSingleNftDetails() {
        const nft: NftModel = this.props.nftMintStore.nfts[0];

        return (
            <NftStepWrapper
                className = { 'NftDetails' }
                stepNumber = { `Step ${this.props.navStore.getMintStepShowNumber()}` }
                stepName = { 'NFT Details' } >
                <div className={'FlexRow DetailsHolder'}>
                    <NftSidePreview
                        imageUrl={nft.uri}
                        name={nft.name}
                    />
                    <LayoutBlock direction={LayoutBlock.DIRECTION_COLUMN} className={'NftDetailsForm'}>
                        <Input
                            className={'NftName'}
                            label={'Nft Name'}
                            placeholder={'E.g. Cool NFT'}
                            value={nft.name}
                            onChange={this.props.nftMintStore.onChangeNftFormName.bind(this.props.nftMintStore, nft)}
                        />
                        <div className={'FlexRow'}>
                            <Checkbox
                                value={this.props.nftMintStore.isAddressFieldActive}
                                onChange={this.props.nftMintStore.toggleAddressFieldActive.bind(this.props.nftMintStore)}
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
                            value={nft.recipient}
                            onChange={this.props.nftMintStore.onChangeNftFormAddress.bind(this.props.nftMintStore, nft)}
                        />
                        )
                        }
                    </LayoutBlock>
                </div>
            </NftStepWrapper>

        )

    }
}

export default inject('navStore', 'nftMintStore')((observer(NftDetails)));

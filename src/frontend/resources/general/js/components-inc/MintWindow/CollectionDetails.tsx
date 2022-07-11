import { inject, observer } from 'mobx-react';
import React from 'react';
import Input from '../../../../common/js/components-inc/Input';
import LayoutBlock from '../../../../common/js/components-inc/LayoutBlock';
import NftImageModel from '../../../../common/js/models/NftImageModel';
import NftModel from '../../../../common/js/models/NftModel';
import NavStore from '../../../../common/js/stores/NavStore';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import '../../../css/components-inc/NftMint/collection-details.css';
import SvgInfo from '../../../../common/svg/info.svg';
import NftSidePreview from '../NftSidePreview';
import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';

interface Props {
    nftMintStore: NftMintStore;
    navStore: NavStore;
}

interface State {

}

class CollectionDetails extends React.Component<Props, State> {
    anchorEl: any;

    constructor(props) {
        super(props);

        this.anchorEl = null;
    }

    render() {
        const nftImage: NftImageModel = this.props.nftMintStore.nftImages[0];
        const nftForm: NftModel = this.props.nftMintStore.nftForm;

        return (
            <div className={'CollectionDetails'}>
                <div className={'Heading3'}>Collection Details</div>
                <div className={'FlexRow DetailsHolder'}>
                    <NftSidePreview
                        imageUrl={''}
                        name={this.props.nftMintStore.collectionName}
                    />
                    <LayoutBlock direction={LayoutBlock.DIRECTION_COLUMN} className={'DetailsForm'}>
                        <Input
                            className={'CollectionName'}
                            label={'Collection Name'}
                            placeholder={'E.g. Cool NFT Collection'}
                            value={this.props.nftMintStore.collectionName}
                            onChange={(e: string) => this.props.nftMintStore.onChangeCollectionName(e)}
                        />

                        <div className={'Info FlexRow'}>
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgInfo }} />
                            <div className={'Text'}>The cover image of the collection will be randomly selected from the uploaded NFTs in it.</div>
                        </div>

                        <Actions className={'MintCollectionButton'} layout={Actions.LAYOUT_ROW_RIGHT} height={Actions.HEIGHT_52}>
                            <Button
                                type={Button.TYPE_ROUNDED}
                                radius={Button.RADIUS_MAX}
                                color={Button.COLOR_SCHEME_1}
                                padding={Button.PADDING_24}
                                onClick={this.props.nftMintStore.mintCollection.bind(
                                    this.props.nftMintStore,
                                    () => this.props.navStore.mintStep = NavStore.STEP_MINTING_IN_PROGRESS,
                                    () => this.props.navStore.mintStep = NavStore.STEP_COLLECTION_DETAILS,
                                )
                                }
                            >Mint Collection</Button>
                        </Actions>
                    </LayoutBlock>
                </div >
            </div >
        )
    }
}

export default inject('navStore', 'nftMintStore')((observer(CollectionDetails)));

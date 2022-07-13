import { inject, observer } from 'mobx-react';
import React from 'react';
import Input from '../../../../common/js/components-inc/Input';
import LayoutBlock from '../../../../common/js/components-inc/LayoutBlock';
import NavStore from '../../../../common/js/stores/NavStore';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import '../../../css/components-inc/NftMint/collection-details.css';

import NftSidePreview from '../NftSidePreview';
import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';
import NftStepWrapper from './NftStepWrapper';

import SvgInfo from '../../../../common/svg/info.svg';
import SvgTickCircle from '../../../../common/svg/tick-circle.svg';
// import SvgErrorCircle from '../../../../common/svg/error-circle.svg';
import SvgLinkBox from '../../../../common/svg/link-box.svg';

interface Props {
    nftMintStore: NftMintStore;
    navStore: NavStore;
}

interface State {
    isAfterMintTry: boolean;
    mintingFailed: boolean;
}

class CollectionDetails extends React.Component<Props, State> {
    anchorEl: any;

    constructor(props) {
        super(props);

        this.anchorEl = null;

        this.state = {
            isAfterMintTry: false,
            mintingFailed: false,
        }
    }

    onChangeCollectionName = (value) => {
        this.props.nftMintStore.collectionName = value;
    }

    render() {
        return (
            <NftStepWrapper
                className={'CollectionDetails'}
                stepNumber={`Step ${this.props.navStore.getMintStepShowNumber()}`}
                stepName={'Collection Details'} >
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
                            onChange={this.onChangeCollectionName}
                            readOnly={this.state.isAfterMintTry}
                        />

                        <div className={'Info FlexRow'}>
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgInfo }} />
                            <div className={'Text'}>The cover image of the collection will be randomly selected from the uploaded NFTs in it.</div>
                        </div>

                        {this.state.isAfterMintTry
                            ? <div className={'SuccessMessage FlexColumn'}>
                                <div className={'Heading FlexRow'}>

                                    {this.state.mintingFailed
                                        ? (<>
                                            {/* // TODO: set to error circle */}
                                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTickCircle }} />
                                            <div className={'ErrorMessageText'}>Collection minting failed!</div>
                                        </>)
                                        : (<>
                                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTickCircle }} />
                                            <div className={'SuccessMessageText'}>Collection Was Minted Successfully!</div>
                                        </>)
                                    }
                                </div>
                                {!this.state.mintingFailed
                                    && <div className={'FlexRow TransacionInfo'}>
                                        <div className={'InfoMessage'}>Check transaction details in Explorer</div>
                                        <a href={this.props.nftMintStore.getTxHashLink()}><div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgLinkBox }} /></a>
                                    </div>}
                            </div>
                            : <Actions className={'MintCollectionButton'} layout={Actions.LAYOUT_ROW_RIGHT} height={Actions.HEIGHT_52}>
                                <Button
                                    type={Button.TYPE_ROUNDED}
                                    radius={Button.RADIUS_MAX}
                                    color={Button.COLOR_SCHEME_1}
                                    padding={Button.PADDING_24}
                                    onClick={this.props.nftMintStore.mintCollection.bind(
                                        this.props.nftMintStore,
                                        this.props.navStore.selectStepMintingInProgress.bind(this.props.navStore),
                                        () => {
                                            this.props.navStore.mintStep = NavStore.STEP_COLLECTION_DETAILS;
                                            this.setState({
                                                isAfterMintTry: true,
                                                mintingFailed: false,
                                            })
                                        },
                                        () => {
                                            this.props.navStore.mintStep = NavStore.STEP_COLLECTION_DETAILS;
                                            this.setState({
                                                isAfterMintTry: true,
                                                mintingFailed: true,
                                            })
                                        },
                                    )}
                                >Mint Collection</Button>
                            </Actions>
                        }
                    </LayoutBlock>
                </div >
            </NftStepWrapper >
        )
    }
}

export default inject('navStore', 'nftMintStore')((observer(CollectionDetails)));

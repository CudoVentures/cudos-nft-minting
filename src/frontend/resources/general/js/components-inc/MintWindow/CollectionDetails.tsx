import { inject, observer } from 'mobx-react';
import React from 'react';
import Input from '../../../../common/js/components-inc/Input';
import LayoutBlock from '../../../../common/js/components-inc/LayoutBlock';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import '../../../css/components-inc/NftMint/collection-details.css';

import NftSidePreview from '../NftSidePreview';
import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';
import NftStepWrapper from './NftStepWrapper';

import SvgInfo from '../../../../common/svg/info.svg';
import SvgTickCircle from '../../../../common/svg/tick-circle.svg';
import SvgCloseBtnOutlined from '../../../../common/svg/close-btn-outlined.svg';
import SvgLinkBox from '../../../../common/svg/link-box.svg';

interface Props {
    nftMintStore: NftMintStore;
}

class CollectionDetails extends React.Component<Props> {
    anchorEl: any;

    constructor(props) {
        super(props);

        this.anchorEl = null;
    }

    onChangeDenomId = (value) => {
        const nftMintStore = this.props.nftMintStore;
        const nftCollectionModel = nftMintStore.nftCollection;
        nftCollectionModel.denomId = value;
    }

    onChangeCollectionName = (value) => {
        const nftMintStore = this.props.nftMintStore;
        const nftCollectionModel = nftMintStore.nftCollection;
        nftCollectionModel.name = value;
    }

    render() {
        const nftMintStore = this.props.nftMintStore;
        const navMintStore = nftMintStore.navMintStore;
        const nftCollectionModel = nftMintStore.nftCollection;

        return (
            <NftStepWrapper
                className={'CollectionDetails'}
                stepNumber={`Step ${navMintStore.getMintStepShowNumber()}`}
                stepName={'Collection Details'} >
                <div className={'FlexRow DetailsHolder'}>
                    <NftSidePreview name = { nftCollectionModel.name } />
                    <LayoutBlock direction={LayoutBlock.DIRECTION_COLUMN} className={'DetailsForm'}>
                        <Input
                            label={'Collection  Id'}
                            placeholder={'E.g. Cool NFT Collection'}
                            value={nftCollectionModel.denomId}
                            readOnly={!navMintStore.isCollectionMintedNone()}
                            onChange={this.onChangeDenomId} />
                        <Input
                            label={'Collection Name'}
                            placeholder={'E.g. Cool NFT Collection'}
                            value={nftCollectionModel.name}
                            readOnly={!navMintStore.isCollectionMintedNone()}
                            onChange={this.onChangeCollectionName} />

                        <div className={'Info FlexRow'}>
                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgInfo }} />
                            <div className={'Text'}>The cover image of the collection will be randomly selected from the uploaded NFTs in it.</div>
                        </div>

                        {navMintStore.isCollectionMintedNone() === false ? (
                            <div className={`ResultMessage FlexColumn ${navMintStore.isCollectionMintedFail() ? 'Fail' : ''}`}>
                                <div className={'Heading FlexRow'}>
                                    { navMintStore.isCollectionMintedFail() ? (
                                        <>
                                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgCloseBtnOutlined }} />
                                            <div>Collection minting failed!</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTickCircle }} />
                                            <div>Collection Was Minted Successfully!</div>
                                        </>
                                    ) }
                                </div>
                                { navMintStore.isCollectionMintedSuccess() && (
                                    <div className={'FlexRow TransacionInfo'}>
                                        <div className={'InfoMessage'}>Check transaction details in Explorer</div>
                                        <a href={this.props.nftMintStore.getTxHashLink()}><div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgLinkBox }} /></a>
                                    </div>
                                ) }
                            </div>
                        ) : (
                            <Actions className={'MintCollectionButton'} layout={Actions.LAYOUT_ROW_RIGHT} height={Actions.HEIGHT_52}>
                                <Button
                                    type={Button.TYPE_ROUNDED}
                                    radius={Button.RADIUS_MAX}
                                    color={Button.COLOR_SCHEME_1}
                                    padding={Button.PADDING_24}
                                    onClick={this.props.nftMintStore.mintCollection}>
                                    Mint Collection
                                </Button>
                            </Actions>
                        ) }
                    </LayoutBlock>
                </div>
            </NftStepWrapper >
        )
    }
}

export default inject('nftMintStore')((observer(CollectionDetails)));

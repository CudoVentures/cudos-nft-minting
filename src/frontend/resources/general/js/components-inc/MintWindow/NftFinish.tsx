import { inject, observer } from 'mobx-react';
import React from 'react';
import NftModel from '../../../../common/js/models/NftModel';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import '../../../css/components-inc/NftMint/nft-finish.css';
import NftSidePreview from '../NftSidePreview';
import NavStore from '../../../../common/js/stores/NavStore';
import WalletStore from '../../../../common/js/stores/WalletStore';
import S from '../../../../common/js/utilities/Main';
import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';
import Popover from '../../../../common/js/components-inc/Popover';

import SvgInfo from '../../../../common/svg/info.svg';
import NftStepWrapper from './NftStepWrapper';

interface Props {
    nftMintStore: NftMintStore
    navStore: NavStore
    walletStore: WalletStore
}

interface State {
    feeEstimate: number;
    feeEstimateInDollars: number;
}

class NftFinish extends React.Component<Props, State> {
    anchorEl: any;

    constructor(props) {
        super(props);
        this.anchorEl = null;

        this.state = {
            feeEstimate: 0,
            feeEstimateInDollars: 0,
        }
    }

    async componentDidMount(): Promise<void> {
        const estimate = await this.props.nftMintStore.esimateMintFees();
        let feeEstimateInDollars = 0;
        if (this.props.navStore.isMintOptionMultiple()) {
            // TODO: make real estimation
            feeEstimateInDollars = 1;
        }

        this.setState({ feeEstimate: estimate, feeEstimateInDollars });

    }

    render() {
        const nfts: NftModel[] = this.props.nftMintStore.nfts;

        return (
            <NftStepWrapper
                className = { 'NftFinish' }
                stepNumber = { `Step ${this.props.navStore.getMintStepShowNumber()}` }
                stepName = { 'Summarised Details' } >
                <div className={'FlexRow NftFinishHolder'}>
                    <NftSidePreview
                        imageUrl={this.props.navStore.isMintOptionSingle() ? nfts[0].getPreviewUrl() : ''}
                        name={this.props.navStore.isMintOptionSingle() ? nfts[0].name : this.props.nftMintStore.collectionName}
                    />
                    <div className={'FlexColumn FlexGrow'}>
                        <div className={'FlexColumn SummaryDetails'}>
                            <div className={'SummaryHeading'}>Minting details</div>
                            {this.props.navStore.isMintOptionMultiple()
                                && <div className={'FlexColumn DetailsRow'}>
                                    <div className={'DetailHeading'}>Collection Name</div>
                                    <div className={'DetailData'}>{this.props.nftMintStore.collectionName}</div>
                                </div>}
                            <div className={'FlexRow DetailsRow'}>
                                <div className={'FlexColumnt DetailColumn'}>
                                    <div className={'DetailHeading'}>Items</div>
                                    <div className={'DetailData'}>{this.props.nftMintStore.nfts.length}</div>
                                </div>
                                <div className={'FlexColumnt DetailColumn'}>
                                    <div className={'DetailHeading'}>Mint Type</div>
                                    <div className={'DetailData'}>{NavStore.getMintTypeText(this.props.navStore.mintOption)}</div>
                                </div>

                                <div className={'FlexColumnt DetailColumn'}>
                                    <div className={'DetailHeading'}>Estimated Gas Fee</div>
                                    <div className={'DetailData FlexRow'}>
                                        <div className={`FeeEstimate ${this.props.navStore.isMintOptionSingle() ? 'Crossed' : ''}`}>{this.state.feeEstimate} CUDOS</div>
                                        <div className={'RealPrice FlexRow'}>
                                            {this.props.navStore.isMintOptionSingle()
                                                ? <>
                                                    FREE
                                                    <div
                                                        className={'SVG Icon'}
                                                        dangerouslySetInnerHTML={{ __html: SvgInfo }}
                                                        onClick={(e) => { this.anchorEl = e.target; this.setState({}); }}
                                                    />
                                                    <Popover
                                                        anchorEl={this.anchorEl}
                                                        open={this.anchorEl !== null}
                                                        onClose={() => { this.anchorEl = null; this.setState({}) }} >
                                                        {/* // TODO: get real TEXT */}
                                                        This is free
                                                    </Popover>
                                                </>
                                                : <>{`&dollar; ${this.state.feeEstimateInDollars.toFixed(2)}`}</>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.props.navStore.isMintOptionSingle()
                                && <div className={'FlexColumnt DetailColumn'}>
                                    <div className={'DetailHeading'}>Recipient</div>
                                    <div className={'DetailData'}>{nfts[0].recipient !== S.Strings.EMPTY ? nfts[0].recipient : this.props.walletStore.keplrWallet.accountAddress}</div>
                                </div>}
                        </div>
                        <Actions className={'MintNftButton'} layout={Actions.LAYOUT_ROW_RIGHT} height={Actions.HEIGHT_52}>
                            <Button
                                type={Button.TYPE_ROUNDED}
                                radius={Button.RADIUS_MAX}
                                color={Button.COLOR_SCHEME_1}
                                padding={Button.PADDING_24}
                                onClick={this.props.nftMintStore.mintNfts.bind(
                                    this.props.nftMintStore,
                                    this.props.navStore.selectStepMintingInProgress.bind(this.props.navStore),
                                    this.props.navStore.selectStepMintingSucceeeded.bind(this.props.navStore),
                                    this.props.navStore.selectStepMintingFailed.bind(this.props.navStore),
                                )}
                            >{this.props.navStore.isMintOptionSingle() ? 'Mint NFT' : 'Mint Collection NFTs'}</Button>
                        </Actions>
                    </div>
                </div>
            </NftStepWrapper>
        )
    }
}

export default inject('walletStore', 'navStore', 'nftMintStore')((observer(NftFinish)));

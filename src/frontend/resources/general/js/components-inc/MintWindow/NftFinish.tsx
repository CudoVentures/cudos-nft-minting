import React from 'react';
import { inject, observer } from 'mobx-react';
import BigNumber from 'bignumber.js'
import S from '../../../../common/js/utilities/Main';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import NavStore from '../../../../common/js/stores/NavStore';
import WalletStore from '../../../../common/js/stores/WalletStore';
import AppStore from '../../../../common/js/stores/AppStore';

import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';
import Popover from '../../../../common/js/components-inc/Popover';
import NftSidePreview from '../NftSidePreview';
import NftStepWrapper from './NftStepWrapper';

import SvgInfo from '../../../../common/svg/info.svg';
import '../../../css/components-inc/NftMint/nft-finish.css';
import Config from '../../../../../../../builds/dev-generated/Config';

interface Props {
    nftMintStore: NftMintStore;
    navStore: NavStore;
    walletStore: WalletStore;
    appStore: AppStore;
}

interface State {
    anchorEl: any;
    feeEstimate: number;
    feeEstimateInDollars: number;
}

class NftFinish extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            feeEstimate: 0,
            feeEstimateInDollars: 0,
        }
    }

    async componentDidMount(): Promise<void> {
        const locale = this.props.navStore.isMintOptionSingle() ? NftMintStore.MINT_MODE_BACKEND : NftMintStore.MINT_MODE_LOCAL;

        await this.props.nftMintStore.esimateMintFees(locale, (estimate: BigNumber) => {
            const estimateNumber = Number(estimate.div(Config.CUDOS_NETWORK.DECIMAL_DIVIDER).toFixed(2));
            if (this.props.navStore.isMintOptionMultiple()) {
                const now = new Date();
                now.setMinutes(0);
                const coinId = 'cudos';
                const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`;
                fetch(url).then((res) => {
                    res.json().then((data) => {
                        data = data[coinId];
                        this.setState({
                            feeEstimate: estimateNumber,
                            feeEstimateInDollars: data.toFixed(3),
                        });
                    });
                }).catch((e) => {
                    console.log(e);
                })
            } else {
                this.setState({
                    feeEstimate: estimateNumber,
                });
            }
        });
    }

    onShowFreeInfo = (e) => {
        this.setState({
            'anchorEl': e.target,
        });
    }

    onHideFreeInfo = () => {
        this.setState({
            'anchorEl': null,
        })
    }

    render() {
        return (
            <NftStepWrapper
                className={'NftFinish'}
                stepNumber={`Step ${this.props.navStore.getMintStepShowNumber()}`}
                stepName={'Summarised Details'} >
                <div className={'FlexRow NftFinishHolder'}>
                    {this.renderSingleMintFinish()}
                </div>
            </NftStepWrapper>
        )
    }

    renderSingleMintFinish(): any {
        const { appStore, nftMintStore } = this.props;
        const nftCollectionModel = nftMintStore.nftCollection;
        const nfts = this.props.nftMintStore.nfts;

        return (
            <>
                <NftSidePreview
                    imageUrl={this.props.navStore.isMintOptionSingle() ? nfts[0].getPreviewUrl(appStore.workerQueueHelper) : ''}
                    name={this.props.navStore.isMintOptionSingle() ? nfts[0].name : nftCollectionModel.name} />
                <div className={'FlexColumn FlexGrow'}>
                    <div className={'FlexColumn SummaryDetails'}>
                        <div className={'SummaryHeading'}>Minting details</div>
                        {this.props.navStore.isMintOptionMultiple() === true && (
                            <div className={'FlexColumn DetailsRow'}>
                                <div className={'DetailHeading'}>Collection Name</div>
                                <div className={'DetailData'}>{nftCollectionModel.name}</div>
                            </div>
                        )}
                        <div className={'FlexRow DetailsRow'}>
                            <div className={'FlexColumnt DetailColumn'}>
                                <div className={'DetailHeading'}>Items</div>
                                <div className={'DetailData'}>{nftMintStore.nfts.length}</div>
                            </div>
                            <div className={'FlexColumnt DetailColumn'}>
                                <div className={'DetailHeading'}>Mint Type</div>
                                <div className={'DetailData'}>{NavStore.getMintTypeText(this.props.navStore.mintOption)}</div>
                            </div>
                            <div className={'FlexColumnt DetailColumn'}>
                                <div className={'DetailHeading'}>Estimated Gas Fee</div>
                                <div className={'DetailData FlexRow'}>
                                    <div className={`FeeEstimate ${S.CSS.getClassName(this.props.navStore.isMintOptionSingle(), 'Crossed')}`}>{this.state.feeEstimate} CUDOS</div>
                                    <div className={'RealPrice FlexRow'}>
                                        {this.props.navStore.isMintOptionSingle() ? (
                                            <>
                                                FREE
                                                <div
                                                    className={'SVG Icon Clickable'}
                                                    dangerouslySetInnerHTML={{ __html: SvgInfo }}
                                                    onClick={this.onShowFreeInfo} />
                                                <Popover
                                                    anchorEl={this.state.anchorEl}
                                                    open={this.state.anchorEl !== null}
                                                    onClose={this.onHideFreeInfo}
                                                    transformOrigin={{
                                                        'vertical': 'top',
                                                        'horizontal': 'left',
                                                    }} >
                                                    {/* // TODO: get real TEXT */}
                                                    This is free
                                                </Popover>
                                            </>
                                        ) : (
                                            <>
                                                {`$ ${this.state.feeEstimateInDollars.toFixed(2)}`}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.props.navStore.isMintOptionSingle() === true && (
                            <div className={'FlexColumnt DetailColumn'}>
                                <div className={'DetailHeading'}>Recipient</div>
                                <div className={'DetailData'}>{nfts[0].recipient !== S.Strings.EMPTY ? nfts[0].recipient : this.props.walletStore.keplrWallet.accountAddress}</div>
                            </div>
                        )}
                    </div>
                    <Actions className={'MintNftButton'} layout={Actions.LAYOUT_ROW_RIGHT} height={Actions.HEIGHT_52}>
                        <Button
                            type={Button.TYPE_ROUNDED}
                            radius={Button.RADIUS_MAX}
                            color={Button.COLOR_SCHEME_1}
                            padding={Button.PADDING_24}
                            onClick={nftMintStore.mintNfts.bind(
                                this.props.nftMintStore,
                                this.props.navStore.isMintOptionSingle() ? NftMintStore.MINT_MODE_BACKEND : NftMintStore.MINT_MODE_LOCAL,
                                this.props.navStore.selectStepMintingInProgress,
                                this.props.navStore.selectStepMintingSucceeeded,
                                this.props.navStore.selectStepMintingFailed,
                            )} >
                            {this.props.navStore.isMintOptionSingle() === true ? 'Mint NFT' : 'Mint Collection NFTs'}
                        </Button>
                    </Actions>
                </div>
            </>
        )
    }
}
export default inject('appStore', 'walletStore', 'navStore', 'nftMintStore')((observer(NftFinish)));

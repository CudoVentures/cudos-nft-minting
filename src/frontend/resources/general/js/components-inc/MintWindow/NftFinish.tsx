import React from 'react';
import { inject, observer } from 'mobx-react';
import BigNumber from 'bignumber.js'
import S from '../../../../common/js/utilities/Main';
import NftMintStore, { NavMintStore } from '../../../../common/js/stores/NftMintStore';
import WalletStore from '../../../../common/js/stores/WalletStore';
import AppStore from '../../../../common/js/stores/AppStore';
import Config from '../../../../../../../builds/dev-generated/Config';

import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';
import Popover from '../../../../common/js/components-inc/Popover';
import NftSidePreview from '../NftSidePreview';
import NftStepWrapper from './NftStepWrapper';
import SvgInfo from '../../../../common/svg/info.svg';
import '../../../css/components-inc/NftMint/nft-finish.css';
import ReCaptchaV2 from 'react-google-recaptcha'

interface Props {
    nftMintStore: NftMintStore;
    walletStore: WalletStore;
    appStore: AppStore;
}

interface State {
    anchorEl: any;
    recaptchaToken: string;
}

class NftFinish extends React.Component<Props, State> {
    recaptchaToken: string;

    constructor(props) {
        super(props);

        this.recaptchaToken = S.Strings.EMPTY;

        this.state = {
            anchorEl: null,
            recaptchaToken: S.Strings.EMPTY,
        }
    }

    onShowGiftInfo = (e) => {
        this.setState({
            'anchorEl': e.target,
        });
    }

    onHideGiftInfo = () => {
        this.setState({
            'anchorEl': null,
        })
    }

    async componentDidMount(): Promise<void> {
        const navMintStore = this.props.nftMintStore.navMintStore;

        // set cudos usd price
        if (navMintStore.isMintOptionMultiple()) {
            this.props.nftMintStore.getUsdPrice();
        }

        // set denom issue fee if needed
        if (navMintStore.isMintOptionMultiple()) {
            await this.props.nftMintStore.esimateDenomIssueFees();
        }

        // set nft mint fee
        await this.props.nftMintStore.esimateMintFees();
    }

    handleRecaptchaToken = (token: string) => {
        if (token === null) {
            this.setState({
                recaptchaToken: S.Strings.EMPTY,
            })
            return;
        }

        this.setState({
            recaptchaToken: token,
        })
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
                stepNumber={`Step ${this.props.nftMintStore.navMintStore.getMintStepShowNumber()}`}
                stepName={'Summarised Details'} >
                <div className={'FlexRow NftFinishHolder'}>
                    {this.renderMintFinish()}
                </div>
            </NftStepWrapper>
        )
    }

    onClickMintNft = () => {
        this.props.nftMintStore.mintNfts(this.state.recaptchaToken);
    }

    onClickIssueCollection = () => {
        this.props.nftMintStore.mintCollection();
    }

    renderMintFinish(): any {
        const { appStore, nftMintStore } = this.props;
        const navMintStore = nftMintStore.navMintStore;
        const nftCollectionModel = nftMintStore.nftCollection;
        const nfts = this.props.nftMintStore.nfts;

        return (
            <>
                <NftSidePreview
                    imageUrl={nfts[0].getPreviewUrl(appStore.workerQueueHelper)}
                    name={navMintStore.isMintOptionSingle() ? nfts[0].name : nftCollectionModel.name} />
                <div className={'FlexColumn FlexGrow'}>
                    {navMintStore.isMintOptionSingle() ? this.renderSingleMintInfo() : this.renderMultipleMintInfo()}
                    <Actions className={'MintNftButton'} layout={Actions.LAYOUT_ROW_RIGHT} height={Actions.HEIGHT_52}>
                        {this.props.nftMintStore.navMintStore.mintOption === NavMintStore.MINT_OPTION_SINGLE
                            && <ReCaptchaV2
                                sitekey={Config.UTILS.CAPTCHA_FRONTEND_KEY}
                                onChange={this.handleRecaptchaToken}
                            />}
                        {navMintStore.isMintOptionMultiple()
                            && <Button
                                type={Button.TYPE_ROUNDED}
                                radius={Button.RADIUS_MAX}
                                color={Button.COLOR_SCHEME_1}
                                padding={Button.PADDING_24}
                                disabled={navMintStore.isCollectionMintedSuccess()}
                                onClick={this.onClickIssueCollection} >
                                {navMintStore.isCollectionMintedNone() === true ? 'Create Collection' : 'Collection Created'}
                            </Button>
                        }
                        <Button
                            type={Button.TYPE_ROUNDED}
                            radius={Button.RADIUS_MAX}
                            color={Button.COLOR_SCHEME_1}
                            padding={Button.PADDING_24}
                            disabled={
                                (navMintStore.mintOption === NavMintStore.MINT_OPTION_MULTIPLE
                                    && navMintStore.isCollectionMintedSuccess() === false)
                                || (this.state.recaptchaToken === S.Strings.EMPTY
                                    && navMintStore.mintOption === NavMintStore.MINT_OPTION_SINGLE)
                            }
                            onClick={this.onClickMintNft} >
                            {navMintStore.isMintOptionSingle() === true ? 'Mint NFT' : 'Mint Collection NFTs'}
                        </Button>
                    </Actions>
                    {navMintStore.isMintOptionMultiple()
                        && <div className={'FlexColumn CollectionMintAdditionalInfoHolder'}>
                            <div className={'FlexRow'}>
                                <div className={'SVG'} dangerouslySetInnerHTML={{ __html: SvgInfo }} />
                                <span className={'InfoText'}>In order to craete the collection with the NFTs in it, two separate transactions need to be signed:</span>
                            </div>
                            <div className={'FlexColumn StepExplanation'}>
                                <div className={'FlexRow'}>
                                    <div className={'Numbering'}>1.</div>
                                    Mint Collection
                                </div>
                                <div className={'FlexRow'}>
                                    <div className={'Numbering'}>2.</div>
                                    Mint NFTs
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </>
        )
    }

    renderSingleMintInfo() {
        const { nftMintStore } = this.props;
        const navMintStore = nftMintStore.navMintStore;
        const nfts = this.props.nftMintStore.nfts;

        return (
            <div className={'FlexColumn SummaryDetails'}>
                <div className={'SummaryHeading'}>Minting details</div>
                <div className={'DetailsHolder'}>
                    <div className={'FlexRow DetailsRow'}>
                        <div className={'FlexColumn DetailColumn'}>
                            <div className={'DetailHeading'}>Items</div>
                            <div className={'DetailData'}>{nftMintStore.nfts.length}</div>
                        </div>
                        <div className={'FlexColumn DetailColumn'}>
                            <div className={'DetailHeading'}>Mint Type</div>
                            <div className={'DetailData'}>{NavMintStore.getMintTypeText(navMintStore.mintOption)}</div>
                        </div>
                        <div className={'FlexColumn DetailColumn'}>
                            <div className={'DetailHeading'}>Estimated Gas Fee</div>
                            <div className={'DetailData FlexRow'}>
                                <div className={'FeeEstimate Crossed'}>{nftMintStore.nftMintFeeEstimate} CUDOS</div>
                                <div className={'RealPrice FlexRow'}>
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
                                        Mint your NFT for free today
                                    </Popover>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'FlexColumn DetailColumn'}>
                        <div className={'DetailHeading'}>Recipient</div>
                        <div className={'DetailData'}>{nfts[0].recipient !== S.Strings.EMPTY ? nfts[0].recipient : this.props.walletStore.keplrWallet.accountAddress}</div>
                    </div>
                </div>
            </div>
        )
    }

    renderMultipleMintInfo() {
        const { nftMintStore } = this.props;
        const navMintStore = nftMintStore.navMintStore;
        const nftCollectionModel = nftMintStore.nftCollection;
        const nfts = this.props.nftMintStore.nfts;
        return (
            <div className={'FlexColumn SummaryDetails'}>
                <div className={'SummaryHeading'}>Minting details</div>
                <div className={'FlexRow DetailsHolder'}>
                    <div className={'FlexColumn DetailsHolderColumn'}>
                        <div className={'FlexColumn DetailColumn'}>
                            <div className={'DetailHeading'}>Collection Name</div>
                            <div className={'DetailData'}>{nftCollectionModel.name}</div>
                        </div>
                        <div className={'FlexColumn DetailColumn'}>
                            <div className={'DetailHeading'}>Estimated Gas Fee Collection</div>
                            <div className={'DetailData FlexRow'}>
                                <div className={'FeeEstimate '}>{nftMintStore.denomIssueFeeEstimate} CUDOS</div>
                                <div className={'RealPrice FlexRow'}>
                                    {`$ ${nftMintStore.getDenomIssueFeeInUsd().toFixed(2)}`}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'FlexColumn DetailsHolderColumn'}>
                        <div className={'FlexRow'}>
                            <div className={'FlexColumn DetailColumn ItemsColumn'}>
                                <div className={'DetailHeading'}>Items</div>
                                <div className={'DetailData'}>{nftMintStore.nfts.length}</div>
                            </div>
                            <div className={'FlexColumn DetailColumn'}>
                                <div className={'DetailHeading'}>Mint Type</div>
                                <div className={'DetailData'}>{NavMintStore.getMintTypeText(navMintStore.mintOption)}</div>
                            </div>
                        </div>
                        <div className={'FlexRow DetailsRow'}>
                            <div className={'FlexColumn DetailColumn'}>
                                <div className={'DetailHeading'}>Estimated Gas Fee NFTs</div>
                                <div className={'DetailData FlexRow'}>
                                    <div className={'FeeEstimate'}>{nftMintStore.nftMintFeeEstimate} CUDOS</div>
                                    <div className={'RealPrice FlexRow'}>
                                        {`$ ${nftMintStore.getNftMintFeeInUsd().toFixed(2)}`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default inject('appStore', 'walletStore', 'nftMintStore')((observer(NftFinish)));

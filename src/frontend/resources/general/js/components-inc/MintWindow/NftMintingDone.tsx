import { inject, observer } from 'mobx-react';
import React from 'react';
import Config from '../../../../../../../builds/dev-generated/Config';
import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';
import ProjectUtils from '../../../../common/js/ProjectUtils';
import NavStore from '../../../../common/js/stores/NavStore';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import SvgMintingWaves from '../../../../common/svg/finished-waves.svg';
import SvgLinkBox from '../../../../common/svg/link-box.svg';
import SvgTwitter from '../../../../common/svg/twitter.svg';
import '../../../css/components-inc/NftMint/nft-minting-done.css';

interface Props {
    navStore: NavStore;
    nftMintStore: NftMintStore;
}

class NftMintingDone extends React.Component<Props> {
    render() {
        return (
            <div className={'NftMintingDone FlexColumn FlexGrow'}>
                <div className={'SVG Icon Size Background'} dangerouslySetInnerHTML={{ __html: SvgMintingWaves }}></div>
                <div className={'NftBoxRow FlexRow'}>
                    {this.props.nftMintStore.mintedNfts.map((index) => {
                        const nft = this.props.nftMintStore.nfts[index];
                        return (
                            <div key={nft.tokenId} className={'NftBox FlexColumn'}>
                                <div className={'NftImageHolder'}>
                                    <div className={'NftImage ImgCoverNode'} style={ProjectUtils.makeBgImgStyle(nft.url)} />
                                </div>
                                <div className={'NftName'}>{nft.name}</div>
                            </div>
                        )
                    })}
                </div>
                <div className={'Heading4'} >Minting is Done!</div>
                <div className={'Description'}>Minting was successful! Check the details from the link below.</div>
                {/* // TODO: fix undefined link */}
                <a href={`${Config.CUDOS_NETWORK.EXPLORER}/trabsactions/${this.props.nftMintStore.transactionHash}`} className={'TransactionLink FlexRow'}>
                    <div>Check transaction details in Explorer</div>
                    <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgLinkBox }}></div>
                </a>
                <Actions height={Actions.HEIGHT_60}>
                    <Button
                        type={Button.TYPE_ROUNDED}
                        radius={Button.RADIUS_MAX}
                        color={Button.COLOR_SCHEME_1}
                        padding={Button.PADDING_82}
                        onClick={this.props.navStore.selectFirstMintStep.bind(this.props.navStore)}
                    >
                        Mint Another
                    </Button>
                </Actions>
                {/* <div className={'ShareLink FlexRow'}>
                    <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTwitter }}></div>
                    <div>Share on Twitter</div>
                </div> */}
            </div>
        )
    }
}

export default inject('nftMintStore', 'navStore')((observer(NftMintingDone)));

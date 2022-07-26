import React from 'react';
import { inject, observer } from 'mobx-react';

import ProjectUtils from '../../../../common/js/ProjectUtils';
import AppStore from '../../../../common/js/stores/AppStore';
import NftMintStore from '../../../../common/js/stores/NftMintStore';

import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';
import SvgMintingWaves from '../../../../common/svg/finished-waves.svg';
import SvgLinkBox from '../../../../common/svg/link-box.svg';
import SvgTickCircle from '../../../../common/svg/tick-circle.svg';

import '../../../css/components-inc/NftMint/nft-minting-done.css';

interface Props {
    appStore: AppStore;
    nftMintStore: NftMintStore;
}

class NftMintingDone extends React.Component<Props> {

    render() {
        const { appStore, nftMintStore } = this.props;
        const navMintStore = nftMintStore.navMintStore;
        const nftCollectionModel = nftMintStore.nftCollection;
        const nftModel = nftMintStore.nfts[0];

        return (
            <div className={'NftMintingDone FlexColumn FlexGrow'}>
                <div className={'SVG Icon Size Background'} dangerouslySetInnerHTML={{ __html: SvgMintingWaves }}></div>
                <div className={'NftBoxRow FlexRow'}>
                    <div key={nftModel.getIdsUniquePair()} className={'NftBox FlexColumn'}>
                        <div className={'NftImageHolder'}>
                            <div className={'NftImage ImgCoverNode'} style={ProjectUtils.makeBgImgStyle(nftModel.getPreviewUrl(appStore.workerQueueHelper))} />
                        </div>
                        <div className={'NftName Dots'}>{navMintStore.isMintOptionSingle() ? nftModel.name : nftCollectionModel.name}</div>
                    </div>
                </div>
                <div className={'Heading4 FlexRow'} >
                    <div className={'SVG Icon Success'} dangerouslySetInnerHTML={{ __html: SvgTickCircle }}></div>
                    Minting is Done!
                </div>
                <div className={'Description'}>Minting was successful! Check the details from the link below.</div>
                <a href={this.props.nftMintStore.getTxHashLink()} className={'TransactionLink FlexRow'} target='_blank' rel='noreferrer'>
                    <div>Check transaction details in Explorer</div>
                    <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgLinkBox }}></div>
                </a>
                <Actions height={Actions.HEIGHT_60}>
                    <Button
                        type={Button.TYPE_ROUNDED}
                        radius={Button.RADIUS_MAX}
                        color={Button.COLOR_SCHEME_1}
                        padding={Button.PADDING_82}
                        onClick={this.props.nftMintStore.reset.bind(this.props.nftMintStore, true)}>
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

export default inject('appStore', 'nftMintStore')((observer(NftMintingDone)));

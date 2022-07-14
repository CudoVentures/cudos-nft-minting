import React from 'react';
import { inject, observer } from 'mobx-react';

import Config from '../../../../../../../builds/dev-generated/Config';
import ProjectUtils from '../../../../common/js/ProjectUtils';
import AppStore from '../../../../common/js/stores/AppStore';
import NftMintStore from '../../../../common/js/stores/NftMintStore';

import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';
import NavStore from '../../../../common/js/stores/NavStore';
import SvgMintingWaves from '../../../../common/svg/finished-waves.svg';
import SvgLinkBox from '../../../../common/svg/link-box.svg';
import SvgTwitter from '../../../../common/svg/twitter.svg';
import '../../../css/components-inc/NftMint/nft-minting-done.css';

interface Props {
    appStore: AppStore;
    navStore: NavStore;
    nftMintStore: NftMintStore;
}

class NftMintingDone extends React.Component<Props> {

    render() {
        const appStore = this.props.appStore;
        const nftModel = this.props.nftMintStore.nfts[0];

        return (
            <div className={'NftMintingDone FlexColumn FlexGrow'}>
                <div className={'SVG Icon Size Background'} dangerouslySetInnerHTML={{ __html: SvgMintingWaves }}></div>
                <div className={'NftBoxRow FlexRow'}>
                    <div key = { nftModel.getIdsUniquePair() } className={'NftBox FlexColumn'}>
                        <div className={'NftImageHolder'}>
                            <div className={'NftImage ImgCoverNode'} style={ProjectUtils.makeBgImgStyle(nftModel.getPreviewUrl(appStore.workerQueueHelper))} />
                        </div>
                        <div className={'NftName'}>{nftModel.name}</div>
                    </div>
                </div>
                <div className={'Heading4'} >Minting is Done!</div>
                <div className={'Description'}>Minting was successful! Check the details from the link below.</div>
                <a href = { this.props.nftMintStore.getTxHashLink() } className={'TransactionLink FlexRow'}>
                    <div>Check transaction details in Explorer</div>
                    <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgLinkBox }}></div>
                </a>
                <Actions height={Actions.HEIGHT_60}>
                    <Button
                        type={Button.TYPE_ROUNDED}
                        radius={Button.RADIUS_MAX}
                        color={Button.COLOR_SCHEME_1}
                        padding={Button.PADDING_82}
                        onClick={this.props.navStore.selectFirstMintStep}>
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

export default inject('appStore', 'nftMintStore', 'navStore')((observer(NftMintingDone)));

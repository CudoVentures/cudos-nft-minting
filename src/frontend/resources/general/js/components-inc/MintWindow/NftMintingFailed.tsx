import { inject, observer } from 'mobx-react';
import React from 'react';
import Config from '../../../../../../../builds/dev-generated/Config';
import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';
import NavStore from '../../../../common/js/stores/NavStore';
import SvgSuccessfullWaves from '../../../../common/svg/unsuccessful-waves.svg';
import '../../../css/components-inc/NftMint/nft-minting-failed.css';

interface Props {
    navStore: NavStore;
}

class NftMintingFailed extends React.Component<Props> {
    render() {
        return (
            <div className={'NftMintingFailed FlexColumn FlexGrow'}>
                <div className={'SVG Icon Size Background Wave'} dangerouslySetInnerHTML={{ __html: SvgSuccessfullWaves }}></div>
                <img src={`${Config.URL.RESOURCES}/common/img/nfts/cone.png`} className={'Background FrontImage'} />

                <div className={'Heading4'} >Minting was Not Successfull!</div>
                <div className={'Description'}>Try again, or check the details in your wallet again.</div>
                <Actions className={'ButtonHolder'} layout={Actions.LAYOUT_COLUMN_FULL} height={Actions.HEIGHT_60}>
                    <Button
                        type={Button.TYPE_ROUNDED}
                        radius={Button.RADIUS_MAX}
                        color={Button.COLOR_SCHEME_1}
                        padding={Button.PADDING_82}
                        onClick={this.props.navStore.selectFirstMintStep.bind(this.props.navStore)}
                    >
                        Try Again
                    </Button>
                    <Button
                        type={Button.TYPE_ROUNDED}
                        radius={Button.RADIUS_MAX}
                        color={Button.COLOR_SCHEME_3}
                        padding={Button.PADDING_82}
                        onClick={this.props.navStore.selectFinishStep.bind(this.props.navStore)}
                    >
                        Go Back
                    </Button>
                </Actions>
            </div >
        )
    }
}

export default inject('navStore')((observer(NftMintingFailed)));

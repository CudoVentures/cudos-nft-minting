import { inject, observer } from 'mobx-react';
import React from 'react';
import Checkbox from '../../../../common/js/components-inc/Checkbox';
import Input from '../../../../common/js/components-inc/Input';
import LayoutBlock from '../../../../common/js/components-inc/LayoutBlock';
import NftImageModel from '../../../../common/js/models/NftImageModel';
import NftModel from '../../../../common/js/models/NftModel';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import '../../../css/components-inc/NftMint/nft-finish.css';
import NftSidePreview from '../NftSidePreview';
import NavStore from '../../../../common/js/stores/NavStore';

interface Props {
    nftMintStore: NftMintStore
    navStore: NavStore
}

interface State {

}

class NftFinish extends React.Component<Props, State> {

    render() {
        const nftImage: NftImageModel = this.props.nftMintStore.nftImages[0];
        const nftForm: NftModel = this.props.nftMintStore.nftForm;

        return (
            <div className={'NftFinish'}>
                <div className={'Heading3'}>Summarised Details</div>
                <div className={'FlexRow NftFinishHolder'}>
                    <NftSidePreview
                        imageUrl={nftImage.imageUrl}
                        name={nftForm.name}
                        description={nftForm.data}
                    />
                    <div className={'FlexColumn SummaryDetails'}>
                        <div className={'SummaryHeading'}>Minting details</div>
                        <div className={'FlexRow DetailsRow'}>
                            <div className={'FlexColumnt DetailColumn'}>
                                <div className={'DetailHeading'}>Items</div>
                                <div className={'DetailData'}>1</div>
                            </div>
                            <div className={'FlexColumnt DetailColumn'}>
                                <div className={'DetailHeading'}>Mint Type</div>
                                <div className={'DetailData'}>{this.props.navStore.getMintOptionText()}</div>
                            </div>

                            <div className={'FlexColumnt DetailColumn'}>
                                <div className={'DetailHeading'}>Fee</div>
                                <div className={'DetailData'}>No fees</div>
                            </div>
                        </div>

                        <div className={'FlexColumnt DetailColumn'}>
                            <div className={'DetailHeading'}>Recipient</div>
                            <div className={'DetailData'}>{nftForm.owner}</div>
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}

export default inject('navStore', 'nftMintStore')((observer(NftFinish)));

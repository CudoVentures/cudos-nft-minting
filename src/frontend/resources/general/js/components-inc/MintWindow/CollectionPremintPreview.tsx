import { inject, observer } from 'mobx-react';
import React from 'react';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import '../../../css/components-inc/NftMint/collection-premint-preview.css';

import NftStepWrapper from './NftStepWrapper';

import S from '../../../../common/js/utilities/Main';
import ProjectUtils from '../../../../common/js/ProjectUtils';
import Config from '../../../../../../../builds/dev-generated/Config';
import MyNftsStore from '../../../../common/js/stores/MyNftsStore';
import AppStore from '../../../../common/js/stores/AppStore';
import NftApi from '../../../../common/js/api/NftApi';
import NftHasuraApi from '../../../../common/js/api/NftHasuraApi';

interface Props {
    nftMintStore: NftMintStore;
    myNftsStore: MyNftsStore;
    appStore: AppStore;
}

interface State {
    txHash: string;
    nftCount: number;
}

class CollectionPremintPreview extends React.Component<Props, State> {
    nftApi: NftApi;
    nftHasuraApi: NftHasuraApi;

    constructor(props) {
        super(props);
        this.nftApi = new NftApi();
        this.nftHasuraApi = new NftHasuraApi();

        this.state = {
            txHash: S.Strings.EMPTY,
            nftCount: S.NOT_EXISTS,
        }
    }

    componentDidMount(): void {
        const collection = this.props.nftMintStore.nftCollection;
        const nftApi = this.nftApi;
        const nftHasuraApi = this.nftHasuraApi;

        nftHasuraApi.getCollectionTxHash(collection.denomId)
            .then((txHash: string) => {
                this.setState({
                    txHash,
                });
            }).catch((e) => { });

        nftHasuraApi.getTotalNumberOfNftsInCollection(collection.denomId)
            .then((nftCount: number) => {
                this.setState({
                    nftCount,
                });
            }).catch((e) => { });
    }

    render() {
        const nftMintStore = this.props.nftMintStore;
        const navMintStore = nftMintStore.navMintStore;
        const myNftsStore = this.props.myNftsStore;

        const appStore = this.props.appStore;
        const nftCollectionModel = nftMintStore.nftCollection;
        return (
            <NftStepWrapper
                className={'CollectionPremintPreview'}
                stepNumber={`Step ${navMintStore.getMintStepShowNumber()}`}
                stepName={'Check Collection Details'} >
                <div className={'NftCollectionPreview FlexRow'} >
                    <div>
                        <div className={'Img ImgCoverNode'} style={ProjectUtils.makeBgImgStyle(myNftsStore.getCollectionPreviewUrl(nftCollectionModel, appStore.workerQueueHelper))} />
                    </div>
                    <div className={'CollectionDataCnt FlexColumn'} >
                        <div className={'CollectionHeader'} >COLLECTION</div>
                        <div className={'CollectionName FlexRow'} >
                            <span className={'Dots'} title={nftCollectionModel.name} > {nftCollectionModel.name} </span>
                        </div>
                        <div className={'CollectionInfo FlexColumn'} >
                            <div className={'InfoRow FlexSplit'} >
                                <label>Transation Hash</label>
                                <a href={`${Config.CUDOS_NETWORK.EXPLORER}/transactions/${nftCollectionModel.txHash}`} className={'TxInfoBlue StartRight'} target='_blank' rel='noreferrer' > {nftCollectionModel.txHash} </a>
                            </div>
                            <div className={'InfoRow FlexSplit'} >
                                <label>Token Standart</label>
                                <div className={'StartRight'} > CUDOS Network Native Token </div>
                            </div>
                            <div className={'InfoRow FlexSplit'} >
                                <label>Collection ID</label>
                                <div className={'StartRight'} > {nftCollectionModel.denomId} </div>
                            </div>
                            <div className={'InfoRow FlexSplit'} >
                                <label>Items in this Collection</label>
                                <div className={'StartRight'} > {this.state.nftCount === S.NOT_EXISTS ? 'fetching...' : this.state.nftCount} </div>
                            </div>
                        </div>
                    </div>
                </div >
            </NftStepWrapper >
        )
    }
}

export default inject('appStore', 'myNftsStore', 'nftMintStore')((observer(CollectionPremintPreview)));

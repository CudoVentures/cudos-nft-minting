import React from 'react';
import { inject, observer } from 'mobx-react';

import S from '../../../../common/js/utilities/Main';
import MyNftsStore from '../../../../common/js/stores/MyNftsStore';

import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';
import Input from '../../../../common/js/components-inc/Input';
import NftCollectionsViewer from '../NftView/NftCollectionsViewer';
import NftModelsViewer from '../NftView/NftModelsViewer';
import NftCollectionViewer from '../NftView/NftCollectionViewer';
import NftModelViewer from '../NftView/NftModelViewer';

import TableHelper from '../../../../common/js/helpers/TableHelper';
import Table from '../../../../common/js/components-inc/Table';
import TableDesktop from '../../../../common/js/components-inc/TableDesktop';

import SvgSearch from '../../../../common/svg/search.svg';
import '../../../css/components-inc/MyNftsWindow/list-nfts.css'
import LoadingIndicator from '../../../../common/js/components-core/LoadingIndicator';
import TimeoutHelper from '../../../../common/js/helpers/TimeoutHelper';
import SingleRowTable from '../../../../common/js/components-inc/SingleRowTable';

interface Props {
    myNftsStore: MyNftsStore;
}

interface State {
    loadingModels: boolean;
}

class ListNfts extends React.Component<Props, State> {
    timeoutHelper: TimeoutHelper;

    constructor(props: Props) {
        super(props);
        this.timeoutHelper = new TimeoutHelper();

        this.state = {
            loadingModels: true,
        }
    }

    componentDidMount(): void {
        this.fetchModels();
    }

    onClickViewSingleNfts = () => {
        this.props.myNftsStore.markViewSingleNfts();
        this.fetchModels();
    }

    onClickViewCollections = () => {
        this.props.myNftsStore.markViewNftCollections();
        this.fetchModels();
    }

    fetchModels() {
        this.setState({ loadingModels: true });
        this.timeoutHelper.signal(() => {
            this.props.myNftsStore.fetchViewingModels(() => this.setState({ loadingModels: false }))
        });
    }

    render() {
        const myNftsStore = this.props.myNftsStore;
        return (
            <div className={'ListNfts'} >
                {myNftsStore.hasViewNft() === false && myNftsStore.hasViewCollection() === false && (
                    <div className={'NftListFilter FlexSplit'} >
                        <Actions
                            height={Actions.HEIGHT_42}
                            layout={Actions.LAYOUT_ROW_LEFT} >

                            <Button
                                type={myNftsStore.isViewSingleNfts() === true ? Button.TYPE_ROUNDED : Button.TYPE_TEXT_INLINE}
                                color={myNftsStore.isViewSingleNfts() === true ? Button.COLOR_SCHEME_3 : Button.COLOR_SCHEME_2}
                                onClick={this.onClickViewSingleNfts} >
                                Single NFTs
                                {myNftsStore.nftsCount === S.NOT_EXISTS
                                    ? <LoadingIndicator margin={'auto'} size={'20px'}/>
                                    : `(${myNftsStore.nftsCount})`
                                }
                            </Button>

                            <Button
                                type={myNftsStore.isViewNftCollections() === true ? Button.TYPE_ROUNDED : Button.TYPE_TEXT_INLINE}
                                color={myNftsStore.isViewNftCollections() === true ? Button.COLOR_SCHEME_3 : Button.COLOR_SCHEME_2}
                                onClick={this.onClickViewCollections} >
                                Collections
                                {myNftsStore.collectionsCount === S.NOT_EXISTS
                                    ? <LoadingIndicator margin={'auto'} size={'20px'}/>
                                    : `(${myNftsStore.collectionsCount})`
                                }
                            </Button>

                        </Actions>
                        <Input
                            className={'FilterString StartRight'}
                            value={myNftsStore.filterString}
                            placeholder={'Search for NFTs'}
                            gray={true}
                            InputProps={{
                                startAdornment: (
                                    <div className={'SVG IconSearch'} dangerouslySetInnerHTML={{ __html: SvgSearch }} />
                                ),
                            }}
                            onChange={myNftsStore.onChangeFilterString} />
                    </div>
                )}
                {this.renderNftModel()}
                {this.renderNftCollection()}
                {this.renderSingleNfts()}
                {this.renderNftCollecions()}
            </div>
        )
    }

    renderNftModel() {
        const myNftsStore = this.props.myNftsStore;
        const display = myNftsStore.hasViewNft() === true;

        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <NftModelViewer nftModel={myNftsStore.viewNftModel} nftCollectionModel={myNftsStore.viewNftCollectionModel} />}
            </div>
        )
    }

    renderNftCollection() {
        const myNftsStore = this.props.myNftsStore;
        const display = myNftsStore.shouldRenderCollection() === true;

        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true && <NftCollectionViewer nftCollectionModel={myNftsStore.viewNftCollectionModel} />}
            </div>
        )
    }

    renderSingleNfts() {
        const myNftsStore = this.props.myNftsStore;
        const display = myNftsStore.shouldRenderSingleNfts();
        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true
                && (this.state.loadingModels
                    ? <LoadingIndicator margin={'200px'}/>
                    : <SingleRowTable
                        className={'NftModelsViewerTable'}
                        legend={['']}
                        widths={['100%']}
                        aligns={[TableDesktop.ALIGN_CENTER]}
                        helper={myNftsStore.tableHelper}
                        rows={[Table.row([Table.cell(<NftModelsViewer nftModels={myNftsStore.filterredNftModels} />)])]}
                        noRowsContent={<div className={'NoNfts'}>There are no NFTs in the collection</div>}
                    />)
                }
            </div>
        )
    }

    renderNftCollecions() {
        const myNftsStore = this.props.myNftsStore;
        const display = myNftsStore.shouldRenderNftCollections();

        return (
            <div className={`ActiveDisplayHidden Transition ${S.CSS.getActiveClassName(display)}`} >
                {display === true
                && (this.state.loadingModels
                    ? <LoadingIndicator margin={'200px'}/>
                    : <SingleRowTable
                        className={'NftModelsViewerTable'}
                        legend={['']}
                        widths={['100%']}
                        aligns={[TableDesktop.ALIGN_CENTER]}
                        helper={myNftsStore.tableHelper}
                        rows={[Table.row([Table.cell(<NftCollectionsViewer nftCollectionModels={myNftsStore.filteredNftCollectionModels} />)])]}
                        noRowsContent={<div className={'NoNfts'}>There are no collections for this address</div>}
                    />)
                }
            </div>
        )
    }

}

export default inject('myNftsStore')(observer(ListNfts));

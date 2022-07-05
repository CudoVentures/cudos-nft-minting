import React from 'react';
import { inject, observer } from 'mobx-react';

import S from '../../../common/js/utilities/Main';
import NavStore from '../../../common/js/stores/NavStore';

import SvgHouse from '../../../common/svg/house.svg';
import SvgMintNft from '../../../common/svg/mint-nft.svg';
import './../../css/components-inc/side-menu.css';

interface Props {
    navStore: NavStore
}

const MENU_ITEMS = [{
    svg: SvgHouse,
    pageKey: NavStore.MY_NFTS_PAGE_KEY,
}, {
    svg: SvgMintNft,
    pageKey: NavStore.MINT_PAGE_KEY,
}]

class SideMenu extends React.Component<Props> {

    render() {
        return (
            <div className={'SideMenu'}>
                {MENU_ITEMS.map((menuItem) => {
                    return (
                        <div
                            key={menuItem.pageKey}
                            className={`MenuItem FlexRow Transition ${S.CSS.getActiveClassName(this.props.navStore.nftPage === menuItem.pageKey)}`}
                            onClick={this.props.navStore.onSelectNftPage.bind(this.props.navStore, menuItem.pageKey)} >

                            <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: menuItem.svg }}></div>
                            {NavStore.getNftPageName(menuItem.pageKey)}

                        </div>
                    )
                })}
            </div>
        )
    }
}

export default inject('navStore')((observer(SideMenu)));

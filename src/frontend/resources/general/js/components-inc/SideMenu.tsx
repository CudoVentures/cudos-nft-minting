import { inject, observer } from 'mobx-react';
import React from 'react';
import './../../css/components-inc/side-menu.css';
import NavStore from '../../../common/js/stores/NavStore';
import SvgHouse from '../../../common/svg/house.svg';
import SvgMintNft from '../../../common/svg/mint-nft.svg';

interface Props {
    navStore: NavStore
}

interface State {

}

class SideMenu extends React.Component<Props, State> {
    static INNER_PAGE = {
        MINT: 0,
        MY_NFTS: 1,
    }

    MENU_ITEMS = new Map<number, any>([
        [SideMenu.INNER_PAGE.MY_NFTS, {
            name: 'My NFTs',
            svg: SvgHouse,
        }],
        [SideMenu.INNER_PAGE.MINT, {
            name: 'Mint NFT',
            svg: SvgMintNft,
        }],
    ]);

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className={'SideMenu'}>
                {Array.from(this.MENU_ITEMS)
                    .map(([key, value]) => <div key={key} className={`MenuItem FlexRow ${this.props.navStore.innerPage === key ? 'Selected' : ''}`}
                        onClick={() => this.props.navStore.onSelectInnerPage(key)} >
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: value.svg }}></div>
                        {value.name}
                    </div>)
                }
            </div>
        )
    }
}

export default inject('navStore')((observer(SideMenu)));

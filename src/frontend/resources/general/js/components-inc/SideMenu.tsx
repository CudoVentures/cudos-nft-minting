import React from 'react';

export enum InnerPage {
    Mint,
    MyNfts,
}

export const MENU_ITEMS = new Map<InnerPage, String>([
    [InnerPage.MyNfts, 'My NFTs'],
    [InnerPage.Mint, 'Mint NFT'],
]);

interface Props {
    menuItems: Map<InnerPage, String>
    selectedItem: InnerPage
    onClickMenuItem: (selectedItem: InnerPage) => void
}

interface State {

}

// TODO: implement
export default class SideMenu extends React.Component<Props, State> {
    render() {
        return (<><div>wegweg</div></>);
    }
}

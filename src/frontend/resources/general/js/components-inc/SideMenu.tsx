import React from "react";


export enum InnerPage {
    Mint,
    MyNfts,
}

interface Props {
    menuItems:  Map<InnerPage, String> = new Map();
    selectedItem: InnerPage
    onClickMenuItem: (selectedItem: InnerPage) => ()
}

interface State {
    
}

export default class PageMenu extends React.Component < Props, State > {
    render() {
        
    }
}
import React from 'react';
import NftImageModel from '../../../../common/js/models/NftImageModel';

export enum MintOption {
    Single,
    Multiple
}

export class MintOptionData {
    option: MintOption;
    header: string;
    info: string;

    constructor(option: MintOption, header: string, info: string) {
        this.option = option;
        this.header = header;
        this.info = info;
    }
}

interface Props {
    selectedMintOption: MintOption;
    mintOptionsData: MintOptionData[];
}

interface State {

}

// TODO: implement
export default class MintPageChooseOption extends React.Component < Props, State > {
    render() {
        return (<></>)
    }
}

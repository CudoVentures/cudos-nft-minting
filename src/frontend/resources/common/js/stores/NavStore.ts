import { makeObservable, observable } from 'mobx';
import { MintOption } from '../../../general/js/components-inc/MintWindow/MintPageChooseOption';
import { MintStage } from '../../../general/js/components-inc/MintWindow/MintWindow';

import { InnerPage } from '../../../general/js/components-inc/SideMenu';

export default class NavStore {
    @observable selectedInnerPage: InnerPage;
    @observable selectedMintOption: MintOption;
    @observable mintStage: MintStage;

    constructor() {
        this.selectedInnerPage = InnerPage.Mint;
        this.selectedMintOption = MintOption.Single;
        this.mintStage = MintStage.ChooseOption;

        makeObservable(this);
    }

    onSelectInnerPage(page: InnerPage): void {
        this.selectedInnerPage = page;
    }
}

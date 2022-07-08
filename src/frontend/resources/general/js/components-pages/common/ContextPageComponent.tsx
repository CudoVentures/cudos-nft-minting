import PagesGeneral from '../../../../../../../builds/dev-generated/PagesGeneral';
import PageComponent, { PageComponentProps } from '../../../../common/js/components-pages/PageComponent';
import ProjectUtils from '../../../../common/js/ProjectUtils';
import WalletStore from '../../../../common/js/stores/WalletStore';

export interface ContextPageComponentProps extends PageComponentProps {
    walletStore: WalletStore,
}

export default class ContextPageComponent < Pr extends ContextPageComponentProps, St = {}, SS = any > extends PageComponent < Pr, St, SS > {

    isKeplrRequired() {
        return false;
    }

    async loadData() {
        this.props.appStore.incrementLoading();

        const walletStore = this.props.walletStore;
        await walletStore.tryConnectKeplr();

        if (this.isKeplrRequired() === true && walletStore.isKeplrConnected() === false) {
            ProjectUtils.redirectToUrl(PagesGeneral.HOME);
            return;
        }

        this.props.appStore.decrementLoading();
    }

}

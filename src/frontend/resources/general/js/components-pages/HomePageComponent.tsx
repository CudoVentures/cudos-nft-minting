/* global TR */

import React from 'react';
import { inject, observer } from 'mobx-react';

import PagesGeneral from '../../../../../../builds/dev-generated/PagesGeneral';
import Config from '../../../../../../builds/dev-generated/Config';
import AlertStore from '../../../common/js/stores/AlertStore';

import PageComponent from '../../../common/js/components-pages/PageComponent';
import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';
import Button from '../../../common/js/components-inc/Button';
import PageHeader from '../components-inc/PageHeader';
import PageFooter from '../components-inc/PageFooter';

import './../../css/components-pages/page-home-component.css';

interface Props extends ContextPageComponentProps {
    alertStore: AlertStore,
}

export default class PageHomeComponent extends ContextPageComponent < Props > {

    static layout() {
        const MobXComponent = inject('appStore', 'alertStore')(observer(PageHomeComponent));
        PageComponent.layout(<MobXComponent />);
    }

    getPageLayoutComponentCssClassName() {
        return 'PageHome';
    }

    renderContent() {
        return (
            <>
                <PageHeader />
                <div className={'IntroBlock'}>
                    <div className = { 'IntroBlockTitle' }>Start Minting NFTs On CUDOS Network</div>
                    <div className = { 'IntroBlockDesc' }>CUDOS NFT Minet is the world&apos;s simplest NFT creation service on CUDOS Network. Try it out yourself</div>
                    <Button
                        className = { 'ButtonStartMinting' }
                        href = { PagesGeneral.INNER }
                        type={Button.TYPE_ROUNDED_LARGE} >
                        Start Minting
                    </Button>
                    <div className={'MainImages'}>
                        <img src={`${Config.URL.RESOURCES}/common/img/home-page/blue-bubble.png`} />
                        <img src={`${Config.URL.RESOURCES}/common/img/home-page/turq-bubble.png`} />
                        <img src={`${Config.URL.RESOURCES}/common/img/home-page/orange-bubble.png`} />
                    </div>
                </div>
                <PageFooter />
            </>
        )
    }
}

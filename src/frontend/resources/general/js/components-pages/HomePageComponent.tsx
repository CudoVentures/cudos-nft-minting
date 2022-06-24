/* global TR */

import React from 'react';
import { inject, observer } from 'mobx-react';

import PageComponent from '../../../common/js/components-pages/PageComponent';
import ContextPageComponent, { ContextPageComponentProps } from './common/ContextPageComponent';

import './../../css/components-pages/page-home-component.css';

interface Props extends ContextPageComponentProps {
}

export default class PageHomeComponent extends ContextPageComponent < Props > {

    static layout() {
        const MobXComponent = inject('appStore')(observer(PageHomeComponent));
        PageComponent.layout(<MobXComponent />);
    }

    constructor(props: Props) {
        super(props);
    }

    getPageLayoutComponentCssClassName() {
        return 'PageHome';
    }

    renderContent() {
        return 'Home page'
    }
}

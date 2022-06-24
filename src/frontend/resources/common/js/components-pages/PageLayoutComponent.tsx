import React from 'react';

import PageLoadingIndicator from '../components-core/PageLoadingIndicator';
import DisableActions from '../components-core/DisableActions';
import Dimmer from '../components-core/Dimmer';
import Alert from '../components-core/Alert';

import S from '../utilities/Main';

import '../../css/utilities/main.css';
import '../../css/utilities/content.css';
import '../../css/utilities/fonts.css';

interface Props {
    className?: string;
    popups?: any[],
    alert?: React.Component | null,
    children?: any,
}

export default class PageLayoutComponent extends React.Component < Props > {

    render() {
        return (
            <div className = { `ReactBody ${this.props.className}` } >

                <div className = { 'Page Transition' } >
                    { this.props.children }
                </div>

                <Dimmer />
                { this.props.alert }
                { this.props.popups }
                <DisableActions />
                <PageLoadingIndicator />
            </div>
        );
    }

}

PageLayoutComponent.defaultProps = {
    'className': S.Strings.EMPTY,
    'popups': null,
    'alert': <Alert />,
}

import React from 'react';
import PropTypes from 'prop-types';

import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import MuiButton from '@material-ui/core/Button';

import './../../css/components-inc/button.css';
import S from '../utilities/Main';

const theme01 = createTheme({
    palette: {
        primary: {
            main: '#52A6F8',
            contrastText: '#fff',
        },
        secondary: {
            main: '#636D8F',
            contrastText: '#fff',
        },
    },
});

// this is not used
const theme02 = createTheme({
    palette: {
        primary: {
            main: 'rgba(82, 166, 248, 0.1)',
            contrastText: '#52A6F8',
        },
    },
});

interface Props {
    className?: string;
    type?: Button.TYPE_ROUNDED | Button.TYPE_TEXT_INLINE;
    color?: Button.COLOR_SCHEME_1 | Button.COLOR_SCHEME_2 | Button.COLOR_SCHEME_3;
    padding?: Button.PADDING_DEFAULT | Button.PADDING_24 | Button.PADDING_48 | Button.PADDING_96;
    radius?: Button.RADIUS_DEFAULT | Button.RADIUS_MAX;
    href?: string,
    onClick?: () => void;
    disabled?: boolean;
    target?: string;
}

export default class Button extends React.Component<Props> {

    static TYPE_ROUNDED: number = 1;
    static TYPE_TEXT_INLINE: number = 4;

    static COLOR_SCHEME_1: number = 1;
    static COLOR_SCHEME_2: number = 2;
    static COLOR_SCHEME_3: number = 3;

    static PADDING_DEFAULT: number = 1;
    static PADDING_48: number = 2;
    static PADDING_96: number = 3;
    static PADDING_24: number = 4;

    static RADIUS_DEFAULT: number = 1;
    static RADIUS_MAX: number = 2;

    cssMuiClassColor() {
        switch (this.props.color) {
            case Button.COLOR_SCHEME_2:
                return 'secondary';
            case Button.COLOR_SCHEME_1:
            case Button.COLOR_SCHEME_3:
            default:
                return 'primary';
        }
    }

    muiVariant() {
        switch (this.props.type) {
            case Button.TYPE_TEXT_INLINE:
                return 'text';
            case Button.TYPE_ROUNDED:
            default:
                return 'contained';
        }
    }

    muiTheme() {
        switch (this.props.color) {
            case Button.COLOR_SCHEME_1:
            case Button.COLOR_SCHEME_2:
                return theme01;
            default:
                return theme02;
        }
    }

    cssPadding() {
        switch (this.props.padding) {
            case Button.PADDING_24:
                return 'Padding24';
            case Button.PADDING_48:
                return 'Padding48';
            case Button.PADDING_96:
                return 'Padding96';
            default:
                return S.Strings.EMPTY;
        }
    }

    cssRadius() {
        switch (this.props.radius) {
            case Button.RADIUS_MAX:
                return 'Radius30';
            default:
                return S.Strings.EMPTY;
        }
    }

    render() {
        const className = `Button Transition ${this.cssPadding()} ${this.cssRadius()} ${this.props.className}`;

        return (
            <ThemeProvider theme={theme01} >
                <ThemeProvider theme={this.muiTheme()} >
                    <MuiButton
                        disabled={this.props.disabled}
                        className={className}
                        onClick={this.props.onClick}
                        variant={this.muiVariant()}
                        color={this.cssMuiClassColor()}
                        href={this.props.href}
                        target={this.props.target} >

                        <div className={'ButtonContent FlexRow'} >
                            {this.props.children}
                        </div>

                    </MuiButton>
                </ThemeProvider>
            </ThemeProvider>
        );
    }

}

Button.defaultProps = {
    'className': S.Strings.EMPTY,
    'type': Button.TYPE_ROUNDED,
    'color': Button.COLOR_SCHEME_1,
    'padding': Button.PADDING_DEFAULT,
    'radius': Button.RADIUS_DEFAULT,
    'href': null,
    'disabled': false,
    'onClick': null,
};

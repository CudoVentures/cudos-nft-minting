import React from 'react';

import { TERMS_AND_CONDITIONS, PRIVACY_POLICY, WEBSITE, TELEGRAM, REDDIT, TWITTER, DISCORD } from '../../../common/js/utilities/Links';

import SvgDiscord from '../../../common/svg/discord.svg';
import SvgTwitter from '../../../common/svg/twitter.svg';
import SvgTelegram from '../../../common/svg/telegram.svg';
import SvgReddit from '../../../common/svg/reddit.svg';
import SvgCudosLogoWithText from '../../../common/svg/cudos-logo-with-text.svg';
import './../../css/components-inc/page-footer.css';

interface Props {

}

interface State {

}

export default class PageFooter extends React.Component < Props, State > {

    render() {
        return (
            <footer className={'PageFooter FlexRow FlexSplit'}>
                <div className={'SVG IconLogoWithText'} dangerouslySetInnerHTML={{ __html: SvgCudosLogoWithText }}></div>
                <div className = { 'FooterNav FlexRow' } >
                    <a href={TERMS_AND_CONDITIONS}>Terms &amp; Conditions</a>
                    <a href={PRIVACY_POLICY}>Privacy Policy</a>
                    <a href={WEBSITE}>Cudos.org</a>
                    <a>License &copy; 2018 - 2022</a>
                </div>
                <div className={'StartRightBlock'}>
                    <a href = { DISCORD } className={'SVG IconSocial'} dangerouslySetInnerHTML={{ __html: SvgDiscord }} />
                    <a href = { TELEGRAM } className={'SVG IconSocial'} dangerouslySetInnerHTML={{ __html: SvgTelegram }} />
                    <a href = { TWITTER } className={'SVG IconSocial'} dangerouslySetInnerHTML={{ __html: SvgTwitter }} />
                    <a href = { REDDIT } className={'SVG IconSocial'} dangerouslySetInnerHTML={{ __html: SvgReddit }} />
                </div>
            </footer>
        )
    }
}

import React from 'react';

import { TERMS_AND_CONDITIONS, PRIVACY_POLICY, WEBSITE, TELEGRAM, REDDIT, TWITTER, DISCORD } from '../../../common/js/utilities/Links';

import SvgDiscord from '../../../common/svg/discord.svg';
import SvgTwitter from '../../../common/svg/twitter.svg';
import SvgTelegram from '../../../common/svg/telegram.svg';
import SvgReddit from '../../../common/svg/reddit.svg';
import SvgCudosLogoWithText from '../../../common/svg/cudos-logo-with-text.svg';
import './../../css/components-inc/page-footer.css';

export default class PageFooter extends React.Component {

    render() {
        return (
            <footer className={'PageFooter FlexRow FlexSplit'}>
                <div className={'SVG IconLogoWithText'} dangerouslySetInnerHTML={{ __html: SvgCudosLogoWithText }}></div>
                <div className = { 'FooterNav FlexRow' } >
                    <a href = { TERMS_AND_CONDITIONS } >Terms &amp; Conditions</a>
                    <a href = { PRIVACY_POLICY } >Privacy Policy</a>
                    <a href = { WEBSITE } target = { '_blank' } rel = { 'noreferrer' } >Cudos.org</a>
                    <a>License &copy; 2018 - {new Date().getFullYear()}</a>
                </div>
                <div className={'StartRightBlock'}>
                    <a href = { DISCORD } className = { 'SVG IconSocial' } target = { '_blank' } rel = { 'noreferrer' } dangerouslySetInnerHTML={{ __html: SvgDiscord }} />
                    <a href = { TELEGRAM } className = { 'SVG IconSocial' } target = { '_blank' } rel = { 'noreferrer' } dangerouslySetInnerHTML={{ __html: SvgTelegram }} />
                    <a href = { TWITTER } className = { 'SVG IconSocial' } target = { '_blank' } rel = { 'noreferrer' } dangerouslySetInnerHTML={{ __html: SvgTwitter }} />
                    <a href = { REDDIT } className = { 'SVG IconSocial' } target = { '_blank' } rel = { 'noreferrer' } dangerouslySetInnerHTML={{ __html: SvgReddit }} />
                </div>
            </footer>
        )
    }
}

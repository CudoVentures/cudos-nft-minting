import React from 'react';

import { TERMS_AND_CONDITIONS, PRIVACY_POLICY, WEBSITE, TELEGRAM, LINKEDIN, TWITTER, DISCORD, FACEBOOK, MEDIUM, SPOTIFY, YOUTUBE } from '../../../common/js/utilities/Links';

import SvgLinkedin from '../../../common/svg/linkedin.svg';
import SvgTwitter from '../../../common/svg/twitter.svg';
import SvgFacebook from '../../../common/svg/facebook.svg';
import SvgMedium from '../../../common/svg/medium.svg';
import SvgTelegram from '../../../common/svg/telegram.svg';
import SvgDiscord from '../../../common/svg/discord.svg';
import SvgSpotify from '../../../common/svg/spotify.svg';
import SvgYoutube from '../../../common/svg/youtube.svg';
import SvgCudosLogoWithText from '../../../common/svg/cudos-rectangle-drk-r.svg';
import './../../css/components-inc/page-footer.css';

export default class PageFooter extends React.Component {

    render() {
        return (
            <footer className={'PageFooter FlexRow FlexSplit'}>
                <div className={'SVG IconLogoWithText'} dangerouslySetInnerHTML={{ __html: SvgCudosLogoWithText }}></div>
                <div className={'FooterNav FlexRow'} >
                    <a href={TERMS_AND_CONDITIONS} >Terms &amp; Conditions</a>
                    <a href={PRIVACY_POLICY} >Privacy Policy</a>
                    <a href={WEBSITE} target={'_blank'} rel={'noreferrer'} >Cudos.org</a>
                    <a>License &copy; 2018 - {new Date().getFullYear()}</a>
                </div>
                <div className={'StartRightBlock'}>
                    <a href={LINKEDIN} className={'SVG IconSocial'} target={'_blank'} rel={'noreferrer'} dangerouslySetInnerHTML={{ __html: SvgLinkedin }} />
                    <a href={TWITTER} className={'SVG IconSocial'} target={'_blank'} rel={'noreferrer'} dangerouslySetInnerHTML={{ __html: SvgTwitter }} />
                    <a href={FACEBOOK} className={'SVG IconSocial'} target={'_blank'} rel={'noreferrer'} dangerouslySetInnerHTML={{ __html: SvgFacebook }} />
                    <a href={MEDIUM} className={'SVG IconSocial'} target={'_blank'} rel={'noreferrer'} dangerouslySetInnerHTML={{ __html: SvgMedium }} />
                    <a href={TELEGRAM} className={'SVG IconSocial'} target={'_blank'} rel={'noreferrer'} dangerouslySetInnerHTML={{ __html: SvgTelegram }} />
                    <a href={DISCORD} className={'SVG IconSocial'} target={'_blank'} rel={'noreferrer'} dangerouslySetInnerHTML={{ __html: SvgDiscord }} />
                    <a href={SPOTIFY} className={'SVG IconSocial'} target={'_blank'} rel={'noreferrer'} dangerouslySetInnerHTML={{ __html: SvgSpotify }} />
                    <a href={YOUTUBE} className={'SVG IconSocial'} target={'_blank'} rel={'noreferrer'} dangerouslySetInnerHTML={{ __html: SvgYoutube }} />
                </div>
            </footer>
        )
    }
}

import React from 'react';
import {
    TERMS_AND_CONDITIONS,
    PRIVACY_POLICY,
    WEBSITE,
    TELEGRAM,
    REDDIT,
    TWITTER,
    DISCORD,
} from '../../../common/js/utilities/Links';
import SvgDiscord from '../../../common/svg/discord.svg';
import SvgTwitter from '../../../common/svg/twitter.svg';
import SvgTelegram from '../../../common/svg/telegram.svg';
import SvgReddit from '../../../common/svg/reddit.svg';
import SvgCudosLogo from '../../../common/svg/cudos-logo.svg';

interface Props {

}

interface State {

}

export default class PageFooter extends React.Component < Props, State > {

    render() {
        return (
            <div className={'Footer FlexRow FlexSplit'}>
                <div className={'FooterLeft FlexRow WithSeparatorVLine'}>
                    <div className={'FooterLogo FlexRow SpaceAround'}>
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgCudosLogo }}></div>
                        <span>CUDOS</span>
                    </div>
                    <a href={TERMS_AND_CONDITIONS}>Terms &amp; Conditions</a>
                    <a href={PRIVACY_POLICY}>Privacy Policy</a>
                    <a href={WEBSITE}>Cudos.org</a>
                    <span>License &copy; 2018 - 2022</span>
                </div>
                <div className={'FooterRight FlexRow StartRight'}>
                    <a href={DISCORD} className={'SocialLink'} >
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgDiscord }}></div>
                    </a>
                    <a href={TELEGRAM} className={'SocialLink'} >
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTelegram }}></div>
                    </a>
                    <a href={TWITTER} className={'SocialLink'} >
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTwitter }}></div>
                    </a>
                    <a href={REDDIT} className={'SocialLink'} >
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgReddit }}></div>
                    </a>
                </div>
            </div>
        )
    }
}

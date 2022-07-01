import React from "react";
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

interface Props {

}

interface State {
    
}

export default class PageFooter extends React.Component < Props, State > {

    render() {
        return (
            <div className={' Footer FlexRow SpaceBetween'}>
                <div className={' FooterLeft '}>
                    <div className={' FooterLogo '}>
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgCudosLogo }}></div>
                        <span>CUDOS</span>
                    </div>
                    <div className={" SeparatorVLine "}></div>
                    <a href={ TERMS_AND_CONDITIONS }>Terms &amp; Conditions</a>
                    <div className={" SeparatorVLine "}></div>
                    <a href={ PRIVACY_POLICY }>Privacy Policy</a>
                    <div className={" SeparatorVLine "}></div>
                    <a href={ WEBSITE }>Cudos.org</a>
                    <div className={" SeparatorVLine "}></div>
                    <span>License &copy; 2018 - 2022</span>
                </div>
                <div className={' FooterRight '}>
                    <a href={ DISCORD } className={' SocialLink '} >
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgDiscord }}></div>
                    </a>
                    <a href={ TELEGRAM } className={' SocialLink '} >
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTelegram }}></div>
                    </a>
                    <a href={ TWITTER } className={' SocialLink '} >
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgTwitter }}></div>
                    </a>
                    <a href={ REDDIT } className={' SocialLink '} >
                        <div className={'SVG Icon'} dangerouslySetInnerHTML={{ __html: SvgReddit }}></div>
                    </a>
                </div>
            </div>
        )
    }
}
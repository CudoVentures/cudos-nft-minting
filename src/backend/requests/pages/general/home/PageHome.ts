import fs from 'fs';

import PageHomeH from './PageHome.h';
import SV from '../../../../utilities/SV';
import Context from '../../../../utilities/network/Context';

const Config = require('../../../../../../config/config');

const TEMPLATE = require(PageHomeH.TEMPLATE_PATH).default;

const CSS_PAGE_LOADING = fs.readFileSync(`${Config.Path.Root.Frontend.RESOURCES}/common/css/inline/page-loading.css`);

export default class PageHome extends PageHomeH {

    async onRequest(context: Context): Promise < boolean > {
        context.payload.ctx.type = 'html';
        context.payload.ctx.body = TEMPLATE.stream({
            META: {
                TITLE: 'CUDOS NFT Minting | Simple, cheap & fast NFT creation',
                DESC: 'Mint Non-Fungible Tokens directly on the Cudos network | Cheaper to mint than other blockchains | Native NFTs reduces time taken to mint | 100% Carbon neutral',
                KEYWORDS: SV.KEYWORDS,
                ROBOTS: 'index, follow',
                PAGE_URL: `${Config.URL.GENERAL}${PageHome.URL}`,
            },
            CSS: {
                PAGE_LOADING: CSS_PAGE_LOADING,
            },
            TR: context.payload.ctx.TR,
            TR_STRING: context.payload.ctx.TR_STRING,
            Config,
        });

        return true;
    }

}

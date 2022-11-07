import fs from 'fs';

import PageNftH from './PageNft.h';
import SV from '../../../../utilities/SV';
import Context from '../../../../utilities/network/Context';

const Config = require('../../../../../../config/config');

const TEMPLATE = require(PageNftH.TEMPLATE_PATH).default;

const CSS_PAGE_LOADING = fs.readFileSync(`${Config.Path.Root.Frontend.RESOURCES}/common/css/inline/page-loading.css`);

export default class PageNft extends PageNftH {

    async onRequest(context: Context): Promise<boolean> {
        context.payload.ctx.type = 'html';
        context.payload.ctx.body = TEMPLATE.stream({
            META: {
                TITLE: 'Cudos NFT Minting | NFTs',
                DESC: 'Mint Non-Fungible Tokens directly on the Cudos network | Cheaper to mint than other blockchains | Native NFTs reduces time taken to mint | 100% Carbon neutral',
                KEYWORDS: SV.KEYWORDS,
                ROBOTS: 'noindex, nofollow',
                PAGE_URL: `${Config.URL.GENERAL}${PageNft.URL}`,
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

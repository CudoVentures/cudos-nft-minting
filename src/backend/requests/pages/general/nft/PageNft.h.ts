import Page from '../../Page';

const Config = require('../../../../../../config/config');

export default class PageNftH extends Page {

    static URL: string;
    static TEMPLATE_PATH: string;
}

PageNftH.URL = `${Config.URL.GENERAL}/nft`;
PageNftH.TEMPLATE_PATH = `${Config.Path.Root.Frontend.Pages.GENERAL}/page-nft.marko`;

import Page from '../../Page';

const Config = require('../../../../../../config/config');

export default class PageInnerH extends Page {

    static URL: string;
    static TEMPLATE_PATH: string;
}

PageInnerH.URL = `${Config.URL.GENERAL}/inner`;
PageInnerH.TEMPLATE_PATH = `${Config.Path.Root.Frontend.Pages.GENERAL}/page-inner.marko`;

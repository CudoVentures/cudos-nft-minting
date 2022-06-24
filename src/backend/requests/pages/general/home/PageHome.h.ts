import Page from '../../Page';

const Config = require('../../../../../../config/config');

export default class PageHomeH extends Page {

    static URL: string;
    static TEMPLATE_PATH: string;
}

PageHomeH.URL = `${Config.URL.GENERAL}/home`;
PageHomeH.TEMPLATE_PATH = `${Config.Path.Root.Frontend.Pages.GENERAL}/page-home.marko`;

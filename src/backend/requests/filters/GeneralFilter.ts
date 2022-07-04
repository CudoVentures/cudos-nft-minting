import Page from '../pages/Page';
import PageNotFound from '../pages/general/not-found/PageNotFound';
import PageHome from '../pages/general/home/PageHome';
import PageInner from '../pages/general/inner/PageInner';

const Config = require('./../../../../config/config');

export default class GeneralFilter {

    static map: Map < string, Page >;

    static init() {
        GeneralFilter.map = new Map();
        GeneralFilter.map.set(`${Config.URL.ROOT}/`, new PageHome());
        GeneralFilter.map.set(PageInner.URL, new PageInner());
        GeneralFilter.map.set(PageNotFound.URL, new PageNotFound());
    }

    static async onRequest(context) {
        const page = GeneralFilter.map.get(Config.URL.ROOT + context.payload.ctx.URL.pathname);
        if (page === undefined) {
            (new PageNotFound()).onRequest(context);
            return false;
        }

        await page.onRequest(context);
        return true;
    }

}

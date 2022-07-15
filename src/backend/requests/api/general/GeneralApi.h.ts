import Api from '../Api';

const Config = require('../../../../../config/config');

export default class GeneralApiH extends Api {

    static URL: string;
    static Actions: any;

}

GeneralApiH.URL = `${Config.URL.API}/general`;
GeneralApiH.Actions = {
    DOWNLOAD: 'a',
};

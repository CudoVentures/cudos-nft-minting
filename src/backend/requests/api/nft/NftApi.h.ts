import Api from '../Api';

const Config = require('../../../../../config/config');

export default class NftApiH extends Api {

    static URL: string;
    static Actions: any;

}

NftApiH.URL = `${Config.URL.API}/nft`;
NftApiH.Actions = {
    MINT: 'a',
    IMAGES_UPLOAD: 'b',
    ESTIMATE_FEE_MINT_NFT: 'c',
};

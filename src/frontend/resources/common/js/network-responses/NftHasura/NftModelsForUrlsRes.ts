export default class NftModelsForUrlsRes {

    denomIdToUrlMap: Map < string, string >

    constructor(json) {
        this.denomIdToUrlMap = new Map();
        json.data.nft_nft.forEach((partialNftJson) => {
            this.denomIdToUrlMap.set(partialNftJson.denom_id, partialNftJson.uri);
        });
    }
}

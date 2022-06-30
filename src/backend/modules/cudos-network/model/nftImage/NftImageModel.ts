import NftImageModelG from './NftImageModel.g';

export default class NftImageModel extends NftImageModelG {

    clone(): NftImageModel {
        return Object.assign(new NftImageModel(), this);
    }

}

import NftModelG from './NftModel.g';

export default class NftModel extends NftModelG {

    clone(): NftModel {
        return Object.assign(new NftModel(), this);
    }

}

import S from '../utilities/Main';

export default class DenomModel {
    denomId: string;
    name: string;
    schema: string;
    creator: string;
    symbol: string;

    constructor() {
        this.denomId = S.Strings.EMPTY;
        this.name = S.Strings.EMPTY;
        this.schema = S.Strings.EMPTY;
        this.creator = S.Strings.EMPTY;
        this.symbol = S.Strings.EMPTY;
    }

    clone(): DenomModel {
        return Object.assign(new DenomModel(), this);
    }

    toJSON(): any {
        return {
            'id': this.denomId,
            'name': this.name,
            'schema': this.schema,
            'creator': this.creator,
            'symbol': this.symbol,
        }
    }

    static fromJSON(json): DenomModel {
        if (json === null) {
            return null;
        }

        const model = new DenomModel();

        model.denomId = json.id ?? model.denomId;
        model.name = json.name ?? model.name;
        model.schema = json.schema ?? model.schema;
        model.creator = json.creator ?? model.creator;
        model.symbol = json.symbol ?? model.symbol;

        return model;
    }

}
